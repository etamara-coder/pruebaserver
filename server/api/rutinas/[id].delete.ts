// DELETE /api/rutinas/:id
import { createError, getRouterParam, setResponseStatus } from 'h3'
import { rutinas } from '../../data/rutinas'
import { guardarRutinas } from '../../utils/guardarRutinas'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  const indice = rutinas.findIndex((rutina) => rutina.id === id)

  if (indice === -1) {
    throw createError({ statusCode: 404, statusMessage: 'Rutina no encontrada' })
  }

  rutinas.splice(indice, 1)
  guardarRutinas()
  setResponseStatus(event, 204)

  return null
})