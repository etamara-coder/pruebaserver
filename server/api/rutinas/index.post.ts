// POST /api/rutinas
import { randomUUID } from 'node:crypto'
import { readBody, setResponseStatus } from 'h3'
import { rutinas } from '../../data/rutinas'
import type { NuevaRutina, Rutina } from '../../types/rutina'
import { guardarRutinas } from '../../utils/guardarRutinas'
import { validarRutina } from '../../utils/rutinas'

export default defineEventHandler(async (event) => {
  const body = (await readBody<Partial<NuevaRutina> | null>(event)) ?? {}
  const datos = validarRutina(body) as NuevaRutina

  const nuevaRutina: Rutina = { id: randomUUID(), ...datos }

  rutinas.push(nuevaRutina)
  guardarRutinas()
  setResponseStatus(event, 201)

  return nuevaRutina
})