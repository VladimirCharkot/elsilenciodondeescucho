"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.back_rechazado = exports.back_pendiente = exports.back_aprobado = exports.webhook = exports.procesarPago = exports.generarLink = void 0;
const axios_1 = __importDefault(require("axios"));
const mercadopago_1 = __importDefault(require("mercadopago"));
const esdelogger_1 = require("./esdelogger");
const googlesheets_1 = require("./googlesheets");
const config_1 = __importDefault(require("./config"));
const url_base = 'https://elsilenciodondeescucho.com';
const cache_pagos = {};
try {
    mercadopago_1.default.configurations.setAccessToken(config_1.default.mercadoPago.token);
    esdelogger_1.logger.debug('MercadoPago configurado');
}
catch (e) {
    esdelogger_1.logger.error('No se pudo configurar MercadoPago. Está el token en el archivo correspondiente (.mptoken)?');
}
// Generación de preferencia y link para CheckoutPro
const generarLink = async (req, res) => {
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
                title: config_1.default.libro.titulo,
                description: config_1.default.libro.descripcion,
                currency_id: 'ARS',
                unit_price: req.body.monto,
                quantity: 1,
                picture_url: config_1.default.libro.imagen
            },
        ]
    };
    try {
        esdelogger_1.logger.debug('Creando preferencia...');
        let r = await mercadopago_1.default.preferences.create(preference);
        esdelogger_1.logger.debug('Respuesta:');
        esdelogger_1.logger.debug(JSON.stringify(r));
        res.status(201).json(r);
    }
    catch (e) {
        esdelogger_1.logger.error('Error al crear preferencia:');
        esdelogger_1.logger.error(JSON.stringify(e));
    }
};
exports.generarLink = generarLink;
// Acciones a llevar a cabo sobre las planillas según status de la situación:
const acciones = {
    approved: async (data) => {
        esdelogger_1.logger.info('Pago aprobado, agregando a la planilla');
        await (0, googlesheets_1.appendPagoPublico)({
            nombre: data.nombre,
            monto: data.monto
        });
        await (0, googlesheets_1.appendPagoPrivado)(data);
    },
    in_process: async (data) => {
        esdelogger_1.logger.info('Pago pendiente, agregando a la planilla');
        await (0, googlesheets_1.appendPendientePrivado)(data);
    },
    rejected: async (data) => {
        esdelogger_1.logger.info('Pago rechazado, agregando a la planilla');
        await (0, googlesheets_1.appendRechazadoPrivado)(data);
    }
};
const procesarPago = async (req, res) => {
    esdelogger_1.logger.debug('Procesando pago con');
    esdelogger_1.logger.debug(JSON.stringify(req.body));
    try {
        const nombre = req.body.nombre;
        delete req.body.nombre;
        const email = req.body.email;
        delete req.body.email;
        let r;
        try {
            r = await mercadopago_1.default.payment.save({
                ...req.body,
                notification_url: url_base + '/webhook' // Por si queda pendiente
            });
            esdelogger_1.logger.debug('Obtenida respuesta');
            esdelogger_1.logger.debug(JSON.stringify(r.body));
        }
        catch (e) {
            esdelogger_1.logger.error(`${e.name}: ${e.message}`);
            res.status(200).json({ status: 'error', status_detail: `${e.name}: ${e.message}` });
        }
        if (!r) {
            res.status(200).json({ status: 'error', status_detail: `No response` });
            return;
        }
        const { status, status_detail, id } = r.body;
        esdelogger_1.logger.debug(`Status es ${status}`);
        await acciones[status]({
            nombre,
            email,
            monto: req.body.transaction_amount,
            dni: req.body.payer.identification.number,
            medio: 'tarjeta',
            id
        });
        cache_pagos[id] = status;
        res.status(200).json({ status, status_detail, id });
    }
    catch (e) {
        esdelogger_1.logger.error(e.message);
        res.status(500).send(e);
    }
};
exports.procesarPago = procesarPago;
const dump = (req) => {
    esdelogger_1.logger.debug('================================');
    esdelogger_1.logger.debug('BODY: ');
    esdelogger_1.logger.debug(JSON.stringify(req.body));
    esdelogger_1.logger.debug('HEADERS: ');
    esdelogger_1.logger.debug(JSON.stringify(req.headers));
    esdelogger_1.logger.debug('QUERY: ');
    esdelogger_1.logger.debug(JSON.stringify(req.query));
    esdelogger_1.logger.debug('================================');
};
const webhook = async (req, res) => {
    esdelogger_1.logger.debug('Recibiendo POST en /webhook...');
    if (req.query.topic == 'merchant_order') {
        // Acá nos enteramos del pago de las preferencias (o sea de checkoutpro)
        let r = await axios_1.default.get(req.body.resource, { headers: { 'Authorization': `Bearer ${config_1.default.mercadoPago.token}` } });
        if (r.status != 200) {
            esdelogger_1.logger.error(`Error queryiando merchant_order: ${JSON.stringify(r)}`);
            return;
        }
        // Obtenemos la orden, que tiene la referencia a la preferencia
        const orden = r.data;
        esdelogger_1.logger.debug('Entró una merchant order en webhook:');
        esdelogger_1.logger.debug(JSON.stringify(orden));
        if (orden.payments.length == 0) {
            esdelogger_1.logger.debug('Todavia no hay info de pago disponible. Omitiendo.');
            return res.status(200).send();
        }
        // Obtenemos el pago asociado
        esdelogger_1.logger.debug(`Buscando el pago en https://api.mercadolibre.com/collections/notifications/${orden.payments[0].id}`);
        let r2 = await axios_1.default.get(`https://api.mercadolibre.com/collections/notifications/${orden.payments[0].id}`, { headers: { 'Authorization': `Bearer ${config_1.default.mercadoPago.token}` } });
        if (r2.status != 200) {
            esdelogger_1.logger.error(`Error queryiando pago: ${JSON.stringify(r2)}`);
            return res.status(400).send();
        }
        const pago = r2.data;
        esdelogger_1.logger.debug('El pago asociado es:');
        esdelogger_1.logger.debug(JSON.stringify(pago));
        // No procesar si la caché lo tiene como aprobado o con el mismo status
        if (cache_pagos.hasOwnProperty(pago.collection.id) && (cache_pagos[pago.collection.id] == 'approved' || cache_pagos[pago.collection.id] == pago.collection.status)) {
            esdelogger_1.logger.debug('Pago ya procesado');
            return res.status(200).send();
        }
        const identificacion = pago.collection.payer.identification.number ?? "NO_ENCONTRADO";
        // Extraemos nuestros propios datos de la preferencia
        const provisto = JSON.parse(orden.additional_info);
        esdelogger_1.logger.debug(`Ahora agregaría entrada pública con ${JSON.stringify({ nombre: provisto.nombre, monto: pago.collection.transaction_amount })}`);
        esdelogger_1.logger.debug(`Ahora agregaría entrada privada con ${JSON.stringify({ nombre: provisto.nombre, monto: pago.collection.transaction_amount, email: provisto.mail, dni: identificacion, medio: 'mercadopago' })}`);
        // Y appendeamos a la planilla correspondiente, según status del pago
        acciones[pago.collection.status]({
            nombre: provisto.nombre,
            monto: pago.collection.transaction_amount,
            email: provisto.mail,
            dni: identificacion,
            medio: 'mercadopago',
            id: pago.collection.id
        });
        cache_pagos[pago.collection.id] = pago.collection.status;
    }
    // dump(req);
    res.status(200).send();
};
exports.webhook = webhook;
const back_aprobado = async (req, res) => {
    res.render('colecta/aprobado', { titulo: 'Gracias!', URLPlanillaPublica: `https://docs.google.com/spreadsheets/d/${config_1.default.sheets.planillaPublica}` });
};
exports.back_aprobado = back_aprobado;
const back_pendiente = async (req, res) => {
    res.render('colecta/pendiente', { titulo: 'Esperamos', URLPlanillaPublica: `https://docs.google.com/spreadsheets/d/${config_1.default.sheets.planillaPublica}` });
};
exports.back_pendiente = back_pendiente;
const back_rechazado = async (req, res) => {
    res.render('colecta/rechazado', { titulo: 'Fallido', mensaje_mp: '[insertar mensaje]' });
};
exports.back_rechazado = back_rechazado;
//# sourceMappingURL=mp.js.map