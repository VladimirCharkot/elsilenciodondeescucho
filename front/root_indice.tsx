import * as React from 'react'
import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import { Indice } from './vidriera/indice'
import { Escrito } from './escrito'
import { NotFound } from './status/not_found'
import { Sitio } from './sitio'


import { vidriera_inicial, vidriera_escritos, vidriera_propuestas } from './vidriera/contenido'
import { NodoType } from './vidriera/tipos'


const Inicio = () => {

    const navigate = useNavigate()
    const [nodosEscritos, setNodosEscritos] = useState<NodoType[]>()

    useEffect(() => {
        vidriera_escritos.nodos(navigate).then(setNodosEscritos)
    }, [])

    return (
        <Routes>

            <Route path="/" element={<Indice
                animacion={vidriera_inicial.animacion}
                nodos={vidriera_inicial.nodos(navigate)}
                layout={vidriera_inicial.layout} />} />

            {nodosEscritos && <Route path="/escritos/" element={<Indice
                animacion={vidriera_escritos.animacion}
                nodos={nodosEscritos}
                layout={vidriera_escritos.layout}
                Overlay={vidriera_escritos.Overlay}
                headerNav={{
                    texto: 'Inicio',
                    path: '/'
                }} />} />}

            <Route path="/propuestas/" element={<Indice
                animacion={vidriera_propuestas.animacion}
                nodos={vidriera_propuestas.nodos(navigate)}
                layout={vidriera_propuestas.layout} 
                headerNav={{
                    texto: 'Inicio',
                    path: '/'
                }}/>} />

            <Route path="/escritos/:textoId" element={<Escrito headerNav={{
                    texto: 'Escritos',
                    path: '/escritos/'
                }}/>} />

            <Route path="/propuestas/:textoId" element={<Escrito headerNav={{
                    texto: 'Propuestas',
                    path: '/propuestas/'
                }}/>} />

            <Route path="/esde/" element={<Escrito txtId='hoy' headerNav={{
                    texto: 'Inicio',
                    path: '/'
                }} />} />

            <Route path="*" element={<NotFound />} />

        </Routes>
    )
}



const container = document.getElementById('app')!;
const root = createRoot(container);

root.render(
    <BrowserRouter>
        <Inicio />
    </BrowserRouter>
);

