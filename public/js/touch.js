addEventListener('load', () => {
  let body = document.querySelector('body')
  let contenido = document.querySelector('.texto')
  let header = document.querySelector('header')

  window.baseFontSize = parseInt(contenido.style.fontSize != "" ? contenido.style.fontSize : "12px")

  delete Hammer.defaults.cssProps.userSelect;
  var hammertime = new Hammer(contenido,  {
    inputClass: Hammer.TouchInput
  })
  hammertime.add(new Hammer.Pinch({}))
  hammertime.add(new Hammer.Tap({}))
  // hammertime.get('pinch').set({ enable: true })
  body.style.touchAction = "pan-y"
  contenido.style.touchAction = "pan-y"

  hammertime.on('pinch', (ev) => {

    if(ev.scale > 1){
      window.baseFontSize += 1
    }else{
      window.baseFontSize -= 1
    }
    contenido.style.fontSize = `clamp(12px, ${window.baseFontSize}px, 72px)`

  })

  hammertime.on('tap', (ev) => {
    header.classList.toggle('hovereado')
  })

})
