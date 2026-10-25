import { randomUUID } from 'node:crypto'
import { createError, getMethod, readBody, setResponseStatus } from 'h3'

type EstadoEquipo = 'Disponible' | 'En mantenimiento' | 'Fuera de servicio'

interface Equipo {
  id: string
  nombre: string
  categoria: string
  cantidad: number
  estado: EstadoEquipo
  fechaAdquisicion: string
}

type NuevoEquipo = Omit<Equipo, 'id'>

const estadosValidos: EstadoEquipo[] = ['Disponible', 'En mantenimiento', 'Fuera de servicio']

let equipos: Equipo[] = [
  {
    id: 'eq-001',
    nombre: 'Caminadora profesional',
    categoria: 'Cardio',
    cantidad: 6,
    estado: 'Disponible',
    fechaAdquisicion: '2025-03-12',
  },
  {
    id: 'eq-002',
    nombre: 'Juego de mancuernas 5-50 kg',
    categoria: 'Peso libre',
    cantidad: 10,
    estado: 'Disponible',
    fechaAdquisicion: '2025-05-20',
  },
  {
    id: 'eq-003',
    nombre: 'Banca de press inclinada',
    categoria: 'Fuerza',
    cantidad: 3,
    estado: 'En mantenimiento',
    fechaAdquisicion: '2024-11-08',
  },
  {
    id: 'eq-004',
    nombre: 'Elíptica',
    categoria: 'Cardio',
    cantidad: 2,
    estado: 'Fuera de servicio',
    fechaAdquisicion: '2024-02-16',
  },
  {
    id: 'eq-005',
    nombre: 'Rack de sentadillas',
    categoria: 'Fuerza',
    cantidad: 4,
    estado: 'Disponible',
    fechaAdquisicion: '2025-08-30',
  },
]

export default defineEventHandler(async (event) => {
  const metodo = getMethod(event)

  if (metodo === 'GET') {
    return equipos
  }

  if (metodo !== 'POST') {
    throw createError({ statusCode: 405, statusMessage: 'Método no permitido' })
  }

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
