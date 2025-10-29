"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.corregir_imagenes = exports.render = exports.md = void 0;
const markdown_it_1 = __importDefault(require("markdown-it"));
const lodash_1 = __importDefault(require("lodash"));
const jsdom_1 = require("jsdom");
exports.md = new markdown_it_1.default({ html: true, typographer: true });
let front_matter;
let hay_front_matter = false;
const markdown_it_attrs_1 = __importDefault(require("markdown-it-attrs"));
//@ts-ignore
const markdown_it_bracketed_spans_1 = __importDefault(require("markdown-it-bracketed-spans"));
//@ts-ignore
const markdown_it_div_1 = __importDefault(require("markdown-it-div"));
//@ts-ignore
const markdown_it_footnote_1 = __importDefault(require("markdown-it-footnote"));
const markdown_it_front_matter_1 = __importDefault(require("markdown-it-front-matter"));
const markdown_it_container_1 = __importDefault(require("markdown-it-container"));
exports.md.use(markdown_it_attrs_1.default);
exports.md.use(markdown_it_bracketed_spans_1.default);
exports.md.use(markdown_it_div_1.default);
exports.md.use(markdown_it_footnote_1.default);
exports.md.use(markdown_it_front_matter_1.default, function (fm) {
    hay_front_matter = true;
    front_matter = lodash_1.default.fromPairs(fm.split('\n').filter(l => l.includes(':')).map(l => l.split(':')).map(p => [p[0], p[1].trim()]));
});
exports.md.use(markdown_it_container_1.default, 'clase', {
    validate: function (params) {
        return params.trim().match(/^(.+)\s*$/);
    },
    render: function (tokens, idx) {
        var m = tokens[idx].info.trim().match(/^(.+)\s*$/);
        if (tokens[idx].nesting === 1) {
            // opening tag
            return `<div class="${exports.md.utils.escapeHtml(m[1])}">\n`;
        }
        else {
            // closing tag
            return '</div>\n';
        }
    }
});
const render = (md_txt) => {
    let html = exports.md.render(md_txt);
    if (hay_front_matter) {
        hay_front_matter = false;
        return { html, front_matter };
    }
    else {
        return { html, front_matter: {} };
    }
};
exports.render = render;
// Quita las imágenes de dentro de los p, que es como las devuelve
// el render de MD. También pone la primera como background de la cabecera.
const corregir_imagenes = (html) => {
    const n = new jsdom_1.JSDOM(html);
    const doc = n.window.document;
    // Cambia las imágenes dentro de ps por divs clase ventana
    doc.querySelectorAll('p img').forEach((i, n) => {
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
        const titulo = doc.querySelector('h2');
        const imagen = doc.querySelector('.ventana');
        imagen.appendChild(titulo);
        return doc.body.innerHTML.trim();
    }
    catch {
        console.log(`Parece que este texto no tiene imagen de cabecera c:`);
        return html;
    }
};
exports.corregir_imagenes = corregir_imagenes;
//# sourceMappingURL=mdesde.js.map