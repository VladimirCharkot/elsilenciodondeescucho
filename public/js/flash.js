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
