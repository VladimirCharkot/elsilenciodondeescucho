"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.traer_texto = exports.buscar = exports.buscar_texto = exports.indice_textos_public = exports.indice = exports.hogar = exports.colecta = void 0;
const lodash_1 = require("lodash");
const mdesde_1 = require("./mdesde");
const config_1 = __importDefault(require("./config"));
const cache_1 = require("./cache");
const colecta = async (__, res) => {
    res.render('colecta', {
        titulo: 'Colecta',
        MPaccessKey: config_1.default.mercadoPago.accessKey,
        URLPlanillaPublica: `https://docs.google.com/spreadsheets/d/${config_1.default.sheets.planillaPublica}/`
    });
};
exports.colecta = colecta;
const hogar = async (req, res) => {
    if (req.user)
        return res.redirect('/editor');
    return res.render('login', { titulo: '🤫' });
};
exports.hogar = hogar;
/* Página de índice de escritos para el público */
const indice = async (__, res) => {
    res.render('indice', { titulo: 'Índice' });
};
exports.indice = indice;
// Geteados por el frontend: 
const indice_textos_public = async (__, res) => {
    const idx = (0, lodash_1.cloneDeep)(cache_1.cache_textos.filter(txt => (txt.fm ? !txt.fm.oculto || txt.fm.oculto == "no" : true) && txt.link.includes('escritos')));
    idx.forEach(txt => delete txt.cuerpo);
    res.json(idx);
};
exports.indice_textos_public = indice_textos_public;
// Busca en la cache el texto con tal nombre
const buscar_texto = async (req, res) => {
    const textoId = req.params.textoId;
    res.json(await (0, exports.traer_texto)(textoId));
};
exports.buscar_texto = buscar_texto;
// Recibe un query y lo busca dentro de los textos
const buscar = async (req, res) => {
    console.log(`Buscando ${req.params.consulta}...`);
    if (req.params.consulta.length < 4)
        res.json([]);
    const delta = 50;
    const resultados = cache_1.cache_textos.map(t => {
        if (!t.cuerpo) {
            console.log(`@buscar fallando:`);
            console.log(t);
            return { titulo: `Error`, matches: [], id: `err` };
        }
        const regex = RegExp(req.params.consulta, 'ig');
        const matches = [];
        const l = t.cuerpo.length;
        const texto = t.cuerpo.split('---')[2];
        while ((regex.exec(texto)) !== null) {
            const inf = regex.lastIndex - delta;
            const sup = regex.lastIndex + delta;
            const i = inf < 0 ? 0 : inf;
            const j = sup > l ? l : sup;
            const frag = (inf != 0 ? '...' : '') + texto.slice(i, j) + (sup != l ? '...' : '');
            matches.push(frag);
        }
        let resp = { titulo: t.titulo, matches: matches, id: t.nombre };
        return resp;
    });
    const relevantes = resultados.filter((r) => r.matches.length > 0);
    res.json(relevantes);
};
exports.buscar = buscar;
// Busca un md y lo devuelve renderizado
const traer_texto = async (textoId) => {
    if (!cache_1.cache_textos)
        return { html: null, front_matter: { titulo: null } };
    const r = cache_1.cache_textos.filter(t => t.nombre == textoId);
    try {
        const { html, front_matter } = (0, mdesde_1.render)(r[0].cuerpo);
        return { html: (0, mdesde_1.corregir_imagenes)(html), front_matter };
    }
    catch (e) {
        console.log(`Excepción trayendo textoId. ${cache_1.cache_textos.filter(t => t.nombre == textoId) ? 'Encontrado en cache.' : 'No encontrado en cache.'}`);
        console.log(e);
        //   console.log(cache_textos)
        return { html: null, front_matter: { titulo: null } };
    }
};
exports.traer_texto = traer_texto;
//# sourceMappingURL=blog.js.map