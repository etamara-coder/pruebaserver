import { equiposDB, guardarEquiposDB } from './data'

export default defineEventHandler(async (event) => {
  // Acepta el id por query (?id=3) o en el body ({ id: '3' })
  const query = getQuery(event)
  const body = query.id === undefined ? await readBody<{ id?: string } | null>(event) : null
  const id = query.id ?? body?.id

  const indice = equiposDB.findIndex((e) => String(e.id) === String(id))


  if (indice === -1) {
    throw createError({ statusCode: 404, statusMessage: `Equipo con id ${id} no encontrado` })
  }

  const [eliminado] = equiposDB.splice(indice, 1)
  guardarEquiposDB()
  return eliminado
})
