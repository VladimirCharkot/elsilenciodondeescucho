// window.onscroll = null

import { capitalize, transform, wrap, limpiar_svg, get_cookie } from './utils.js'
import { centros_indice, menu_propuestas } from './contenido.js'



// Textos ya visitados
let visitados = get_cookie('visitados')





/* Lienzo */

let svg = d3.select("svg")
let lienzo = svg.append("g")
lienzo.attr("class", "lienzo")


let zoomed = ({transform}) => {
  // console.log(transform)
  lienzo.attr("transform", transform)
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

  let default_opcs = {init: () => {},
                  draw: () => transform(nodos),
                  dv: 0.6,
                  da: 0.01,
                  df: -450}
  opcs = {...default_opcs, ...opcs}

  // console.log(opcs)
  opcs.init()

  let simulacion = d3.forceSimulation(nodos.data())
    .velocityDecay(opcs.dv)
    .alphaDecay(opcs.da)
    .force("campo", d3.forceManyBody().strength(opcs.df))
    .on("tick", opcs.draw)


  return simulacion
}






/* Layout */

// Recibe d3.select
let centrar = (nodos, centro) => {
  let theta = Math.PI * (3 - Math.sqrt(5))
  nodos.each((d, i) => {
    let r = 100 * Math.sqrt(i)
    let phi = i * theta
    d.x = centro.x + r * Math.cos(phi)
    d.y = centro.y + r * Math.sin(phi)
  })
  nodos.attr('transform', d => `translate(${d.x}, ${d.y})`)
}




/* Aspecto de los items */

let labels = () => {

  let lbls = d3.select('svg.vidriera').select('g').selectAll('g.cabecera')
    .data(Object.entries(centros_indice))
    .enter().append('g')
    .attr('transform', d => `translate(${d[1].x * 2.6}, ${d[1].y * 2.6})`)
    .attr('class', 'cabecera')
    .append('text').text(d => capitalize(d[0]))

}



let grafo = (idx, grupos={base: {x : 0, y: 0}}) => {

  let scl = 1.6
  // let scl = 1

  let gs = d3.select('svg.vidriera g').selectAll('g.grupo')
    .data(Object.entries(grupos)).enter()
    .append('g')
      .attr('class', 'grupo')
      .attr('id', d => d[0])
      .attr('transform', d => `translate(${d[1].x}, ${d[1].y})`)
      // Esto no funca bien:
      // .on('mouseenter', (e, d) => d3.select(e.target).classed('resaltado', true))
      // .on('mouseleave', (e, d) => d3.select(e.target).classed('resaltado', false))
    .append('text')
      .text(d => capitalize(d[0]))
      .attr('transform', d => `translate(${d[1].x * scl}, ${d[1].y * scl})`)
      .attr('class', 'cabecera')
      .style('visibility', d => d[0] == 'base' ? 'hidden' : 'visible')

  gs.each((grupo,i) => {

    let nodos = d3.select('#' + grupo[0]).selectAll('g.entrada')
      .data(idx.filter(elem => elem.serie ? elem.serie == grupo[0] : true))
      .enter().append('g')
      .call(drag)
      .on('click', (e, d) => {
        d.accion()
      })
      .on('mouseenter', (e, d) => d3.select(e.target).classed('resaltado', true))
      .on('mouseleave', (e, d) => d3.select(e.target).classed('resaltado', false))
      .call(esferitas)
      .call(centrar, {x: grupo[1].x, y: grupo[1].y})

  })

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
      d => (d.color ?? d3.rgb('#bcbcbc')).darker())

  let titulos = nodos.append('text')
    .text(d => d.titulo)
    .attr('transform','translate(10,-10)')
    .attr('class', 'titulo')

  let pies = nodos.append('text')
    .text(d => d.pie ? d.pie : '')
    .attr('transform','translate(20,20)')
    .attr('class','pie')
    .call(wrap)

}




let json_a_nodos = (idx) => {
  for (let entrada of idx){
    entrada.color = d3.color(centros_indice[entrada.serie].color)
    entrada.titulo = capitalize(entrada.filename.split('.')[0].replaceAll('-', ' '))
    entrada.accion = () => document.location = `/escritos/${entrada.filename.split('.')[0]}`
  }
  return idx
}








let indice = () => {

  d3.json('/indice_json').then(indice_json => {

    let data_indices = json_a_nodos(indice_json)

    grafo(data_indices, centros_indice)

    let nodos = d3.selectAll('.entrada')

    layout_fuerza(nodos, {
      init: () => {
        svg.transition().duration(1750).ease(d3.easeCubic)
          .call(zoom.scaleTo, 0.4)
      },
      df: -350
    })

  })

}






let propuestas = () => {
  grafo(menu_propuestas)
  let nodos = d3.selectAll('.entrada')
  window.sim = layout_fuerza(nodos, {init: () => {
    svg.transition().duration(2750).ease(d3.easeCubic)
      .call(zoom.scaleTo, 1)
  }, df: -1800})
}





/* Menu */

let menu_principal = [
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
  grafo(menu_principal)
  let nodos = d3.selectAll('.entrada')
  layout_fuerza(nodos, {init: () => {
    svg.transition().duration(2750).ease(d3.easeCubic)
      .call(zoom.scaleTo, 2)
  }, df: -500})
}




let visto
try{
  visto = document.cookie.split('; ').filter(s => s.startsWith('visto'))[0].split('=')[1] == 'true'
}catch(err){
  visto = false
}

if(!visto){
  setTimeout(menu, 2000)
}else{
  menu()
  console.log('abriendo menu')
}
