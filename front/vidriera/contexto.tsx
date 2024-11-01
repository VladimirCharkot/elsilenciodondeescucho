import * as d3 from "d3";
import * as React from "react";
import { createContext, useState } from "react";
import { GenericD3Selection, NodoType, Punto } from "./tipos";

export type SVG = d3.Selection<SVGSVGElement, unknown, HTMLElement, any>
export type Zoom = d3.ZoomBehavior<SVGSVGElement, unknown>
export type Animacion = (svg: SVG, zoom: Zoom, ) => Promise<void>
export type Layout = (nodos: GenericD3Selection) => void;

interface VidrieraContextI {
  zoom: Zoom | null;
  setZoom: React.Dispatch< React.SetStateAction<Zoom | null> >;
  svg: SVG | null;
  setSvg: React.Dispatch< React.SetStateAction<SVG | null> >;
  nodos: NodoType[];
  setNodos: React.Dispatch<React.SetStateAction<NodoType[]>>;
  layout: Layout | null;
  setLayout: React.Dispatch<React.SetStateAction<Layout | null>>;
}

//@ts-ignore
const VidrieraContext = createContext<VidrieraContextI>(null);

export const VidrieraContextProvider = ({ children }) => {
  const [zoom, setZoom] = useState<d3.ZoomBehavior<
    SVGSVGElement,
    unknown
  > | null>(null);
  const [svg, setSvg] = useState<d3.Selection<
    SVGSVGElement,
    unknown,
    HTMLElement,
    any
  > | null>(null);
  const [nodos, setNodos] = useState<NodoType[]>([]);
  const [layout, setLayout] = useState<Layout | null>(null);
  const [montado, setMontado] = useState(false);

  // Configura zoom y pan y drag una vez que svg está montado
  React.useEffect(() => {
    if (svg && montado) {
      const lienzo = d3.select(".lienzo");

      // Zoom and pan
      const zoomd3 = d3
        .zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.05, 5])
        .on("zoom", ({ transform }) => {
          lienzo.attr("transform", transform);
        });

      console.log(`Seteando zoom`, zoomd3);

      // // Lo seteamos para poder accederlo desde fuera
      // setZoom(zoomd3);
      svg.call(zoomd3);

      // Debug
      document.addEventListener("keypress", (e) => {
        if (e.key == "d" || e.key == "D") console.log(lienzo.attr("transform"));
      });

      // Drag

      const drag = d3
        .drag<SVGSVGElement, unknown>()
        .on("drag", (ev, d: any) => {
          console.log(`Drag`);
          d.x = ev.x;
          d.y = ev.y;
        });
      svg.call(drag);

      console.log(`ok`);

      // Fuerza
      // const fuerza = layout_fuerza(entradas);
    }
  }, [montado, svg]);

  // Configura d3 en el svg
  React.useEffect(() => {
    if (svg && nodos.length > 0 && layout && !montado) {
      console.log(`Corriendo useEffect que configura d3 en el svg`);

      // Linkea data de nodos a los circulitos
      const entradas = d3.selectAll(".entrada").data(nodos);
      const lienzo = d3.select(".lienzo");

      // Debug
      document.addEventListener("keypress", (e) => {
        if (e.key == "d" || e.key == "D") console.log(lienzo.attr("transform"));
      });

      console.log(`Aplicando layout`, layout);

      // layout?.(entradas);

      setMontado(true);
    }
  }, [svg, layout, nodos]);

  const data = {
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
