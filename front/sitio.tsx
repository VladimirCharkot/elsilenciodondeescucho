import * as React from 'react'
import {PropsWithChildren} from 'react'

interface SitioProps extends PropsWithChildren{
    titulo?: string
}

export const Sitio  = ({titulo, children}: SitioProps) => (
    <html>
        <head>
            <title>{titulo ?? 'El Silencio Donde Escucho'}</title>
            <link rel="stylesheet" href="/css/style.css" />
            <link rel="icon" href="/icon/leaf.png" />
        </head>
        <body>
            {children}
        </body>
    </html>
    )


