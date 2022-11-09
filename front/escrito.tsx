import * as React from 'react';
import {useEffect} from 'react';
import {useArchivos} from './editor/backend';

const Texto = ({src_md} : {src_md: string}) => {
  const {getMd} = useArchivos();

  useEffect(() => {
    getMd(src_md)
  }, [])

  return (
    <>
      <header className="ventana">

      </header>
      <main>

      </main>
    </>
  )

}

export const Escrito = () => {
  return (
      <article className="texto">
        <Texto src_md={'/textos/escritos/atención/cuestiones-de-orden.md'}/>
        <address className="firma piel">
          <p>Sebastián Rojo</p>
          <p>"El Silencio Donde Escucho"</p>
        </address>
      </article>
  )
}
