import { defineStore } from 'pinia'
import { mensajeErrorApi } from '~/utils/api'

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

interface SociosState {
  socios: Socio[]
  cargando: boolean
  guardando: boolean
  error: string | null
}

export const useSociosStore = defineStore('socios', {
  state: (): SociosState => ({
    socios: [],
    cargando: false,
    guardando: false,
    error: null,
  }),

  getters: {
    totalSocios: (state) => state.socios.length,
    sociosActivos: (state) => state.socios.filter((socio) => socio.activo).length,
    sociosInactivos: (state) => state.socios.filter((socio) => !socio.activo).length,
  },

  actions: {
    async cargarSocios() {
      this.cargando = true
      this.error = null

      try {
        this.socios = await $fetch<Socio[]>('/api/socios')
      } catch (error) {
        this.error = mensajeErrorApi(error, 'No se pudieron cargar los socios.')
        throw error
      } finally {
        this.cargando = false
      }
    },

    async crearSocio(datos: NuevoSocio) {
      this.guardando = true
      this.error = null

      try {
        const socio = await $fetch<Socio>('/api/socios', {
          method: 'POST',
          body: datos,
        })

        this.socios.push(socio)
        return socio
      } catch (error) {
        this.error = mensajeErrorApi(error, 'No se pudo registrar el socio.')
        throw error
      } finally {
        this.guardando = false
      }
    },
  },
})
