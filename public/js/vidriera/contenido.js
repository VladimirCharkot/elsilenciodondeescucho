export let centros_indice = {
  'esencial' : {x: 0, y: 0, color: '#D8EBD8'},
  'atención' : {x: -1000, y: 400, color: '#B4D6D7'},
  'mecanicidad' : {x: -1000, y: -400, color: '#F5EDCE'},
  'trabajo' : {x: 1000, y: -400, color: '#FAE0B8'},
  'presencia' : {x: 2000, y: 0, color: '#D7CCEA'},
  'mundo' : {x: 0, y: 800, color: '#CDD6F0'},
  'contemplación' : {x: -2000, y: 0, color: '#D9C8DE'},
  'verdad' : {x: 0, y: -800, color: '#D9C8DE'},
  'libertad': {x: 1000, y: 400, color: '#DBB6B6'}
}


export let menu_propuestas = [
  {
    titulo: 'Integrador de movimiento',
    accion: () => document.location = '/propuestas/integrador-movimiento/',
    color: d3.rgb("#23689b"),
    pie: 'Enfoque integrador de la dialéctica Cuerpo-Mente-Espíritu y de la relación entre lo Interno y lo externo'
  },
  {
    titulo: 'Malabareando un no-malabar',
    accion: () => document.location = '/propuestas/malabareando',
    color: d3.rgb("#23689b"),
    pie: 'Estancia de Investigación para malabaristas'
  },
  {
    titulo: 'El Silencio Donde Escucho',
    accion: () => document.location = '/propuestas/esde',
    color: d3.rgb("#23689b"),
    pie: 'Taller Entrenamiento de Presencia Activa'
  },
  {
    titulo: 'Los movimientos -en la práctica de la presencia- son "Acción"',
    accion: () => document.location = '/propuestas/accion',
    color: d3.rgb("#23689b"),
    pie: '"Cada lenguaje, el gesto de una mano, el toque en una cuerda, un pincel que se desliza, el lanzamiento de un objeto, cada uno, es un movimiento. Y un movimiento es también lo que lo generó"'
  },
  {
    titulo: 'Formato Anual Grupal',
    accion: () => document.location = '/propuestas/grupal',
    color: d3.rgb("#939b62"),
    pie: 'Este primer modulo abre el trabajo para la investigación y exploración sobre nosotros mismos, a nivel vivencial y conceptual. Las partes que componen lo que somos, cómo funcionan, cuál es nuestra naturaleza esencial y cuál la adquirida, cuál es y de qué consta un Real Trabajo sobre sí mismo sin formas predeterminadas.'
  },
  {
    titulo: 'Formato Personalizado',
    accion: () => document.location = '/propuestas/personalizado',
    color: d3.rgb("#939b62"),
    pie: 'Se abre un espacio-tiempo para iniciar un proceso individual de trabajo sobre sí mismo, dando la atención y cuidado precisos'
  },
  {
    titulo: 'Formato Charla Abierta',
    accion: () => document.location = '/propuestas/abierta',
    color: d3.rgb("#939b62"),
    pie: 'La misma se propone sin dirección ni recorrido determinado de antemano, sino que se confía en que tome la forma que le corresponda por intermedio de las cuestiones que atraviesen a los asistentes en torno a estos temas'
  },

]
