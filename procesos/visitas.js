const express = require('express')
const router = express.Router()

const _ = require('lodash')

const redis = require('./redisclient')
const { fecha, hora } = require('./accesos')

// id con el que se está logueando en redis
const id_redis = 'esde'

exports.visor = async (req, res) => {
  res.render('visitas', {titulo: 'Visitas al sitio'})
}

let objetificar = (linea) => {
  let [t, ip, path] = linea.split('|')
  return {t, ip, path}
}

exports.hora = async (req, res) => {
  let t = Date.now()

  let hoy = await redis.client.lRange(`${id_redis}|${fecha()}`, 0, -1)
  let ayer = await redis.client.lRange(`${id_redis}|${fecha(-1)}`, 0, -1)
  let entradas = hoy.map(objetificar).concat(ayer.map(objetificar))

  let dos_horas_antes = t - 1000 * 60 * 60 * 2
  let ultimas_dos_horas = entradas.filter(e => e.t > dos_horas_antes)

  res.json(ultimas_dos_horas)
}

exports.dia = async (req, res) => {
  let hoy = await redis.client.lRange(`${id_redis}|${fecha()}`, 0, -1)
  let ayer = await redis.client.lRange(`${id_redis}|${fecha(-1)}`, 0, -1)
  let entradas = hoy.map(objetificar).concat(ayer.map(objetificar).filter(e => e.t > Date.now() - 24 * 60 * 60 * 1000))

  res.json(entradas)
}

exports.semana = async (req, res) => {
  let fechas = _.range(7)
    .map(d => fecha(-d))

  let base = []
  for (let f of fechas) base.push(await redis.client.lRange(`${id_redis}|${f}`, 0, -1))
  let entradas = _.flatten(base).map(objetificar)

  res.json(entradas)
}

exports.mes = async (req, res) => {
  let fechas = _.range(30)
    .map(d => fecha(-d))

  let base = []
  for (let f of fechas) base.push(await redis.client.lRange(`${id_redis}|${f}`, 0, -1))
  let entradas = _.flatten(base).map(objetificar)

  res.json(entradas)
}

exports.semestre = async (req, res) => {
  let fechas = _.range(7*26)
    .map(d => fecha(-d))

  let base = []
  for (let f of fechas) base.push(await redis.client.lRange(`${id_redis}|${f}`, 0, -1))
  let entradas = _.flatten(base).map(objetificar)

  res.json(entradas)
}
