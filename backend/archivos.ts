import fs from 'fs/promises';
import path from 'path';
import {ArbolFS, NodoFS} from '../shared/tipos';
import {cache_textos, referencias_a_imagenes} from './cache';


// Update o create
export const post_public = async (ruta: string, recurso: any) => {
  console.log(`Recibiendo request a post_public para ruta ${ruta}`)
  let target = path.join('public', ruta)
  try{
    let stat = await fs.stat(target)
    if (stat.isFile()){
      console.log(`Sobreescribiendo ${ruta}...`)
      await fs.writeFile(target, recurso)
      return {status: 200, mensaje: 'Actualizado'}
    }else{
      return {status: 400, mensaje: 'No está permitido escribir sobre un directorio'}
    }

  }catch(err: any){

    if(err.code == 'ENOENT'){
      console.log(`Creando ${ruta}...`)
      await fs.writeFile(target, recurso)
      return {status: 201, mensaje: 'Creado'}
    }else{
      console.log(err)
      return {status: 400, mensaje: err}
    }

  }
}


export const move_public = async (origen: string, destino: string) => {
  console.log(`move_public llamado con ${origen}, ${destino}`)
  let source = path.join('public', origen)
  let target = path.join('public', destino)

  try{

    let stat = await fs.stat(source)
    await fs.rename(source, target)
    return {status: 200, mensaje: 'Movido!'}

  }catch(err: any){

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


export const delete_public = async (ruta: string) => {
  console.log(`delete_public llamado con ${ruta}`)
  let source = path.join('public', ruta)

  try{

    // let stat = await fs.stat(source)
    await fs.unlink(source)
    return {status: 200, mensaje: 'Borrado!'}

  }catch(err: any){

    if(err.code == 'ENOENT'){
      console.log(`${ruta} no existe`)
      return {status: 400, mensaje: 'Solicitado renombrar un objeto inexistente'}
    }else{
      console.log(err)
      return {status: 400, mensaje: err}
    }

  }
}









interface EntradaFS{
  ruta: string,
  nombre: string,
  children?: EntradaFS[]
}

export const fsTreeWalk = async <T>(baseDir: string, leerHoja: (e: EntradaFS) => Promise<any>): Promise<T[]> => {

  const lista = (await fs.readdir(baseDir, {withFileTypes: true}))
                  .filter(e => e.name != '.DS_Store');

  const indice = lista.map(async e => {
    const entrada = {
      ruta: path.join(baseDir, e.name),
      nombre: e.name
    }
    if(e.isDirectory()){
      const nodo = {...entrada,  children: await fsTreeWalk(entrada.ruta, leerHoja)}
      return nodo
    }else{
      return await leerHoja(entrada)
    }
  })
  return await Promise.all(indice);
}

export const flatten = <T>(tree: T[]): T[] => tree.map((n: any) => n.children ? flatten<T>(n.children) : [n]).flat()



const atributos_fs = (ruta: string, nombre: string) => ({
  ruta: ruta.replace('public', ''),
  nombre: nombre,
  type: nombre.split('.')[1]
})

// Esto es llamado para construir la cache
export const construir_indice_textos = (addr: string) => fsTreeWalk<NodoFS>(addr,
    async ({ruta, nombre}) => atributos_fs(ruta, nombre)
  )

export const construir_indice_textos_hidratado = (addr: string) => fsTreeWalk<NodoFS>(addr,
    async ({ruta, nombre}) => {
      const path = ruta.replace('public', '');
      const txts = cache_textos.filter(t => t.link == path);

      if (txts.length == 0) {
        console.log(`No encontramos ${path} en cache!`);
        return atributos_fs(path, nombre);
      }
      const txt = txts[0];
      // const portada =
      return {
        ...atributos_fs(path, nombre),
        atributos: {...txt.fm, portada: txt.imagenes ? txt.imagenes[0] : null},
      }
    }
  )

export const construir_indice_imgs = (addr: string) => fsTreeWalk<NodoFS>(addr,
    async ({ruta, nombre}) => ({
      ...atributos_fs(ruta, nombre),
      atributos: {
        referencias: referencias_a_imagenes[ruta.replace('public', '')]
      }
    }))




/* Endpoints */

/* Transforma el índice json que devuelve construir_indice() a md */
export const indice_a_md = async (idx: ArbolFS): Promise<string> => {
  let ls: string[] = []
  for (const e of idx){
    if (e.children){
      ls = ls.concat(['', `- ${e.nombre}`, ''])
      if(e.children){
        const subindice = await indice_a_md(e.children)
        ls = ls.concat(subindice.split('\n').map(l => '  ' + l).join('\n'))
      }
    }else{
      ls.push(`- [${e.nombre}](${e.ruta})`)
    }
  }
  return ls.join('\n')
}
