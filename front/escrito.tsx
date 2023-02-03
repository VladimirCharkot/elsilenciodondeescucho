import * as React from 'react';
import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useArchivos } from './editor/backend';
import { Cabecera } from './cabecera';
import { logaccess } from './utils/http';
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
  const txt = txtId ?? textoId

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
  useEffect(() => {logaccess(txt ?? 'escrito')}, [])

  useEffect(() => {
    window.addEventListener("scroll", manejarNav);
    return () => { 
      window.removeEventListener("scroll",manejarNav);
    };
  }, [y]);

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
        document.title = t.front_matter.titulo ?? 'El Silencio Donde Escucho'
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