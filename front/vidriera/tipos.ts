import * as d3 from 'd3'

export type SVG = d3.Selection<SVGSVGElement, unknown, HTMLElement, any>
export type Zoom = d3.ZoomBehavior<SVGSVGElement, unknown>
export type Animacion = (svg: SVG, zoom: Zoom, nodo?: { x: number, y: number }) => Promise<void>
export type Layout = (nodos: GenericD3Selection) => void;

export interface DataNodo {
  titulo: string,
  accion: () => void,
  color: string,
  pie: string
}

export type CentroType = { nombre: string, x: number, y: number, color: string }

export interface NodoVidriera {
  titulo: string,
  color: string,
  pie: string,

  fm?: {
    serie?: string
    pie?: string
  },

  accion?: () => void,
  id?: string,
  link?: string,
  visitado?: boolean,
  slug?: string

  x?: number,
  y?: number
}

/**
 * Función async que devuelve una lista de nodos.
 * Recibe navigate para poder definirse fuera de .tsx y aún así poder navegar a otra página.
 */
export type Menu = (navigate?: (path: string) => void) => Promise<NodoVidriera[]>;

export type Punto = { x: number, y: number }
export type GenericD3Selection = d3.Selection<any, any, any, any>
