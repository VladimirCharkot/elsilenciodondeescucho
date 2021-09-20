// window.onscroll = null


let globales = {}

let capitalize = (s) => s.substr(0,1).toUpperCase() + s.substr(1)

// Textos ya visitados
let visitados
try{
  visitados = JSON.parse(document.cookie.split(':')[1])
}catch(err){
  visitados = []
}

let vidriera = (idx) => {}



/* Base */

let svg = d3.select("svg")
let base = svg.append("g")
base.attr("class", "base")


let zoomed = ({transform}) => {
  // console.log(transform)
  base.attr("transform", transform)
}

let zoom = d3.zoom()
  .scaleExtent([0.1, 5])
  .on("zoom", zoomed);

svg.call(zoom)


// zoom.scaleTo(svg, 2)
// zoom.translateTo(svg, 0, 0)

// svg.call(zoom.scaleTo, 2)
// svg.call(zoom.translateTo, 0, 0)

// svg.transition().duration(750).call(zoom.scaleTo, 3)
// svg.transition().duration(750).call(zoom.translateTo, 0, 0)


let drag =  d3.drag()
  .on('start', (ev, d) => {
    d.fx = d.x;
    d.fy = d.y;
  })
  .on('drag', (ev, d) => {
    d.fx = ev.x;
    d.fy = ev.y;
  })
  .on('end', (ev, d) => {
    d.fx = null;
    d.fy = null;
  })



  let layout_fuerza = (nodos, opcs = null) => {

    default_opcs = {init: () => {},
                    draw: () => transform(nodos),
                    dv: 0.6,
                    da: 0.01,
                    df: -450}
    opcs = {...default_opcs, ...opcs}

    console.log(opcs)
    opcs.init()

    let simulacion = d3.forceSimulation(nodos.data())
      .velocityDecay(opcs.dv)
      .alphaDecay(opcs.da)
      .force("campo", d3.forceManyBody().strength(opcs.df))
      .on("tick", opcs.draw)


    return simulacion
  }



  /* Layout */

  let centros_indice = {'mecanicidad' : {x: 1500, y: 1500,
                          color: d3.rgb("#23689b")},
                         'dios' : {x: -1500, y: 1500,
                          color: d3.rgb("#939b62")},
                         'conciencia' : {x: 0, y: 0,
                          color: d3.rgb("#ffd56b")},
                         'cortos' : {x: 1500, y: -1500,
                          color: d3.rgb("#ffb26b")},
                         'cuentos' : {x: -1500, y: -1500,
                          color: d3.rgb("#ff7b54")}}



  let labels = () => {

    let lbls = d3.select('svg.vidriera').select('g').selectAll('g.isla')
      .data(Object.entries(centros_indice))
      .enter().append('g')
      .attr('transform', d => `translate(${d[1].x * 1.2}, ${d[1].y * 1.2})`)
      .attr('class', 'isla')
      .append('text').text(d => capitalize(d[0]))

  }



let centrar = (nodos) => {
  nodos.each((d, i) => {
    let theta = Math.PI * (3 - Math.sqrt(5))
    let r = 100 * Math.sqrt(i)
    let phi = i * theta
    if (d.centro){
      d.x = d.centro.x + r * Math.cos(phi)
      d.y = d.centro.y + r * Math.sin(phi)
    }
  })
  nodos.attr('transform', d => `translate(${d.x}, ${d.y})`)
}


let layout_indice = (nodos) => {
  layout_fuerza(nodos, {
    init: () => {
      centrar(nodos)
      svg.transition().duration(1750).ease(d3.easeCubic)
        .call(zoom.scaleTo, 0.6)
    }
  })
}



let transform = (nodos) => {
  nodos.attr('transform', d => `translate(${d.x},${d.y})`)
}






/* Aspecto de los items */


