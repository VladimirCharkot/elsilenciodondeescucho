// let fs = require('fs').promises
import fs from 'fs/promises';
import formidable from 'formidable';
import _ from 'lodash';
import {Request, Response} from 'express';
import {delete_public, post_public, move_public, construir_indice_imgs, construir_indice_textos} from './archivos';

type Endpoint = (req: Request, res: Response) => Promise<void>;


/* MDs */

export const delete_md: Endpoint = async (req, res) => {
  res.json(await delete_public(req.params.path))
}

export const borrar_imagen: Endpoint = async (req, res) => {
  res.json(await delete_public(req.params.path))
}

export const post_md: Endpoint = async (req, res) => {
  if(req.body.md && req.body.ruta){
    if(!req.body.ruta.endsWith('.md')) req.body.ruta += '.md'
    res.json(await post_public(req.body.ruta, req.body.md))
  }
  if(req.body.ruta_vieja && req.body.ruta_nueva){
    res.json(await move_public(req.body.ruta_vieja, req.body.ruta_nueva))
  }
}

/* Imágenes */

export const post_imagenes: Endpoint = async (req, res) => {
  const form = new formidable.IncomingForm()
  form.parse(req, async (__, ___, files) => {
    const rutas = []
    if (files){
      //@ts-ignore
      for (const pic of files){
        const nn = `./public/img/${pic.newFilename}`
        console.log(`Poniendo ${pic} en ${nn}`)
        fs.rename(pic.path, nn)
        rutas.push(`/img/${pic.name}`)
      }
    }
    res.json({status: 200, rutas: rutas})
  })
}


export const indice_imagenes_editor: Endpoint = async (__, res) => {
  console.log(`Armando índice imágenes`)
  let idx_img = await construir_indice_imgs('public/img')
  // let idx_foto = await construir_indice('public/foto')
  // res.json(idx_img.concat(idx_foto))
  res.json(idx_img)
}

// Devuelve un ÁRBOL, que es procesado por el editor
export const indice_textos_editor: Endpoint = async (__, res) => {
  const idx = await construir_indice_textos('public/textos')
  res.json(idx)
}


export const editor: Endpoint = async (__, res) => {
  res.render('editor/editor')
}
