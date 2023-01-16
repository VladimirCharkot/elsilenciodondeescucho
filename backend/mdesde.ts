import markdownIt from 'markdown-it'
import _ from 'lodash'
import { JSDOM } from 'jsdom'

export const md = new markdownIt({ html: true, typographer: true })

interface Atributos {
    [atributo: string]: string;
}
let front_matter: Atributos
let hay_front_matter = false

import markdownItAttrs from "markdown-it-attrs";
//@ts-ignore
import markdownItSpans from "markdown-it-bracketed-spans";
//@ts-ignore
import markdownItDivs from "markdown-it-div";
//@ts-ignore
import markdownItFootnote from "markdown-it-footnote";
import markdownItFrontMatter from "markdown-it-front-matter";
import markdownItContainer from "markdown-it-container";

md.use(markdownItAttrs)
md.use(markdownItSpans)
md.use(markdownItDivs)
md.use(markdownItFootnote)
md.use(markdownItFrontMatter, function (fm: string) {
    hay_front_matter = true
    front_matter = _.fromPairs(fm.split('\n').filter(l => l.includes(':')).map(l => l.split(':')).map(p => [p[0], p[1].trim()]))
})

md.use(markdownItContainer, 'clase', {
    validate: function (params: string) {
        return params.trim().match(/^(.+)\s*$/);
    },

    render: function (tokens: any[], idx: number) {
        var m = tokens[idx].info.trim().match(/^(.+)\s*$/);

        if (tokens[idx].nesting === 1) {
            // opening tag
            return `<div class="${md.utils.escapeHtml(m[1])}">\n`

        } else {
            // closing tag
            return '</div>\n';
        }
    }
})

export const render = (md_txt: string) => {
    let html = md.render(md_txt)
    if (hay_front_matter) {
        hay_front_matter = false
        return { html, front_matter }
    } else {
        return { html, front_matter: {} }
    }
}

// Quita las imágenes de dentro de los p, que es como las devuelve
// el render de MD. También pone la primera como background de la cabecera.
export const corregir_imagenes = (html: string) => {
    const n = new JSDOM(html)
    const doc = n.window.document

    // Cambia las imágenes dentro de ps por divs clase ventana
    doc.querySelectorAll('p img').forEach((i: HTMLElement, n) => {
        const d = doc.createElement('div')
        d.classList.add('ventana')
        if (n == 0)
            d.classList.add('cabecera')
        for (const attr of i.getAttributeNames()) {
            d.setAttribute(attr, i.getAttribute(attr))
        }
        d.style.setProperty('--url-imagen', `url(${i.getAttribute('src')})`)
        if (i.getAttribute('data-pos'))
            d.style.setProperty('--posicion', i.getAttribute('data-pos'))
        if (i.getAttribute('data-escala'))
            d.style.setProperty('--escala', i.getAttribute('data-escala'))
        i.parentElement.replaceWith(d)
        // i.style.opacity = '0'
        d.appendChild(i)
    })


    try {
        const titulo = doc.querySelector('h2')
        const imagen = doc.querySelector('.ventana')
        imagen.appendChild(titulo)
        return doc.body.innerHTML.trim()
    } catch {
        console.log(`Parece que este texto no tiene imagen de cabecera c:`)
        return html
    }
}
