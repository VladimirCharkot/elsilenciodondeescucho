import * as React from 'react';
import {Panel} from './panel'
import {useContext, useEffect} from 'react';
import {EditorContext} from '../contexto';
// import Tree from 'react-animated-tree';
import {useEdicion} from '../edicion';
// import * as $ from 'jquery';


export const PanelArbol = () => {
  const {textos, toggleExpandido} = useContext(EditorContext);
  const {accion} = useEdicion();

  useEffect(() => {
    if(textos.length > 1){

      console.log("Inicializando jstree con: ");

      const formatear = (txts) => txts.map((t: any) => {
          if (t.es_dir){
            return {...t, text: t.nombre , type: 'carpeta', children: formatear(t.children)}
          }else{
            return {...t, type: 'md'}
          }
        })


      const textos_para_jstree = formatear(textos);
      console.log(textos_para_jstree);

      $('#arbol').jstree({
          "types" : {
            "default" : { "icon" : "texto-icono" },
            "carpeta" : { "icon" : "carpeta-icono" }
          },
          "plugins" : [ "types", "dnd", "search" ],
          "core" : {
            "data" : textos_para_jstree,
            "multiple" : false,
            "check_callback" : function (operation: any, node: any, node_parent: any, node_position: any, more: any) {
              console.log(operation)
              return operation == 'move_node' && node_parent.original.es_carpeta
            }
          }
        })

        $('#arbol').on("select_node.jstree", (e, data) => {
          console.log('Seleccionado: ')
          console.log(data.node.original)
          if(!data.node.original.es_dir){
            accion('cargar', data.node.original.ruta)
            toggleExpandido('md', true)
          }
        })

      }

    // $('#arbol').jstree(true).settings.core.data = textos;
    // $('#arbol').jstree(true).refresh();
  }, [textos]);

  //@ts-ignore
  return ( <Panel id="arbol"> </Panel> )
}
