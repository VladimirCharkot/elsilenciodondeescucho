"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const accesos_1 = require("../backend/sitio/accesos");
const visitas = __importStar(require("../backend/sitio/visitas"));
const blog = __importStar(require("../backend/blog/blog"));
const auth = __importStar(require("../backend/sitio/auth"));
const editor = __importStar(require("../backend/editor/editor"));
const router = (0, express_1.Router)();
/* Público */
router.get('/', [blog.frontend]);
router.get('/buscar/:consulta', blog.buscar);
router.get('/colecta', [blog.colecta]);
// MercadoPago
// router.post('/pago', (req, res) => {
//   mp.procesarPago(req, res);
// });
// router.post('/billetera', (req, res) => mp.generarLink(req, res));
// router.post('/webhook', (req, res) => mp.webhook(req, res));
// router.get('/pago_aprobado', mp.back_aprobado);
// router.get('/pago_pendiente', mp.back_pendiente);
// router.get('/pago_fallido', mp.back_rechazado);
/* Público funcional */
router.get('/indice_json', blog.indice_textos_public);
router.get('/indice_arbol_textos', editor.indice_textos_editor);
router.get('/indice_arbol_imagenes', editor.indice_imagenes_editor);
router.get('/texto/:textoId', blog.buscar_texto);
/* Privado */
// router.get('/visitas', [auth.is_admin, visitas.visor])
router.get('/analytics/hora', [auth.is_admin, visitas.hora]);
router.get('/analytics/dia', [auth.is_admin, visitas.dia]);
router.get('/analytics/semana', [auth.is_admin, visitas.semana]);
router.get('/analytics/mes', [auth.is_admin, visitas.mes]);
router.get('/analytics/semestre', [auth.is_admin, visitas.semestre]);
// Editor
router.post('/md/', [auth.is_admin, editor.post_md]);
router.delete('/md/:path', [auth.is_admin, editor.delete_md]);
// router.get('/imagenes/', [auth.is_admin, editor.imagenes])
router.post('/imagenes/', [auth.is_admin, editor.post_imagenes]);
router.delete('/imagenes/:path', [auth.is_admin, editor.borrar_imagen]);
router.post('/hogar', auth.login);
//@ts-ignore
router.post('/accion', (req, res) => { (0, accesos_1.logaccess)(req.headers['X-Forwarded-For'] ?? req.ip, req.body.accion); res.json({ ok: true }); });
router.get('/check', auth.check_admin);
router.get('/logout', auth.logout);
router.get('*', blog.frontend);
module.exports = router;
//# sourceMappingURL=esde.js.map