import * as d3 from 'd3'
import * as React from 'react'
import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { chunk } from 'lodash'
import { NodoType } from './tipos'
import { transform } from './utils'
import { useEffect } from 'react'
import VidrieraContext from './contexto'

export type LayoutFunc = (nodos: GenericD3Selection) => void

export interface VidrieraProps {
    // update: React.Dispatch<VidrieraProps | null>,   // Dispatcher que actualiza el contenido de la vidriera
    // animacion?: 'inicial' | 'indice',               // Animación inicial, usualmente pan y zoom
    nodos: NodoType[],                              // Nodos de la vidriera
    layout: LayoutFunc,                             // Función que asigna posición inicial a cada nodo
    Overlay?: React.FC
}


// Una vidriera es: nodos + layout + fuerzas + animacion


export type Punto = { x: number, y: number }
export type GenericD3Selection = d3.Selection<any, any, any, any>


export const Vidriera = ({ nodos, layout, Overlay }: VidrieraProps) => {
    const { setNodos, setSvg } = useContext(VidrieraContext)

    useEffect(() => {

        const svg = d3.select<SVGSVGElement, unknown>("svg")
        setSvg(svg)
        setNodos(nodos)

        // const entradas = d3.selectAll('.entrada').data(nodos)

        // setZoom(zoomd3)

        // La animación a veces no sale bien. 
        // translate(-599,-494.25) scale(0.5) -> Mal
        // translate(316,329.5) scale(0.5) -> Bien

        // Drag
        // const drag = d3.drag<SVGSVGElement, unknown>()
        //     .on('drag', (ev, d: any) => {
        //         console.log(`Drag`)
        //         d.x = ev.x;
        //         d.y = ev.y;
        //     })
        // svg.call(drag)

    }, [nodos])

    return (
        <svg className='vidriera' onKeyUp={(e) => {
            // if (e.key == 'a') console.log('a')
        }}>
            <g className='lienzo'>
                {Overlay && <Overlay />}
                {nodos.map(n => <Nodo key={n.titulo} g={n} />)}
            </g>
        </svg>
    )
}


/* Lienzo */

// zoom.scaleTo(svg, 2)
// zoom.translateTo(svg, 0, 0)

// svg.call(zoom.scaleTo, 2)
// svg.call(zoom.translateTo, 0, 0)

// svg.transition().duration(750).call(zoom.scaleTo, 3)
// svg.transition().duration(750).call(zoom.translateTo, 0, 0)




/* Layout */

export interface NodoProps {
    g: NodoType,
    // update: React.Dispatch<any>
}

export const Nodo = ({ g }: NodoProps) => {
    // if(color === undefined) color = '#ccc';
    const navigate = useNavigate()

    if (g.id === undefined) g.id = g.titulo.toLowerCase().split(' ').join('-')

    const [hovereado, setHovereado] = useState(false);

    return (
        <g onClick={() => {
                if(g.accion) g.accion()
                else if(g.slug) navigate(`/escritos/${g.slug!}`)
            }}
            className={`entrada ${hovereado ? 'resaltado' : ''} ${g.visitado ? 'visitado' : ''}`}
            onMouseEnter={() => setHovereado(true)}
            onMouseLeave={() => setHovereado(false)}>

            {/* Esferita */}
            <circle r={95} fill={g.color} stroke={d3.color(g.color)?.darker().formatHex()}></circle>

            {/* Titulo */}
            <text className='titulo' transform='translate(-10,-10)'>{g.titulo}</text>

            {/* Parte el pie en renglones de siete palabras: */}
            {chunk(g.pie.split(' '), 7).map((frase, i) => (
                <text key={frase.join('')} className='pie' transform={`translate(20,${20 + 25 * i})`}>{frase.join(' ')}</text>
            ))}
        </g>
    )
}
