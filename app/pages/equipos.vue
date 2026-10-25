<script setup lang="ts">
import EquiposFiltro from '~/components/equipos/Filtro.vue'
import EquiposFormulario from '~/components/equipos/Formulario.vue'
import EquiposListado from '~/components/equipos/Listado.vue'
import type { NuevoEquipo } from '~/stores/equipos'
import { useEquiposStore } from '~/stores/equipos'

const store = useEquiposStore()

const busqueda = ref('')
const dialogoAbierto = ref(false)
const snackbar = ref(false)
const mensaje = ref('')
const colorMensaje = ref<'success' | 'error'>('success')

const equiposFiltrados = computed(() => {
  const termino = (busqueda.value ?? '').trim().toLowerCase()

  if (!termino) {
    return store.equipos
  }

  return store.equipos.filter((equipo) =>
    [equipo.nombre, equipo.categoria, equipo.estado].some((valor) =>
      valor.toLowerCase().includes(termino),
    ),
  )
})

onMounted(() => {
  void store.cargarEquipos().catch(() => undefined)
})

function mostrarMensaje(texto: string, color: 'success' | 'error') {
  mensaje.value = texto
  colorMensaje.value = color
  snackbar.value = true
}

async function guardarEquipo(datos: NuevoEquipo) {
  try {
    await store.crearEquipo(datos)
    dialogoAbierto.value = false
    mostrarMensaje('Equipo registrado correctamente.', 'success')
  } catch {
    mostrarMensaje(store.error ?? 'No se pudo registrar el equipo.', 'error')
  }
}
</script>

<template>
  <div>
    <div class="d-flex flex-wrap align-center justify-space-between ga-4 mb-6">
      <div>
        <div class="text-overline text-primary">Módulo 3</div>
        <h1 class="text-h4 font-weight-bold mb-1">Inventario de Máquinas</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          Controla existencias, disponibilidad y mantenimiento de los equipos.
        </p>
      </div>

      <v-btn color="primary" prepend-icon="mdi-plus" size="large" @click="dialogoAbierto = true">
        Nuevo equipo
      </v-btn>
    </div>

    <v-row class="mb-4">
      <v-col cols="12" sm="4">
        <v-card color="primary" rounded="lg" variant="tonal">
          <v-card-text>
            <div class="text-caption text-medium-emphasis">Unidades totales</div>
            <div class="text-h4 font-weight-bold">{{ store.totalUnidades }}</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card color="success" rounded="lg" variant="tonal">
          <v-card-text>
            <div class="text-caption text-medium-emphasis">Unidades disponibles</div>
            <div class="text-h4 font-weight-bold">{{ store.unidadesDisponibles }}</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card color="warning" rounded="lg" variant="tonal">
          <v-card-text>
            <div class="text-caption text-medium-emphasis">Equipos en mantenimiento</div>
            <div class="text-h4 font-weight-bold">{{ store.equiposEnMantenimiento }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-alert
      v-if="store.error"
      class="mb-4"
      color="error"
      icon="mdi-alert-circle-outline"
      variant="tonal"
    >
      {{ store.error }}
    </v-alert>

    <v-card class="mb-5" rounded="lg">
      <v-card-text class="pa-5">
        <div class="d-flex flex-wrap align-center justify-space-between ga-3 mb-4">
          <div>
            <div class="text-h6 font-weight-bold">Inventario general</div>
            <div class="text-caption text-medium-emphasis">
              Busca por equipo, categoría o estado operativo.
            </div>
          </div>
          <v-chip color="primary" size="small" variant="tonal">
            {{ equiposFiltrados.length }} resultados
          </v-chip>
        </div>

        <EquiposFiltro v-model="busqueda" />
      </v-card-text>
    </v-card>

    <v-progress-linear v-if="store.cargando" class="mb-4 rounded" color="primary" indeterminate />

    <EquiposListado v-else :equipos="equiposFiltrados" />

    <v-dialog v-model="dialogoAbierto" max-width="680" persistent scrollable>
      <EquiposFormulario
        v-if="dialogoAbierto"
        :cargando="store.guardando"
        @guardar="guardarEquipo"
        @cancelar="dialogoAbierto = false"
      />
    </v-dialog>

    <v-snackbar v-model="snackbar" :color="colorMensaje" :timeout="3500">
      {{ mensaje }}
      <template #actions>
        <v-btn variant="text" @click="snackbar = false">Cerrar</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
