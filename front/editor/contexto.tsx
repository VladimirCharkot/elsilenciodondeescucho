import * as React from 'react';
import {createContext, useState, useEffect, Dispatch, SetStateAction} from 'react';
import {EstadoEditor, Panel} from './edicion';

import {ArbolFS, Entrada} from '../../shared/types/arbol';

interface EditorContextI{
  textoMd: string,
  setTextoMd: Dispatch<SetStateAction<string>>,
  textoCheckpointMd: string,
  setTextoCheckpointMd: Dispatch<SetStateAction<string>>,
  tituloMd: string,
  setTituloMd: Dispatch<SetStateAction<string>>,
  expandidos: string[],
  toggleExpandido: (id: string, on?: boolean) => void,
  textos: ArbolFS,
  imagenes: Entrada[],
  imagenSeleccionada: string,
  setImagenSeleccionada: (id: string) => void,
  estado: EstadoEditor,
  setEstado: (e: EstadoEditor) => void
}

export const EditorContext = createContext<EditorContextI>(null);

export const EditorContextProvider = ({children}) => {

  const [estado, setEstado] = useState<EstadoEditor>('vacio')

  // Textos
  useEffect(() => {
    console.log('Cargando textos...');
    fetch('/indice_arbol_textos').then(r => r.json()).then(setTextos);
  }, [])
  const [textos, setTextos] = useState<ArbolFS>([]);

  // Imágenes
  useEffect(() => {
    console.log('Cargando imágenes...');
    fetch('/indice_arbol_imagenes').then(r => r.json()).then(setImagenes);
  }, [])

  const [imagenes, setImagenes] = useState<Entrada[]>([]);
  const [imagenSeleccionada, setImagenSeleccionada] = useState<string>('');

  // Estado del texto
  const [textoMd, setTextoMd] = useState('');
  const [textoCheckpointMd, setTextoCheckpointMd] = useState('');
  const [tituloMd, setTituloMd] = useState('');

  // Estado de los paneles
  const [expandidos, setExpandidos] = useState<Panel[]>([]);
  const toggleExpandido = (id: Panel, on?: boolean) =>{
    // console.log(`antes:`)
    // console.log(expandidos)
    if(on === undefined){
      // console.log(`después:`)
      // console.log(expandidos.includes(id) ? expandidos.filter(s => s != id) : [...expandidos, id])
      setExpandidos(expandidos.includes(id) ? expandidos.filter(s => s != id) : [...expandidos, id])
    }else{

      if(on) {setExpandidos([...expandidos.filter(s => s != id), id]); console.log(`después:`); console.log([...expandidos.filter(s => s != id), id])}
      else {setExpandidos(expandidos.filter(s => s != id)); console.log(`después:`); console.log(expandidos.filter(s => s != id))}
    }
  }


  return (
    <EditorContext.Provider value={{
      textoMd, setTextoMd,
      textoCheckpointMd, setTextoCheckpointMd,
      tituloMd, setTituloMd,
      expandidos, toggleExpandido,
      textos, imagenes,
      imagenSeleccionada, setImagenSeleccionada,
      estado, setEstado
    }}>
      {children}
    </EditorContext.Provider>
  )
}
