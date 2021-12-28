try{
  window.visto = parseInt(document.cookie.split('; ').filter(s => s.startsWith('visto'))[0].split('=')[1])
  //window.visto = false
}catch(err){
  window.visto = 0
}
