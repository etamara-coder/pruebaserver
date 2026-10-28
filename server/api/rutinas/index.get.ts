// GET /api/rutinas
import { rutinas } from '../../data/rutinas'

export default defineEventHandler(() => {
  return rutinas
})
