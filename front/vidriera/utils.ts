import * as d3 from "d3";
import { CentroType, GenericD3Selection, Punto } from "./tipos";
import { Animacion, SVG, Zoom } from "./contexto";

export const capitalize = (s) => s.substr(0, 1).toUpperCase() + s.substr(1);

/**
 * Actualiza la posición de los nodos en el lienzo a partir de las x, y de su datum
 * @param nodos
 */
export const transform = (nodos: GenericD3Selection) => {
  nodos.attr("transform", (d) => `translate(${d.x},${d.y})`);
};

/**
 * Limpia el `.lienzo` de todo
 */
export const limpiar_svg = () => {
  d3.selectAll(".lienzo *")
    .transition()
    .duration(500)
    .style("opacity", 0)
    .remove();
};

/**
 * Envuelve un texto en tspans para que no se salga del ancho, agregando saltos de línea
 * @param text
 */
export const wrap = (text) => {
  // as in https://bl.ocks.org/mbostock/7555321
  const width = 500;
  text.each(function () {
    let text = d3.select(this),
      words = text.text().split(/\s+/).reverse(),
      word,
      line = [],
      lineNumber = 0,
      lineHeight = 1.3, // ems
      dy = 1,
      tspan = text
        .text(null)
        .append("tspan")
        .attr("dy", dy + "em");
    while ((word = words.pop())) {
      line.push(word as never);
      tspan.text(line.join(" "));
      if (tspan && tspan.node()!.getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word as never];
        tspan = text
          .append("tspan")
          .attr("x", 0)
          .attr("y", 0)
          .attr("dy", ++lineNumber * lineHeight + dy + "em")
          .text(word);
      }
    }
  });
};

/**
 * Devuelve la lista de los ids de los nodos visitados del localStorage
 */
export const get_visitados = (): string[] =>
  JSON.parse(localStorage.getItem("visitados") ?? "[]");

/**
 * Arregla los nodos alrededor de los centros como pétalos
 * @param nodos la selección d3
 * @param centros los centros a los que se quiere distribuir los nodos
 */
export const layout_centros = (
  nodos: GenericD3Selection,
  centros: CentroType[] | null
) => {
  const centrar = (nodos, centro) => {
    let theta = Math.PI * (3 - Math.sqrt(5));
    nodos.each((d, i) => {
      let r = 100 * Math.sqrt(i);
      let phi = i * theta;
      d.x = centro.x + r * Math.cos(phi);
      d.y = centro.y + r * Math.sin(phi);
    });
    transform(nodos);
  };

  if (!centros) centros = [{ nombre: "", x: 0, y: 0, color: "#aaa" }];

  centros.forEach((c) => {
    const these_nodos = c.nombre
      ? nodos.filter((n) => n.fm?.serie == c.nombre)
      : nodos;
    centrar(these_nodos, c);
  });
};

/**
 * Layout de pétalos con un solo centro
 */
export const layout_inicial = (ns: GenericD3Selection) =>
  layout_centros(ns, [{ nombre: "", x: 0, y: 0, color: "black" }]);

/**
 * Aplica un layout de fuerza a los nodos
 * @param nodos la selección d3
 * @param custom_opcs opciones personalizadas, como fuerza, velocidad, función draw, etc.
 * @returns la simulación d3
 */
export const layout_fuerza = (
  nodos: GenericD3Selection,
  custom_opcs: Partial<IOpcionesFuerza> = {}
) => {
  const default_opcs: IOpcionesFuerza = {
    init: () => {},
    draw: () => transform(nodos),
    dv: 0.6,
    da: 0.01,
    df: -450,
  };
  const opcs = { ...default_opcs, ...custom_opcs };

  // opcs.init()

  let simulacion = d3
    .forceSimulation(
      d3.selectAll(".entrada").data() as d3.SimulationNodeDatum[]
    )
    .velocityDecay(opcs.dv)
    .alphaDecay(opcs.da)
    .force("campo", d3.forceManyBody().strength(opcs.df))
    .on("tick", opcs.draw);

  return simulacion;
};

interface IOpcionesFuerza {
  init: () => void;
  draw: () => void;
  dv: number;
  da: number;
  df: number;
}



const escalar = (svg: SVG, zoom: Zoom,  ms: number, scl: number) =>
  svg.transition().duration(ms).ease(d3.easeCubic).call(zoom.scaleTo, scl);

const panear = (svg: SVG, zoom: Zoom,  ms: number, p: Punto) =>
  svg
    .transition()
    .duration(ms)
    .ease(d3.easeCubic)
    .call(zoom.translateTo, p.x, p.y);

export const anim_inicial: Animacion = async (svg, zoom) => {
  console.log("animación inicial zoom ", zoom, " svg ", svg);
  if (!zoom || !svg) return;
  zoom.translateTo(svg, 100, 0);
  zoom.scaleTo(svg, 0.2);
  escalar(svg, zoom, 3000, 0.5);
}

export const anim_indice: Animacion =  async (svg, zoom) => {
  console.log("animación indice");
  if (!zoom || !svg) return;
  zoom.translateTo(svg, 0, 0);
  zoom.scaleTo(svg, 0.5);
  escalar(svg, zoom, 3000, 0.08);
}