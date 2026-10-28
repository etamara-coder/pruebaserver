// PATCH /api/rutinas/:id  (cambia solo los campos enviados)
import { createError, readBody } from 'h3'
import type { NuevaRutina } from '../../types/rutina'
import { guardarRutinas } from '../../utils/guardarRutinas'
import { buscarRutina, validarRutina } from '../../utils/rutinas'

export default defineEventHandler(async (event) => {
  const { rutina } = buscarRutina(event)
  const body = (await readBody<Partial<NuevaRutina> | null>(event)) ?? {}
  const cambios = validarRutina(body, true)

  if (Object.keys(cambios).length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No se envió ningún campo para actualizar' })
  }

  Object.assign(rutina, cambios)
  guardarRutinas()

  return rutina
})