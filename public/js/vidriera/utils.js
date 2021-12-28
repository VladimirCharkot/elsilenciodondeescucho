export let capitalize = (s) => s.substr(0,1).toUpperCase() + s.substr(1)

export let transform = (nodos) => {
  nodos.attr('transform', d => `translate(${d.x},${d.y})`)
}

export let limpiar_svg = () => {
  d3.selectAll(".lienzo *").remove()
}

let caracteres = 80
let width = 500
export let wrap = (text) => {
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

export let get_cookie = (nombre) => {
  let c
  try{
    console.log(`Parseando cookie ${nombre}...`)
    let cookie_json = document.cookie.split(';').filter(s => s.startsWith(nombre))
    cookie_json = cookie_json.lenght > 1 ? cookie_json[0].split(':')[1] : '[]'
    c = JSON.parse(cookie_json)
    console.log(c)
  }catch(err){
    console.warn(`Error parseando cookie ${nombre} :oops: `)
    console.warn(err)
    c = []
  }
  return c
}
