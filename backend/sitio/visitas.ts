import express, {Request, Response} from 'express'
const router = express.Router()

import _ from 'lodash'
import {client} from './redisclient'
import {fecha} from './accesos'

// id con el que se está logueando en redis
const id_redis = 'esde'

export const visor = async (req: Request, res: Response) => {
  res.render('visitas', {titulo: 'Visitas al sitio'})
}

let objetificar = (linea: string) => {
  let [t, ip, path] = linea.split('|')
  return {t: parseInt(t), ip, path}
}

export const hora = async (req: Request, res: Response) => {
  let t = Date.now()

  let hoy: string[] = await client.lRange(`${id_redis}|${fecha()}`, 0, -1)
  let ayer: string[] = await client.lRange(`${id_redis}|${fecha(-1)}`, 0, -1)
  let entradas = hoy.map(objetificar).concat(ayer.map(objetificar))

  let dos_horas_antes = t - 1000 * 60 * 60 * 2
  let ultimas_dos_horas = entradas.filter(e => e.t > dos_horas_antes)

  res.json(ultimas_dos_horas)
}

export const dia = async (req: Request, res: Response) => {
  let hoy: string[] = await client.lRange(`${id_redis}|${fecha()}`, 0, -1)
  let ayer: string[] = await client.lRange(`${id_redis}|${fecha(-1)}`, 0, -1)
  let entradas = hoy.map(objetificar).concat(ayer.map(objetificar))
  entradas = entradas.filter(e => e.t > Date.now() - 24 * 60 * 60 * 1000)

  res.json(entradas)
}

export const semana = async (req: Request, res: Response) => {
  let fechas = _.range(7)
    .map(d => fecha(-d))

  let base = []
  for (let f of fechas) base.push(await client.lRange(`${id_redis}|${f}`, 0, -1))
  let entradas = _.flatten(base).map(objetificar)

  res.json(entradas)
}

export const mes = async (req: Request, res: Response) => {
  let fechas = _.range(30)
    .map(d => fecha(-d))

  let base = []
  for (let f of fechas) base.push(await client.lRange(`${id_redis}|${f}`, 0, -1))
  let entradas = _.flatten(base).map(objetificar)

  res.json(entradas)
}

export const semestre = async (req: Request, res: Response) => {
  let fechas = _.range(7*26)
    .map(d => fecha(-d))

  let base = []
  for (let f of fechas) base.push(await client.lRange(`${id_redis}|${f}`, 0, -1))
  let entradas = _.flatten(base).map(objetificar)

  res.json(entradas)
}