let grafo = (idx) => {

  let nodos = d3.select('svg.vidriera').select('g').selectAll('g.entrada')
    .data(idx)
    .enter().append('g')
    .call(drag)
    .on('click', (d, e) => {
      console.log("Intentando acción de: ")
      console.log(d)
      console.log(e)
      e.accion()
    })

  return nodos

}

let esferitas = (nodos) => {
  nodos.attr('class', d => 'entrada ' + (visitados.includes(d.id) ? 'visitado' : 'no_visitado'))

  let links = nodos.append('a')
    .attr('href', d => d.filename ? `/escritos/${d.filename.split('.')[0]}` : '#')

  let circulos = links.append('circle')
    .attr('r', 95)
    .attr('fill',
      d => d.color ?? d3.rgb('#bcbcbc'))
    .attr('stroke',
      d => (d.color ? d.color : d3.rgb('#bcbcbc')).darker())

  let titulos = nodos.append('text')
    .text(d => d.titulo)
    .attr('transform','translate(10,-10)')
    .attr('class', 'titulo')



  let caracteres = 80
  let width = 500
  let wrap = (text) => {
    // as in https://bl.ocks.org/mbostock/7555321
    text.each(function () {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.3, // ems
            dy = 1,
            tspan = text.text(null)
                        .append("tspan")
                        .attr("dy", dy + "em")
        while (word = words.pop()) {
            line.push(word)
            tspan.text(line.join(" "))
            if (tspan.node().getComputedTextLength() > width) {
                line.pop()
                tspan.text(line.join(" "))
                line = [word]
                tspan = text.append("tspan")
                            .attr("x", 0)
                            .attr("y", 0)
                            .attr("dy", ++lineNumber * lineHeight + dy + "em")
                            .text(word)
            }
        }
    })
  }

  let pies = nodos.append('text')
    .text(d => d.pie ? d.pie : '')
    .attr('transform','translate(20,20)')
    .attr('class','pie')
    .call(wrap)

}




let json_a_nodos = (idx) => {
  for (let entrada of idx){
    let c = centros_indice[entrada.serie]
    entrada.centro = {x: c.x, y: c.y}
    entrada.color = c.color
    entrada.titulo = capitalize(entrada.filename.split('.')[0].replaceAll('-', ' '))
    entrada.accion = () => document.location = `/escritos/${entrada.filename.split('.')[0]}`
  }
  return idx
}


let indice = () => {

  d3.json('/indice_json').then(indice_json => {

    labels()

    let data_indices = json_a_nodos(indice_json)

    let nodos = grafo(data_indices)

    esferitas(nodos)

    layout_indice(nodos)

  })

}


let limpiar_svg = () => {
  d3.selectAll(".base *").remove()
}




let menu_propuestas = [
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


let propuestas = () => {
  let nodos = grafo(menu_propuestas)
  esferitas(nodos)
  window.sim = layout_fuerza(nodos, {init: () => {
    svg.transition().duration(2750).ease(d3.easeCubic)
      .call(zoom.scaleTo, 1)
  }, df: -1800})
}





/* Menu */

let menu_opcs = [
  {
    titulo: 'Escritos',
    accion: () => {
      console.log('Abriendo escritos...')
      limpiar_svg()
      indice()
    },
    color: d3.rgb("#23689b"),
    pie: 'Textos'
  },
  {
    titulo: 'Propuestas',
    accion: () => {
      console.log('Abriendo propuestas...')
      limpiar_svg()
      propuestas()
    },
    color: d3.rgb("#939b62"),
    pie: 'Propuestas'
  },
  {
    titulo: 'ESDE',
    accion: () => document.location = '/esde/',
    color: d3.rgb("#ffd56b"),
    pie: 'El Silencio Donde Escucho'
  }
]

let menu = () => {
  let nodos = grafo(menu_opcs)
  esferitas(nodos)
  window.sim = layout_fuerza(nodos, {init: () => {
    svg.transition().duration(2750).ease(d3.easeCubic)
      .call(zoom.scaleTo, 1)
  }, df: -500})
}

menu()
