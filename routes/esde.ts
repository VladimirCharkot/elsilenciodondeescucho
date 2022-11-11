const visitas = require('../../procesos/visitas.js')
const { logaccess } = require('../../procesos/accesos.js')
const sheets = require('../../procesos/googlesheets.js')
const mp = require('../../procesos/mp.js')

import {Router, Application} from 'express';

import * as blog from '../procesos/blog';
import * as auth from '../procesos/auth';
import * as editor from '../procesos/editor';


const router = Router();

/* Público */
router.get('/', [logaccess, blog.escritos])

router.get('/escritos', blog.escritos as Application)
router.get('/escritos/:eid', [logaccess, blog.escrito])

router.get('/propuestas/:eid', [logaccess, blog.escrito])

router.get('/buscar/:consulta', blog.buscar as Application)

router.get('/esde/', [logaccess, blog.esde])

router.get('/colecta', [logaccess, blog.colecta])


// router.post('/pago', (req, res) => {
//   mp.procesarPago(req, res);
// });
// router.post('/billetera', (req, res) => mp.generarLink(req, res));


// router.post('/webhook', (req, res) => mp.webhook(req, res));

router.get('/pago_aprobado', mp.back_aprobado);
router.get('/pago_pendiente', mp.back_pendiente);
router.get('/pago_fallido', mp.back_rechazado);


/* Público funcional */
router.get('/reset_cookie/', (req, res) => res.clearCookie('visitados').json({ok: true}))

router.get('/indice_json', blog.indice_textos_public as Application)


router.get('/indice_arbol_textos',  editor.indice_textos_editor)
router.get('/indice_arbol_imagenes',  editor.indice_imagenes_editor)


/* Privado */
router.get('/visitas', [auth.is_admin, visitas.visor])
router.get('/data/hora', [auth.is_admin, visitas.hora])
router.get('/data/dia', [auth.is_admin, visitas.dia])
router.get('/data/semana', [auth.is_admin, visitas.semana])
router.get('/data/mes', [auth.is_admin, visitas.mes])
router.get('/data/semestre', [auth.is_admin, visitas.semestre])


// Editor

router.post('/md/', [auth.is_admin, editor.post_md])
router.delete('/md/:path', [auth.is_admin, editor.delete_md])

// router.get('/imagenes/', [auth.is_admin, editor.imagenes])

router.post('/imagenes/', [auth.is_admin, editor.post_imagenes])
router.delete('/imagenes/:path', [auth.is_admin, editor.borrar_imagen])

router.get('/editor/', [auth.is_admin, editor.editor])

router.get('/hogar', blog.hogar as Application)
router.post('/hogar', auth.login)

router.get('/logout', auth.logout)


module.exports = router
