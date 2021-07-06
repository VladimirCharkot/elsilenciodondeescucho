let fs = require('fs').promises
let path = require('path')
let _ = require('lodash')
let md = require('./mdesde')


exports.hogar = async (req, res) => {
  if (req.user) return res.redirect('/editor')
  return res.render('login', {titulo: '🤫'})
}

/* Página de índice de escritos para el público */
exports.escritos = async (req, res) => {
  // Algo con cookies
  let visto = true
  if(!req.cookies.visto){
    res.cookie('visto', true, {maxAge: 365*24*60*60000, encode: String})
    visto = false
  }
  res.render('indice', { titulo: 'Índice', visto: visto})
}

/* Índice de escritos en json para ubicar en la página de índices */
exports.indice_escritos = async (req, res) => {
  let idx = await construir_indice_completo()
  res.json(idx)
}


/* Página con un escrito */
exports.escrito = async (req, res) => {

  // Guardo la visita en la cookie
  let visitados = req.cookies.visitados ?  req.cookies.visitados : []
  visitados.push(req.params.eid)
  res.cookie('visitados', [...new Set(visitados)], {maxAge: 10*365*24*60*60000, encode: String})

  let [texto_html, fm] = await traer_texto(req.params.eid)
  if (!texto_html) return res.status(404).json({status: 404, mensaje: 'No existe'})
  res.render('escrito', { titulo: fm.titulo || 'El Silencio Donde Escucho', cont: texto_html })
}

exports.taller = async (req, res) => {

  let [texto_html, fm] = await traer_texto(req.params.tid, './public/textos/propuestas/')
  if (!texto_html) return res.status(404).json({status: 404, mensaje: 'No existe'})
  res.render('taller', { titulo: fm.titulo || 'El Silencio Donde Escucho', cont: texto_html })

}


exports.propuestas = (req, res) => {
  res.render('propuestas', {titulo: 'Propuestas'})
}

exports.esde = async (req, res) => {
  let [texto_html, fm] = await traer_texto('hoy', './public/textos/esde/')
  res.render('taller', { titulo: fm.titulo, cont: texto_html })
}


let traer_texto = async (eid, base = './public/textos/escritos/') => {
  let md_file = await buscar_texto(eid, base=base)
  if(md_file){
    let md_content = await fs.readFile(md_file, 'utf8')
    return md.render(md_content)
  }
}

let buscar_texto = async (eid, base = './public/textos/escritos/') => {
  let nombre = eid + '.md'
  let mds = await fs.readdir(base)
  let found = false
  for (let md of mds){
    let st = await fs.stat(base+md)
    if(st.isDirectory()){
      found = await buscar_texto(eid, base+md+'/')
      if (found) return found
    }else{
      if(md == nombre) return base + nombre
    }
  }
}



/* Lee public/textos/escritos y devuelve un índice en json conteniendo la info del front_matter */
let construir_indice_completo = async (base = 'public/textos/escritos') => {
  let lista = await fs.readdir(base, {withFileTypes: true})
  let indice = []

  for (let e of lista){

    let ruta = path.join(base, e.name)
    let ruta_public = ruta.replace('public', '')

    if(e.isDirectory()){

      let cont = await construir_indice_completo(ruta)
      indice = indice.concat(cont)

    }else{

      let entrada = {ruta: ruta_public, filename: e.name, type: 'md', id: e.name.split('.')[0]}

      let [html, front_matter] = md.render(await fs.readFile(ruta, 'utf8'))

      _.assign(entrada, front_matter)

      if (!front_matter.oculto || front_matter.oculto == "no"){
        indice.push(entrada)
      }

    }
  }
  // Carpetas primero:
  indice = indice.filter(e => e.es_carpeta).concat(indice.filter(e => !e.es_carpeta))
  return indice
}


exports.login = (req, res, next) => {
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
  }
