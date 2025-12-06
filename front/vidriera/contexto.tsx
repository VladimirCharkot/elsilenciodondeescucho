/**
 * La vidriera funciona cargando y descargando contenido, pero permaneciendo siempre renderizada.
 * Este contexto se encarga de inicializar y mantener referencia a los elementos de d3.
 */

import * as d3 from "d3";
import * as React from "react";
import { createContext, useState } from "react";
import { Layout, NodoVidriera, SVG, Zoom } from "./tipos";

interface IVidrieraContext {
  zoom: Zoom | null;
  setZoom: React.Dispatch< React.SetStateAction<Zoom | null> >;
  svg: SVG | null;
  setSvg: React.Dispatch< React.SetStateAction<SVG | null> >;
  nodos: NodoVidriera[];
  setNodos: React.Dispatch<React.SetStateAction<NodoVidriera[]>>;
  layout: Layout | null;
  setLayout: React.Dispatch<React.SetStateAction<Layout | null>>;
}

//@ts-ignore
const VidrieraContext = createContext<IVidrieraContext>(null);

export const VidrieraContextProvider = ({ children }) => {
  const [zoom, setZoom] = useState<Zoom | null>(null);
  const [svg, setSvg] = useState<SVG | null>(null);
  const [nodos, setNodos] = useState<NodoVidriera[]>([]);
  const [layout, setLayout] = useState<Layout | null>(null);
  const [montado, setMontado] = useState(false);

  // Configura d3 en el svg
  React.useEffect(() => {
    if (svg && nodos.length > 0 && layout && !montado) {
      
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
