import * as d3 from 'd3'

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

export type Menu = (navigate: (path: string) => void) => Promise<NodoType[]>;

export type Punto = { x: number, y: number }
export type GenericD3Selection = d3.Selection<any, any, any, any>
