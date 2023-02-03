import fs from 'fs/promises';
import {Texto} from '../../shared/tipos';
import {construir_indice_textos, flatten} from './archivos';
import {render} from './mdesde';


/* SCOPED!! */

export let cache_textos : Texto[];
export let referencias_a_imagenes: Record<string,string[]> = {};

const extraer_imagenes = (cuerpo_md : string) => {
  const imgs = []
  const regex = RegExp('!\\[(.+?)\\]\\((.+?)\\)', 'ig')
  let m = regex.exec(cuerpo_md)
  while (m !== null) {
    const ruta = m[2];
    imgs.push(ruta)
    m = regex.exec(cuerpo_md)
  }
  return imgs
}

export const cargar_referencias_a_imagenes = () => {
  cache_textos.forEach(t => {
    const imgs = t.imagenes ?? [];
    imgs.forEach(img => {
      if(referencias_a_imagenes.hasOwnProperty(img)){
        referencias_a_imagenes[img].push(t.link);
      }else{
        referencias_a_imagenes[img] = [t.link];
      }
    })
  })
}


export const cargar_cache = () => {
  cargar_textos().then(res => {
    cache_textos = res
    console.log(`Textos cacheados`)
    cargar_referencias_a_imagenes()
  })
}

const capitalize = (s: string) => s.substring(0,1).toUpperCase() + s.substring(1)


// Lee el contenido!
export const cargar_textos = async (): Promise<Texto[]> => {
  console.log('Cargando textos...')
  const textos: Texto[] = []
  const indice = flatten(await construir_indice_textos('public/textos'))

  for (let entrada of indice){
    let contenido = await fs.readFile('public' + entrada.ruta, 'utf8')
    const {front_matter} = render(contenido);
    const imgs = extraer_imagenes(contenido);

    // console.log(`Cargando ${entrada.ruta}...`)
    textos.push({
      titulo: capitalize(entrada.nombre.replace(/-/g,' ')),
      slug: entrada.nombre.includes('.') ? entrada.nombre.split('.')[0] : '',
      cuerpo: contenido,
      link: entrada.ruta,
      nombre: entrada.nombre.split('.')[0],
      fm: front_matter,
      imagenes: imgs
    })
  }
  console.log('Textos cargados!...')
  return textos
}

cargar_cache()


/* /SCOPED!! */
