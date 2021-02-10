
// window.last_scroll_check = document.documentElement.scrollTop // comparar con esto para ver si hay gesto ascendente


let monitor = (n) => {
  ajustar_cabecera()
  setTimeout(() => monitor(n), n)
}

// window.addEventListener('load', () => monitor(1000))

function ajustar_cabecera() {
  let cabecera = document.querySelector('#cabecera')
  if (window.innerWidth <= 1060){
    cabecera.classList.add('contraida')
  }
  else{
    cabecera.classList.remove('contraida')
  }
  document.querySelector('#contenido').style.top = (document.querySelector('#cabecera').getBoundingClientRect().height) + 'px'
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

    // document.querySelector('#contenido').style.top = (document.querySelector('#cabecera').getBoundingClientRect().height - 20) + 'px'
  }
}


window.addEventListener('load', ajustar_cabecera)
window.addEventListener('resize', ajustar_cabecera)
window.addEventListener('scroll', barra)
