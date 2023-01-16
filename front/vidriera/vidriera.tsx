import * as d3 from 'd3'
import * as React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { chunk } from 'lodash'
import { NodoType } from './tipos'
import { transform } from './utils'
import { useEffect } from 'react'
import e from 'express'

// export type EfectoVidriera = (update) => Promise<void>
export type LayoutFunc = (nodos: GenericD3Selection) => void

export interface VidrieraProps {
    // update: React.Dispatch<VidrieraProps | null>,   // Dispatcher que actualiza el contenido de la vidriera
    animacion?: 'inicial' | 'indice',               // Animación inicial, usualmente pan y zoom
    nodos: NodoType[],                              // Nodos de la vidriera
    layout: LayoutFunc,                             // Función que asigna posición inicial a cada nodo
    Overlay?: React.FC
}


// Una vidriera es: nodos + layout + fuerzas + animacion


export type Punto = { x: number, y: number }
export type GenericD3Selection = d3.Selection<any, any, any, any>


export const Vidriera = ({ animacion, nodos, layout, Overlay }: VidrieraProps) => {

    useEffect(() => {

        const svg = d3.select<SVGSVGElement, unknown>("svg")
        const entradas = d3.selectAll('.entrada').data(nodos)
        const lienzo = d3.select('.lienzo')

        // Zoom and pan
        const zoom = d3.zoom<SVGSVGElement, unknown>()
            .scaleExtent([0.05, 5])
            .on("zoom", ({ transform }) => {
                lienzo.attr('transform', transform)
            });

        document.addEventListener('keypress', (e) => {
            if(e.key == 'd' || e.key == 'D')
                console.log(lienzo.attr('transform'))
        })

        svg.call(zoom)

        // Fuerza
        const fuerza = layout_fuerza(entradas);

        //@ts-ignore
        const escalar = (ms: number, scl: number) => svg.transition().duration(ms).ease(d3.easeCubic).call(zoom.scaleTo, scl)
        //@ts-ignore
        const panear = (ms: number, p: Punto) => svg.transition().duration(ms).ease(d3.easeCubic).call(zoom.translateTo, p.x, p.y)

        const animaciones = {
            'inicial': async () => {
                console.log(`Corriendo animacion`)
                zoom.translateTo(svg, 100, 0)
                zoom.scaleTo(svg, 0.2)
                escalar(3000, 0.5)
            },
            'indice': async () => {
                zoom.translateTo(svg, 0, 0)
                zoom.scaleTo(svg, 0.5)
                escalar(3000, 0.08) 
            }
        }

        layout(entradas)

        if(animacion) setTimeout(() => animaciones[animacion]())

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



const layout_fuerza = (nodos: GenericD3Selection, custom_opcs = {}) => {
    const default_opcs = {
        init: () => { },
        draw: () => transform(nodos),
        dv: 0.6,
        da: 0.01,
        df: -450
    }
    const opcs = { ...default_opcs, ...custom_opcs }

    opcs.init()

    //@ts-ignore
    let simulacion = d3.forceSimulation(d3.selectAll('.entrada').data())
        .velocityDecay(opcs.dv)
        .alphaDecay(opcs.da)
        .force("campo", d3.forceManyBody().strength(opcs.df))
        .on("tick", opcs.draw)

    return simulacion
}



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
