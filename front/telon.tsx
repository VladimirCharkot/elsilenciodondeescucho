import * as React from 'react'
import { useRef } from 'react'
import { useEffect, useState } from 'react'

// const umbral = 1000 * 60 * 60
const umbral = 1000 * 60

export const Telon = () => {

    const [mostrar, setMostrar] = useState(false)
    const telon = useRef<HTMLDivElement>(null)

    const visualizar = () => {
        if(telon.current !== null){
            setTimeout(() => {telon.current!.classList.add('visible')}, 500)
            setTimeout(() => {telon.current!.style.visibility = 'hidden'}, 4000)
        }
        
    }

    useEffect(() => {
        const t0 = localStorage.getItem('ultima_visita')
        if (t0 === null){
            visualizar()
        }else{
            const paso_umbral_t = !!(t0 && (Date.now() - parseInt(t0) > umbral))
            if(paso_umbral_t) {
                visualizar()
            }else{
                telon.current?.classList.add('invisible')
            }
        }
        localStorage.setItem('ultima_visita', Date.now().toString())
    }, [])

    return (<div className='telon' ref={telon}>
        <h1>El Silencio Donde Escucho</h1>
    </div>)
}



// script.
  
//   if(Date.now() - window.visto > 1000 * 60 * 60){
//     setTimeout(() => document.querySelector('.telon h1').style.opacity = 1, 100)
//     setTimeout(() => document.querySelector('.telon').style.opacity = 0, 3000)
//     setTimeout(() => document.querySelector('.telon').style.visibility = 'hidden', 4000)
//     document.cookie = `visto=${Date.now()};max-age=${60*60*24}`
//   }else{
//     setTimeout(() => document.querySelector('.telon').style.opacity = 0, 300)
//     setTimeout(() => document.querySelector('.telon').style.visibility = 'hidden', 300)
//   }





// let visto
// try {
//     visto = parseInt(document.cookie.split('; ').filter(s => s.startsWith('visto'))[0].split('=')[1])
// } catch (err) {
//     visto = 0
// }

// const desplegar = () => window.location.hash == '#indice' ? indice() : menu()

// //@ts-ignore
// if (Date.now() - window.visto > 1000 * 60 * 60) {
//     setTimeout(desplegar, 2000)
// } else {
//     desplegar()
// }

