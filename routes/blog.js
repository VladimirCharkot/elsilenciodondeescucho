var express = require('express')
var router = express.Router()
var blog = require('../procesos/blog.js')
var editor = require('../procesos/editor.js')
let passport = require('passport')

let is_admin = (req, res, next) => { if(req.user) {next()} else {return res.redirect('/hogar')} }

/* Público */
router.get('/', blog.escritos)

router.get('/escritos', blog.escritos)
router.get('/escritos/:eid', blog.escrito)

router.get('/propuestas/', blog.propuestas)
router.get('/propuestas/:tid', blog.taller)

router.get('/buscar/:consulta', blog.buscar)

router.get('/esde/', blog.esde)


/* Público funcional */
router.get('/reset_cookie/', (req, res) => res.clearCookie('visitados').json({ok: true}))

router.get('/indice_json', blog.indice_escritos)
router.get('/indice', editor.indice)


/* Privado */
router.post('/md/', [is_admin, editor.post_md])
router.delete('/md/', [is_admin, editor.delete_md])

router.get('/imagenes/', [is_admin, editor.imagenes])
router.post('/imagenes/', [is_admin, editor.post_imagenes])
router.get('/editor/', [is_admin, editor.editor])

router.get('/hogar', blog.hogar)
router.post('/hogar', blog.login)

router.get('/logout', (req,res) => {req.logout(); res.redirect('/')})

module.exports = router
