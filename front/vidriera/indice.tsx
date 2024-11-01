import * as React from 'react';
import { Cabecera } from '../cabecera';
import { Vidriera } from './vidriera';
import { vidriera_inicial } from './contenido';
import { useState, useEffect, useContext } from 'react';
import { VidrieraProps, LayoutFunc } from './vidriera';
import { NodoType } from './tipos';
import { Telon } from '../telon'
// import VidrieraContext, { VidrieraContextProvider } from './contexto';
import VidrieraContext, { VidrieraContextProvider } from './contexto';

export interface IndiceProps {
    nodos: NodoType[],                              // Nodos de la vidriera
    layout: LayoutFunc,                             // Función que asigna posición inicial a cada nodo
    // animacion?: 'inicial' | 'indice',               // Animación inicial, usualmente pan y zoom
    Overlay?: React.FC,
    headerNav?: {
        texto: string,
        path: string
    },
    titulo?: string
}


export const Indice = ({nodos, layout, Overlay, headerNav, titulo} : IndiceProps) => {

    // const [vidriera, setVidriera] = useState<VidrieraProps | null>(null);
    
    const { animacion } = useContext(VidrieraContext)

    useEffect(() => {
        document.title = titulo ?? 'El Silencio Donde Escucho'
    }, [])

    return (
        <>
            <VidrieraContextProvider>
                {/* <Telon onDesvanecer={() => animacion('indice')}/> */}
                <Telon onDesvanecer={() => animacion('inicial') }/>
                <Cabecera atrasTexto={headerNav?.texto} atrasPath={headerNav?.path} />
                <Vidriera
                    nodos={nodos}
                    layout={layout} 
                    Overlay={Overlay}/>
            </VidrieraContextProvider>
        </>
    )
}