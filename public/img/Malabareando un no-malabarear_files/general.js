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

let getCookie = (name) => {
  var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) return JSON.parse(match[2]);
}
