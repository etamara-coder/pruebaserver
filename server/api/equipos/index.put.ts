import { equiposDB, guardarEquiposDB, type Equipo } from './data'

export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<Equipo> & { id: string }>(event)
  const id = body?.id

  const equipo = equiposDB.find((e) => String(e.id) === String(id))

  if (!equipo) {
    throw createError({ statusCode: 404, statusMessage: `Equipo con id ${id} no encontrado` })
  }

  // Actualiza el estado (y cualquier otro campo enviado), sin permitir cambiar el id
  const { id: _id, ...cambios } = body
  Object.assign(equipo, cambios)
  guardarEquiposDB()
  return equipo
})
