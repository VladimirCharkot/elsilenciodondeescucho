/**
 * La vidriera funciona cargando y descargando contenido, pero permaneciendo siempre renderizada.
 * Este contexto se encarga de inicializar y mantener referencia a los elementos de d3.
 */

import * as d3 from 'd3'
import * as React from 'react'
import { createContext, useState } from 'react'
import { centros_indice } from './contenido'
import { Animacion, Layout, NodoVidriera, SVG, Zoom } from './tipos'
import { dragd3, zoomd3 } from './utils'

interface VidrieraConfig {
  nodos: NodoVidriera[]
  layout?: Layout
  animacion?: Animacion
}

function useVidrieraState() {
  const zoomRef = React.useRef<Zoom | null>(null)
  const svgRef = React.useRef<SVG | null>(null)

  const [nodos, setNodos] = useState<NodoVidriera[]>([])
  const [enfocado, setEnfocado] = useState<string | null>(null)

  const layoutRef = React.useRef<Layout | null>(null)
  const animacionRef = React.useRef<Animacion | null>(null)

  const [montado, setMontado] = useState(false)

  // Funciones de la vidriera
  const enfocarPunto = React.useCallback(
    (punto: { x?: number; y?: number }, escala: number = 0.8, duracion: number = 500) => {
      if (!svgRef.current || !zoomRef.current) return

      const svgWidth = parseInt(svgRef.current.style('width'))
      const svgHeight = parseInt(svgRef.current.style('height'))
      const { x, y } = punto

      if (x === undefined || y === undefined) return

      const t = d3.zoomIdentity
        .translate(svgWidth / 2, svgHeight / 2)
        .scale(escala)
        .translate(-x, -y)

      svgRef.current.transition().duration(duracion).ease(d3.easeCubic).call(zoomRef.current.transform, t)
    },
    []
  )

  /**
   * Busca por slug el nodo o centro, y enfoca si lo encuentra.
   */
  const enfocarItem = React.useCallback(
    (slug: string, escala: number = 0.8, duracion: number = 1500) => {
      const nodo = nodos.find((n) => n.titulo === slug)
      const centro = centros_indice.find((c) => c.nombre === slug)

      if (centro || nodo) enfocarPunto(centro || nodo!, escala, duracion)
    },
    [nodos, enfocarPunto]
  )

  // Highlight y downlight de nodo enfocado (y su serie si aplica)
  React.useEffect(() => {
    if (enfocado) {
      // Buscamos nodo y centro (serie)
      const nodo = nodos.find((n) => n.slug === enfocado)
      const centro = centros_indice.find((c) => c.nombre === nodo?.fm?.serie)

      // Destacamos
      if (centro) {
        d3.selectAll('.cabecera').classed('dimmeado', true)
        d3.select(`[data-slug="${centro.nombre}"]`).classed('destacado', true)
        enfocarItem(centro.nombre, 0.6)
      }

      // Destacamos
      if (nodo) {
        d3.selectAll('.entrada').classed('dimmeado', true)
        d3.select(`[data-slug="${enfocado}"]`).classed('destacado', true)
      }
    } else {
      // Quitamos destacados
      d3.selectAll('.entrada').classed('destacado', false)
      d3.selectAll('.entrada').classed('dimmeado', false)
    }
  }, [enfocado])

  const montar = React.useCallback((config: VidrieraConfig) => {
    // Guardamos la "estrategia"
    if (config.layout) layoutRef.current = config.layout
    if (config.animacion) animacionRef.current = config.animacion

    // Triggereamos el render
    setNodos(config.nodos)
  }, [])

  /**
   * Cuando los nodos estén, lanzamos d3 (layout y animación)
   * Effectful. Monta el zoom y drag con d3 sobre los nodos que hayan en el estado.
   * Llama al layout y a la animación si las hubiera.
   * Los nodos son renderizados en el template y linkeados a d3 acá.
   * DA POR HECHO QUE EXISTE UN SVG EN EL DOM MONTADO POR VIDRIERA.
   * Corre en un useLayoutEffect para que corra antes del paint pero después del state update de `nodos`.
   */
  React.useLayoutEffect(() => {
    if (nodos.length === 0) return

    const svg = d3.select<SVGSVGElement, unknown>('svg')
    if (svg.empty()) return

    // Zoom/drag
    const lienzo = d3.select('.lienzo')
    const zoomBehavior = zoomd3(svg, lienzo)
    dragd3(svg)

    // Linkeamos data
    const entradas = d3.selectAll('.entrada').data(nodos)

    // Corremos el layout
    if (layoutRef.current) {
      layoutRef.current(entradas)
    }

    // Corremos animación
    if (animacionRef.current) {
      animacionRef.current(svg, zoomBehavior)
      // Optional, si hubiera que limparla luego de triggerear:
      // animacionRef.current = null;
    }

    // Abastecer refs
    svgRef.current = svg
    zoomRef.current = zoomBehavior
    setMontado(true)
  }, [nodos])

  return {
    nodos,
    setNodos,

    enfocado,
    setEnfocado,

    zoomRef,
    svgRef,
    layoutRef,
    animacionRef,

    montado,

    enfocarItem,
    montar,
  }
}

//@ts-ignore
const VidrieraContext = createContext<ReturnType<typeof useVidrieraState>>(null)

export const VidrieraContextProvider = ({ children }) => {
  const data = useVidrieraState()
  return <VidrieraContext.Provider value={data}>{children}</VidrieraContext.Provider>
}

export function useVidriera() {
  const context = React.useContext(VidrieraContext)
  if (!context) {
    throw new Error('useVidriera debe usarse dentro de un VidrieraContextProvider')
  }
  return context
}

export default VidrieraContext
