import * as React from "react";
import { createContext, useState } from "react";
import * as d3 from "d3";
import { GenericD3Selection, LayoutFunc, Punto } from "./vidriera";
import { NodoType } from "./tipos";
import { transform } from "./utils";
import { layout_centros } from "./contenido";

type Animacion = "inicial" | "indice";

interface VidrieraContextI {
  animacion: (anim: Animacion) => void;
  zoom: d3.ZoomBehavior<SVGSVGElement, unknown> | null;
  setZoom: React.Dispatch<
    React.SetStateAction<d3.ZoomBehavior<SVGSVGElement, unknown> | null>
  >;
  svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any> | null;
  setSvg: React.Dispatch<
    React.SetStateAction<d3.Selection<
      SVGSVGElement,
      unknown,
      HTMLElement,
      any
    > | null>
  >;
  nodos: NodoType[];
  setNodos: React.Dispatch<React.SetStateAction<NodoType[]>>;
  layout: LayoutFunc | null;
  setLayout: React.Dispatch<React.SetStateAction<LayoutFunc | null>>;
}

const layout_fuerza = (nodos: GenericD3Selection, custom_opcs = {}) => {
  const default_opcs = {
    init: () => {},
    draw: () => transform(nodos),
    dv: 0.6,
    da: 0.01,
    df: -450,
  };
  const opcs = { ...default_opcs, ...custom_opcs };

  // opcs.init()

  //@ts-ignore
  let simulacion = d3
    .forceSimulation(d3.selectAll(".entrada").data() as d3.SimulationNodeDatum[])
    .velocityDecay(opcs.dv)
    .alphaDecay(opcs.da)
    .force("campo", d3.forceManyBody().strength(opcs.df))
    .on("tick", opcs.draw);

  return simulacion;
};

//@ts-ignore
const VidrieraContext = createContext<VidrieraContextI>(null);

export const VidrieraContextProvider = ({ children }) => {
  const [zoom, setZoom] = useState<d3.ZoomBehavior< SVGSVGElement, unknown > | null>(null);
  const [svg, setSvg] = useState<d3.Selection< SVGSVGElement, unknown, HTMLElement, any > | null>(null);
  const [nodos, setNodos] = useState<NodoType[]>([]);
  const [layout, setLayout] = useState<LayoutFunc | null>(null);

  const lo_centros = (nodos: GenericD3Selection) => layout_centros(nodos, [{
    nombre: "Inicio",
    x: 0,
    y: 0,
    color: "red",
  }])

  React.useEffect(() => {
    if (svg && nodos.length > 0) {
      console.log(`Corriendo posta`);

      const entradas = d3.selectAll(".entrada").data(nodos);
      const lienzo = d3.select(".lienzo");

      // Debug
      document.addEventListener("keypress", (e) => {
        if (e.key == "d" || e.key == "D") console.log(lienzo.attr("transform"));
      });

      console.log(`Instanciando zoom`);

      // Zoom and pan
      const zoomd3 = d3
        .zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.05, 5])
        .on("zoom", ({ transform }) => {
          lienzo.attr("transform", transform);
        });

      // console.log(`Seteando zoom`)

      // setZoom(zoomd3);

      // Debug
      document.addEventListener("keypress", (e) => {
        if (e.key == "d" || e.key == "D") console.log(lienzo.attr("transform"));
      });

      console.log(`ok`)

      svg.call(zoomd3);


      const drag = d3.drag<SVGSVGElement, unknown>()
          .on('drag', (ev, d: any) => {
              console.log(`Drag`)
              d.x = ev.x;
              d.y = ev.y;
          })
      svg.call(drag)

      // Fuerza
      // const fuerza = layout_fuerza(entradas);

      // layout(entradas);
    }
  }, [svg, layout, nodos]);

  const escalar = (ms: number, scl: number) =>
    zoom &&
    svg &&
    svg.transition().duration(ms).ease(d3.easeCubic).call(zoom.scaleTo, scl);

  const panear = (ms: number, p: Punto) =>
    zoom &&
    svg &&
    svg
      .transition()
      .duration(ms)
      .ease(d3.easeCubic)
      .call(zoom.translateTo, p.x, p.y);

  const animaciones: Record<Animacion, () => void> = {
    inicial: async () => {
      console.log("animación inicial zoom ", zoom, " svg ", svg);
      if (!zoom || !svg) return;
      zoom.translateTo(svg, 100, 0);
      zoom.scaleTo(svg, 0.2);
      escalar(3000, 0.5);
    },
    indice: async () => {
      console.log("animación indice");
      if (!zoom || !svg) return;
      zoom.translateTo(svg, 0, 0);
      zoom.scaleTo(svg, 0.5);
      escalar(3000, 0.08);
    },
  };

  const animacion = async (anim: Animacion) => {
    if (anim in animaciones) {
      await animaciones[anim]();
    }
  };

  const data = {
    animacion,
    zoom,
    setZoom,
    svg,
    setSvg,
    nodos,
    setNodos,
    layout,
    setLayout,
  };

  return (
    <VidrieraContext.Provider value={data}>{children}</VidrieraContext.Provider>
  );
};

export default VidrieraContext;
