import { randomUUID } from 'node:crypto'
import { createError, readBody, setResponseStatus } from 'h3'
import { equipos } from '../../data/equipos'
import type { Equipo, EstadoEquipo, NuevoEquipo } from '../../types/equipo'

const estadosValidos: EstadoEquipo[] = ['Disponible', 'En mantenimiento', 'Fuera de servicio']

export default defineEventHandler(async (event) => {
  const body = (await readBody<Partial<NuevoEquipo> | null>(event)) ?? {}
  const nombre = body.nombre?.trim() ?? ''
  const categoria = body.categoria?.trim() ?? ''
  const cantidad = Number(body.cantidad)
  const estado = body.estado
  const fechaAdquisicion = body.fechaAdquisicion ?? ''

  if (!nombre || nombre.length < 3) {
    throw createError({ statusCode: 400, statusMessage: 'El nombre debe tener al menos 3 caracteres' })
  }

  if (!categoria || categoria.length < 3) {
    throw createError({ statusCode: 400, statusMessage: 'La categoría es obligatoria' })
  }

  if (!Number.isInteger(cantidad) || cantidad <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'La cantidad debe ser un número entero mayor que cero' })
  }

  if (!estado || !estadosValidos.includes(estado)) {
    throw createError({ statusCode: 400, statusMessage: 'El estado del equipo no es válido' })
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaAdquisicion)) {
    throw createError({ statusCode: 400, statusMessage: 'La fecha de adquisición no es válida' })
  }

  const nuevoEquipo: Equipo = {
    id: randomUUID(),
    nombre,
    categoria,
    cantidad,
    estado,
    fechaAdquisicion,
  }

  equipos.push(nuevoEquipo)
  setResponseStatus(event, 201)

  return nuevoEquipo
})
