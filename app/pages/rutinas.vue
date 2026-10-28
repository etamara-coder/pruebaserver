<script setup lang="ts">
import RutinasFiltro from '~/components/rutinas/Filtro.vue'
import RutinasFormulario from '~/components/rutinas/Formulario.vue'
import RutinasListado from '~/components/rutinas/Listado.vue'
import type { NuevaRutina, Rutina } from '~/stores/rutinas'
import { useRutinasStore } from '~/stores/rutinas'

const store = useRutinasStore()

const busqueda = ref('')
const dialogoAbierto = ref(false)
const dialogoEliminar = ref(false)
const rutinaAEliminar = ref<Rutina | null>(null)
const snackbar = ref(false)
const mensaje = ref('')
const colorMensaje = ref<'success' | 'error'>('success')

const rutinasFiltradas = computed(() => {
  const termino = (busqueda.value ?? '').trim().toLowerCase()

  if (!termino) {
    return store.rutinas
  }

  return store.rutinas.filter((rutina) =>
    [rutina.nombre, rutina.descripcion, rutina.nivel, rutina.entrenador].some((valor) =>
      valor.toLowerCase().includes(termino),
    ),
  )
})

const totalEntrenadores = computed(
  () => new Set(store.rutinas.map((rutina) => rutina.entrenador)).size,
)

onMounted(() => {
  void store.cargarRutinas().catch(() => undefined)
})

function mostrarMensaje(texto: string, color: 'success' | 'error') {
  mensaje.value = texto
  colorMensaje.value = color
  snackbar.value = true
}

async function guardarRutina(datos: NuevaRutina) {
  try {
    await store.crearRutina(datos)
    dialogoAbierto.value = false
    mostrarMensaje('Rutina registrada correctamente.', 'success')
  } catch {
    mostrarMensaje(store.error ?? 'No se pudo registrar la rutina.', 'error')
  }
}

function pedirConfirmacion(rutina: Rutina) {
  rutinaAEliminar.value = rutina
  dialogoEliminar.value = true
}

async function confirmarEliminacion() {
  const rutina = rutinaAEliminar.value

  if (!rutina) {
    return
  }

  try {
    await store.eliminarRutina(rutina.id)
    mostrarMensaje(`Rutina "${rutina.nombre}" eliminada.`, 'success')
  } catch {
    mostrarMensaje(store.error ?? 'No se pudo eliminar la rutina.', 'error')
  } finally {
    dialogoEliminar.value = false
  }
}
</script>

<template>
  <div>
    <div class="d-flex flex-wrap align-center justify-space-between ga-4 mb-6">
      <div>
        <div class="text-overline text-primary">Módulo 2</div>
        <h1 class="text-h4 font-weight-bold mb-1">Rutinas y Ejercicios</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          Organiza los planes de entrenamiento y sus responsables.
        </p>
      </div>

      <v-btn color="primary" prepend-icon="mdi-plus" size="large" @click="dialogoAbierto = true">
        Nueva rutina
      </v-btn>
    </div>

    <v-row class="mb-4">
      <v-col cols="12" sm="4">
        <v-card color="primary" rounded="lg" variant="tonal">
          <v-card-text>
            <div class="text-caption text-medium-emphasis">Total de rutinas</div>
            <div class="text-h4 font-weight-bold">{{ store.totalRutinas }}</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card color="success" rounded="lg" variant="tonal">
          <v-card-text>
            <div class="text-caption text-medium-emphasis">Rutinas activas</div>
            <div class="text-h4 font-weight-bold">{{ store.rutinasActivas }}</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card color="teal" rounded="lg" variant="tonal">
          <v-card-text>
            <div class="text-caption text-medium-emphasis">Entrenadores asignados</div>
            <div class="text-h4 font-weight-bold">{{ totalEntrenadores }}</div>
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
            <div class="text-h6 font-weight-bold">Catálogo de rutinas</div>
            <div class="text-caption text-medium-emphasis">
              Filtra por nombre, nivel, descripción o entrenador.
            </div>
          </div>
          <v-chip color="primary" size="small" variant="tonal">
            {{ rutinasFiltradas.length }} resultados
          </v-chip>
        </div>

        <RutinasFiltro v-model="busqueda" />
      </v-card-text>
    </v-card>

    <v-progress-linear v-if="store.cargando" class="mb-4 rounded" color="primary" indeterminate />

    <RutinasListado v-else :rutinas="rutinasFiltradas" @eliminar="pedirConfirmacion" />

    <v-dialog v-model="dialogoAbierto" max-width="680" persistent scrollable>
      <RutinasFormulario
        v-if="dialogoAbierto"
        :cargando="store.guardando"
        @guardar="guardarRutina"
        @cancelar="dialogoAbierto = false"
      />
    </v-dialog>

    <v-dialog v-model="dialogoEliminar" max-width="420" persistent>
      <v-card rounded="lg">
        <v-card-item>
          <v-card-title>Eliminar rutina</v-card-title>
        </v-card-item>

        <v-card-text>
          ¿Seguro que quieres eliminar <strong>{{ rutinaAEliminar?.nombre }}</strong>?
          Esta acción no se puede deshacer.
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn :disabled="store.eliminando" variant="text" @click="dialogoEliminar = false">
            Cancelar
          </v-btn>
          <v-btn
            color="error"
            :loading="store.eliminando"
            prepend-icon="mdi-delete-outline"
            variant="flat"
            @click="confirmarEliminacion"
          >
            Eliminar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" :color="colorMensaje" :timeout="3500">
      {{ mensaje }}
      <template #actions>
        <v-btn variant="text" @click="snackbar = false">Cerrar</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>