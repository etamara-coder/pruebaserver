export type EstadoEquipo = 'Disponible' | 'En mantenimiento' | 'Fuera de servicio'

export interface Equipo {
  id: string
  nombre: string
  categoria: string
  cantidad: number
  estado: EstadoEquipo
  fechaAdquisicion: string
}

export type NuevoEquipo = Omit<Equipo, 'id'>
