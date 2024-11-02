import * as React from "react";
import { useEffect } from "react";
import { Barra, CabeceraProps } from "../cabecera";
import { Telon, TelonBienvenida } from "../telon";
import { Animacion, Layout, Menu } from "./tipos";
import { Vidriera } from "./vidriera";
import { EventEmitter } from 'events';

/**
 * Telón + Vidriera + Barra
 */

export interface IndiceProps {
  animacion?: Animacion; // Animación inicial, usualmente pan y zoom
  menu: Menu; // Nodos de la vidriera
  layout: Layout; // Función que asigna posición inicial a cada nodo
  Overlay?: React.FC;
  headerNav?: CabeceraProps;
  titulo?: string;
}

export const Indice = ({ animacion, menu, layout, Overlay, headerNav, titulo, }: IndiceProps) => {

  useEffect(() => {
    document.title = titulo ?? "El Silencio Donde Escucho";
  }, []);

  const trigger = new EventEmitter();

  return (
    <>
        <TelonBienvenida onDesvanecer={() => trigger.emit('listo')}/>
        <Barra atrasTexto={headerNav?.atrasTexto} atrasPath={headerNav?.atrasPath} />
        <Vidriera animacion={animacion} menu={menu} layout={layout} Overlay={Overlay} trigger={trigger}/>
    </>
  );
};
