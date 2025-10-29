import { Router, Application } from 'express';
import { logaccess } from '../backend/sitio/accesos';

import * as visitas from '../backend/sitio/visitas';
import * as blog from '../backend/blog/blog';
import * as auth from '../backend/sitio/auth';
import * as editor from '../backend/editor/editor';


const router = Router();

/* Público */
router.get('/', [blog.frontend])
router.get('/buscar/:consulta', blog.buscar as Application)
router.get('/colecta', [blog.colecta])

// MercadoPago

// router.post('/pago', (req, res) => {
//   mp.procesarPago(req, res);
// });
// router.post('/billetera', (req, res) => mp.generarLink(req, res));

// router.post('/webhook', (req, res) => mp.webhook(req, res));

// router.get('/pago_aprobado', mp.back_aprobado);
// router.get('/pago_pendiente', mp.back_pendiente);
// router.get('/pago_fallido', mp.back_rechazado);


/* Público funcional */
router.get('/indice_json', blog.indice_textos_public as Application)
router.get('/indice_arbol_textos', editor.indice_textos_editor)
router.get('/indice_arbol_imagenes', editor.indice_imagenes_editor)
router.get('/texto/:textoId', blog.buscar_texto)


/* Privado */
// router.get('/visitas', [auth.is_admin, visitas.visor])
router.get('/analytics/hora',     [auth.is_admin, visitas.hora])
router.get('/analytics/dia',      [auth.is_admin, visitas.dia])
router.get('/analytics/semana',   [auth.is_admin, visitas.semana])
router.get('/analytics/mes',      [auth.is_admin, visitas.mes])
router.get('/analytics/semestre', [auth.is_admin, visitas.semestre])


// Editor

router.post('/md/', [auth.is_admin, editor.post_md])
router.delete('/md/:path', [auth.is_admin, editor.delete_md])

// router.get('/imagenes/', [auth.is_admin, editor.imagenes])

router.post('/imagenes/', [auth.is_admin, editor.post_imagenes])
router.delete('/imagenes/:path', [auth.is_admin, editor.borrar_imagen])

router.post('/hogar', auth.login)

//@ts-ignore
router.post('/accion', (req, res) => { logaccess(req.headers['X-Forwarded-For'] ? req.ip : 'unknown', req.body.accion); res.json({ok: true}) })

router.get('/check', auth.check_admin)
router.get('/logout', auth.logout)

router.get('*', blog.frontend)

module.exports = router
