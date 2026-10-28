// GET /api/rutinas/:id
import { buscarRutina } from '../../utils/rutinas'

export default defineEventHandler((event) => {
  return buscarRutina(event).rutina
})