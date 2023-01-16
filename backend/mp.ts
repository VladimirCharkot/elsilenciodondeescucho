import {Request, Response} from 'express';
import axios from 'axios'
import mercadopago from 'mercadopago'
import {Currency} from 'mercadopago/shared/currency';
import {logger} from './esdelogger'
import {appendPagoPublico, appendPagoPrivado, appendPendientePrivado, appendRechazadoPrivado, EntradaPrivada} from './googlesheets'
import conf from './config'

const url_base = 'https://elsilenciodondeescucho.com';
const cache_pagos: {[id: string] : string} = {};

type Status = 'approved' | 'in_process' | 'rejected'

try{
  mercadopago.configurations.setAccessToken(conf.mercadoPago.token);
  logger.debug('MercadoPago configurado');
}catch(e){
  logger.error('No se pudo configurar MercadoPago. Está el token en el archivo correspondiente (.mptoken)?')
}


// Generación de preferencia y link para CheckoutPro
export const generarLink = async (req: Request, res: Response) => {

  let preference = {
    additional_info: JSON.stringify({
      nombre: req.body.nombre,
      mail: req.body.mail,
      monto: req.body.monto
    }),
    notification_url: url_base + '/webhook',
    back_urls: {
      success: url_base + '/pago_aprobado',
      pending: url_base + '/pago_pendiente',
      failure: url_base + '/pago_fallido'
    },
    purpose: "wallet_purchase",
    items: [
      {
        title: conf.libro.titulo,
        description: conf.libro.descripcion,
        currency_id: 'ARS' as Currency,
        unit_price: req.body.monto,
        quantity: 1,
        picture_url: conf.libro.imagen
      },
    ]
  };

  try{
    logger.debug('Creando preferencia...');
    let r = await mercadopago.preferences.create(preference);
    logger.debug('Respuesta:');
    logger.debug(JSON.stringify(r));
    res.status(201).json(r);
  }catch(e){
    logger.error('Error al crear preferencia:');
    logger.error(JSON.stringify(e));
  }

}



// Acciones a llevar a cabo sobre las planillas según status de la situación:
const acciones = {
  approved: async (data: EntradaPrivada) => {
    logger.info('Pago aprobado, agregando a la planilla')
    await appendPagoPublico({
      nombre: data.nombre,
      monto: data.monto
    })
    await appendPagoPrivado(data);
  },
  in_process: async (data: EntradaPrivada) => {
    logger.info('Pago pendiente, agregando a la planilla')
    await appendPendientePrivado(data);
  },
  rejected: async (data: EntradaPrivada) => {
    logger.info('Pago rechazado, agregando a la planilla')
    await appendRechazadoPrivado(data);
  }
}




export const procesarPago = async (req: Request, res: Response) => {

  logger.debug('Procesando pago con');
  logger.debug(JSON.stringify(req.body));

  try{
    const nombre = req.body.nombre;
    delete req.body.nombre;
    const email = req.body.email;
    delete req.body.email;

    let r;
    try{
      r = await mercadopago.payment.save({
        ...req.body,
        notification_url: url_base + '/webhook' // Por si queda pendiente
      })
      logger.debug('Obtenida respuesta');
      logger.debug(JSON.stringify(r.body));
    }catch(e: any){
      logger.error(`${e.name}: ${e.message}`);
      res.status(200).json({ status: 'error', status_detail: `${e.name}: ${e.message}`});
    }

    if (!r) {
      res.status(200).json({ status: 'error', status_detail: `No response`});
      return
    }


    interface PaymentResponse{status: Status, status_detail: string, id: string}
    const { status, status_detail, id } = r.body as PaymentResponse;

    logger.debug(`Status es ${status}`);

    await acciones[status]({
      nombre,
      email,
      monto: req.body.transaction_amount,
      dni: req.body.payer.identification.number,
      medio: 'tarjeta',
      id
    })

    cache_pagos[id] = status;

    res.status(200).json({ status, status_detail, id });

  }catch(e: any){

    logger.error(e.message);
    res.status(500).send(e);

  }

}


