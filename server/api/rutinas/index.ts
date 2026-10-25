import { randomUUID } from 'node:crypto'
import { createError, getMethod, readBody, setResponseStatus } from 'h3'

type NivelRutina = 'Principiante' | 'Intermedio' | 'Avanzado'

interface Rutina {
  id: string
  nombre: string
  descripcion: string
  nivel: NivelRutina
  duracionMinutos: number
  entrenador: string
  activa: boolean
}

type NuevaRutina = Omit<Rutina, 'id'>

const nivelesValidos: NivelRutina[] = ['Principiante', 'Intermedio', 'Avanzado']

let rutinas: Rutina[] = [
  {
    id: 'rut-001',
    nombre: 'Full Body Inicial',
    descripcion: 'Circuito de fuerza y acondicionamiento para quienes inician su proceso.',
    nivel: 'Principiante',
    duracionMinutos: 45,
    entrenador: 'Laura Gómez',
    activa: true,
  },
  {
    id: 'rut-002',
    nombre: 'Hipertrofia Superior',
    descripcion: 'Trabajo enfocado en pecho, espalda, hombros y brazos.',
    nivel: 'Intermedio',
    duracionMinutos: 60,
    entrenador: 'Andrés Mejía',
    activa: true,
  },
  {
    id: 'rut-003',
    nombre: 'HIIT Quema Calorías',
    descripcion: 'Intervalos de alta intensidad con ejercicios funcionales.',
    nivel: 'Avanzado',
    duracionMinutos: 30,
    entrenador: 'Laura Gómez',
    activa: true,
  },
  {
    id: 'rut-004',
    nombre: 'Movilidad y Recuperación',
    descripcion: 'Sesión de movilidad articular, estiramientos y respiración.',
    nivel: 'Principiante',
    duracionMinutos: 35,
    entrenador: 'Sofía Herrera',
    activa: false,
  },
]

export default defineEventHandler(async (event) => {
  const metodo = getMethod(event)

  if (metodo === 'GET') {
    return rutinas
  }

  if (metodo !== 'POST') {
    throw createError({ statusCode: 405, statusMessage: 'Método no permitido' })
  }

  const body = (await readBody<Partial<NuevaRutina> | null>(event)) ?? {}
  const nombre = body.nombre?.trim() ?? ''
  const descripcion = body.descripcion?.trim() ?? ''
  const nivel = body.nivel
  const duracionMinutos = Number(body.duracionMinutos)
  const entrenador = body.entrenador?.trim() ?? ''

  if (!nombre || nombre.length < 3) {
    throw createError({ statusCode: 400, statusMessage: 'El nombre debe tener al menos 3 caracteres' })
  }

  if (!descripcion || descripcion.length < 10) {
    throw createError({ statusCode: 400, statusMessage: 'La descripción debe tener al menos 10 caracteres' })
  }

  if (!nivel || !nivelesValidos.includes(nivel)) {
    throw createError({ statusCode: 400, statusMessage: 'El nivel de la rutina no es válido' })
  }

  if (!Number.isInteger(duracionMinutos) || duracionMinutos <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'La duración debe ser un número entero mayor que cero' })
  }

  if (!entrenador || entrenador.length < 3) {
    throw createError({ statusCode: 400, statusMessage: 'El nombre del entrenador es obligatorio' })
  }

  const nuevaRutina: Rutina = {
    id: randomUUID(),
    nombre,
    descripcion,
    nivel,
    duracionMinutos,
    entrenador,
    activa: body.activa ?? true,
  }

  rutinas.push(nuevaRutina)
  setResponseStatus(event, 201)

  return nuevaRutina
})
