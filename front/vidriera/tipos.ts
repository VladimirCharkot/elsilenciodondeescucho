import {RGBColor} from 'd3'
// import { EfectoVidriera } from './vidriera'

export interface DataNodo{
  titulo: string,
  accion: () => void,
  color: string,
  pie: string
}

export type CentroType = { nombre: string, x: number, y: number, color: string }

export interface NodoType{
    titulo: string,
    color: string,
    pie: string,
    
    accion?: () => void,
    id?: string,
    link?: string,
    visitado?: boolean,
    slug?: string
}