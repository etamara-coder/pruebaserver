<script setup lang="ts">
import SociosFiltro from '~/components/socios/Filtro.vue'
import SociosFormulario from '~/components/socios/Formulario.vue'
import SociosListado from '~/components/socios/Listado.vue'
import type { NuevoSocio } from '~/stores/socios'
import { useSociosStore } from '~/stores/socios'

const store = useSociosStore()

const busqueda = ref('')
const dialogoAbierto = ref(false)
const snackbar = ref(false)
const mensaje = ref('')
const colorMensaje = ref<'success' | 'error'>('success')

const sociosFiltrados = computed(() => {
  const termino = (busqueda.value ?? '').trim().toLowerCase()

  if (!termino) {
    return store.socios
  }

  return store.socios.filter((socio) =>
    [socio.nombre, socio.email, socio.telefono, socio.membresia].some((valor) =>
      valor.toLowerCase().includes(termino),
    ),
  )
})

onMounted(() => {
  void store.cargarSocios().catch(() => undefined)
})

function mostrarMensaje(texto: string, color: 'success' | 'error') {
  mensaje.value = texto
  colorMensaje.value = color
  snackbar.value = true
}

async function guardarSocio(datos: NuevoSocio) {
  try {
    await store.crearSocio(datos)
    dialogoAbierto.value = false
    mostrarMensaje('Socio registrado correctamente.', 'success')
  } catch {
    mostrarMensaje(store.error ?? 'No se pudo registrar el socio.', 'error')
  }
}
</script>

<template>
  <div>
    <div class="d-flex flex-wrap align-center justify-space-between ga-4 mb-6">
      <div>
        <div class="text-overline text-primary">Módulo 1</div>
        <h1 class="text-h4 font-weight-bold mb-1">Socios y Membresías</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          Consulta, filtra y registra los socios del gimnasio.
        </p>
      </div>

      <v-btn color="primary" prepend-icon="mdi-account-plus-outline" size="large" @click="dialogoAbierto = true">
        Nuevo socio
      </v-btn>
    </div>

    <v-row class="mb-4">
      <v-col cols="12" sm="4">
        <v-card color="primary" rounded="lg" variant="tonal">
          <v-card-text>
            <div class="text-caption text-medium-emphasis">Total registrados</div>
            <div class="text-h4 font-weight-bold">{{ store.totalSocios }}</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card color="success" rounded="lg" variant="tonal">
          <v-card-text>
            <div class="text-caption text-medium-emphasis">Socios activos</div>
            <div class="text-h4 font-weight-bold">{{ store.sociosActivos }}</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card color="grey" rounded="lg" variant="tonal">
          <v-card-text>
            <div class="text-caption text-medium-emphasis">Socios inactivos</div>
            <div class="text-h4 font-weight-bold">{{ store.sociosInactivos }}</div>
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
            <div class="text-h6 font-weight-bold">Directorio de socios</div>
            <div class="text-caption text-medium-emphasis">
              Busca por cualquier dato de contacto o membresía.
            </div>
          </div>
          <v-chip color="primary" size="small" variant="tonal">
            {{ sociosFiltrados.length }} resultados
          </v-chip>
        </div>

        <SociosFiltro v-model="busqueda" />
      </v-card-text>
    </v-card>

    <v-progress-linear v-if="store.cargando" class="mb-4 rounded" color="primary" indeterminate />

    <SociosListado v-else :socios="sociosFiltrados" />

    <v-dialog v-model="dialogoAbierto" max-width="680" persistent scrollable>
      <SociosFormulario
        v-if="dialogoAbierto"
        :cargando="store.guardando"
        @guardar="guardarSocio"
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
