import fs from 'fs/promises';
import {Texto} from '../shared/types/arbol';
import {construir_indice_textos, flatten} from './archivos';
import {render} from './mdesde';


/* SCOPED!! */

export let cache_textos : Texto[];
export let referencias_a_imagenes: Record<string,string[]> = {};

export const cargar_referencias_a_imagenes = () => {
  cache_textos.forEach(t => {
    const regex = RegExp('!\\[(.+?)\\]\\((.+?)\\)', 'ig')
    let m = regex.exec(t.cuerpo)
    while (m !== null) {
      const ruta = m[2];
      if (referencias_a_imagenes.hasOwnProperty(m[2]) ){
        referencias_a_imagenes[ruta].push(t.link)
      }else{
        referencias_a_imagenes[ruta] = [t.link]
      }
      m = regex.exec(t.cuerpo)
    }
  })
}


export const cargar_cache = () => {
  cargar_textos().then(res => {
    cache_textos = res
    cargar_referencias_a_imagenes()
  })
}




const capitalize = (s: string) => s.substring(0,1).toUpperCase() + s.substring(1)

// Lee el contenido!
export const cargar_textos = async (): Promise<Texto[]> => {
  console.log('Cargando textos...')
  const textos = []
  const indice = flatten(await construir_indice_textos('public/textos'))

  for (let entrada of indice){
    let contenido = await fs.readFile('public' + entrada.ruta, 'utf8')
    const {front_matter} = render(contenido);
    //         const entrada: Entrada = {ruta: ruta_public, filename: e.name, type: 'md', id: e.name.split('.')[0], fm: front_matter}

    textos.push({
      titulo: capitalize(entrada.nombre.replace(/-/g,' ')),
      cuerpo: contenido,
      link: entrada.ruta,
      nombre: entrada.nombre.split('.')[0],
      fm: front_matter
    })
  }
  console.log('Textos cargados!...')
  return textos
}


/* /SCOPED!! */
