export type Membresia = 'Mensual' | 'Trimestral' | 'Anual'

export interface Socio {
  id: string
  nombre: string
  email: string
  telefono: string
  membresia: Membresia
  fechaInicio: string
  activo: boolean
}

export type NuevoSocio = Omit<Socio, 'id'>
