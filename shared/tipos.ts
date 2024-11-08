import { NodoVidriera } from "../front/vidriera/tipos";

/**
 * Backend
 */

// Representa un archivo o carpeta levantado del FS
export interface NodoFS{
  ruta: string,
  nombre: string,
  type: string,
  atributos?: Record<string, any>,
  children?: ArbolFS
}

export type ArbolFS = NodoFS[];


// Representa una entrada del blog, un MD, posiblemente con front matter
export interface Entrada{
  ruta: string,
  filename: string,
  type: string,
  id: string,
  fm: any
}


/**
 * Interfaz
 */

// Representa una _entrada_ del blog como son enviadas al frontend
// (no tiene el texto, solo el "header")
export interface TextoSinCuerpo{
  titulo: string,
  link: string,
  nombre: string,
  fm: Record<string, string>,
  slug: string
  cuerpo?: string,
  imagenes?: string[]
}

export interface Texto extends TextoSinCuerpo{
  cuerpo: string
}

export interface ImagenSrc{
  src: string
}
