// import * as React from 'react';

import {get, post, del, postFiles} from '../utils/http';

import {ArbolFS, NodoFS, ImagenSrc} from '../../shared/tipos';

interface UpsertRequest{ ruta: string, contenido: string }
interface RenameRequest{ ruta_vieja: string, ruta_nueva: string }
interface Md{html: string, front_matter: any};

export const useArchivos = () => {

  const lookupMd = (textId: string) => get<Md>(`/texto/${textId}`)
  const getMd = (url: string) => get<string>(url, r => r.text())
  const upsertMd = (md: UpsertRequest) => post(`/md/`, md)
  const renameMd = (rn: RenameRequest) => post(`/md/`, rn)
  const eraseMd = (path: string) => del(`/md/${path}`)

  const getIndexMd = () => get<ArbolFS>(`/indice_escritos/`)
  const getIndexImgs = () => get<ArbolFS>(`/indice_imagenes/`)

  const getImgs = () => get<ImagenSrc[]>(`/imagenes/`)
  const postImgs = (fs: FileList) => postFiles(`/imagenes/`, fs)
  const eraseImg = (path: string) => del(`/imagenes/${path}`)

  return {lookupMd, getMd, upsertMd, renameMd, eraseMd, getImgs, postImgs, eraseImg, getIndexMd, getIndexImgs}

}
