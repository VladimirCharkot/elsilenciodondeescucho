"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logaccess = exports.momento = exports.tiempo = exports.fecha = void 0;
const redisclient_1 = require("./redisclient");
const fecha = (dd = 0) => {
    let hoy = new Date();
    hoy.setDate(hoy.getDate() + dd);
    return hoy.toISOString().split('T')[0];
};
exports.fecha = fecha;
const tiempo = (dh = 0) => {
    let ahora = new Date();
    ahora.setHours(ahora.getHours() + dh);
    return ahora.toISOString().split('T')[1].split('.')[0];
};
exports.tiempo = tiempo;
const momento = (dh = 0) => {
    let ahora = new Date();
    ahora.setHours(ahora.getHours() + dh);
    return ahora;
};
exports.momento = momento;
const logaccess = (req, res, next) => {
    (0, redisclient_1.rpush)(`esde|${(0, exports.fecha)()}`, `${Date.now()}|${req.ip}|${req.path}`);
    next();
};
exports.logaccess = logaccess;
//# sourceMappingURL=accesos.js.map