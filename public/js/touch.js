let body = document.querySelector('body')
let contenido = document.querySelector('#contenido')


let hammertime = new Hammer(contenido)
hammertime.get('pinch').set({ enable: true })
body.style.touchAction = "pan-y"
contenido.style.touchAction = "pan-y"

hammertime.on('pinch', (ev) => {

  let tamaneo = parseInt(contenido.style.fontSize ? contenido.style.fontSize : "12px")
  if(ev.scale > 1){
    contenido.style.fontSize = `clamp(12px, ${tamaneo+1}px, 72px)`
  }else{
    contenido.style.fontSize = `clamp(12px, ${tamaneo-1}px, 72px)`
  }

});
