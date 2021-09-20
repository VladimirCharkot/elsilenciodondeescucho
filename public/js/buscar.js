let abrir_busqueda = () => {
  let area = document.querySelector('#area_busqueda')
  let busqueda = document.querySelector('#busqueda')
  let panel = document.querySelector('#panel')
  area.classList.toggle('expandido');
  if (area.classList.contains('expandido') && busqueda.value.length > 3) {
    panel.classList.add('revelado')
  }else{
    panel.classList.remove('revelado')
  }
  document.querySelector('#busqueda').focus();
}

let buscar = (e) => {
  if(e.value.length > 3){
    console.log(`Buscando ${e.value}...`)
    fetch(`/buscar/${e.value}`)
    .then(r => r.json())
    .then(res => {
      console.log(res)
      let resultados = document.querySelector('#panel')
      resultados.innerHTML = ''
      resultados.className = 'revelado'

      for (let r of res){

        let base = document.createElement('div')

        let h = document.createElement('h4')
        h.textContent = r.titulo
        let link = document.createElement('a')
        link.setAttribute('href', `/escritos/${r.id}`)
        link.appendChild(h)
        base.appendChild(link)

        for (let m of r.matches){
          let p = document.createElement('p')
          p.textContent = m
          base.appendChild(p)
        }

        resultados.appendChild(base)

      }
    })
  }else{
    document.querySelector('#panel').classList.remove('revelado')
  }
}

window.addEventListener('keyup', (e) => {
  let inputbox = document.querySelector('#busqueda')
  if (document.activeElement == inputbox && e.key == "Escape"){
    inputbox.value = ""
  }
})
