import * as React from "react";
import { useEffect, useState } from "react";

type EstadoTelon =
  | "visible" // Telón visible
  | "aparecer" // Telón visible y contenido fade in
  | "desvanecer" // Telón desvaneciéndose
  | "escondido"; // Telón escondido del DOM

interface TelonProps extends React.PropsWithChildren {
  onDesvanecer?: () => void;
  umbral?: number;
  estado: EstadoTelon;
}

export const TelonBienvenida = ({
  onDesvanecer,
}: Omit<TelonProps, "estado">) => {
  const umbral = 1000 * 30 // * 60 * 24; // Un día, en ms

  // Verficar si ya se ha visitado la página
  const t0 = localStorage.getItem("ultima_visita");
  const paso_umbral = t0 && Date.now() - parseInt(t0) > umbral;

  useEffect(() => { console.log(`Montando TelonBienvenida con t0 = ${t0} y paso_umbral ${paso_umbral} (umbral es ${umbral})`) }, [])

  return paso_umbral ? (
    <TelonDescripcion estado={"visible"} onDesvanecer={onDesvanecer} />
  ) : (
    <TelonTitulo estado={"visible"} onDesvanecer={onDesvanecer} />
  );
};

export const TelonDescripcion = ({ onDesvanecer }: TelonProps) => {
  const [estado, setEstado] = useState<EstadoTelon>("aparecer");
  const desvanecer: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    e.preventDefault();
    setEstado("desvanecer");
  };

  return (
    <Telon estado={estado} onDesvanecer={onDesvanecer}>
      <h1>El Silencio Donde Escucho</h1>
      <p>Te damos la bienvenida!</p>
      <p>
        ESDE es un proceso de enseñanza <b>vivo</b>. De
        un grupo de trabajo por la libertad interior y para el encuentro con la
        Verdad. En este sitio están congregados los escritos del equipo desde sus inicios,
        nuestra historia y nuestros proyectos.
      </p>
      <p>
        El Trabajo que llevamos adelante sucede también en actividades
        presenciales, encuentros, ejercicios, rondas, seminarios y otras. 
        También están disponibles aquí algunas propuestas.
      </p>
      <p>
        Nos encontramos cerca de Ciudad de Córdoba. Nos movemos donde el Trabajo
        nos convoque. Te damos la bienvenida a entrar en contacto, si así lo sentís,
        al mail que se encuentra al final de la sección de identidad.
      </p>
      <p>
        ¡Adelante! Le invitamos a navegar los escritos. 
        Encontrará marcados los que ya haya leído al regresar a este sitio.
      </p>
      <p>Buen provecho!</p>
      <a href="#" onClick={desvanecer}>
        Seguir al sitio
      </a>
    </Telon>
  );
};

export const TelonTitulo = ({ onDesvanecer }: TelonProps) => {
  const [estado, setEstado] = useState<EstadoTelon>("aparecer");
  const desvanecer = () => setEstado("desvanecer");

  useEffect(() => {
    setTimeout(desvanecer, 1000);
  }, []);

  return (
    <Telon estado={estado} onDesvanecer={onDesvanecer}>
      <h1>El Silencio Donde Escucho</h1>
    </Telon>
  );
};

export const Telon = ({ onDesvanecer, estado, children }: TelonProps) => {
  const [estadoLocal, setEstadoLocal] = useState<EstadoTelon | null>(null);

  useEffect(() => {
    if (estado === "desvanecer") {
      onDesvanecer && onDesvanecer();

      // Desvanecer el telón n segundos después de aparecer
      setTimeout(() => {
        setEstadoLocal("escondido");
      }, 4000); // Lo que demora en desvanecerse
    }
  }, [estado]);

  return <div className={`telon ${estadoLocal ?? estado}`}>{children}</div>;
};
