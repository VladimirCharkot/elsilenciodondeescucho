import * as d3 from "d3";
import * as React from "react";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { chunk } from "lodash";
import { useEffect } from "react";
import VidrieraContext, { Animacion, Layout } from "./contexto";
import { GenericD3Selection, NodoType } from "./tipos";
import { Menu } from "../vidriera/tipos";

export interface VidrieraProps {
  animacion?: Animacion; // Animación inicial, usualmente pan y zoom
  menu: Menu; // Nodos de la vidriera
  layout: Layout; // Función que asigna posición inicial a cada nodo
  Overlay?: React.FC; // Componente que se renderiza sobre los nodos
}

// Una vidriera es: nodos + layout + fuerzas + animacion

export const Vidriera = ({
  animacion,
  menu,
  layout,
  Overlay,
}: VidrieraProps) => {
  const navigate = useNavigate();
  const { nodos, setNodos, setSvg, setLayout } = useContext(VidrieraContext);

  useEffect(() => {
    const svg = d3.select<SVGSVGElement, unknown>("svg");
    menu(navigate).then(setNodos);
    setSvg(svg);

    // Esto pincha <------------
    // setLayout(layout);

    // const entradas = d3.selectAll('.entrada').data(nodos)

    // setZoom(zoomd3)

    // La animación a veces no sale bien.
    // translate(-599,-494.25) scale(0.5) -> Mal
    // translate(316,329.5) scale(0.5) -> Bien

    // Drag
    // const drag = d3.drag<SVGSVGElement, unknown>()
    //     .on('drag', (ev, d: any) => {
    //         console.log(`Drag`)
    //         d.x = ev.x;
    //         d.y = ev.y;
    //     })
    // svg.call(drag)
  }, [menu]);

  return (
    <svg
      className="vidriera"
      onKeyUp={(e) => {
        // if (e.key == 'a') console.log('a')
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

/* Lienzo */

// zoom.scaleTo(svg, 2)
// zoom.translateTo(svg, 0, 0)

// svg.call(zoom.scaleTo, 2)
// svg.call(zoom.translateTo, 0, 0)

// svg.transition().duration(750).call(zoom.scaleTo, 3)
// svg.transition().duration(750).call(zoom.translateTo, 0, 0)

/* Layout */

export interface NodoProps {
  g: NodoType;
  // update: React.Dispatch<any>
}

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
