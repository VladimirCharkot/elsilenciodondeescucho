const { promisify } = require("util")
const redis = require("redis")
const client = redis.createClient()


client.on('connect', () => {
  console.log('Redis conectado!')
})

client.on('error', (err) => {
  console.error('Error conectando Redis:')
  console.error(err)
})

client.connect()

exports.client = client
exports.get = promisify(client.get).bind(client)
exports.set = promisify(client.set).bind(client)
exports.incr = promisify(client.incr).bind(client)
exports.decr = promisify(client.decr).bind(client)
exports.exists = promisify(client.exists).bind(client)
exports.rpush = promisify(client.rPush).bind(client)
exports.lrange = promisify(client.lRange).bind(client)
