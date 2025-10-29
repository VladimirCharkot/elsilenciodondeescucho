"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corregir_imagenes = void 0;
// Quita las imágenes de dentro de los p, que es como las devuelve
// el render de MD. También pone la primera como background de la cabecera.
const corregir_imagenes = (doc) => {
    const body = doc.body;
    // Cambia las imágenes dentro de ps por divs clase ventana
    body.querySelectorAll('p img').forEach((i, n) => {
        //@ts-ignore
        const d = doc.createElement('div');
        d.classList.add('ventana');
        if (n == 0)
            d.classList.add('cabecera');
        for (const attr of i.getAttributeNames()) {
            d.setAttribute(attr, i.getAttribute(attr));
        }
        d.style.setProperty('--url-imagen', `url(${i.getAttribute('src')})`);
        if (i.getAttribute('data-pos'))
            d.style.setProperty('--posicion', i.getAttribute('data-pos'));
        if (i.getAttribute('data-escala'))
            d.style.setProperty('--escala', i.getAttribute('data-escala'));
        i.parentElement.replaceWith(d);
        // i.style.opacity = '0'
        d.appendChild(i);
    });
    try {
        const titulo = body.querySelector('h2');
        const imagen = body.querySelector('.ventana');
        imagen.appendChild(titulo);
        return body.innerHTML.trim();
    }
    catch {
        console.log(`Parece que este texto no tiene imagen de cabecera c:`);
        return body.innerHTML.trim();
    }
};
exports.corregir_imagenes = corregir_imagenes;
//# sourceMappingURL=mdcustoms.js.map