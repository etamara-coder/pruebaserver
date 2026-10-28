import { mkdirSync, renameSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { rutinas } from '../data/rutinas'

// Archivo donde se guardan las rutinas para que no se pierdan al reiniciar el servidor.
// La carpeta .data está en el .gitignore y Nuxt no la vigila (guardar aquí no reinicia nada).
export const archivoRutinas = join(process.cwd(), '.data', 'rutinas.json')

/** Escribe en disco la lista actual de rutinas. Se llama después de crear, cambiar o borrar. */
export function guardarRutinas() {
  mkdirSync(dirname(archivoRutinas), { recursive: true })

  // Se escribe primero en un temporal y luego se renombra, para no dejar el archivo a medias.
  const temporal = `${archivoRutinas}.tmp`
  writeFileSync(temporal, JSON.stringify(rutinas, null, 2), 'utf-8')
  renameSync(temporal, archivoRutinas)
}