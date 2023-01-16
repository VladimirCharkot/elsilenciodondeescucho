import * as React from 'react';

export const Flash = () => <div className="flash"></div>

declare global {
interface Window {
    flash_last_updated: any;
}
}

export const flash = (m: {mensaje: string}) => {
$('#flash p').text(m.mensaje)
$('#flash').addClass('expandido')
window.flash_last_updated = Date.now()
setTimeout(chequear, 3000)
}

export const chequear = (t = 3000) => {
if (Date.now() - window.flash_last_updated >= t){
    $('#flash').removeClass('expandido')
}else{
    setTimeout(chequear, t)
}
}