import { equiposDB, guardarEquiposDB, type Equipo } from './data'

export default defineEventHandler(async (event) => {
  const body = await readBody<Omit<Equipo, 'id'>>(event)

  const nuevoEquipo: Equipo = {
    ...body,
    id: String(Date.now()),
    cantidad: Number(body.cantidad),
  }

  equiposDB.push(nuevoEquipo)
  guardarEquiposDB()
  return nuevoEquipo
})
