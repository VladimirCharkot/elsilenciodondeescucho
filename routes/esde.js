const express = require('express')
const router = express.Router()
const blog = require('../procesos/blog.js')
const editor = require('../procesos/editor.js')
const visitas = require('../procesos/visitas.js')
const { logaccess } = require('../procesos/accesos.js')
const passport = require('passport')

const sheets = require('../procesos/googlesheets.js')
const mp = require('../procesos/mp.js')


let is_admin = (req, res, next) => { if(req.user) {next()} else {return res.redirect('/hogar')} }

/* Público */
router.get('/', [logaccess,blog.escritos])

router.get('/escritos', blog.escritos)
router.get('/escritos/:eid', [logaccess, blog.escrito])

router.get('/propuestas/', [logaccess, blog.propuestas])
router.get('/propuestas/:tid', [logaccess, blog.taller])

router.get('/buscar/:consulta', blog.buscar)

router.get('/esde/', [logaccess, blog.esde])

router.get('/colecta', [logaccess, blog.colecta])

/* TEST */

router.post('/pago', (req, res) => {
  mp.procesarPago(req, res);
});
router.post('/billetera', (req, res) => mp.generarLink(req, res));


router.post('/webhook', (req, res) => mp.webhook(req, res));

router.get('/pago_aprobado', mp.back_aprobado);
router.get('/pago_pendiente', mp.back_pendiente);
router.get('/pago_fallido', mp.back_rechazado);

// router.get('/sheet', async (req, res) => {
//   // Sheet privada: 1EkXD4b5vIQn1vsuJrQAYRAHYlCmAMkrk-vYlgI0AEkM
//   // Sheet pública: 1nxNa1IOaquv3luX2Kgu1EohSK3goN04b9TkCRhs1mko
//   await sheets.appendSpreadSheetValues({
//     spreadsheetId: '1nxNa1IOaquv3luX2Kgu1EohSK3goN04b9TkCRhs1mko',
//     sheetName: 'contribuciones',
//     auth: await sheets.getAuthToken(),
//     values: [["El Vladi", "555", "=now()"]]
//     })
//   res.status(200).send();
// });


/* Público funcional */
router.get('/reset_cookie/', (req, res) => res.clearCookie('visitados').json({ok: true}))

router.get('/indice_json', blog.indice_escritos)
router.get('/indice_imgs', blog.indice_imagenes)
router.get('/indice', editor.indice)


/* Privado */
router.get('/visitas', [is_admin, visitas.visor])
router.get('/data/hora', [is_admin, visitas.hora])
router.get('/data/dia', [is_admin, visitas.dia])
router.get('/data/semana', [is_admin, visitas.semana])
router.get('/data/mes', [is_admin, visitas.mes])
router.get('/data/semestre', [is_admin, visitas.semestre])

router.post('/md/', [is_admin, editor.post_md])
router.delete('/md/', [is_admin, editor.delete_md])

router.get('/imagenes/', [is_admin, editor.imagenes])
router.post('/imagenes/', [is_admin, editor.post_imagenes])
router.get('/editor/', [is_admin, editor.editor])

router.get('/hogar', blog.hogar)
router.post('/hogar', blog.login)

router.get('/logout', (req,res) => {req.logout(); res.redirect('/')})

module.exports = router

// https://www.mercadopago.com.ar/developers/es/docs/checkout-api/landing
