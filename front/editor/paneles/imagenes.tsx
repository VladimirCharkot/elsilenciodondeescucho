import * as React from 'react';
import {useContext} from 'react';
import {EditorContext} from '../contexto';
import {Panel} from './panel';
import {Control} from '../controles';
import {Entrada} from '../../../shared/types/arbol';


interface ImagenProps{
  imagen: Entrada,
  seleccionada?: boolean
}

const Imagen = ({imagen}: ImagenProps) => {
  const {imagenSeleccionada, setImagenSeleccionada} = useContext(EditorContext);
  return (
    <img src={imagen.ruta} className={imagen.ruta == imagenSeleccionada ? 'seleccionada' : ''} onClick={() => setImagenSeleccionada(imagen.ruta)}/>
  )
}

export const PanelImagenes = () => {
  const {imagenes} = useContext(EditorContext);
  return (<Panel id="imagenes">
    <div id="vitrina">
      {imagenes.map((img, i) => (<Imagen key={i} imagen={img}/>))}
    </div>
  </Panel>)}


  // <div className="controles">
  //   <Control id="subir_imagen" texto="Cargar imagen" accion={() => {}}/>
  //   <input id="archivo_imagen" type="file"/>
  //   <Control id="borrar_imagen" texto="Borrar imagen" accion={() => {}}/>
  // </div>


// let cursor = textarea_md.selectionStart!
// let txt = textarea_md.value
// textarea_md.value = txt.slice(0, cursor) + `\n![Texto alt](${img.src})\n` + txt.slice(cursor, txt.length)
