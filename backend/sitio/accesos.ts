import { rpush } from './redisclient'
import { Request, Response, NextFunction } from 'express';

export const fecha = (dd = 0) => {
    let hoy = new Date()
    hoy.setDate(hoy.getDate() + dd)
    return hoy.toISOString().split('T')[0]
}

export const tiempo = (dh = 0) => {
    let ahora = new Date()
    ahora.setHours(ahora.getHours() + dh)
    return ahora.toISOString().split('T')[1].split('.')[0]
}

export const momento = (dh = 0) => {
    let ahora = new Date()
    ahora.setHours(ahora.getHours() + dh)
    return ahora
}

export const logaccess = (origen: string, recurso: string) => {
    rpush(`esde|${fecha()}`, `${Date.now()}|${origen}|${recurso}`)
}