const dump = (req: Request) => {
  logger.debug('================================');
  logger.debug('BODY: ');
  logger.debug(JSON.stringify(req.body));
  logger.debug('HEADERS: ');
  logger.debug(JSON.stringify(req.headers));
  logger.debug('QUERY: ');
  logger.debug(JSON.stringify(req.query));
  logger.debug('================================');
}


export const webhook = async (req: Request, res: Response) => {

  logger.debug('Recibiendo POST en /webhook...');

  if(req.query.topic == 'merchant_order'){

    // Acá nos enteramos del pago de las preferencias (o sea de checkoutpro)
    let r = await axios.get(req.body.resource, {headers: {'Authorization': `Bearer ${conf.mercadoPago.token}`}});
    if(r.status != 200){
      logger.error(`Error queryiando merchant_order: ${JSON.stringify(r)}`);
      return;
    }

    // Obtenemos la orden, que tiene la referencia a la preferencia
    const orden = r.data;
    logger.debug('Entró una merchant order en webhook:');
    logger.debug(JSON.stringify(orden));

    if(orden.payments.length == 0){
      logger.debug('Todavia no hay info de pago disponible. Omitiendo.');
      return res.status(200).send();
    }

    // Obtenemos el pago asociado

    logger.debug(`Buscando el pago en https://api.mercadolibre.com/collections/notifications/${orden.payments[0].id}`)

    let r2 = await axios.get(`https://api.mercadolibre.com/collections/notifications/${orden.payments[0].id}`, {headers: {'Authorization': `Bearer ${conf.mercadoPago.token}`}});

    if(r2.status != 200){
      logger.error(`Error queryiando pago: ${JSON.stringify(r2)}`);
      return res.status(400).send();
    }
    const pago = r2.data;
    logger.debug('El pago asociado es:');
    logger.debug(JSON.stringify(pago));

    // No procesar si la caché lo tiene como aprobado o con el mismo status
    if (cache_pagos.hasOwnProperty(pago.collection.id) && (cache_pagos[pago.collection.id] == 'approved' || cache_pagos[pago.collection.id] == pago.collection.status)) {
      logger.debug('Pago ya procesado');
      return res.status(200).send();
    }

    const identificacion = pago.collection.payer.identification.number ?? "NO_ENCONTRADO";

    // Extraemos nuestros propios datos de la preferencia
    const provisto = JSON.parse(orden.additional_info);
    logger.debug(`Ahora agregaría entrada pública con ${JSON.stringify({nombre: provisto.nombre, monto: pago.collection.transaction_amount})}`);
    logger.debug(`Ahora agregaría entrada privada con ${JSON.stringify({nombre: provisto.nombre, monto: pago.collection.transaction_amount, email: provisto.mail, dni: identificacion, medio: 'mercadopago'})}`);


    // Y appendeamos a la planilla correspondiente, según status del pago
    acciones[pago.collection.status as Status]({
      nombre: provisto.nombre,
      monto: pago.collection.transaction_amount,
      email: provisto.mail,
      dni: identificacion,
      medio: 'mercadopago',
      id: pago.collection.id
    })

    cache_pagos[pago.collection.id] = pago.collection.status;

  }

  // dump(req);
  res.status(200).send();
}



export const back_aprobado = async (req: Request, res: Response) => {
  res.render('colecta/aprobado', { titulo: 'Gracias!', URLPlanillaPublica: `https://docs.google.com/spreadsheets/d/${conf.sheets.planillaPublica}` });
}

export const back_pendiente = async (req: Request, res: Response) => {
  res.render('colecta/pendiente', { titulo: 'Esperamos', URLPlanillaPublica: `https://docs.google.com/spreadsheets/d/${conf.sheets.planillaPublica}` });
}

export const back_rechazado = async (req: Request, res: Response) => {
  res.render('colecta/rechazado', { titulo: 'Fallido', mensaje_mp: '[insertar mensaje]' });
}
