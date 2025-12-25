import * as d3 from "d3";
import EventEmitter from "events";
import * as React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Animacion, Layout, Menu } from "../vidriera/tipos";
import { anim_enfocar, centros_indice } from "./contenido";
import VidrieraContext from "./contexto";
import { Nodo } from "./nodo";
import { dragd3, zoomd3 } from "./utils";

export interface VidrieraProps {
  animacion?: Animacion; // Animación inicial, usualmente pan y zoom
  menu: Menu; // Nodos de la vidriera
  layout: Layout; // Función que asigna posición inicial a cada nodo
  Overlay?: React.FC; // Componente que se renderiza sobre los nodos
  trigger?: EventEmitter; // Trigger de animación y fuerzas
  
}

// Una vidriera es: nodos + layout inicial + fuerzas + animacion inicial
// Renderiza los nodos desde react y llama luego a d3 para posicionarlos y delegar animaciones y etc

export const Vidriera = ({
  animacion,
  menu,
  layout,
  Overlay,
  trigger,
}: VidrieraProps) => {
  const navigate = useNavigate();

  const { zoomRef, svgRef, nodos, setNodos } = React.useContext(VidrieraContext)
  const [triggereado, setTriggereado] = useState(false);

  // Monta el svg zoom, drag con d3 sobre los nodos que haya devuelto el menu
  // Llama al layout y a la animación si la hubiera
  // Los nodos son renderizados en el template y linkeados a d3 acá
  const montarD3 = React.useCallback(() => {
    const svg = d3.select<SVGSVGElement, unknown>("svg");

    // Layout
    const entradas = d3.selectAll(".entrada").data(nodos);
    layout(entradas);

    // Zoom y drag
    const lienzo = d3.select(".lienzo");
    const zoomBehavior = zoomd3(svg, lienzo);
    dragd3(svg);

    // Animación inicial
    if (animacion) animacion(svg, zoomBehavior);

    // Abastecer context
    console.log(`Vidriera: Montado d3 con svg y zoom:`, svg, zoomBehavior);
    svgRef.current = svg
    zoomRef.current = zoomBehavior

  }, [nodos, layout, animacion]);

  // Al montar el componente, o cambiar el menu, cargar los nodos
  useEffect(() => {
    menu(navigate).then(setNodos);
  }, [menu, setNodos]);

  // Al montar el componente, o cambiar el menu, bindear trigger a la variable de estado
  useEffect(() => {
    if (trigger) {
      trigger.on("listo", () => setTriggereado(true));

      trigger.on("enfocar", (slug: string) => {
        const svg = svgRef.current
        const zoom = zoomRef.current

        const nodo = nodos.find(n => n.slug === slug)
        if (!nodo || !svg || !zoom) return;

        const centro = centros_indice.find(c => nodo.fm && c.nombre === nodo.fm.serie);
        
        if (centro) {
          // Enfocar el centro de la serie
          anim_enfocar(svg, zoom, centro, 0.3, 700);
        } else { 
          // Enfocar el nodo
          anim_enfocar(svg, zoom, nodo as { x: number, y: number }, 0.3, 700);
        }

        d3.selectAll('.entrada').classed("dimmeado", true);
        d3.select(`[data-slug="${slug}"]`).classed("destacado", true);
      })
      trigger.on("unhover", (slug: string) => {
        d3.selectAll('.entrada').classed("destacado", false);
        d3.selectAll('.entrada').classed("dimmeado", false);
      })

    } else {
      setTriggereado(true)
    }

    return () => {
      trigger?.removeAllListeners()
    }

  }, [trigger, nodos]);

  // Cuando los nodos estén cargados y el trigger efectuado, montar el svg
  useEffect(() => {
    if (nodos.length > 0 && triggereado) {
      montarD3();
    }
  }, [nodos, triggereado]);

  return (
    <svg className="vidriera" >
      <g className="lienzo">
        {Overlay && <Overlay />}
        {nodos.map((n) => (
          <Nodo key={n.titulo} g={n} />
        ))}
      </g>
    </svg>
  );
};

