var express = require('express')
var router = express.Router()
var blog = require('../procesos/blog.js')
let passport = require('passport')

let is_admin = (req, res, next) => { if(req.user) {next()} else {return res.redirect('/hogar')} }

/* GET home page. */
router.get('/', blog.bienvenida)
router.get('/escritos/', blog.escritos)
router.get('/escritos/:eid', blog.escrito)

router.get('/indice', blog.indice)


router.post('/md/', [is_admin, blog.post_md])
router.delete('/md/', [is_admin, blog.delete_md])

router.get('/imagenes/', [is_admin, blog.imagenes])
router.post('/imagenes/', [is_admin, blog.post_imagenes])
router.get('/editor/', [is_admin, blog.editor])

router.get('/hogar', blog.hogar)
router.post('/hogar', function(req, res, next) {
    passport.authenticate('local', function(err, user, info){
      try{
        if (err) return next(err);
        if (!user) return res.json({ok: false})
        console.log(`Logueado con ${user.id}`)
        console.log(user)

        req.login(user, (e,b ) => {console.log(e); console.log(b); })

        return res.json({ok: true})

      }catch(e){
        console.log(e)
      }
    })(req, res, next)
  })

router.get('/logout', (req,res) => {req.logout(); res.redirect('/')})

module.exports = router
