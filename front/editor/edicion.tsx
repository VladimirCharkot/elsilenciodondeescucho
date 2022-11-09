import * as React from 'react';
import {useContext, useState} from 'react';
import {EditorContext} from './contexto';
import {useArchivos} from './backend';
import {NodoFS} from '../../shared/types/arbol';

export type Panel = 'md' | 'arbol' | 'imagenes' | 'previa'

// Finite state machine representado edición
export type EstadoEditor = 'vacio' | 'nuevo' | 'limpio' | 'editado' | 'borrador'
export type AccionEditor = 'cargar' | 'crear' | 'cerrar' | 'descartar' | 'editar' | 'guardar' | 'borrar'

type MEFEditor = Record<EstadoEditor, Partial<Record<AccionEditor, EstadoEditor>>>

const transiciones: MEFEditor = {
  vacio: {
    cargar: 'limpio',
    crear: 'nuevo'
  },
  nuevo: {
    editar: 'borrador',
    cerrar: 'vacio'
  },
  limpio: {
    editar: 'editado',
    cerrar: 'vacio',
    borrar: 'vacio'
  },
  editado: {
    editar: 'editado',
    guardar: 'limpio',
    descartar: 'limpio',
    borrar: 'vacio'
  },
  borrador: {
    guardar: 'limpio',
    descartar: 'nuevo',
    editar: 'borrador'
  }
}


export const useEdicion = () => {
  const {textoMd, setTextoMd, textoCheckpointMd, setTextoCheckpointMd,
    tituloMd, setTituloMd, estado, setEstado, editorRef, setPathMd, pathMd, expandidos, textos} = useContext(EditorContext);

  const {getMd, upsertMd, eraseMd} = useArchivos();

  const accion = (acc: AccionEditor, args?: any) => {
    try{
      acciones[acc](args);
      console.log(`Pasando a ${transiciones[estado][acc]}`)
      setEstado(transiciones[estado][acc]);
    }catch(err){
      console.error(err);
      alert(err.message);
    }
  }

  const acciones : Record<AccionEditor, (args?: any) => void> = {
    cargar: (txt: NodoFS) => {
      getMd(txt.ruta).then(texto => {
        const nombre = txt.nombre;
        setTituloMd(nombre);
        setTextoMd(texto);
        setTextoCheckpointMd(texto);
        setPathMd(txt.ruta);
      })
    },
    crear: () => {
      setTextoMd('');
      setTituloMd('');
      setTextoCheckpointMd('');
      setPathMd('');
    },
    editar: (txt) => {
      setTextoMd(txt);
    },
    guardar: () => {
      //@ts-ignore
      const slug = tituloMd.toLowerCase().replaceAll(' ','-')
      if(!slug) { throw new Error("Un nuevo archivo necesita nombre"); }
      upsertMd({
        ruta: pathMd != '' ? pathMd : `/textos/${slug}.md`,
        contenido: textoMd
      });
      setTextoCheckpointMd(textoMd);
      // updarbol()  // To Do
    },
    descartar: () => {
      setTextoMd(textoCheckpointMd);
    },
    cerrar: () => {
      // Not much really...
    },
    borrar: () => {
      //@ts-ignore
      const slug = tituloMd.toLowerCase().replaceAll(' ','-')
      if(confirm('Seguro?')) {
        alert(`"Borrando" ${pathMd}`);
        // eraseMd(pathMd)
      }
    }
  }

  const insertarImagen = (ruta: string) => {
    if(editorRef.current){
      const p = editorRef.current.selectionStart;
      accion('editar', textoMd.slice(0, p) + `![Texto alternativo](${ruta})` + textoMd.slice(p));
    }
  }

  return {estado, accion, insertarImagen}

}
