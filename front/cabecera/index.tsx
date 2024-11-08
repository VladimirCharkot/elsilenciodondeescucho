import * as React from 'react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ResultadoDeBusqueda } from '../../backend/blog/blog';
import { debounce } from 'lodash';


type Resultados = ResultadoDeBusqueda[]

type SetState<T> = React.Dispatch<React.SetStateAction<T>>

interface Busqueda {
    textInput: React.RefObject<HTMLInputElement>,
    buscando: boolean,
    setBuscando: SetState<boolean>,
    busqueda: string,
    setBusqueda: SetState<string>,
    resultado: Resultados,
    setResultados: SetState<Resultados>
}



// Query

const query = async (busqueda, setResultado) => {
    // Throttle
    const r = await fetch(`/buscar/${busqueda}`);
    if (r.ok) {
        setResultado(await r.json());
    }
}

const debouncedQuery = debounce(query, 1000);


export interface CabeceraProps {
    active?: boolean,
    atrasTexto?: string,
    atrasPath?: string
}

export const Barra = ({ active, atrasTexto, atrasPath }: CabeceraProps) => {

    const [hovereado, setHovereado] = useState(false);
    const [busqueda, setBusqueda] = useState("");
    const [resultado, setResultado] = useState<Resultados>();

    useEffect(() => {
        if (busqueda.length > 3) {
            debouncedQuery(busqueda, setResultado)
        } else {
            setResultado(undefined)
        }
    }, [busqueda]);


    return (
        <>
            <header className={`${resultado ? 'resultados' : ''} ${(hovereado || active) ? 'hovereado' : ''}`}
                onMouseEnter={() => setHovereado(true)}
                onMouseLeave={() => setHovereado(false)}>
                    
                {atrasTexto && atrasPath && <Nav atrasTexto={atrasTexto} atrasPath={atrasPath} />}
                {(!atrasTexto || !atrasPath) && <div className='placeholder'/>}

                <Titulo />

                <Busqueda busqueda={busqueda} setBusqueda={setBusqueda} />

            </header>

            {resultado && <ResultadosDeBusqueda resultados={resultado} />}
        </>
    )
}



// Barra

const Titulo = () => (
    <h1>
        <a href="/" title="El Silencio Donde Escucho" rel="home">El Silencio Donde Escucho</a>
    </h1>
)

const Nav = ({ atrasTexto, atrasPath }: {atrasTexto?: string, atrasPath?: string}) => {
    const navigate = useNavigate()

    return (<nav onClick={() => { if (atrasPath) navigate(atrasPath) }}>
        &lt; <span className='texto-volver'>{atrasTexto ?? ''}</span>
        </nav>)
}



const Busqueda = ({ busqueda, setBusqueda }: any) => {

    return (
        <div id='area_busqueda'>
            <input id="busqueda" value={busqueda}
                placeholder={'Búsqueda'}
                onKeyUp={(e) => {
                    if (e.key == 'Escape') {
                        setBusqueda('')
                    }
                }}
                onChange={(e) => {
                    setBusqueda(e.target.value);
                }}
                type="text" />
        </div>
    )
}



// Resultados de búsqueda

const TituloResultadoDeBusqueda = ({ r }: { r: ResultadoDeBusqueda }) => {
    return (<div>
        <h4>{r.titulo.replace('.md', '')}</h4>
    </div>)
}

const TextoResultadoDeBusqueda = ({ texto }: { texto: string }) => {
    return (<p>{texto}</p>)
}

const ResultadosDeBusqueda = ({ resultados }: { resultados: Resultados }) => (
    <div id="resultados">{resultados.map(r => (
        <a className='resultado' key={r.id} href={`/escritos/${r.id}`}>
            <TituloResultadoDeBusqueda r={r} />
            {r.matches.map((m, i) => (
                <TextoResultadoDeBusqueda key={i} texto={m} />
            ))}
        </a>
    ))}</div>
)
