
window.onscroll = function() { barra() };

window.last_scroll_check = document.documentElement.scrollTop // comparar con esto para ver si hay gesto ascendente

function barra(){
  let cabecera = document.querySelector('#cabecera')
  let contenido = document.querySelector('#contenido')
  if (document.documentElement.scrollTop < 20){
    document.querySelector('#cabecera').classList.remove('contraida')
  }
  if (document.documentElement.scrollTop > 50) {
    document.querySelector('#cabecera').classList.add('contraida')
  }
}

window.onload = () => { document.querySelector('#contenido').style.top = (document.querySelector('#cabecera').getBoundingClientRect().height - 20) + 'px'}
