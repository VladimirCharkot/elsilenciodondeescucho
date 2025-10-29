"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appendRechazadoPrivado = exports.appendPendientePrivado = exports.appendPagoPrivado = exports.appendPagoPublico = void 0;
const googleapis_1 = require("googleapis");
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const sheets = googleapis_1.google.sheets('v4');
const esdelogger_1 = require("../sitio/esdelogger");
const config_1 = __importDefault(require("../sitio/config"));
const getAuthToken = async () => {
    const auth = new googleapis_1.google.auth.GoogleAuth({
        keyFile: '.sheet_credentials.json',
        scopes: SCOPES
    });
    const authToken = await auth.getClient(); // JWT
    return authToken;
};
const getSpreadSheetInfo = async ({ spreadsheetId, auth }) => {
    const res = await sheets.spreadsheets.get({
        spreadsheetId,
        auth,
    });
    return res;
};
const getSpreadSheetValues = async ({ spreadsheetId, auth, sheetName }) => {
    const res = await sheets.spreadsheets.values.get({
        spreadsheetId,
        auth,
        range: sheetName
    });
    return res;
};
const appendSpreadSheetValues = async ({ spreadsheetId, auth, sheetName, values, range }) => {
    const params = {
        spreadsheetId,
        auth,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
            range,
            values
        }
    };
    const res = await sheets.spreadsheets.values.append(params);
    return res;
};
const ahora = (offset = -3) => {
    return new Date(Date.now() + offset * 60 * 60 * 1000);
};
// Append a la planilla pública
const appendPagoPublico = async ({ nombre, monto }) => {
    esdelogger_1.logger.debug(`Agregando ${nombre}, ${monto} al registro público`);
    appendSpreadSheetValues({
        spreadsheetId: config_1.default.sheets.planillaPublica,
        auth: await getAuthToken(),
        sheetName: config_1.default.sheets.nombreHoja,
        values: [[nombre, monto, ahora().toLocaleString()]],
        range: 'A:C'
    });
};
exports.appendPagoPublico = appendPagoPublico;
// Append a la planilla privada
const appendPagoPrivado = async ({ nombre, email, dni, medio, monto, id }) => {
    esdelogger_1.logger.debug(`Agregando ${nombre}, ${medio}, ${monto} al registro privado`);
    appendSpreadSheetValues({
        spreadsheetId: config_1.default.sheets.planillaPrivada,
        auth: await getAuthToken(),
        sheetName: config_1.default.sheets.nombreHoja,
        values: [[nombre, email, dni, monto, medio, ahora().toLocaleString(), id]],
        range: 'A:G'
    });
};
exports.appendPagoPrivado = appendPagoPrivado;
const appendPendientePrivado = async ({ nombre, email, dni, medio, monto, id }) => {
    esdelogger_1.logger.debug(`Agregando ${nombre}, ${medio}, ${monto} al registro privado de PENDIENTES`);
    appendSpreadSheetValues({
        spreadsheetId: config_1.default.sheets.planillaPrivada,
        auth: await getAuthToken(),
        sheetName: config_1.default.sheets.nombreHoja,
        values: [[nombre, email, dni, monto, medio, ahora().toLocaleString(), id]],
        range: 'I:O'
    });
};
exports.appendPendientePrivado = appendPendientePrivado;
const appendRechazadoPrivado = async ({ nombre, email, dni, medio, monto, id }) => {
    esdelogger_1.logger.debug(`Agregando ${nombre}, ${medio}, ${monto} al registro privado de RECHAZADOS`);
    appendSpreadSheetValues({
        spreadsheetId: config_1.default.sheets.planillaPrivada,
        auth: await getAuthToken(),
        sheetName: config_1.default.sheets.nombreHoja,
        values: [[nombre, email, dni, monto, medio, ahora().toLocaleString(), id]],
        range: 'Q:W'
    });
};
exports.appendRechazadoPrivado = appendRechazadoPrivado;
//# sourceMappingURL=googlesheets.js.map