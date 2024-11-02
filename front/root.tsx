import * as React from "react";
import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Editor } from "./editor/editor";
import { Escrito } from "./escrito";
import { Login } from "./login";
import { NotFound } from "./status/not_found";
import { Indice } from "./vidriera/indice";

import {
  vidriera_escritos,
  vidriera_inicial,
  vidriera_propuestas,
} from "./vidriera/contenido";
import { VidrieraContextProvider } from "./vidriera/contexto";

const Inicio = () => {

  // Registramos este momento como la última visita (se usa para determinar si mostrar el telón de bienvenida)
  useEffect(() => localStorage.setItem("ultima_visita", Date.now().toString()), []);

  return (
    <VidrieraContextProvider>
      <Routes>
        <Route
          path="/"
          element={
            <Indice
              animacion={vidriera_inicial.animacion}
              menu={vidriera_inicial.menu}
              layout={vidriera_inicial.layout}
              titulo="El Silencio Donde Escucho"
            />
          }
        />
        <Route
          path="/escritos/"
          element={
            <Indice
              animacion={vidriera_escritos.animacion}
              menu={vidriera_escritos.menu}
              layout={vidriera_escritos.layout}
              Overlay={vidriera_escritos.Overlay}
              headerNav={{
                atrasTexto: "Inicio",
                atrasPath: "/",
              }}
              titulo="ESDE - Escritos"
            />
          }
        />
        <Route
          path="/propuestas/"
          element={
            <Indice
              // animacion={vidriera_propuestas.animacion}
              menu={vidriera_propuestas.menu}
              layout={vidriera_propuestas.layout}
              headerNav={{
                atrasTexto: "Inicio",
                atrasPath: "/",
              }}
              titulo="ESDE - Propuestas"
            />
          }
        />
        <Route
          path="/escritos/:textoId"
          element={
            <Escrito
              headerNav={{
                texto: "Escritos",
                path: "/escritos/",
              }}
            />
          }
        />
        <Route
          path="/propuestas/:textoId"
          element={
            <Escrito
              headerNav={{
                texto: "Propuestas",
                path: "/propuestas/",
              }}
            />
          }
        />
        <Route
          path="/esde/"
          element={
            <Escrito
              txtId="hoy"
              headerNav={{
                texto: "Inicio",
                path: "/",
              }}
            />
          }
        />
        <Route path="/editor" element={<Editor />} />
        <Route path="/hogar" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </VidrieraContextProvider>
  );
};

const container = document.getElementById("app")!;
const root = createRoot(container);

root.render(
  <BrowserRouter>
    <Inicio />
  </BrowserRouter>
);
