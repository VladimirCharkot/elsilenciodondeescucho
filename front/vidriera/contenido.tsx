import * as React from 'react'

import { rgb } from 'd3'
import { TextoSinCuerpo } from '../../shared/tipos'
import { DataNodo } from './tipos'
import { CentroType, NodoType } from './tipos';
import { capitalize, transform, get_visitados } from './utils'
import { get } from '../utils/http'
import { GenericD3Selection } from './vidriera'
import {find, defaultTo} from 'lodash'

// Textos ya visitados
const visitados = get_visitados()


type Menu = (navigate: (path: string) => void) => Promise<NodoType[]>

export const layout_escritos = (ns: GenericD3Selection) => layout_centros(ns, centros_indice.map(c => ({...c, x: c.x * 2.6, y: c.y * 2.6})))

// Centros para usar en el índice de escritos
export let centros_indice: CentroType[] = [
    { nombre: 'primarios', x: 0, y: 0, color: '#D8EBD8' },
    { nombre: 'atención', x: -1000, y: 400, color: '#B4D6D7' },
    { nombre: 'mecanicidad', x: -1000, y: -400, color: '#F5EDCE' },
    { nombre: 'trabajo', x: 1000, y: -400, color: '#FAE0B8' },
    { nombre: 'presencia', x: 2000, y: 0, color: '#D7CCEA' },
    { nombre: 'mundo', x: 0, y: 800, color: '#CDD6F0' },
    { nombre: 'contemplación', x: -2000, y: 0, color: '#D9C8DE' },
    { nombre: 'verdad', x: 0, y: -800, color: '#D9C8DE' },
    { nombre: 'libertad', x: 1000, y: 400, color: '#DBB6B6' }
]

// Etiquetas dibujadas sobre los centros
export const Etiquetas: React.FC = () => (
    <>{centros_indice.map(c => (
        <g className='cabecera' transform={`translate(${c.x * 3}, ${c.y * 3})`} key={c.nombre}>
            <text>{capitalize(c.nombre)}</text>
        </g>)
    )}</>
)

// Procesamiento de la información del backend para mostrarla como nodos
const texto_a_nodo = (entrada: TextoSinCuerpo): NodoType => ({
    ...entrada,
    color: defaultTo(find(centros_indice, ['nombre', entrada.fm.serie])?.color, 'gray'),
    titulo: capitalize(entrada.nombre.split('.')[0].split('-').join(' ')),
    // accion: async () => { document.location = `/escritos/${entrada.nombre.split('.')[0]}` },
    pie: entrada.fm.pie ?? '',
    visitado: visitados.includes(entrada.slug)
})


export const menu_escritos = async (navigate) => {
    const r = await get<TextoSinCuerpo[]>('/indice_json');
    return r.map(texto_a_nodo)
}

export const vidriera_escritos = {
    animacion: 'indice' as 'indice',
    nodos: menu_escritos,
    layout: layout_escritos,
    Overlay: Etiquetas
}




// Menú principal, cuatro esferitas
export const menu_principal = (navigate) => [
    {
        id: 'escritos',
        titulo: 'Escritos',
        accion: () => {
            navigate('/escritos/')
        },
        color: rgb("#23689b").formatHsl(),
        pie: ''
    },
    {
        id: 'propuestas',
        titulo: 'Propuestas',
        accion: () => {
            navigate('/propuestas/')
        },
        color: rgb("#939b62").formatHsl(),
        pie: ''
    },
    {
        id: 'esde',
        titulo: 'El Silencio Donde Escucho',
        accion: () => {
            navigate('/esde/')
        },
        color: rgb("#ffd56b").formatHsl(),
        pie: ''
    },
    {
        id: 'colecta',
        titulo: 'Colecta',
        accion: () => {
            document.location = '/colecta'
        },
        color: rgb("#7e67e5").formatHsl(),
        pie: ''
    }
]






// NodoType[]
export let menu_propuestas = (navigate) => [
    {
        titulo: 'Integrador de movimiento',
        accion: async () => { navigate('/propuestas/integrador-movimiento/') },
        color: "#23689b",
        pie: 'Enfoque integrador de la dialéctica Cuerpo-Mente-Espíritu y de la relación entre lo Interno y lo externo'
    },
    {
        titulo: 'Malabareando un no-malabar',
        accion: async () => { navigate('/propuestas/malabareando') },
        color: "#23689b",
        pie: 'Estancia de Investigación para malabaristas'
    },
    {
        titulo: 'El Silencio Donde Escucho',
        accion: async () => { navigate('/propuestas/esde') },
        color: "#23689b",
        pie: 'Taller Entrenamiento de Presencia Activa'
    },
    {
        titulo: 'Los movimientos -en la práctica de la presencia- son "Acción"',
        accion: async () => { navigate('/propuestas/accion') },
        color: "#23689b",
        pie: '"Cada lenguaje, el gesto de una mano, el toque en una cuerda, un pincel que se desliza, el lanzamiento de un objeto, cada uno, es un movimiento. Y un movimiento es también lo que lo generó"'
    },
    {
        titulo: 'Formato Anual Grupal',
        accion: async () => { navigate('/propuestas/grupal') },
        color: "#939b62",
        pie: 'Este primer modulo abre el trabajo para la investigación y exploración sobre nosotros mismos, a nivel vivencial y conceptual. Las partes que componen lo que somos, cómo funcionan, cuál es nuestra naturaleza esencial y cuál la adquirida, cuál es y de qué consta un Real Trabajo sobre sí mismo sin formas predeterminadas.'
    },
    {
        titulo: 'Formato Personalizado',
        accion: async () => { navigate('/propuestas/personalizado') },
        color: "#939b62",
        pie: 'Se abre un espacio-tiempo para iniciar un proceso individual de trabajo sobre sí mismo, dando la atención y cuidado precisos'
    },
    {
        titulo: 'Formato Charla Abierta',
        accion: async () => { navigate('/propuestas/abierta') },
        color: "#939b62",
        pie: 'La misma se propone sin dirección ni recorrido determinado de antemano, sino que se confía en que tome la forma que le corresponda por intermedio de las cuestiones que atraviesen a los asistentes en torno a estos temas'
    },

]


export const layout_inicial =  (ns: GenericD3Selection) => layout_centros(ns, [{nombre: '', x: 0, y: 0, color: 'black'}])

export const vidriera_inicial = {
    animacion: 'inicial',
    nodos: menu_principal,
    layout: layout_inicial
}

export const vidriera_propuestas = {
    animacion: 'inicial',
    nodos: menu_propuestas, 
    layout: layout_inicial
}



export const layout_centros = (nodos: GenericD3Selection, centros: CentroType[] | null) => {

    const centrar: any = (nodos, centro) => {
        let theta = Math.PI * (3 - Math.sqrt(5))
        nodos.each((d, i) => {
            let r = 100 * Math.sqrt(i)
            let phi = i * theta
            d.x = centro.x + r * Math.cos(phi)
            d.y = centro.y + r * Math.sin(phi)
        })
        transform(nodos)
    }

    if (!centros) centros = [{ nombre: '', x: 0, y: 0, color: '#aaa' }]

    centros.forEach(c => {
        const these_nodos = c.nombre ? nodos.filter(n => n.fm?.serie == c.nombre) : nodos;
        centrar(these_nodos, c)
    })

}



