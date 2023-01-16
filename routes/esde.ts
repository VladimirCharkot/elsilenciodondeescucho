import {Router, Application} from 'express';
import {logaccess} from '../backend/accesos';

import * as visitas from '../backend/visitas';
import * as mp from '../backend/mp';
import * as blog from '../backend/blog';
import * as auth from '../backend/auth';
import * as editor from '../backend/editor';


const router = Router();

/* Público */
router.get('/', [logaccess, blog.indice])

// router.get('/escritos', blog.escritos as Application)
// router.get('/escritos/:eid', [logaccess, blog.escrito])

router.get('/propuestas/:eid', [logaccess, blog.propuesta])

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
router.get('/texto/:textoId', blog.buscar_texto)


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

// router.get('/vidriera', (__, res) => res.render('vidriera') )

router.get('*', [logaccess, blog.indice])

module.exports = router
