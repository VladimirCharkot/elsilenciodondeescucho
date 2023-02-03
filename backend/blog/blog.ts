import fs from 'fs/promises';
import { cloneDeep } from 'lodash';
import { render } from './mdesde';
import { corregir_imagenes } from './mdcustoms';
import config from '../sitio/config';
import { Request, Response } from 'express';
import { cache_textos } from './cache';
import { TextoSinCuerpo } from '../../shared/tipos';
import { JSDOM } from 'jsdom';


type UserReq = Request & { user?: string, login: any }
type Endpoint = (req: UserReq, res: Response) => Promise<void> | ((req: UserReq, res: Response) => Promise<void>)[]

export const colecta: Endpoint = async (__, res) => {
  res.render('colecta/presencia', {
    titulo: 'Colecta',
    MPaccessKey: config.mercadoPago.accessKey,
    URLPlanillaPublica: `https://docs.google.com/spreadsheets/d/${config.sheets.planillaPublica}/`
  })
}

export const hogar: Endpoint = async (req, res) => {
  if (req.user) return res.redirect('/editor')
  return res.render('login', { titulo: '🤫' })
}

/* Página de índice de escritos para el público */
export const frontend: Endpoint = async (__, res) => {
  res.render('frontend')
}


// Geteados por el frontend: 

export const indice_textos_public: Endpoint = async (__, res) => {
  const idx: TextoSinCuerpo[] = cloneDeep(cache_textos ? cache_textos.filter(txt => (txt.fm ? !txt.fm.oculto || txt.fm.oculto == "no" : true) && txt.link.includes('escritos')) : [])
  idx.forEach(txt => delete txt.cuerpo)
  res.json(idx)
}

// Busca en la cache el texto con tal nombre
export const buscar_texto: Endpoint = async (req, res) => {
  const textoId = req.params.textoId
  res.json(await traer_texto(textoId))
}


export interface ResultadoDeBusqueda {
  titulo: string,
  matches: string[],
  id: string
}


// Recibe un query y lo busca dentro de los textos
export const buscar: Endpoint = async (req, res) => {
  console.log(`Buscando ${req.params.consulta}...`)
  if (req.params.consulta.length < 4) res.json([])

  const delta = 50
  const resultados = cache_textos.map(t => {

    if (!t.cuerpo) {
      console.log(`@buscar fallando:`)
      console.log(t)
      return { titulo: `Error`, matches: [], id: `err` }
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
      const frag = (inf != 0 ? '...' : '') + texto.slice(i, j) + (sup != l ? '...' : '')
      matches.push(frag)
    }

    let resp = { titulo: t.titulo, matches: matches, id: t.nombre }
    return resp
  })
  const relevantes = resultados.filter((r: ResultadoDeBusqueda) => r.matches.length > 0)
  res.json(relevantes)
}




// Busca un md y lo devuelve renderizado
export const traer_texto = async (textoId: string) => {
  if (!cache_textos) return { html: null, front_matter: { titulo: null } };
  const r = cache_textos.filter(t => t.nombre == textoId);
  try {
    const { html, front_matter } = render(r[0].cuerpo)
    
    return { html: corregir_imagenes(new JSDOM(html).window.document), front_matter }

  } catch (e) {
    console.log(`Excepción trayendo textoId. ${cache_textos.filter(t => t.nombre == textoId) ? 'Encontrado en cache.' : 'No encontrado en cache.'}`)
    console.log(e)
    //   console.log(cache_textos)
    return { html: null, front_matter: { titulo: null } }
  }
}

