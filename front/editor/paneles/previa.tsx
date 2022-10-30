import * as React from 'react';
import {useContext} from 'react';
import {Panel} from './panel';
import {EditorContext} from '../contexto';
import {render} from '../../../procesos/mdesde';


export const PanelPrevia = () => {
  const {textoMd} = useContext(EditorContext);
  const escritoHtml = render(textoMd);
  return (
    <Panel id="previa" className='escrito' innerHTML={escritoHtml.html}></Panel>
  )
}
