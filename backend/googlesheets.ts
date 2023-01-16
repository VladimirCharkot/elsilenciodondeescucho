import {google} from 'googleapis'
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
const sheets = google.sheets('v4');
import { logger } from './esdelogger'
import conf from './config'

interface SpreadsheetKey{
  spreadsheetId: string,
  auth: any
}

interface SheetKey extends SpreadsheetKey{
  sheetName: string
}

interface AppendOperation extends SheetKey{
  values: any[],
  range: string
}


const getAuthToken = async () => {
  const auth = new google.auth.GoogleAuth({
    keyFile: '.sheet_credentials.json',
    scopes: SCOPES
  });
  const authToken = await auth.getClient(); // JWT
  return authToken;
}

const getSpreadSheetInfo = async ({spreadsheetId, auth}: SpreadsheetKey) => {
  const res = await sheets.spreadsheets.get({
    spreadsheetId,
    auth,
  });
  return res;
}

const getSpreadSheetValues = async ({spreadsheetId, auth, sheetName}: SheetKey) => {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    auth,
    range: sheetName
  });
  return res;
}

const appendSpreadSheetValues = async ({spreadsheetId, auth, sheetName, values, range}: AppendOperation) => {
  const params = {
    spreadsheetId,
    auth,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      range,
      values
    }
  }
  const res = await sheets.spreadsheets.values.append(params);
  return res;
}


const ahora = (offset = -3) => {
  return new Date(Date.now() + offset * 60 * 60 * 1000);
}


interface EntradaPublica{
  nombre: string,
  monto: string,
}

export interface EntradaPrivada extends EntradaPublica{
  email: string,
  dni: string,
  medio: string,
  id: string
}


// Append a la planilla pública

export const appendPagoPublico = async ({nombre, monto}: EntradaPublica) => {
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

export const appendPagoPrivado = async ({nombre, email, dni, medio, monto, id}: EntradaPrivada) => {
  logger.debug(`Agregando ${nombre}, ${medio}, ${monto} al registro privado`);
  appendSpreadSheetValues({
    spreadsheetId : conf.sheets.planillaPrivada,
    auth: await getAuthToken(),
    sheetName : conf.sheets.nombreHoja,
    values : [[nombre, email, dni, monto, medio, ahora().toLocaleString(), id]],
    range: 'A:G'
  })
}

export const appendPendientePrivado = async ({nombre, email, dni, medio, monto, id}: EntradaPrivada) => {
  logger.debug(`Agregando ${nombre}, ${medio}, ${monto} al registro privado de PENDIENTES`);
  appendSpreadSheetValues({
    spreadsheetId : conf.sheets.planillaPrivada,
    auth: await getAuthToken(),
    sheetName : conf.sheets.nombreHoja,
    values : [[nombre, email, dni, monto, medio, ahora().toLocaleString(), id]],
    range: 'I:O'
  })
}

export const appendRechazadoPrivado = async ({nombre, email, dni, medio, monto, id}: EntradaPrivada) => {
  logger.debug(`Agregando ${nombre}, ${medio}, ${monto} al registro privado de RECHAZADOS`);
  appendSpreadSheetValues({
    spreadsheetId : conf.sheets.planillaPrivada,
    auth: await getAuthToken(),
    sheetName : conf.sheets.nombreHoja,
    values : [[nombre, email, dni, monto, medio, ahora().toLocaleString(), id]],
    range: 'Q:W'
  })
}
