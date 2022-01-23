addEventListener('load', () => {
  let body = document.querySelector('body')
  let contenido = document.querySelector('.texto')
  let header = document.querySelector('header')

  var hammertime = new Hammer(contenido,  {})
  hammertime.add(new Hammer.Pinch({}))
  hammertime.add(new Hammer.Press({}))
  // hammertime.get('pinch').set({ enable: true })
  body.style.touchAction = "pan-y"
  contenido.style.touchAction = "pan-y"

  hammertime.on('pinch', (ev) => {

    let tamaneo = parseInt(contenido.style.fontSize ? contenido.style.fontSize : "12px")
    if(ev.scale > 1){
      contenido.style.fontSize = `clamp(12px, ${tamaneo+1}px, 72px)`
    }else{
      contenido.style.fontSize = `clamp(12px, ${tamaneo-1}px, 72px)`
    }

  })

  hammertime.on('press', (ev) => {
    header.classList.toggle('hovereado')
  })

})
