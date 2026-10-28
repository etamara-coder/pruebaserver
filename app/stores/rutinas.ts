import { defineStore } from 'pinia'
import { mensajeErrorApi } from '~/utils/api'

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

interface RutinasState {
  rutinas: Rutina[]
  cargando: boolean
  guardando: boolean
  eliminando: boolean
  error: string | null
}

export const useRutinasStore = defineStore('rutinas', {
  state: (): RutinasState => ({
    rutinas: [],
    cargando: false,
    guardando: false,
    eliminando: false,
    error: null,
  }),

  getters: {
    totalRutinas: (state) => state.rutinas.length,
    rutinasActivas: (state) => state.rutinas.filter((rutina) => rutina.activa).length,
  },

  actions: {
    async cargarRutinas() {
      this.cargando = true
      this.error = null

      try {
        this.rutinas = await $fetch<Rutina[]>('/api/rutinas')
      } catch (error) {
        this.error = mensajeErrorApi(error, 'No se pudieron cargar las rutinas.')
        throw error
      } finally {
        this.cargando = false
      }
    },

    async crearRutina(datos: NuevaRutina) {
      this.guardando = true
      this.error = null

      try {
        const rutina = await $fetch<Rutina>('/api/rutinas', {
          method: 'POST',
          body: datos,
        })

        this.rutinas.push(rutina)
        return rutina
      } catch (error) {
        this.error = mensajeErrorApi(error, 'No se pudo registrar la rutina.')
        throw error
      } finally {
        this.guardando = false
      }
    },

    async eliminarRutina(id: string) {
      this.eliminando = true
      this.error = null

      try {
        await $fetch(`/api/rutinas/${id}`, { method: 'DELETE' })

        this.rutinas = this.rutinas.filter((rutina) => rutina.id !== id)
      } catch (error) {
        this.error = mensajeErrorApi(error, 'No se pudo eliminar la rutina.')
        throw error
      } finally {
        this.eliminando = false
      }
    },
  },
})