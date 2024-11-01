import * as d3 from "d3";
import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { chunk } from "lodash";
import { useEffect } from "react";
import { Animacion, Layout, Menu } from "../vidriera/tipos";
import { NodoVidriera } from "./tipos";
import { dragd3, zoomd3 } from "./utils";
import EventEmitter from "events";
import { Nodo } from "./nodo";

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

  const [nodos, setNodos] = useState<NodoVidriera[]>([]);
  const [triggereado, setTriggereado] = useState(false);

  // Monta el svg zoom, drag con d3 sobre los nodos que haya devuelto el menu
  // Llama al layout y a la animación si la hubiera
  // Los nodos son renderizados en el template y linkeados a d3 acá
  const montarD3 = () => {
    const svg = d3.select<SVGSVGElement, unknown>("svg");
    const entradas = d3.selectAll(".entrada").data(nodos);
    const lienzo = d3.select(".lienzo");
    layout(entradas);
    const zoomBehavior = zoomd3(svg, lienzo);
    dragd3(svg);
    if (animacion) animacion(svg, zoomBehavior);
  };

  // Al montar el componente, o cambiar el menu, cargar los nodos
  useEffect(() => {
    menu(navigate).then(setNodos);
  }, [menu]);

  // Al montar el componente, o cambiar el menu, bindear trigger a la variable de estado
  useEffect(() => {
    if (trigger) {
      trigger.on("listo", () => setTriggereado(true));
    } else {
      setTriggereado(true)
    }
  }, [nodos]);

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

