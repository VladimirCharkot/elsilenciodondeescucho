import * as React from 'react';
import {useContext, useState} from 'react';
import {EditorContext} from './contexto';
import {useArchivos} from './backend';

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
    tituloMd, setTituloMd, estado, setEstado} = useContext(EditorContext);

  const {getMd, upsertMd, eraseMd} = useArchivos();

  const accion = (acc: AccionEditor, txt?: string) => {
    try{
      acciones[acc](txt);
      console.log(`Pasando a ${transiciones[estado][acc]}`)
      setEstado(transiciones[estado][acc]);
    }catch(err){
      console.error(err);
      alert(err.message);
    }
  }

  const acciones : Record<AccionEditor, (txt?: string) => void> = {
    cargar: (txt) => {
      getMd(txt).then(texto => {
        setTextoMd(texto);
        setTextoCheckpointMd(texto);
      })
    },
    crear: () => {
      setTextoMd('');
      setTituloMd('');
      setTextoCheckpointMd('');
    },
    editar: (txt) => {
      setTextoMd(txt);
    },
    guardar: () => {
      //@ts-ignore
      const slug = tituloMd.toLowerCase().replaceAll(' ','-')
      if(!slug) { throw new Error("Un nuevo archivo necesita nombre"); }
      // upsertMd({ruta: `/textos/${slug}.md`, contenido: textoMd});
      alert(`"Guardando" ${`/textos/${slug}.md`}...`);
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
        alert(`"Borrando" /textos/${slug}.md`);
        // eraseMd(`/textos/${slug}.md`)
      }
    }
  }

  return {estado, accion}

}
