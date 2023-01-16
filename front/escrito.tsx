import { text } from 'd3';
import * as React from 'react';
import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useArchivos } from './editor/backend';
import { Cabecera } from './cabecera';
import { throttle } from 'lodash';
import { use } from 'passport';

// MD devuelve las imágenes en imgs dentro de ps,
// acá las reemplazo por divs con background

// const Ventana = () => (
//   <div className="ventana">
//     {}
//   </div>
// )

interface EscritoProps{
    txtId?: string,
    headerNav?: {
        texto: string,
        path: string
    }
}



// Puede venir por prop o por url
export const Escrito = ({txtId, headerNav}: EscritoProps) => {
  const { textoId } = useParams();

  const [y, setY] = useState(0);
  const [barraActiva, setBarraActiva] = useState(false)

//   const manejarNav = useCallback(throttle(() => {
//     // const window = e.currentTarget;
//     console.log(y > window.scrollY)
//     setY(window.scrollY);
//     setBarraActiva(y > window.scrollY)
//   }, 500), []);

  const manejarNav = () => {
    setY(window.scrollY);
    setBarraActiva(y > window.scrollY)
  }

  useEffect(() => {setY(window.scrollY)}, [])

  useEffect(() => {
    window.addEventListener("scroll", manejarNav);
    return () => { 
      window.removeEventListener("scroll",manejarNav);
    };
  }, [y]);

  const txt = txtId ?? textoId

  return (
    <>
      <Cabecera atrasTexto={headerNav?.texto} atrasPath={headerNav?.path} active={barraActiva} />
      <article className="texto">
        {txt && <>
            <Texto src_md={txt}/>
            <address className="firma piel">
                <p>Sebastián Rojo</p>
                <p>"El Silencio Donde Escucho"</p>
            </address>
        </>}
        
      </article>
    </>
  )
}



const Texto = ({src_md} : {src_md: string}) => {
    const {lookupMd} = useArchivos();
    const [html, setHtml] = useState('');
  
    useEffect(() => {
      lookupMd(src_md).then(t => {
        setHtml(t.html)
    })
    }, [])
  
    return (
      <div className='texto' dangerouslySetInnerHTML={{__html: html}}></div>
    )
  
  }


  
// const agregar_scroll_a_backref = () => {
//     document.querySelectorAll('.footnote-backref').forEach(r => {
//       const target = document.querySelector(r.getAttribute('href'))
//       r.addEventListener('click', e => {
//         e.preventDefault()
//         document.querySelector('main').scrollTo({
//           top: target.offsetTop-window.innerHeight/4,
//           left: 0,
//           behavior: 'smooth'
//         })
//         target.classList.add('backref-highlight')
//         setTimeout(() => target.classList.remove('backref-highlight'), 2000)
//       })
//     })
//   }
  
//   const agregar_highlights_a_ref = () => {
//     document.querySelectorAll('.footnote-ref a').forEach(r => {
//       const target = document.querySelector(r.getAttribute('href'))
//       r.addEventListener('click', e => {
//         e.preventDefault()
//         document.querySelector('main').scrollTo({
//           top: target.offsetTop,
//           left: 0,
//           behavior: 'smooth'
//         })
//         target.classList.add('ref-highlight')
//         setTimeout(() => target.classList.remove('ref-highlight'), 2000)
//       })
//     })
//   }
  
//   window.lastScrollY = 0;
//   const revelar_barra = () => {
//     //- console.log()
//     if(window.scrollY - window.lastScrollY > 0){
//       document.querySelector('header').classList.remove('habitado')
//     }else{
//       document.querySelector('header').classList.add('habitado')
//     }
//     window.lastScrollY = window.scrollY
//   }

//   window.addEventListener('scroll', revelar_barra)
//   window.addEventListener('load', corregir_imagenes)
//   window.addEventListener('load', agregar_scroll_a_backref)
//   window.addEventListener('load', agregar_highlights_a_ref)