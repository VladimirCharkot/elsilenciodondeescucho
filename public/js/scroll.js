
window.onscroll = function() { barra() };

window.last_scroll_check = document.documentElement.scrollTop // comparar con esto para ver si hay gesto ascendente

function ajustar_cabecera() {
  let cabecera = document.querySelector('#cabecera')
  console.log(window.innerWidth)
  if (window.innerWidth <= 1000) cabecera.classList.add('contraida');
  else cabecera.classList.remove('contraida');

  document.querySelector('#contenido').style.top = (document.querySelector('#cabecera').getBoundingClientRect().height - 20) + 'px'
};



function barra(){
  if (window.innerWidth > 1000){
    let cabecera = document.querySelector('#cabecera')
    let contenido = document.querySelector('#contenido')
    
    if (document.documentElement.scrollTop < 20){
      document.querySelector('#cabecera').classList.remove('contraida')
    }
    if (document.documentElement.scrollTop > 50) {
      document.querySelector('#cabecera').classList.add('contraida')
    }
  }
}


window.addEventListener('load', ajustar_cabecera)
window.addEventListener('resize', ajustar_cabecera)
window.addEventListener('scroll', barra)
