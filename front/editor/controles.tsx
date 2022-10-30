import * as React from 'react';
import {useContext} from 'react';
import {EditorContext} from './contexto';

interface ControlProps{
  id: string,
  texto: string,
  tecla?: string,
  accion?: () => void
}

export const Control = ({id, texto, tecla, accion}: ControlProps) => {
  return (
    <div className="btn" id={id} title={`${texto} ${tecla ? '[' + tecla.toUpperCase() + ']' : ""}`} onClick={accion}></div>
  )
}

interface BtnProps{
  target: string,
  texto: string,
  tecla?: string
}

const ToggleBtn = ({target, texto, tecla}: BtnProps) => {
  const {toggleExpandido} = useContext(EditorContext)
  return (<Control id={`btn_${target}`} texto={texto} tecla={tecla} accion={() => toggleExpandido(target)}/> )
}

export const Controles = () => {

  return (
    <div id="controles">
      <ToggleBtn target="md" texto="Editor" tecla="e"/>
      <ToggleBtn target="previa" texto="Vista previa" tecla="p"/>
      <ToggleBtn target="arbol" texto="Textos" tecla="a"/>
      <ToggleBtn target="imagenes" texto="Imágenes" tecla="i"/>
      <Control id="logout" texto="Salir" accion={()=>{}}/>
    </div>
  )
}
