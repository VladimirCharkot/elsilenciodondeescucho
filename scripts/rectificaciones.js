// Rectifica los nombres de archivo de /public/textos/ reemplazando guiones bajos por guiones.

const fs = require('fs/promises')

let rectificar_guiones = async (base = './public/textos/') => {
  let mds = await fs.readdir(base)
  for (let md of mds){
    let st = await fs.stat(base+md)
    if(st.isDirectory()){
      await rectificar(base+md+'/')
    }else{
      console.log(`Movería ${base+md} a ${(base+md).split('_').join('-')}`)
      await fs.rename(base+md, (base+md).split('_').join('-'))
    }
  }
  return 'ta'
}

let agregar_front_matter = async (base = './public/textos/', parent = '') => {
  let mds = await fs.readdir(base)
  for (let md of mds){
    let st = await fs.stat(base+md)
    if(st.isDirectory()){
      await agregar_front_matter(base+md+'/', parent = md)
    }else{

      console.log(`Procesando ${base+md}`)
      let contenido = await fs.readFile(base+md, 'utf8')
      if (!contenido.startsWith('---')){
        let nuevo_contenido = `---\nserie: ${parent}\n---\n\n` + contenido
        await fs.writeFile(base+md, nuevo_contenido)
      }

    }
  }
  return 'ta'
}

exports.rectificar_guiones = rectificar_guiones
exports.agregar_front_matter = agregar_front_matter
