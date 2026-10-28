export type NivelRutina = 'Principiante' | 'Intermedio' | 'Avanzado'

export interface Rutina {
  id: string
  nombre: string
  descripcion: string
  nivel: NivelRutina
  duracionMinutos: number
  entrenador: string
  activa: boolean
}

export type NuevaRutina = Omit<Rutina, 'id'>
