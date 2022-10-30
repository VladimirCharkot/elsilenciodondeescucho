import fs from 'fs/promises';
import _ from 'lodash';
import {render} from './mdesde';
import config from './config';
import {Request, Response} from 'express';
import {cache_textos} from './cache';
import {TextoSinCuerpo} from '../shared/types/arbol';


type UserReq = Request & {user?: string, login: any}
type Endpoint = (req: UserReq, res: Response) => Promise<void>;

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
export const escritos: Endpoint = async (__, res) => {
  res.render('indice', { titulo: 'Índice' })
}

export const escrito: Endpoint = async (req, res) => {

  // Guardo la visita en la cookie
  let visitados = req.cookies.visitados ?  req.cookies.visitados : [];
  visitados.push(req.params.eid);
  res.cookie('visitados', [...new Set(visitados)], {maxAge: 3*365*24*60*60000, encode: String});

  let {html, front_matter} = await traer_texto(req.params.eid);
  console.log(front_matter);
  console.log(html);
  if (!html) res.status(404).send();
  res.render('texto', { titulo: front_matter.titulo || 'El Silencio Donde Escucho', cont: html });
}

export const taller: Endpoint = async (req, res) => {

  let {html, front_matter} = await traer_texto(req.params.tid);
  if (!html) res.status(404).send();
  res.render('texto', { titulo: front_matter.titulo || 'El Silencio Donde Escucho', cont: html });
}

export const propuestas: Endpoint = async (__, res) => {
  res.render('propuestas', {titulo: 'Propuestas'})
}

export const esde: Endpoint = async (__, res) => {
  let {html, front_matter} = await traer_texto('hoy')
  res.render('texto', { titulo: front_matter.titulo, cont: html })
}




// Devuelve una LISTA, que es procesada por public/js/vidriera/vidriera.js
export const indice_textos_public: Endpoint = async (__, res) => {
  const idx: TextoSinCuerpo[] = cache_textos.filter(txt => txt.fm ? !txt.fm.oculto || txt.fm.oculto == "no" : true)
  idx.forEach(txt => delete txt.cuerpo)
  res.json(idx)
}


interface ResultadoDeBusqueda{
  titulo: string,
  matches: string[],
  id: string
}

export const buscar: Endpoint = async (req, res) => {
  if(req.params.consulta.length < 4) res.json([])
  const delta = 50
  const resultados = cache_textos.map(t => {

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
export const traer_texto = async (eid: string) => {
  if(!cache_textos) return {html: null, front_matter: {titulo: null}};
  const r = cache_textos.filter(t => t.nombre == eid);
  try{
    const md_file = 'public' + r[0].link;
    const md_content = await fs.readFile(md_file, 'utf8')
    return render(md_content)
  }catch(e){
    return {html: null, front_matter: {titulo: null}}
  }
}
