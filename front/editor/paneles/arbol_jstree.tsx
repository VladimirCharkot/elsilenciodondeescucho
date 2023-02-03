import * as React from 'react'
import {Panel} from './panel'
import {useContext, useEffect, useState} from 'react'
import {EditorContext} from '../contexto'
import {useEdicion} from '../edicion'
import {ArbolFS} from '../../../shared/tipos'
// import TreeView from 'react-simple-jstree';

export const PanelArbol = () => {
  const {textos, toggleExpandido} = useContext(EditorContext);
  const {accion} = useEdicion();

  useEffect(() => {
    if(textos.length > 1){

      console.log("Inicializando jstree con: ");

      // Agrega los atributos type y text que jstree necesita
      const formatear = (txts: ArbolFS) => txts.map((t: any) => {
          if (t.children){
            return {...t, text: t.nombre , type: 'carpeta', children: formatear(t.children)}
          }else{
            if(t.atributos && t.atributos.portada) return {...t, text: t.nombre, type: 'mdc'}  // La 'c' es de 'completo' c:
            return {...t, text: t.nombre, type: 'md'}
          }
        })

      const textos_para_jstree = formatear(textos);
      console.log(textos_para_jstree);

      //@ts-ignore
      $.jstree.defaults.contextmenu = {
        select_node: false,
        show_at_node: true,
        items: (nodo, cb) => {
          if(nodo.type != 'carpeta'){
            console.log(nodo)
            cb({
              borrar : {
                label : "Borrar",
                action : () => console.log(`Borrar ${nodo.original.ruta}`)
              }
            })
          }
        }
        // items:
        // }
      }

      $('#arbol').jstree({
        "types" : {
          "default" : {"icon" : "desconocido-icono"},
          "md" : { "icon" : "texto-icono" },
          "mdc" : { "icon" : "texto-completo-icono" },
          "carpeta" : { "icon" : "carpeta-icono" }
        },
        "plugins" : [ "types", "dnd", "search", "contextmenu" ],
        "core" : {
          "data" : textos_para_jstree,
          "multiple" : false,
          "check_callback" : true
        }
      })

       $('#arbol').on("select_node.jstree", (e, data) => {
         if(data.node.original.type != 'carpeta'){
           toggleExpandido('md', true)
           accion('cargar', data.node.original)
         }
       })

      }

    // $('#arbol').jstree(true).settings.core.data = textos;
    // $('#arbol').jstree(true).refresh();
  }, [textos]);

  //@ts-ignore
  return ( <Panel id="arbol"> 
    {/* <TreeView treeData={textos} /> */}
  </Panel> )
}
