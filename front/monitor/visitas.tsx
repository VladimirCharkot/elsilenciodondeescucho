import * as React from 'react';
import { useEffect, useState } from 'react';
import _ from 'lodash';
import * as d3 from 'd3';
import {get} from '../utils/http'
import { useNavigate } from 'react-router-dom'

export const Monitor = () => {

  const [chart, setChart] = useState<any>()
  const navigate = useNavigate();

  useEffect(() => {
    get<{ok: boolean}>('/check').then(r => {if(!r.ok) navigate('/hogar')})
  }, [])

  const update_chart = async (e) => {
      
    const endpoints = {
      hora : '/analytics/hora',
      dia : '/analytics/dia',
      semana : '/analytics/semana',
      mes : '/analytics/mes',
      semestre : '/analytics/semestre',
    }

    console.log(e.value)
    
    let endpoint = endpoints[e.value]
    //- console.log(`Fetcheando ${endpoint}`)

    const j = await get(endpoint, r => r.text())
    console.log(j)
    
    // fetch(endpoint).then(r => {console.log(r); r.text()})
    //   .then(r => {
    //     console.log(r);
    //     confeccionar_grafico[e.value](r)
    //     cargar_listas(r)
    //   })
    
    //- Listas
    
    const agrupar = (criterio) => 
      (dataset) => _.sortBy(_.map(_.entries(_.groupBy(dataset, criterio)), ([path, accesos]) => [path, accesos.length]), ([path, accesos]) => -accesos)
    
    const agrupar_por_path = agrupar(d => d.path)
    
    const agrupar_por_ip = agrupar(d => d.ip)
    
    const cargar_lista = (ol_id, data) => {
      d3.select(ol_id).selectAll("*").remove()
      let lis = d3.select(ol_id).selectAll('li')
        .data(data)
      .enter()
        .append('li')
      //@ts-ignore
      lis.append('p').text(d => `${d[0]}`)
      //@ts-ignore
      lis.append('p').text(d => `${d[1]}`)
    }
    
    const cargar_listas = (dataset) => {
      let por_path = agrupar_por_path(dataset)
      let por_ip = agrupar_por_ip(dataset)
      cargar_lista('#paths', por_path)
      cargar_lista('#ips', por_ip)
    } 
     
    //- Lógica de confección de gráfico
    
    const linea_visitas = {
      label: 'Visitas',
      backgroundColor: '#71bf72',
      borderColor: '#71bf72'
    }
    
    const contar_segmentado = (dataset, limites) => {
      let ps = _.range(limites.length - 1)
                .map(i => dataset
                          .filter(e => e.t > limites[i] && 
                                       e.t < limites[i+1]).length)
      ps.push(dataset.filter(e => e.t > limites[limites.length - 1]).length)
      return ps
    } 
    
    const t_redondeado_a = d => Date.now() - Date.now() % (d)
    const extraer_hora  = t => new Date(t).toTimeString().slice(0,5)
    const extraer_fecha = t => new Date(t).toDateString().slice(4,10)
    
    // Devuelve n momentos previos separados por d milisegundos
    const momentos_previos = (n, d) => now => _.range(0, n)
                                               .map(n => now - d * n)
                                               .reverse()
    
    const grafico = specs => dataset => {
      
      let now = t_redondeado_a(specs.redondeo)
      let momentos = momentos_previos(specs.puntos, specs.intervalo)(now)
      let labels = momentos.map(specs.etiquetado)
      let ps = contar_segmentado(dataset, momentos)
      
      let data = {
        labels: labels,
        datasets: [{...linea_visitas, data: ps}]
      }
      
      chart.data = data
      chart.update()
    }
    
    
    // Detalles de confección de gráfico
    
    const confeccionar_grafico = {
      
      hora : grafico({
          redondeo: 1000 * 60,
          puntos: 13,
          intervalo: 1000 * 60 * 10,
          etiquetado: extraer_hora
          }),
  
      dia : grafico({
          redondeo: 1000 * 60 * 60,
          puntos: 25,
          intervalo: 1000 * 60 * 60 * 2,
          etiquetado: extraer_hora
          }),
      
      semana : grafico({
          redondeo: 1000 * 60 * 60 * 24,
          puntos: 8,
          intervalo: 1000 * 60 * 60 * 24,
          etiquetado: extraer_fecha
          }),
      
      mes : grafico({
          redondeo: 1000 * 60 * 60 * 24,
          puntos: 30,
          intervalo: 1000 * 60 * 60 * 24,
          etiquetado: extraer_fecha
          }),
      
      semestre : grafico({
          redondeo: 1000 * 60 * 60 * 24,
          puntos: 26,
          intervalo: 1000 * 60 * 60 * 24 * 7,
          etiquetado: extraer_fecha
          })
    }
           
  }



  useEffect(() => {

    //@ts-ignore
    setChart(new Chart(document.querySelector('#grafico'),
      {
        type: 'line',
        data: {
          labels: [],
          datasets: [{
            label: 'Visitas',
            backgroundColor: '#71bf72',
            borderColor: '#71bf72',
            data: [],
          }]
        },
        options: {}
      }
    ))
    
    update_chart(document.querySelector('#rango'))
  }, [])

  return (<div className='visitas'>
    <h2>Visitas</h2>
    <select id="rango" onChange={update_chart}>
      <option value="hora">Hora</option>
      <option value="dia">Día</option>
      <option value="semana">Semana</option>
      <option value="mes">Mes</option>
      <option value="semestre">Semestre</option>
    </select>
    <div>
      <canvas id="grafico" style={{marginBottom: '20vh'}}></canvas>
      <div id="listas">
        <div className='g'>
          <h3>Paths</h3>
          <ol className='ranking' id="paths"></ol>
        </div>
        <div className='g'>
          <h3>Ips</h3>
          <ol className='ranking' id="ips"></ol>
        </div>
      </div>
    </div>
  </div>)
}
