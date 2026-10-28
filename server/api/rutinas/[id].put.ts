// PUT /api/rutinas/:id  (reemplaza la rutina completa)
import { readBody } from 'h3'
import { rutinas } from '../../data/rutinas'
import type { NuevaRutina, Rutina } from '../../types/rutina'
import { guardarRutinas } from '../../utils/guardarRutinas'
import { buscarRutina, validarRutina } from '../../utils/rutinas'

export default defineEventHandler(async (event) => {
  const { rutina, indice } = buscarRutina(event)
  const body = (await readBody<Partial<NuevaRutina> | null>(event)) ?? {}
  const datos = validarRutina(body) as NuevaRutina

  const actualizada: Rutina = { id: rutina.id, ...datos }
  rutinas[indice] = actualizada
  guardarRutinas()

  return actualizada
})