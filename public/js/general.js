function flash(m){
  $('#flash p').text(m.mensaje)
  $('#flash').addClass('expandido')
  window.flash_last_updated = Date.now()
  setTimeout(chequear, 3000)
}

let chequear = (t = 3000) => {
  if (Date.now() - window.flash_last_updated >= t){
    $('#flash').removeClass('expandido')
  }else{
    setTimeout(chequear, t)
  }
}

const getCookie = (name) => {
  var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) return JSON.parse(match[2]);
}

const corregir_imagenes = () => {
  document.querySelectorAll('.texto p img').forEach(i => {
      console.log(`Iterando sobre:`);
      console.log(i);
      const d = document.createElement('div')
      d.classList.add('ventana')
      d.classList.add('cabecera')
      for (const attr of i.getAttributeNames()){
        d.setAttribute(attr, i.getAttribute(attr))
      }
      d.style.setProperty('--url-imagen', `url(${i.getAttribute('src')})`)
      if(i.getAttribute('data-pos'))
        d.style.setProperty('--posicion', i.getAttribute('data-pos'))
      if(i.getAttribute('data-escala'))
        d.style.setProperty('--escala', i.getAttribute('data-escala'))
      //@ts-ignore
      i.parentElement.replaceWith(d)
      //@ts-ignore
      i.style.opacity = 0
      d.appendChild(i)
    })
  try{
    console.log(`Intentando appendear`)
    const titulo = document.querySelector('h2')
    const imagen = document.querySelector('.ventana')
    console.log(titulo)
    console.log(imagen)
    //@ts-ignore
    imagen.appendChild(titulo)
  }catch{
    console.log(`Parece que este texto no tiene imagen de cabecera c:`)
  }
}
