"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editor = exports.indice_textos_editor = exports.indice_imagenes_editor = exports.post_imagenes = exports.post_md = exports.borrar_imagen = exports.delete_md = void 0;
// let fs = require('fs').promises
const promises_1 = __importDefault(require("fs/promises"));
const formidable_1 = __importDefault(require("formidable"));
const archivos_1 = require("../blog/archivos");
/* MDs */
const delete_md = async (req, res) => {
    res.json(await (0, archivos_1.delete_public)(req.params.path));
};
exports.delete_md = delete_md;
const borrar_imagen = async (req, res) => {
    res.json(await (0, archivos_1.delete_public)(req.params.path));
};
exports.borrar_imagen = borrar_imagen;
const post_md = async (req, res) => {
    console.log(`Recibiendo post_md`);
    if (req.body.contenido && req.body.ruta) {
        if (!req.body.ruta.endsWith('.md'))
            req.body.ruta += '.md';
        res.json(await (0, archivos_1.post_public)(req.body.ruta, req.body.contenido));
    }
    if (req.body.ruta_vieja && req.body.ruta_nueva) {
        res.json(await (0, archivos_1.move_public)(req.body.ruta_vieja, req.body.ruta_nueva));
    }
};
exports.post_md = post_md;
/* Imágenes */
const post_imagenes = async (req, res) => {
    const form = new formidable_1.default.IncomingForm();
    form.parse(req, async (__, ___, files) => {
        const rutas = [];
        if (files) {
            //@ts-ignore
            for (const pic of files) {
                const nn = `./public/img/${pic.newFilename}`;
                console.log(`Poniendo ${pic} en ${nn}`);
                promises_1.default.rename(pic.path, nn);
                rutas.push(`/img/${pic.name}`);
            }
        }
        res.json({ status: 200, rutas: rutas });
    });
};
exports.post_imagenes = post_imagenes;
const indice_imagenes_editor = async (__, res) => {
    console.log(`Armando índice imágenes`);
    let idx_img = await (0, archivos_1.construir_indice_imgs)('public/img');
    let idx_foto = await (0, archivos_1.construir_indice_imgs)('public/foto');
    res.json([
        {
            ruta: 'public/img',
            nombre: 'img',
            children: idx_img
        },
        {
            ruta: 'public/foto',
            nombre: 'foto',
            children: idx_foto
        }
    ]);
};
exports.indice_imagenes_editor = indice_imagenes_editor;
// Devuelve un ÁRBOL, que es procesado por el editor
const indice_textos_editor = async (__, res) => {
    const idx = await (0, archivos_1.construir_indice_textos_hidratado)('public/textos');
    res.json(idx);
};
exports.indice_textos_editor = indice_textos_editor;
const editor = async (__, res) => {
    res.render('editor');
};
exports.editor = editor;
//# sourceMappingURL=editor.js.map