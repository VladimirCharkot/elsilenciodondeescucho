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








d3.json('/indice_json').then(idx => {

  /***** SVG *****/

  let centros = {'mecanicidad' : {x: 1500, y: 1500},
                 'dios' : {x: -1500, y: 1500},
                 'conciencia' : {x: 0, y: 0},
                 'cortos' : {x: 1500, y: -1500},
                 'cuentos' : {x: -1500, y: -1500}}

  let colores = {'mecanicidad' :  d3.rgb("#23689b"),
                 'dios' :         d3.rgb("#939b62"),
                 'conciencia' :   d3.rgb("#ffd56b"),
                 'cortos' :       d3.rgb("#ffb26b"),
                 'cuentos' :       d3.rgb("#ff7b54")}

  console.log(idx)

  /* Base */

  let svg = d3.select("svg")
  let g = svg.append("g")
  g.attr("class", "base")


  let zoomed = ({transform}) => {
    g.attr("transform", transform)
  }

  let zoom = d3.zoom()
    .scaleExtent([0.1, 5])
    .on("zoom", zoomed);

  svg.call(zoom)

  /* Elementos */


  let labels = d3.select('.vidriera').select('g').selectAll('g.isla')
    .data(Object.entries(centros))
    .enter().append('g')
    .attr('transform', d => `translate(${d[1].x * 1.2}, ${d[1].y * 1.2})`)
    .attr('class', 'isla')
    .append('text').text(d => capitalize(d[0]))


  let nodos = d3.select('.vidriera').select('g').selectAll('g.entrada')
    .data(idx)
    .enter().append('g')
    .attr('class', d => 'entrada ' + (visitados.includes(d.id) ? 'visitado' : 'no_visitado'))
    //- .attr('transform', (d,i) => `translate(${i*50},${i*50})`)
    .call(d3.drag()
      .on('start', (ev, d) => {
        simulacion.alpha(0.3).restart();
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
    )

  let links = nodos.append('a')
    .attr('href', d => `/escritos/${d.filename.split('.')[0]}`)

  let circulos = links.append('circle')
    .attr('r', 95)
    .attr('fill', d => d.serie in colores ? colores[d.serie] : d3.rgb('#bcbcbc'))
    .attr('stroke', d => (d.serie in colores ? colores[d.serie] : d3.rgb('#bcbcbc')).darker())

  let titulos = nodos.append('text')
    .text(d => capitalize(d.filename.split('.')[0].replaceAll('-', ' ')))
    .attr('transform','translate(10,-10)')
    .attr('class', 'titulo')

  let pies = nodos.append('text')
    .text(d => d.pie ? d.pie : '')
    .attr('transform','translate(20,20)')
    .attr('class','pie')


  /* Fuerzas */

  // Sostener aceleración en el scroll
  // https://github.com/d3/d3-force

  let k = 0.7;
  let tick = () => {
    k *= 0.7;
    idx.forEach((n, i) => {
      if(n.serie in centros){
        n.x += (centros[n.serie].x - n.x) * k;
        n.y += (centros[n.serie].y - n.y) * k;
      }
    });
    nodos.attr('transform', d => `translate(${d.x},${d.y})`)
  }

  let simulacion = d3.forceSimulation(idx)
    .velocityDecay(0.3)  // 1.3
    .alphaDecay(0.02)
    .force("campo", d3.forceManyBody().strength(-200))
    .on("tick", tick)

  globales.simulacion = simulacion
  globales.nodos = nodos
  globales.idx = idx

})
