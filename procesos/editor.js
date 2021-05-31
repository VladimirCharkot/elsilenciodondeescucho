let fs = require('fs').promises
let path = require('path')
let formidable = require('formidable')
let _ = require('lodash')
let md = require('./mdesde')



/* Editor */

/* GIT */

let post_public = async (ruta, recurso) => {
  // Checkear si existe, sino crear

  console.log(`post_public llamado con ${ruta}`)
  let target = path.join('public', ruta)
  console.log(`Buscando ${target}`)

  try{

    let stat = await fs.stat(target)

    if (stat.isFile()){
      console.log(`Archivo ${ruta} existe, sobreescribiendo (!)...`)
      await fs.writeFile(target, recurso)
      return {status: 200, mensaje: 'Actualizado'}
    }else{
      console.log(`Intentando escribir sobre un dir... nop`)
      return {status: 400, mensaje: 'No está permitido escribir sobre un directorio'}
    }

  }catch(err){

    if(err.code == 'ENOENT'){
      console.log(`Creando ${ruta}`)
      await fs.writeFile(target, recurso)
      return {status: 201, mensaje: 'Creado'}
    }else{
      console.log(err)
      return {status: 400, mensaje: err}
    }

  }
}


let move_public = async (origen, destino) => {
  console.log(`move_public llamado con ${origen}, ${destino}`)
  let source = path.join('public', origen)
  let target = path.join('public', destino)

  try{

    let stat = await fs.stat(source)
    await fs.rename(source, target)
    return {status: 200, mensaje: 'Movido!'}

  }catch(err){

    if(err.code == 'ENOENT'){
      console.log(`${origen} no existe`)
      return {status: 400, mensaje: 'Solicitado renombrar un objeto inexistente'}
    }else if(err.code == 'ENOTDIR') {
      console.log(`Intentando mover un archivo dentro de otro`)
      return {status: 400, mensaje: `Intentando mover un archivo dentro de otro`}
    }else{
      console.log(err)
      return {status: 400, mensaje: err}
    }

  }
}


let delete_public = async (ruta) => {
  console.log(`delete_public llamado con ${ruta}`)
  let source = path.join('public', ruta)

  try{

    let stat = await fs.stat(source)
    await fs.unlink(source)
    return {status: 200, mensaje: 'Borrado!'}

  }catch(err){

    if(err.code == 'ENOENT'){
      console.log(`${ruta} no existe`)
      return {status: 400, mensaje: 'Solicitado renombrar un objeto inexistente'}
    }else{
      console.log(err)
      return {status: 400, mensaje: err}
    }

  }
}

exports.delete_md = async (req, res) => {
  res.json(await delete_public(req.body.ruta))
}


exports.post_md = async (req, res) => {
  if(req.body.md && req.body.ruta){
    if(!req.body.ruta.endsWith('.md')) req.body.ruta += '.md'
    res.json(await post_public(req.body.ruta, req.body.md))
  }
  if(req.body.ruta_vieja && req.body.ruta_nueva){
    res.json(await move_public(req.body.ruta_vieja, req.body.ruta_nueva))
  }
}







/* Devuelve la lista de imágenes en public/img */
let imagenes = async () => {
  let imgs_raw = await fs.readdir('public/img')
  let imgs = imgs_raw.map(fn => ({src: '/img/' + fn}))
  return imgs
}


/* Lee public/textos y devuelve un índice en json */
let construir_indice = async (base = 'public/textos') => {
  let lista = await fs.readdir(base, {withFileTypes: true})
  let indice = []
  for (let e of lista){
    // console.log(`Procesando ${e.name}`)
    let ruta = path.join(base, e.name)
    let direccion = ruta.replace('public', '')
    if(e.isDirectory()){
      let cont = await construir_indice(ruta)
      indice.push({es_carpeta: true, ruta: direccion, text: e.name, type: 'carpeta', children: cont})
    }else{
      indice.push({es_carpeta: false, ruta: direccion, text: e.name, type: 'md'})
    }
  }
  // Carpetas primero:
  indice = indice.filter(e => e.es_carpeta).concat(indice.filter(e => !e.es_carpeta))
  return indice
}

/* Transforma el índice json que devuelve construir_indice() a md */
let indice_a_md = async (idx) => {
  let ls = []
  let i = 0
  for (let e of idx){
    if (e.es_carpeta){
      ls.push(``)
      ls.push(`- ${e.text}`)
      ls.push(``)
      let subindice = await indice_a_md(e.children)
      ls = ls.concat(subindice.split('\n').map(l => '  ' + l).join('\n'))
    }
    else{
      ls.push(`- [${e.text}](${e.ruta})`)
    }
  }
  // console.log(ls.join('\n'))
  return ls.join('\n')
}


/* Devuelve el índice de textos en json */
/* Para uso en editor */
exports.indice = async (req, res) => {
  let r = await construir_indice()
  // let ignorar = await indice_a_md(r)
  res.json(r)
}


exports.post_imagenes = async (req, res) => {
  let form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    console.log(err)
    console.log(fields)
    console.log(files)
    console.log()
    let rutas = []
    if (files){
      for (let [ x , pic ] of _.entries(files)){
        let nn = `./public/img/${pic.name}`
        console.log(`Poniendo ${pic} en ${nn}`)
        fs.rename(pic.path, nn, e => { if (e) throw e; })
        rutas.push(`/img/${pic.name}`)
      }
    }
    res.json({status: 200, rutas: rutas})
  })
}

exports.imagenes = async (req, res) => {
  let imgs = await imagenes()
  return res.json(imgs)
}

exports.editor = async (req, res) => {
  let imgs = imagenes()
  let indice_json = await construir_indice()
  let indice_md = await indice_a_md(indice_json)
  let indice_html = md.render(indice_md)

  res.render('editor', {indice: indice_json, imagenes: imgs, indice_html: indice_html, titulo: 'ESDitor'})
}
