"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.indice_a_md = exports.construir_indice_imgs = exports.construir_indice_textos_hidratado = exports.construir_indice_textos = exports.flatten = exports.fsTreeWalk = exports.delete_public = exports.move_public = exports.post_public = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const cache_1 = require("./cache");
// Update o create
const post_public = async (ruta, recurso) => {
    console.log(`Recibiendo request a post_public para ruta ${ruta}`);
    let target = path_1.default.join('public', ruta);
    try {
        let stat = await promises_1.default.stat(target);
        if (stat.isFile()) {
            console.log(`Sobreescribiendo ${ruta}...`);
            await promises_1.default.writeFile(target, recurso);
            return { status: 200, mensaje: 'Actualizado' };
        }
        else {
            return { status: 400, mensaje: 'No está permitido escribir sobre un directorio' };
        }
    }
    catch (err) {
        if (err.code == 'ENOENT') {
            console.log(`Creando ${ruta}...`);
            await promises_1.default.writeFile(target, recurso);
            return { status: 201, mensaje: 'Creado' };
        }
        else {
            console.log(err);
            return { status: 400, mensaje: err };
        }
    }
};
exports.post_public = post_public;
const move_public = async (origen, destino) => {
    console.log(`move_public llamado con ${origen}, ${destino}`);
    let source = path_1.default.join('public', origen);
    let target = path_1.default.join('public', destino);
    try {
        let stat = await promises_1.default.stat(source);
        await promises_1.default.rename(source, target);
        return { status: 200, mensaje: 'Movido!' };
    }
    catch (err) {
        if (err.code == 'ENOENT') {
            console.log(`${origen} no existe`);
            return { status: 400, mensaje: 'Solicitado renombrar un objeto inexistente' };
        }
        else if (err.code == 'ENOTDIR') {
            console.log(`Intentando mover un archivo dentro de otro`);
            return { status: 400, mensaje: `Intentando mover un archivo dentro de otro` };
        }
        else {
            console.log(err);
            return { status: 400, mensaje: err };
        }
    }
};
exports.move_public = move_public;
const delete_public = async (ruta) => {
    console.log(`delete_public llamado con ${ruta}`);
    let source = path_1.default.join('public', ruta);
    try {
        // let stat = await fs.stat(source)
        await promises_1.default.unlink(source);
        return { status: 200, mensaje: 'Borrado!' };
    }
    catch (err) {
        if (err.code == 'ENOENT') {
            console.log(`${ruta} no existe`);
            return { status: 400, mensaje: 'Solicitado renombrar un objeto inexistente' };
        }
        else {
            console.log(err);
            return { status: 400, mensaje: err };
        }
    }
};
exports.delete_public = delete_public;
const fsTreeWalk = async (baseDir, leerHoja) => {
    const lista = (await promises_1.default.readdir(baseDir, { withFileTypes: true }))
        .filter(e => e.name != '.DS_Store');
    const indice = lista.map(async (e) => {
        const entrada = {
            ruta: path_1.default.join(baseDir, e.name),
            nombre: e.name
        };
        if (e.isDirectory()) {
            const nodo = { ...entrada, children: await (0, exports.fsTreeWalk)(entrada.ruta, leerHoja) };
            return nodo;
        }
        else {
            return await leerHoja(entrada);
        }
    });
    return await Promise.all(indice);
};
exports.fsTreeWalk = fsTreeWalk;
const flatten = (tree) => tree.map((n) => n.children ? (0, exports.flatten)(n.children) : [n]).flat();
exports.flatten = flatten;
const atributos_fs = (ruta, nombre) => ({
    ruta: ruta.replace('public', ''),
    nombre: nombre,
    type: nombre.split('.')[1]
});
// Esto es llamado para construir la cache
const construir_indice_textos = (addr) => (0, exports.fsTreeWalk)(addr, async ({ ruta, nombre }) => atributos_fs(ruta, nombre));
exports.construir_indice_textos = construir_indice_textos;
const construir_indice_textos_hidratado = (addr) => (0, exports.fsTreeWalk)(addr, async ({ ruta, nombre }) => {
    const path = ruta.replace('public', '');
    const txts = cache_1.cache_textos.filter(t => t.link == path);
    if (txts.length == 0) {
        console.log(`No encontramos ${path} en cache!`);
        return atributos_fs(path, nombre);
    }
    const txt = txts[0];
    // const portada =
    return {
        ...atributos_fs(path, nombre),
        atributos: { ...txt.fm, portada: txt.imagenes ? txt.imagenes[0] : null },
    };
});
exports.construir_indice_textos_hidratado = construir_indice_textos_hidratado;
const construir_indice_imgs = (addr) => (0, exports.fsTreeWalk)(addr, async ({ ruta, nombre }) => ({
    ...atributos_fs(ruta, nombre),
    atributos: {
        referencias: cache_1.referencias_a_imagenes[ruta.replace('public', '')]
    }
}));
exports.construir_indice_imgs = construir_indice_imgs;
/* Endpoints */
/* Transforma el índice json que devuelve construir_indice() a md */
const indice_a_md = async (idx) => {
    let ls = [];
    for (const e of idx) {
        if (e.children) {
            ls = ls.concat(['', `- ${e.nombre}`, '']);
            if (e.children) {
                const subindice = await (0, exports.indice_a_md)(e.children);
                ls = ls.concat(subindice.split('\n').map(l => '  ' + l).join('\n'));
            }
        }
        else {
            ls.push(`- [${e.nombre}](${e.ruta})`);
        }
    }
    return ls.join('\n');
};
exports.indice_a_md = indice_a_md;
//# sourceMappingURL=archivos.js.map