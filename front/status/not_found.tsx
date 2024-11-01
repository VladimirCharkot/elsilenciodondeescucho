import { Barra } from '../cabecera'
import * as React from 'react'

export const NotFound = () => {

    const d = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        if (d.current) { d.current.style.opacity = '1' }
    }, [])

    return (<>
        <Barra />
        <div ref={d} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            textTransform: 'uppercase',
            letterSpacing: '0.6em',
            transition: '5s',
            opacity: 0
        }}>
            Esa página no existe
        </div>
    </>)
}