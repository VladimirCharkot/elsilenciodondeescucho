import * as React from 'react';
import {createContext, useState, useEffect, useRef, Dispatch, SetStateAction, MutableRefObject} from 'react';
import {EstadoEditor, Panel} from './edicion';

import {ArbolFS} from '../../shared/types/arbol';

interface EditorContextI{
  textoMd: string,
  setTextoMd: Dispatch<SetStateAction<string>>,
  textoCheckpointMd: string,
  setTextoCheckpointMd: Dispatch<SetStateAction<string>>,
  tituloMd: string,
  setTituloMd: Dispatch<SetStateAction<string>>,
  pathMd: string,
  setPathMd: Dispatch<SetStateAction<string>>,
  expandidos: string[],
  toggleExpandido: (id: string, on?: boolean) => void,
  textos: ArbolFS,
  imagenes: ArbolFS,
  imagenesMostradas: ArbolFS,
  imagenSeleccionada: string,
  imagenesPath: string[],
  setRutaImagenes: (dirName: string) => void,
  setImagenSeleccionada: (id: string) => void,
  estado: EstadoEditor,
  setEstado: (e: EstadoEditor) => void,
  editorRef: MutableRefObject<HTMLTextAreaElement>
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
    fetch('/indice_arbol_imagenes').then(r => r.json()).then(r => {
      setImagenes(r);
      setImagenesMostradas(r);
    });
  }, [])

  const [imagenes, setImagenes] = useState<ArbolFS>([]);
  const [imagenesMostradas, setImagenesMostradas] = useState<ArbolFS>([]);
  const [imagenesPath, setImagenesPath] = useState<string[]>([]);
  const [imagenSeleccionada, setImagenSeleccionada] = useState<string>('');

  const subArbol = (arbol: ArbolFS, ruta: string[]) => {
    if (ruta.length == 0) return arbol
    else{
      const nodo = arbol.filter(n => n.nombre == ruta[0])[0]
      return subArbol(nodo.children, ruta.slice(1))
    }
  }

  const setRutaImagenes = (dirName: string) => {
    let newPath : string[];
    if(dirName == '..' && imagenesPath.length > 0)
      newPath = imagenesPath.slice(0, imagenesPath.length - 1)
    else
      newPath = [...imagenesPath, dirName]
    console.log(`newPath set to`)
    console.log(newPath)
    setImagenesPath(newPath)
    setImagenesMostradas(subArbol(imagenes, newPath));
  }

  // Estado del texto
  const [textoMd, setTextoMd] = useState('');
  const [textoCheckpointMd, setTextoCheckpointMd] = useState('');
  const [tituloMd, setTituloMd] = useState('');
  const [pathMd, setPathMd] = useState('');
  const editorRef = useRef<HTMLTextAreaElement>(null);

  // Estado de los paneles
  const [expandidos, setExpandidos] = useState<Panel[]>([]);
  const toggleExpandido = (id: Panel, on?: boolean) =>{
    if(on === undefined){
      setExpandidos(expandidos.includes(id) ? expandidos.filter(s => s != id) : [...expandidos, id])
    }else{
      if(on) {
        setExpandidos([...expandidos.filter(s => s != id), id]);
      } else {
        setExpandidos(expandidos.filter(s => s != id));
      }
    }
  }


  return (
    <EditorContext.Provider value={{
      textoMd, setTextoMd,
      textoCheckpointMd, setTextoCheckpointMd,
      tituloMd, setTituloMd, editorRef,
      pathMd, setPathMd,
      expandidos, toggleExpandido,
      textos, imagenes,
      imagenSeleccionada, setImagenSeleccionada,
      estado, setEstado,
      imagenesMostradas, setRutaImagenes, imagenesPath
    }}>
      {children}
    </EditorContext.Provider>
  )
}
