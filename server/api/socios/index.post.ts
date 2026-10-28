import { randomUUID } from 'node:crypto'
import { createError, readBody, setResponseStatus } from 'h3'
import { socios } from '../../data/socios'
import type { Membresia, NuevoSocio, Socio } from '../../types/socio'

const membresiasValidas: Membresia[] = ['Mensual', 'Trimestral', 'Anual']
const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default defineEventHandler(async (event) => {
  const body = (await readBody<Partial<NuevoSocio> | null>(event)) ?? {}
  const nombre = body.nombre?.trim() ?? ''
  const email = body.email?.trim().toLowerCase() ?? ''
  const telefono = body.telefono?.trim() ?? ''
  const membresia = body.membresia
  const fechaInicio = body.fechaInicio ?? ''

  if (!nombre || nombre.length < 3) {
    throw createError({ statusCode: 400, statusMessage: 'El nombre debe tener al menos 3 caracteres' })
  }

  if (!emailValido.test(email)) {
    throw createError({ statusCode: 400, statusMessage: 'El correo electrónico no es válido' })
  }

  if (telefono.replace(/\D/g, '').length < 7) {
    throw createError({ statusCode: 400, statusMessage: 'El teléfono debe tener al menos 7 dígitos' })
  }

  if (!membresia || !membresiasValidas.includes(membresia)) {
    throw createError({ statusCode: 400, statusMessage: 'El tipo de membresía no es válido' })
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaInicio)) {
    throw createError({ statusCode: 400, statusMessage: 'La fecha de inicio no es válida' })
  }

  if (socios.some((socio) => socio.email.toLowerCase() === email)) {
    throw createError({ statusCode: 409, statusMessage: 'Ya existe un socio con ese correo electrónico' })
  }

  const nuevoSocio: Socio = {
    id: randomUUID(),
    nombre,
    email,
    telefono,
    membresia,
    fechaInicio,
    activo: body.activo ?? true,
  }

  socios.push(nuevoSocio)
  setResponseStatus(event, 201)

  return nuevoSocio
})
