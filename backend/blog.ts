import fs from 'fs/promises';
import {cloneDeep} from 'lodash';
import {render, corregir_imagenes} from './mdesde';
import config from './config';
import {Request, Response} from 'express';
import {cache_textos} from './cache';
import {TextoSinCuerpo} from '../shared/tipos';


type UserReq = Request & {user?: string, login: any}
type Endpoint = (req: UserReq, res: Response) => Promise<void> | ((req: UserReq, res: Response) => Promise<void>)[]

export const colecta: Endpoint = async (__, res) => {
  res.render('colecta', {
    titulo: 'Colecta',
    MPaccessKey: config.mercadoPago.accessKey,
    URLPlanillaPublica: `https://docs.google.com/spreadsheets/d/${config.sheets.planillaPublica}/`
   })
}

export const hogar: Endpoint = async (req, res) => {
  if (req.user) return res.redirect('/editor')
  return res.render('login', {titulo: '🤫'})
}

/* Página de índice de escritos para el público */
export const indice: Endpoint = async (__, res) => {
  res.render('indice', { titulo: 'Índice' })
}

export const escrito: Endpoint = async (req, res) => {

  // Guardo la visita en la cookie
  let visitados = req.cookies.visitados ?  req.cookies.visitados : [];
  visitados.push(req.params.eid);
  res.cookie('visitados', [...new Set(visitados)], {maxAge: 3*365*24*60*60000, encode: String});

  let {html, front_matter} = await traer_texto(req.params.eid);
  if (!html) res.status(404).send();
  res.render('texto', { titulo: front_matter.titulo || 'El Silencio Donde Escucho', cont: html });
}

export const propuesta: Endpoint = async (req, res) => {
  const md_content = await fs.readFile(`public/textos/propuestas/${req.params.eid}.md`, 'utf8')
  const {html, front_matter} = render(md_content)
  if (!html) res.status(404).send();
  res.render('texto', { titulo: front_matter.titulo || 'El Silencio Donde Escucho', cont: html })
}

export const esde: Endpoint = async (__, res) => {
  const md_content = await fs.readFile('public/textos/esde/hoy.md', 'utf8')
  const {html, front_matter} = render(md_content)
  res.render('texto', { titulo: front_matter.titulo, cont: html })
}


export const indice_textos_public: Endpoint = async (__, res) => {
  const idx: TextoSinCuerpo[] = cloneDeep(cache_textos.filter(txt => (txt.fm ? !txt.fm.oculto || txt.fm.oculto == "no" : true) && txt.link.includes('escritos')))
  idx.forEach(txt => delete txt.cuerpo)
res.json(idx)
}

// Busca en la cache el texto con tal nombre
export const buscar_texto: Endpoint = async (req, res) => {
    const textoId = req.params.textoId
    res.json(await traer_texto(textoId))
}


export interface ResultadoDeBusqueda{
  titulo: string,
  matches: string[],
  id: string
}


// Recibe un query y lo busca dentro de los textos
export const buscar: Endpoint = async (req, res) => {
  console.log(`Buscando ${req.params.consulta}...`)
  if(req.params.consulta.length < 4) res.json([])
  
  const delta = 50
  const resultados = cache_textos.map(t => {

    if(!t.cuerpo) {
        console.log(`@buscar fallando:`)
        console.log(t)
        return {titulo: `Error`, matches: [], id: `err`}
    }

    const regex = RegExp(req.params.consulta, 'ig')
    const matches = []
    const l = t.cuerpo.length

    const texto = t.cuerpo.split('---')[2]

    while ((regex.exec(texto)) !== null) {
      const inf = regex.lastIndex - delta
      const sup = regex.lastIndex + delta
      const i = inf < 0 ? 0 : inf
      const j = sup > l ? l : sup
      const frag = (inf != 0 ? '...' : '') + texto.slice(i,j) + (sup != l ? '...' : '')
      matches.push(frag)
    }

    let resp = {titulo: t.titulo, matches : matches, id: t.nombre}
    return resp
  })
  const relevantes = resultados.filter((r: ResultadoDeBusqueda) => r.matches.length > 0)
  res.json(relevantes)
}




// Busca un md y lo devuelve renderizado
export const traer_texto = async (textoId: string) => {
  if(!cache_textos) return {html: null, front_matter: {titulo: null}};
  const r = cache_textos.filter(t => t.nombre == textoId);
  try{
    const {html, front_matter} = render(r[0].cuerpo)
    return {html: corregir_imagenes(html), front_matter}
    
  }catch(e){
      console.log(`Excepción trayendo textoId. ${cache_textos.filter(t => t.nombre == textoId) ? 'Encontrado en cache.' : 'No encontrado en cache.'}`)
      console.log(e)
      //   console.log(cache_textos)
      return {html: null, front_matter: {titulo: null}}
  }
}

