const { google } = require('googleapis')
const fs = require('fs');
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
const sheets = google.sheets('v4');
const { logger } = require('./esdelogger');



const getAuthToken = async () => {
  const auth = new google.auth.GoogleAuth({
    keyFile: '.sheet_credentials.json',
    scopes: SCOPES
  });
  const authToken = await auth.getClient(); // JWT
  return authToken;
}

const getSpreadSheetInfo = async ({spreadsheetId, auth}) => {
  logger.debug('[Sheets]:: Getting spreadsheet info...');
  const res = await sheets.spreadsheets.get({
    spreadsheetId,
    auth,
  });
  logger.debug('[Sheets]:: Got');
  logger.debug(JSON.stringify(res))
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




// Append a la planilla pública

const appendPagoPublico = async ({nombre, monto}) => {
  logger.debug(`Agregando ${nombre}, ${monto} al registro público`);
  appendSpreadSheetValues({
    spreadsheetId : '1nxNa1IOaquv3luX2Kgu1EohSK3goN04b9TkCRhs1mko',
    auth: await getAuthToken(),
    sheetName : 'contribuciones',
    values : [[nombre, monto, new Date().toLocaleString()]],
    range: 'A:C'
  })
}


// Append a la planilla privada

const appendPagoPrivado = async ({nombre, email, dni, medio, monto}) => {
  logger.debug(`Agregando ${nombre}, ${medio}, ${monto} al registro privado`);
  appendSpreadSheetValues({
    spreadsheetId : '1EkXD4b5vIQn1vsuJrQAYRAHYlCmAMkrk-vYlgI0AEkM',
    auth: await getAuthToken(),
    sheetName : 'contribuciones',
    values : [[nombre, email, dni, monto, medio, new Date().toLocaleString()]],
    range: 'A:F'
  })
}

const appendPendientePrivado = async ({nombre, email, dni, medio, monto}) => {
  logger.debug(`Agregando ${nombre}, ${medio}, ${monto} al registro privado de PENDIENTES`);
  appendSpreadSheetValues({
    spreadsheetId : '1EkXD4b5vIQn1vsuJrQAYRAHYlCmAMkrk-vYlgI0AEkM',
    auth: await getAuthToken(),
    sheetName : 'contribuciones',
    values : [[nombre, email, dni, monto, medio, new Date().toLocaleString()]],
    range: 'H:M'
  })
}

const appendRechazadoPrivado = async ({nombre, email, dni, medio, monto}) => {
  logger.debug(`Agregando ${nombre}, ${medio}, ${monto} al registro privado de RECHAZADOS`);
  appendSpreadSheetValues({
    spreadsheetId : '1EkXD4b5vIQn1vsuJrQAYRAHYlCmAMkrk-vYlgI0AEkM',
    auth: await getAuthToken(),
    sheetName : 'contribuciones',
    values : [[nombre, email, dni, monto, medio, new Date().toLocaleString()]],
    range: 'O:T'
  })
}



// Google Sheets API Key AIzaSyBt8S4rE-lBlnllSJsPqKOgUmElBsLWI8w

// Sheet privada: 1EkXD4b5vIQn1vsuJrQAYRAHYlCmAMkrk-vYlgI0AEkM
// Sheet pública: 1nxNa1IOaquv3luX2Kgu1EohSK3goN04b9TkCRhs1mko

// exports.getAuthToken = getAuthToken
// exports.getSpreadSheetInfo = getSpreadSheetInfo
// exports.getSpreadSheetValues = getSpreadSheetValues
// exports.appendSpreadSheetValues = appendSpreadSheetValues

exports.appendPagoPublico = appendPagoPublico
exports.appendPagoPrivado = appendPagoPrivado
exports.appendPendientePrivado = appendPendientePrivado
exports.appendRechazadoPrivado = appendRechazadoPrivado
