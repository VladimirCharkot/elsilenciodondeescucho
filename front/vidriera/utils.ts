import * as d3 from 'd3'
import {parse as parseCookie} from 'cookie';
import { parse } from 'path';

export const capitalize = (s) => s.substr(0,1).toUpperCase() + s.substr(1)

export const transform = (nodos) => {
  nodos.attr('transform', d => `translate(${d.x},${d.y})`)
}

export const limpiar_svg = () => {
  d3.selectAll(".lienzo *")
    .transition()
    .duration(500)
    .style('opacity', 0)
    .remove()
}

const caracteres = 80
const width = 500
export const wrap = (text) => {
  // as in https://bl.ocks.org/mbostock/7555321
  text.each(function () {
      let text = d3.select(this),
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
          line.push(word as never)
          tspan.text(line.join(" "))
          if (tspan && tspan.node()!.getComputedTextLength() > width) {
              line.pop()
              tspan.text(line.join(" "))
              line = [word as never]
              tspan = text.append("tspan")
                          .attr("x", 0)
                          .attr("y", 0)
                          .attr("dy", ++lineNumber * lineHeight + dy + "em")
                          .text(word)
          }
      }
  })
}


export const get_cookie = (nombre: string) => {
  let c
  try{
    const cookies = parseCookie(document.cookie)
    console.log(`Cookies parseadas`)
    c = JSON.parse(cookies.visitados.split(':')[1])
    console.log(c)
  }catch(err){
    console.warn(`Error parseando cookie ${nombre} :oops: `)
    console.warn(err)
    c = []
  }
  return c
}

export const get_visitados = () : string[] => get_cookie('visitados')