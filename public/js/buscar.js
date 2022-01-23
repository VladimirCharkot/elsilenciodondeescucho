let area = document.querySelector('#area_busqueda')
let busqueda = document.querySelector('#busqueda')
let encuentro = document.querySelector('#area_encuentro')

let dimensiones_header = document.querySelector('header').getBoundingClientRect()
let dimensiones_input = document.querySelector('#area_busqueda').getBoundingClientRect()



let ubicar_resultados = () => {
  encuentro.style.top = `${dimensiones_header.height + 4}px`
}

let abrir_busqueda = () => {

  area.classList.toggle('expandido');
  if (area.classList.contains('expandido') && busqueda.value.length > 3) {
    encuentro.classList.add('revelado')
    ubicar_resultados()
  }else{
    encuentro.classList.remove('revelado')
  }
  busqueda.focus()
}

let buscar = (e) => {
  if(e.value.length > 3){
    console.log(`Buscando ${e.value}...`)
    fetch(`/buscar/${e.value}`)
    .then(r => r.json())
    .then(res => {

      encuentro.innerHTML = ''
      encuentro.classList.add('revelado')

      for (let r of res){

        let base = document.createElement('div')

        let h = document.createElement('h4')
        h.textContent = r.titulo
        let link = document.createElement('a')
        link.setAttribute('href', `/escritos/${r.id}`)
        link.appendChild(base)
        base.appendChild(h)

        for (let m of r.matches){
          let p = document.createElement('p')
          p.textContent = m
          base.appendChild(p)
        }

        encuentro.appendChild(link)

      }
    })
  }else{
    encuentro.classList.remove('revelado')
  }
}

// let busqueda = document.querySelector('#busqueda')
let limpiar_busqueda = () => {
  busqueda.value = ""
  window.focus('main')
  area.classList.remove('expandido')
  encuentro.classList.remove('revelado')
}

// busqueda.addEventListener('focus', () => h.classList.add('habitado'))
// busqueda.addEventListener('blur', limpiar_busqueda)
ubicar_resultados()

busqueda.addEventListener('keyup', (e) => {
  if (e.key != 'Escape') buscar(e.target)
  if (e.key == 'Escape') limpiar_busqueda()
})
