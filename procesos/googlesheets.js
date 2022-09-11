const { google } = require('googleapis')
const fs = require('fs');
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
const sheets = google.sheets('v4');
const { logger } = require('./esdelogger');
const conf = require('./config');


const getAuthToken = async () => {
  const auth = new google.auth.GoogleAuth({
    keyFile: '.sheet_credentials.json',
    scopes: SCOPES
  });
  const authToken = await auth.getClient(); // JWT
  return authToken;
}

const getSpreadSheetInfo = async ({spreadsheetId, auth}) => {
  const res = await sheets.spreadsheets.get({
    spreadsheetId,
    auth,
  });
  return res;
}

const getSpreadSheetValues = async ({spreadsheetId, auth, sheetName}) => {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    auth,
    range: sheetName
  });
  return res;
}

const appendSpreadSheetValues = async ({spreadsheetId, auth, sheetName, values, range}) => {
  const res = await sheets.spreadsheets.values.append({
    spreadsheetId,
    auth,
    range,
    valueInputOption: 'USER_ENTERED',
    resource: {
        values: values
    },
  });
  return res;
}


const ahora = (offset = -3) => {
  return new Date(Date.now() + offset * 60 * 60 * 1000);
}


// Append a la planilla pública

const appendPagoPublico = async ({nombre, monto}) => {
  logger.debug(`Agregando ${nombre}, ${monto} al registro público`);
  appendSpreadSheetValues({
    spreadsheetId : conf.sheets.planillaPublica,
    auth: await getAuthToken(),
    sheetName : conf.sheets.nombreHoja,
    values : [[nombre, monto, ahora().toLocaleString()]],
    range: 'A:C'
  })
}


// Append a la planilla privada

const appendPagoPrivado = async ({nombre, email, dni, medio, monto, id}) => {
  logger.debug(`Agregando ${nombre}, ${medio}, ${monto} al registro privado`);
  appendSpreadSheetValues({
    spreadsheetId : conf.sheets.planillaPrivada,
    auth: await getAuthToken(),
    sheetName : conf.sheets.nombreHoja,
    values : [[nombre, email, dni, monto, medio, ahora().toLocaleString(), id]],
    range: 'A:G'
  })
}

const appendPendientePrivado = async ({nombre, email, dni, medio, monto, id}) => {
  logger.debug(`Agregando ${nombre}, ${medio}, ${monto} al registro privado de PENDIENTES`);
  appendSpreadSheetValues({
    spreadsheetId : conf.sheets.planillaPrivada,
    auth: await getAuthToken(),
    sheetName : conf.sheets.nombreHoja,
    values : [[nombre, email, dni, monto, medio, ahora().toLocaleString(), id]],
    range: 'I:O'
  })
}

const appendRechazadoPrivado = async ({nombre, email, dni, medio, monto, id}) => {
  logger.debug(`Agregando ${nombre}, ${medio}, ${monto} al registro privado de RECHAZADOS`);
  appendSpreadSheetValues({
    spreadsheetId : conf.sheets.planillaPrivada,
    auth: await getAuthToken(),
    sheetName : conf.sheets.nombreHoja,
    values : [[nombre, email, dni, monto, medio, ahora().toLocaleString(), id]],
    range: 'Q:W'
  })
}


// exports.getAuthToken = getAuthToken
// exports.getSpreadSheetInfo = getSpreadSheetInfo
// exports.getSpreadSheetValues = getSpreadSheetValues
// exports.appendSpreadSheetValues = appendSpreadSheetValues

exports.appendPagoPublico = appendPagoPublico
exports.appendPagoPrivado = appendPagoPrivado
exports.appendPendientePrivado = appendPendientePrivado
exports.appendRechazadoPrivado = appendRechazadoPrivado
