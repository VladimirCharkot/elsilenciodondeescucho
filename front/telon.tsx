import * as React from "react";
import { useEffect, useState } from "react";

const umbral = 0; //1000 * 60 // en ms

interface TelonProps {
  onDesvanecer?: () => void;
}

export const Telon = ({ onDesvanecer }: TelonProps) => {
  type EstadosTelon = 
  | "visible"    // Telón visible
  | "aparecer"   // Telón visible y contenido fade in
  | "desvanecer" // Telón desvaneciéndose
  | "escondido"; // Telón escondido del DOM

  // El telón está visible por default
  const [estado, setEstado] = useState<EstadosTelon>("visible");

  const desvanecer = (e) => {
    e.preventDefault();

    // Lo desvanecemos
    setEstado("desvanecer");
    onDesvanecer && onDesvanecer();

    // Scheduleamos el escondido
    setTimeout(() => {
      setEstado("escondido");
    }, 4000); // Lo que demora en desvanecerse
  };

  // Al montar el componente, verificar si ya se visitó la página y hace cuanto 
  useEffect(() => {

    // Entrar contenido
    setEstado("aparecer");

    // Verficar si ya se ha visitado la página
    const t0 = localStorage.getItem("ultima_visita");

    // No encontrado:
    if (t0 === null) {
      // setEstado()
    } else {
      // Hace cuanto?
      const paso_umbral_t = !!(t0 && Date.now() - parseInt(t0) > umbral);
      if (paso_umbral_t) {
        // visualizar()
      } else {
        setEstado("desvanecer");
      }
    }
    localStorage.setItem("ultima_visita", Date.now().toString());
  }, []);

  return (
    <div className={`telon ${estado}`}>
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
    </div>
  );
};
