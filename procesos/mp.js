const axios = require('axios');
const fs = require('fs');
const mercadopago = require('mercadopago');
const {logger} = require('./esdelogger');
const {appendPagoPublico, appendPagoPrivado, appendPendientePrivado, appendRechazadoPrivado} = require('./googlesheets');
const conf = require('./config');

const url_base = 'https://elsilenciodondeescucho.com';

try{
  mercadopago.configurations.setAccessToken(conf.mercadoPago.token);
  logger.debug('MercadoPago configurado');
}catch(e){
  logger.error('No se pudo configurar MercadoPago. Está el token en el archivo correspondiente (.mptoken)?')
}


const generarLink = async (req, res) => {

  let preference = {
    back_urls: {
      success: url_base + '/pago_aprobado',
      pending: url_base + '/pago_pendiente',
      failure: url_base + '/pago_fallido'
    },
    auto_return: 'approved',
    purpose: "wallet_purchase",
    items: [
      {
        title: conf.libro.titulo,
        description: conf.libro.descripcion,
        currency_id: 'ARS',
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




const procesarPago = async (req, res) => {

  logger.debug('Procesando pago con');
  logger.debug(JSON.stringify(req.body));

  try{
    const nombre = req.body.nombre;
    delete req.body.nombre;
    const email = req.body.email;
    delete req.body.email;

    const r = await mercadopago.payment.save({
      ...req.body,
      notification_url: url_base + '/webhook' // Por si queda pendiente
    })
    logger.debug('Obtenida respuesta');
    logger.debug(JSON.stringify(r.body));

    const { status, status_detail, id } = r.body;

    const acciones = {
      approved: async () => {
        logger.info('Pago aprobado, agregando a la planilla')
        await appendPagoPublico({
          nombre: nombre,
          monto: req.body.transaction_amount
        })
        await appendPagoPrivado({
          nombre: nombre,
          email: email,
          dni: req.body.payer.identification.number,
          medio: 'tarjeta',
          monto: req.body.transaction_amount
        })
      },
      in_process: async () => {
        logger.info('Pago pendiente, agregando a la planilla')
        await appendPendientePrivado({
          nombre: nombre,
          email: email,
          dni: req.body.payer.identification.number,
          medio: 'tarjeta',
          monto: req.body.transaction_amount
        })
      },
      rejected: async () => {
        logger.info('Pago rechazado, agregando a la planilla')
        await appendRechazadoPrivado({
          nombre: nombre,
          email: email,
          dni: req.body.payer.identification.number,
          medio: 'tarjeta',
          monto: req.body.transaction_amount
        })
      }
    }

    logger.debug(`Status es ${status}`);
    await acciones[status]()

    res.status(200).json({ status, status_detail, id });

  }catch(e){

    logger.error(e.message);
    res.status(500).send(e);

  }

}


const dump = (req) => {
  logger.debug('================================');
  logger.debug('BODY: ');
  logger.debug(JSON.stringify(req.body));
  logger.debug('HEADERS: ');
  logger.debug(JSON.stringify(req.headers));
  logger.debug('QUERY: ');
  logger.debug(JSON.stringify(req.query));
  logger.debug('================================');
}


const webhook = async (req, res) => {
  if(req.body.action == 'payment.created'){
    let payment = mercadopago.payment.get(req.body.data.id);
    logger.debug('Entró el pago:');
    logger.debug(JSON.stringify(payment));
  }
  if(req.body.action == 'payment.updated'){} // ???

  // if (req.body.type == 'payment') {
  //   let payment = mercadopago.payment.get(req.body.data.id)
  //   Agregar al excel
  // }
  logger.debug('Recibiendo POST en webhook');
  dump(req);
  res.status(200).send();
}



const back_aprobado = async (req, res) => {
  logger.debug('Pago aprobado, agregando a la planilla');
  dump(req);
  // await appendPagoPublico({
  //   nombre: nombre,
  //   monto: req.body.transaction_amount
  // });
  // await appendPagoPrivado({
  //   nombre: nombre,
  //   email: email,
  //   dni: req.body.payer.identification.number,
  //   medio: 'mercadopago',
  //   monto: req.body.transaction_amount
  // });
  res.render('colecta/aprobado', { titulo: 'Gracias!', URLPlanillaPublica: `https://docs.google.com/spreadsheets/d/${conf.sheets.planillaPublica}` });
}

const back_pendiente = async (req, res) => {
  logger.debug('Pago pendiente, agregando a la planilla');
  dump(req);
  // await appendPendientePrivado({
  //   nombre: nombre,
  //   email: email,
  //   dni: req.body.payer.identification.number,
  //   medio: 'mercadopago',
  //   monto: req.body.transaction_amount
  // });
  res.render('colecta/pendiente', { titulo: 'Esperamos', URLPlanillaPublica: `https://docs.google.com/spreadsheets/d/${conf.sheets.planillaPublica}` });
}

const back_rechazado = async (req, res) => {
  logger.debug('Pago rechazado, agregando a la planilla');
  dump(req);
  // await appendRechazadoPrivado({
  //   nombre: nombre,
  //   email: email,
  //   dni: req.body.payer.identification.number,
  //   medio: 'mercadopago',
  //   monto: req.body.transaction_amount
  // });
  res.render('colecta/rechazado', { titulo: 'Fallido', mensaje_mp: '[insertar mensaje]' });
}


exports.back_aprobado = back_aprobado
exports.back_pendiente = back_pendiente
exports.back_rechazado = back_rechazado

exports.procesarPago = procesarPago;
exports.generarLink = generarLink;
exports.webhook = webhook
