"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cargar_textos = exports.cargar_cache = exports.cargar_referencias_a_imagenes = exports.referencias_a_imagenes = exports.cache_textos = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const archivos_1 = require("./archivos");
const mdesde_1 = require("./mdesde");
exports.referencias_a_imagenes = {};
const extraer_imagenes = (cuerpo_md) => {
    const imgs = [];
    const regex = RegExp('!\\[(.+?)\\]\\((.+?)\\)', 'ig');
    let m = regex.exec(cuerpo_md);
    while (m !== null) {
        const ruta = m[2];
        imgs.push(ruta);
        m = regex.exec(cuerpo_md);
    }
    return imgs;
};
const cargar_referencias_a_imagenes = () => {
    exports.cache_textos.forEach(t => {
        const imgs = t.imagenes ?? [];
        imgs.forEach(img => {
            if (exports.referencias_a_imagenes.hasOwnProperty(img)) {
                exports.referencias_a_imagenes[img].push(t.link);
            }
            else {
                exports.referencias_a_imagenes[img] = [t.link];
            }
        });
    });
};
exports.cargar_referencias_a_imagenes = cargar_referencias_a_imagenes;
const cargar_cache = () => {
    (0, exports.cargar_textos)().then(res => {
        exports.cache_textos = res;
        console.log(`Textos cacheados`);
        (0, exports.cargar_referencias_a_imagenes)();
    });
};
exports.cargar_cache = cargar_cache;
const capitalize = (s) => s.substring(0, 1).toUpperCase() + s.substring(1);
// Lee el contenido!
const cargar_textos = async () => {
    console.log('Cargando textos...');
    const textos = [];
    const indice = (0, archivos_1.flatten)(await (0, archivos_1.construir_indice_textos)('public/textos'));
    for (let entrada of indice) {
        let contenido = await promises_1.default.readFile('public' + entrada.ruta, 'utf8');
        const { front_matter } = (0, mdesde_1.render)(contenido);
        const imgs = extraer_imagenes(contenido);
        // console.log(`Cargando ${entrada.ruta}...`)
        textos.push({
            titulo: capitalize(entrada.nombre.replace(/-/g, ' ')),
            slug: entrada.nombre.includes('.') ? entrada.nombre.split('.')[0] : '',
            cuerpo: contenido,
            link: entrada.ruta,
            nombre: entrada.nombre.split('.')[0],
            fm: front_matter,
            imagenes: imgs
        });
    }
    console.log('Textos cargados!...');
    return textos;
};
exports.cargar_textos = cargar_textos;
(0, exports.cargar_cache)();
/* /SCOPED!! */
//# sourceMappingURL=cache.js.map