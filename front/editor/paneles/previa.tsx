import * as React from 'react';
import {useContext, useEffect} from 'react';
import {Panel} from './panel';
import {EditorContext} from '../contexto';
import {render} from '../../../backend/blog/mdesde';

export const PanelPrevia = () => {
  const {textoMd} = useContext(EditorContext);
  const escritoHtml = render(textoMd);

  const firma = `
  <address class="firma piel">
    <p>Sebastián Rojo</p>
    <p>"El Silencio Donde Escucho"</p>
  </address>`

  return (
    <Panel id="previa" className='escrito texto' innerHTML={escritoHtml.html + firma}></Panel>
  )
}
