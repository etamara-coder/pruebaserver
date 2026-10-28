import { existsSync, readFileSync } from 'node:fs'
import { rutinas } from '../data/rutinas'
import type { Rutina } from '../types/rutina'
import { archivoRutinas } from '../utils/guardarRutinas'

// Se ejecuta una vez cuando arranca el servidor: si ya hay rutinas guardadas en
// .data/rutinas.json, reemplaza los datos de ejemplo por ellas.
export default defineNitroPlugin(() => {
  if (!existsSync(archivoRutinas)) {
    return
  }

  try {
    const guardadas = JSON.parse(readFileSync(archivoRutinas, 'utf-8')) as Rutina[]

    if (Array.isArray(guardadas)) {
      rutinas.splice(0, rutinas.length, ...guardadas)
    }
  } catch {
    // Si el archivo está dañado se siguen usando los datos de ejemplo.
  }
})