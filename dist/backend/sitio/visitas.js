"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.semestre = exports.mes = exports.semana = exports.dia = exports.hora = exports.visor = void 0;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const lodash_1 = __importDefault(require("lodash"));
const redisclient_1 = require("./redisclient");
const accesos_1 = require("./accesos");
// id con el que se está logueando en redis
const id_redis = 'esde';
const visor = async (req, res) => {
    res.render('visitas', { titulo: 'Visitas al sitio' });
};
exports.visor = visor;
let objetificar = (linea) => {
    let [t, ip, path] = linea.split('|');
    return { t: parseInt(t), ip, path };
};
const hora = async (req, res) => {
    let t = Date.now();
    let hoy = await redisclient_1.client.lRange(`${id_redis}|${(0, accesos_1.fecha)()}`, 0, -1);
    let ayer = await redisclient_1.client.lRange(`${id_redis}|${(0, accesos_1.fecha)(-1)}`, 0, -1);
    let entradas = hoy.map(objetificar).concat(ayer.map(objetificar));
    let dos_horas_antes = t - 1000 * 60 * 60 * 2;
    let ultimas_dos_horas = entradas.filter(e => e.t > dos_horas_antes);
    res.json(ultimas_dos_horas);
};
exports.hora = hora;
const dia = async (req, res) => {
    let hoy = await redisclient_1.client.lRange(`${id_redis}|${(0, accesos_1.fecha)()}`, 0, -1);
    let ayer = await redisclient_1.client.lRange(`${id_redis}|${(0, accesos_1.fecha)(-1)}`, 0, -1);
    let entradas = hoy.map(objetificar).concat(ayer.map(objetificar));
    entradas = entradas.filter(e => e.t > Date.now() - 24 * 60 * 60 * 1000);
    res.json(entradas);
};
exports.dia = dia;
const semana = async (req, res) => {
    let fechas = lodash_1.default.range(7)
        .map(d => (0, accesos_1.fecha)(-d));
    let base = [];
    for (let f of fechas)
        base.push(await redisclient_1.client.lRange(`${id_redis}|${f}`, 0, -1));
    let entradas = lodash_1.default.flatten(base).map(objetificar);
    res.json(entradas);
};
exports.semana = semana;
const mes = async (req, res) => {
    let fechas = lodash_1.default.range(30)
        .map(d => (0, accesos_1.fecha)(-d));
    let base = [];
    for (let f of fechas)
        base.push(await redisclient_1.client.lRange(`${id_redis}|${f}`, 0, -1));
    let entradas = lodash_1.default.flatten(base).map(objetificar);
    res.json(entradas);
};
exports.mes = mes;
const semestre = async (req, res) => {
    let fechas = lodash_1.default.range(7 * 26)
        .map(d => (0, accesos_1.fecha)(-d));
    let base = [];
    for (let f of fechas)
        base.push(await redisclient_1.client.lRange(`${id_redis}|${f}`, 0, -1));
    let entradas = lodash_1.default.flatten(base).map(objetificar);
    res.json(entradas);
};
exports.semestre = semestre;
//# sourceMappingURL=visitas.js.map