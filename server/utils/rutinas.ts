import { createError, getRouterParam } from 'h3'
import type { H3Event } from 'h3'
import { rutinas } from '../data/rutinas'
import type { NivelRutina, NuevaRutina, Rutina } from '../types/rutina'

const nivelesValidos: NivelRutina[] = ['Principiante', 'Intermedio', 'Avanzado']

function errorDeValidacion(mensaje: string) {
  return createError({ statusCode: 400, statusMessage: mensaje })
}

/**
 * Busca la rutina indicada en la ruta (/api/rutinas/:id).
 * Si no existe responde 404. Lo usan [id].get, [id].put, [id].patch y [id].delete.
 */
export function buscarRutina(event: H3Event): { rutina: Rutina; indice: number } {
  const id = getRouterParam(event, 'id')
  const indice = rutinas.findIndex((rutina) => rutina.id === id)
  const rutina = rutinas[indice]

  if (!rutina) {
    throw createError({ statusCode: 404, statusMessage: 'Rutina no encontrada' })
  }

  return { rutina, indice }
}

/**
 * Valida y limpia los datos de una rutina.
 * - parcial = false (POST y PUT): todos los campos son obligatorios.
 * - parcial = true (PATCH): solo se validan los campos que vienen en el cuerpo.
 */
export function validarRutina(body: Partial<NuevaRutina>, parcial = false): Partial<NuevaRutina> {
  const datos: Partial<NuevaRutina> = {}
  const aplica = (campo: keyof NuevaRutina) => !parcial || body[campo] !== undefined

  if (aplica('nombre')) {
    const nombre = body.nombre?.trim() ?? ''
    if (nombre.length < 3) {
      throw errorDeValidacion('El nombre debe tener al menos 3 caracteres')
    }
    datos.nombre = nombre
  }

  if (aplica('descripcion')) {
    const descripcion = body.descripcion?.trim() ?? ''
    if (descripcion.length < 10) {
      throw errorDeValidacion('La descripción debe tener al menos 10 caracteres')
    }
    datos.descripcion = descripcion
  }

  if (aplica('nivel')) {
    const nivel = body.nivel
    if (!nivel || !nivelesValidos.includes(nivel)) {
      throw errorDeValidacion('El nivel de la rutina no es válido')
    }
    datos.nivel = nivel
  }

  if (aplica('duracionMinutos')) {
    const duracionMinutos = Number(body.duracionMinutos)
    if (!Number.isInteger(duracionMinutos) || duracionMinutos <= 0) {
      throw errorDeValidacion('La duración debe ser un número entero mayor que cero')
    }
    datos.duracionMinutos = duracionMinutos
  }

  if (aplica('entrenador')) {
    const entrenador = body.entrenador?.trim() ?? ''
    if (entrenador.length < 3) {
      throw errorDeValidacion('El nombre del entrenador es obligatorio')
    }
    datos.entrenador = entrenador
  }

  if (body.activa !== undefined) {
    if (typeof body.activa !== 'boolean') {
      throw errorDeValidacion('El campo activa debe ser verdadero o falso')
    }
    datos.activa = body.activa
  } else if (!parcial) {
    datos.activa = true
  }

  return datos
}