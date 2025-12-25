/**
 * La vidriera funciona cargando y descargando contenido, pero permaneciendo siempre renderizada.
 * Este contexto se encarga de inicializar y mantener referencia a los elementos de d3.
 */

import * as React from "react";
import { createContext, useState } from "react";
import { Layout, NodoVidriera, SVG, Zoom } from "./tipos";

function useVidrieraState() {

  const zoomRef = React.useRef<Zoom | null>(null);
  const svgRef = React.useRef<SVG | null>(null);

  const [nodos, setNodos] = useState<NodoVidriera[]>([]);
  const [layout, setLayout] = useState<Layout | null>(null);

  const [montado, setMontado] = useState(false);

  // Configura d3 en el svg
  React.useEffect(() => {
    if (svgRef.current && nodos.length > 0 && layout && !montado) {
      console.log(`VidrieraContext: Activando flag de d3...`);
      setMontado(true);
    }
  }, [svgRef.current, layout, nodos]);

  return {
    zoomRef,
    svgRef,
    nodos,
    setNodos,
    layout,
    setLayout,
    montado,
    setMontado,
  };
}

//@ts-ignore
const VidrieraContext = createContext<ReturnType<typeof useVidrieraState>>(null);

export const VidrieraContextProvider = ({ children }) => {

  const data = useVidrieraState();

  return (
    <VidrieraContext.Provider value={data}>{children}</VidrieraContext.Provider>
  );
};

export default VidrieraContext;
