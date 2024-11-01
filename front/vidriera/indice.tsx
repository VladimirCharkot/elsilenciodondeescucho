import * as React from "react";
import { useEffect } from "react";
import { Barra, CabeceraProps } from "../cabecera";
import { Telon } from "../telon";
import { Menu } from "./tipos";
import { Vidriera } from "./vidriera";
import { Layout, VidrieraContextProvider } from "./contexto";

/**
 * Telón + Vidriera + Barra
 */

export interface IndiceProps {
  menu: Menu; // Nodos de la vidriera
  layout: Layout; // Función que asigna posición inicial a cada nodo
  Overlay?: React.FC;
  headerNav?: CabeceraProps;
  titulo?: string;
}

export const Indice = ({
  menu,
  layout,
  Overlay,
  headerNav,
  titulo,
}: IndiceProps) => {

  useEffect(() => {
    document.title = titulo ?? "El Silencio Donde Escucho";
  }, []);

  return (
    <>
      <VidrieraContextProvider>
        <Telon onDesvanecer={() => console.log(`Telón desvanecido`)} />
        <Barra atrasTexto={headerNav?.atrasTexto} atrasPath={headerNav?.atrasPath} />
        <Vidriera menu={menu} layout={layout} Overlay={Overlay} />
      </VidrieraContextProvider>
    </>
  );
};
