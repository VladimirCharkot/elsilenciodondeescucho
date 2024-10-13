import * as React from 'react'
import {PropsWithChildren} from 'react'

interface SitioProps extends PropsWithChildren{
    titulo?: string
}

export const Sitio  = ({titulo, children}: SitioProps) => (
    <html>
        <head>

            <script async src="https://www.googletagmanager.com/gtag/js?id=G-FLJ7JG40P4"></script>
            <script>
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());

                gtag('config', 'G-FLJ7JG40P4');
            </script>

            <title>{titulo ?? 'El Silencio Donde Escucho'}</title>
            <link rel="stylesheet" href="/css/style.css" />
            <link rel="icon" href="/icon/leaf.png" />
        </head>
        <body>
            {children}
        </body>
    </html>
    )


