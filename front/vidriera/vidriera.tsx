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

  const navegar = (to: string) => {
    console.log(`Navegando a ${to}`);
    setTriggereado(false);
    setNodos([]);
    navigate(to)
  }

  const [nodos, setNodos] = useState<NodoVidriera[]>([]);
  const [triggereado, setTriggereado] = useState(false);

  const montarD3 = () => {
    console.log(`Montando svg y bindeando nodos a `, nodos);
    const svg = d3.select<SVGSVGElement, unknown>("svg");
    const entradas = d3.selectAll(".entrada").data(nodos);
    const lienzo = d3.select(".lienzo");
    layout(entradas);
    const zoomBehavior = zoomd3(svg, lienzo);
    dragd3(svg);
    if (animacion) animacion(svg, zoomBehavior);
  };

  // Al montar el componente, cargar los nodos
  useEffect(() => {
    console.log(`Cargando nodos...`);
    menu(navegar).then(setNodos);
  }, []);

  // Al montar el componente, bindear trigger a la variable de estado
  useEffect(() => {
    console.log(`Bindeando trigger...`);
    const flagTrigger = () => setTriggereado(true);
    if (trigger) {
      trigger.on("listo", flagTrigger);
      return () => {
        trigger.off("resolve", flagTrigger);
      };
    } else {
      flagTrigger();
    }
  }, []);

  // Cuando los nodos estén cargados y el trigger efectuado, montar el svg
  useEffect(() => {
    if (nodos.length > 0 && triggereado) {
      console.log(`Triggereado! Montando d3...`);
      montarD3();
    }
  }, [nodos, triggereado]);

  return (
    <svg
      className="vidriera"
      onKeyUp={(e) => {
        if (e.key == "a") console.log("a");
      }}
    >
      <g className="lienzo">
        {Overlay && <Overlay />}
        {nodos.map((n) => (
          <Nodo key={n.titulo} g={n} />
        ))}
      </g>
    </svg>
  );
};

/* Layout */
export interface NodoProps {
  g: NodoVidriera;
}

/**
 * Renderiza un nodo de la vidriera en svg (<g> + <circle> + <text>)
 */
export const Nodo = ({ g }: NodoProps) => {
  // if(color === undefined) color = '#ccc';
  const navigate = useNavigate();

  if (g.id === undefined) g.id = g.titulo.toLowerCase().split(" ").join("-");

  const [hovereado, setHovereado] = useState(false);

  return (
    <g
      onClick={() => {
        if (g.accion) g.accion();
        else if (g.slug) navigate(`/escritos/${g.slug!}`);
      }}
      className={`entrada ${hovereado ? "resaltado" : ""} ${
        g.visitado ? "visitado" : ""
      }`}
      onMouseEnter={() => setHovereado(true)}
      onMouseLeave={() => setHovereado(false)}
    >
      {/* Esferita */}
      <circle
        r={95}
        fill={g.color}
        stroke={d3.color(g.color)?.darker().formatHex()}
      ></circle>

      {/* Titulo */}
      <text className="titulo" transform="translate(-10,-10)">
        {g.titulo}
      </text>

      {/* Parte el pie en renglones de siete palabras: */}
      {chunk(g.pie.split(" "), 7).map((frase, i) => (
        <text
          key={frase.join("")}
          className="pie"
          transform={`translate(20,${20 + 25 * i})`}
        >
          {frase.join(" ")}
        </text>
      ))}
    </g>
  );
};
