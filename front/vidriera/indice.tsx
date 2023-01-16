import * as React from 'react';
import { Cabecera } from '../cabecera';
import { Vidriera } from './vidriera';
import { vidriera_inicial } from './contenido';
import { useState, useEffect } from 'react';
import { VidrieraProps, LayoutFunc } from './vidriera';
import { NodoType } from './tipos';
import { Telon } from '../telon'


export interface IndiceProps {
    nodos: NodoType[],                              // Nodos de la vidriera
    layout: LayoutFunc,                             // Función que asigna posición inicial a cada nodo
    animacion?: 'inicial' | 'indice',               // Animación inicial, usualmente pan y zoom
    Overlay?: React.FC,
    headerNav?: {
        texto: string,
        path: string
    }
}


export const Indice = ({animacion, nodos, layout, Overlay, headerNav} : IndiceProps) => {

    // const [vidriera, setVidriera] = useState<VidrieraProps | null>(null);

    useEffect(() => {
        
    }, [])

    return (
        <>
            <Telon/>
            <Cabecera atrasTexto={headerNav?.texto} atrasPath={headerNav?.path} />
            <Vidriera
                animacion={animacion}
                nodos={nodos}
                layout={layout} 
                Overlay={Overlay}/>
        </>
    )
}