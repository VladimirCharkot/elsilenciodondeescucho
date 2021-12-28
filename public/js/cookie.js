try{
  window.visto = document.cookie.split('; ').filter(s => s.startsWith('visto'))[0].split('=')[1] == 'true'
}catch(err){
  window.visto = false
}
