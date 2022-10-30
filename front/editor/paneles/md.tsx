import * as React from 'react';
import {useContext, useEffect} from 'react';
import {EditorContext} from '../contexto';
import {Control} from '../controles';
import {Panel} from './panel';
import {useEdicion, AccionEditor} from '../edicion';
import {flash} from '../../general';



export const PanelMd = () => {

  const {textoMd, tituloMd, setTituloMd, textos, estado} = useContext(EditorContext);
  const {accion} = useEdicion();

  const Btn = ({id, txt}: {id: AccionEditor, txt: string}) =>
    <Control id={id} texto={txt} accion={() => { accion(id); }}/>

  return (
    <Panel id="md" className={estado}>
      {/*<p style={{margin: "0.1rem"}}>{estado}</p>*/}
      <div className="controles">

        {(estado == 'vacio' || estado == 'limpio') &&
          <Btn id="crear" txt="Nuevo texto"/>
        }

        {(estado == 'editado' || estado == 'borrador') &&
          <Btn id='guardar' txt="Guardar cambios"/>
        }

        {(estado == 'editado' || estado == 'borrador') &&
          <Btn id='descartar' txt="Descartar cambios"/>
        }

        <input id="nombre" title="Titulo" value={tituloMd}
          onChange={e => {
            console.log(tituloMd)
            if(!/^[A-Za-z0-9- ]*$/.test(e.target.value)){
              flash({mensaje: '¡Nombre inválido! Sólo letras, números, espacios y guiones'})
              return
            }
            setTituloMd(e.target.value)
        }}/>

        {(estado == 'limpio' || estado == 'editado') &&
          <Btn id='borrar' txt="Borrar"/>
        }

        {(estado != 'vacio') &&
          <Btn id='cerrar' txt="Cerrar"/>
        }

      </div>

      <textarea id="texto_md" value={textoMd}
        onChange={e => accion('editar', e.target.value)}/>

    </Panel>)
  }
