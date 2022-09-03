var express = require('express')
var router = express.Router()
var blog = require('../procesos/blog.js')
var editor = require('../procesos/editor.js')
var visitas = require('../procesos/visitas.js')
let { logaccess } = require('../procesos/accesos.js')
let passport = require('passport')


let is_admin = (req, res, next) => { if(req.user) {next()} else {return res.redirect('/hogar')} }

/* Público */
router.get('/', [logaccess,blog.escritos])

router.get('/escritos', blog.escritos)
router.get('/escritos/:eid', [logaccess, blog.escrito])

router.get('/propuestas/', [logaccess, blog.propuestas])
router.get('/propuestas/:tid', [logaccess, blog.taller])

router.get('/buscar/:consulta', blog.buscar)

router.get('/esde/', [logaccess, blog.esde])


/* TEST */

router.get('/test', (req, res) => res.render('test'))


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
