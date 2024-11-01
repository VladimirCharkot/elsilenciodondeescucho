import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NodoVidriera } from "./tipos";
import { chunk } from "lodash";
import * as d3 from "d3";

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
