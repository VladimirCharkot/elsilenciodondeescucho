import * as React from "react";
import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
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
import { NodoType } from "./vidriera/tipos";

const Inicio = () => {
  const navigate = useNavigate();
  const [nodosEscritos, setNodosEscritos] = useState<NodoType[]>();

  useEffect(() => {
    vidriera_escritos.nodos(navigate).then(setNodosEscritos);
  }, []);

  return (
    <VidrieraContextProvider>
      <Routes>
        <Route
          path="/"
          element={
            <Indice
              // animacion={vidriera_inicial.animacion}
              nodos={vidriera_inicial.nodos(navigate)}
              layout={vidriera_inicial.layout}
              titulo="El Silencio Donde Escucho"
            />
          }
        />

        {nodosEscritos && (
          <Route
            path="/escritos/"
            element={
              <Indice
                // animacion={vidriera_escritos.animacion}
                nodos={nodosEscritos}
                layout={vidriera_escritos.layout}
                Overlay={vidriera_escritos.Overlay}
                headerNav={{
                  texto: "Inicio",
                  path: "/",
                }}
                titulo="ESDE - Escritos"
              />
            }
          />
        )}

        <Route
          path="/propuestas/"
          element={
            <Indice
              // animacion={vidriera_propuestas.animacion}
              nodos={vidriera_propuestas.nodos(navigate)}
              layout={vidriera_propuestas.layout}
              headerNav={{
                texto: "Inicio",
                path: "/",
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
