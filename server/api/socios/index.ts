import { randomUUID } from 'node:crypto'
import { createError, getMethod, readBody, setResponseStatus } from 'h3'

type Membresia = 'Mensual' | 'Trimestral' | 'Anual'

interface Socio {
  id: string
  nombre: string
  email: string
  telefono: string
  membresia: Membresia
  fechaInicio: string
  activo: boolean
}

type NuevoSocio = Omit<Socio, 'id'>

const membresiasValidas: Membresia[] = ['Mensual', 'Trimestral', 'Anual']
const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

let socios: Socio[] = [
  {
    id: 'soc-001',
    nombre: 'Ana Torres',
    email: 'ana.torres@fitzone.com',
    telefono: '300 123 4567',
    membresia: 'Anual',
    fechaInicio: '2026-01-15',
    activo: true,
  },
  {
    id: 'soc-002',
    nombre: 'Carlos Ramírez',
    email: 'carlos.ramirez@fitzone.com',
    telefono: '310 555 7890',
    membresia: 'Mensual',
    fechaInicio: '2026-09-01',
    activo: true,
  },
  {
    id: 'soc-003',
    nombre: 'Luisa Fernández',
    email: 'luisa.fernandez@fitzone.com',
    telefono: '320 444 1122',
    membresia: 'Trimestral',
    fechaInicio: '2026-06-10',
    activo: false,
  },
]

export default defineEventHandler(async (event) => {
  const metodo = getMethod(event)

  if (metodo === 'GET') {
    return socios
  }

  if (metodo !== 'POST') {
    throw createError({ statusCode: 405, statusMessage: 'Método no permitido' })
  }

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
