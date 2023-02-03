import { promisify } from 'util'
import { createClient } from 'redis'

export const client = createClient()

client.on('connect', () => {
  console.log('Redis conectado!')
})

client.on('error', (err) => {
  console.error('Error conectando Redis:')
  console.error(err)
})

client.connect()

export const get = promisify(client.get).bind(client)
export const set = promisify(client.set).bind(client)
export const incr = promisify(client.incr).bind(client)
export const decr = promisify(client.decr).bind(client)
export const exists = promisify(client.exists).bind(client)
export const rpush = promisify(client.rPush).bind(client)
export const lrange = promisify(client.lRange).bind(client)
