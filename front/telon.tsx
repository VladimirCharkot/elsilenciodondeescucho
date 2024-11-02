import { extend } from "lodash";
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
  const umbral = 1000 * 60 * 60 * 24; // Un día, en ms

  // Verficar si ya se ha visitado la página
  const t0 = localStorage.getItem("ultima_visita");
  const paso_umbral = t0 && Date.now() - parseInt(t0) > umbral;

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
      <p>Bienvenidx</p>
      <p>
        Aquí encontrará la expresión de un proceso de enseñanza <b>vivo</b>. De
        un grupo de trabajo por la libertad interior y para el encuentro con la
        Verdad. Principalmente en la forma de escritos, que es el segmento de
        esta enseñanza que puede volcarse a este formato.
      </p>
      <p>
        El trabajo que lleva adelante ESDE se desenvuelve también en actividades
        presenciales, encuentros, ejercicios, rondas, seminarios y demás
        realizaciones. También están disponibles aquí algunas propuestas.
      </p>
      <p>
        Nos encontramos cerca de Ciudad de Córdoba. Nos movemos donde el Trabajo
        nos convoque. Le damos la bienvenida a entrar en contacto, si así lo
        siente.
      </p>
      <p>
        Pase. Con todo alborozo le invitamos a leer estos escritos. Encontrará
        marcados los que ya haya leído al regresar a este sitio.
      </p>
      <p>Buen provecho!</p>
      <a href="#" onClick={desvanecer}>
        Continuar
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
