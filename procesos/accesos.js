const redis = require("./redisclient")

let fecha = (dd = 0) => {
  let hoy = new Date()
  hoy.setDate(hoy.getDate() + dd)
  return hoy.toISOString().split('T')[0]
}

let hora = (dh = 0) => {
  let ahora = new Date()
  ahora.setHours(ahora.getHours() + dh)
  return ahora.toISOString().split('T')[1].split('.')[0]
}

let momento = (dh = 0) => {
  let ahora = new Date()
  ahora.setHours(ahora.getHours() + dh)
  return ahora
}

exports.logaccess = (req, res, next) => {
  redis.rpush(`esde|${fecha()}`, `${Date.now()}|${req.ip}|${req.path}`)
  next()
}

exports.fecha = fecha
exports.hora = hora
