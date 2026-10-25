import { defineStore } from 'pinia'
import { mensajeErrorApi } from '~/utils/api'

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

interface EquiposState {
  equipos: Equipo[]
  cargando: boolean
  guardando: boolean
  error: string | null
}

export const useEquiposStore = defineStore('equipos', {
  state: (): EquiposState => ({
    equipos: [],
    cargando: false,
    guardando: false,
    error: null,
  }),

  getters: {
    totalEquipos: (state) => state.equipos.length,
    totalUnidades: (state) => state.equipos.reduce((total, equipo) => total + equipo.cantidad, 0),
    unidadesDisponibles: (state) =>
      state.equipos
        .filter((equipo) => equipo.estado === 'Disponible')
        .reduce((total, equipo) => total + equipo.cantidad, 0),
    equiposEnMantenimiento: (state) =>
      state.equipos.filter((equipo) => equipo.estado === 'En mantenimiento').length,
  },

  actions: {
    async cargarEquipos() {
      this.cargando = true
      this.error = null

      try {
        this.equipos = await $fetch<Equipo[]>('/api/equipos')
      } catch (error) {
        this.error = mensajeErrorApi(error, 'No se pudo cargar el inventario de equipos.')
        throw error
      } finally {
        this.cargando = false
      }
    },

    async crearEquipo(datos: NuevoEquipo) {
      this.guardando = true
      this.error = null

      try {
        const equipo = await $fetch<Equipo>('/api/equipos', {
          method: 'POST',
          body: datos,
        })

        this.equipos.push(equipo)
        return equipo
      } catch (error) {
        this.error = mensajeErrorApi(error, 'No se pudo registrar el equipo.')
        throw error
      } finally {
        this.guardando = false
      }
    },
  },
})
