export interface NodoFS{
  ruta: string,
  nombre: string,
  type: string,
  atributos?: Record<string, any>,
  children?: ArbolFS
}

export type ArbolFS = NodoFS[];


export interface Entrada{
  ruta: string,
  filename: string,
  type: string,
  id: string,
  fm: any
}



export interface TextoSinCuerpo{
  titulo: string,
  link: string,
  nombre: string,
  fm: Record<string, string>,
  cuerpo?: string,
  imagenes?: string[]
}

export interface Texto extends TextoSinCuerpo{
  cuerpo: string
}

export interface ImagenSrc{
  src: string
}
