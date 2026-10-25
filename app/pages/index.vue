<script setup lang="ts">
import { useEquiposStore } from '~/stores/equipos'
import { useRutinasStore } from '~/stores/rutinas'
import { useSociosStore } from '~/stores/socios'

const sociosStore = useSociosStore()
const rutinasStore = useRutinasStore()
const equiposStore = useEquiposStore()

onMounted(() => {
  void Promise.allSettled([
    sociosStore.cargarSocios(),
    rutinasStore.cargarRutinas(),
    equiposStore.cargarEquipos(),
  ])
})

const cargando = computed(() =>
  sociosStore.cargando || rutinasStore.cargando || equiposStore.cargando,
)

const errores = computed(() =>
  [sociosStore.error, rutinasStore.error, equiposStore.error].filter(
    (error): error is string => Boolean(error),
  ),
)

const tarjetas = computed(() => [
  {
    titulo: 'Socios y Membresías',
    modulo: 'Módulo 1',
    total: sociosStore.totalSocios,
    unidad: 'socios registrados',
    detalle: `${sociosStore.sociosActivos} activos · ${sociosStore.sociosInactivos} inactivos`,
    icono: 'mdi-account-group-outline',
    color: 'primary',
    to: '/socios',
    accion: 'Gestionar socios',
  },
  {
    titulo: 'Rutinas y Ejercicios',
    modulo: 'Módulo 2',
    total: rutinasStore.totalRutinas,
    unidad: 'rutinas disponibles',
    detalle: `${rutinasStore.rutinasActivas} activas en este momento`,
    icono: 'mdi-run-fast',
    color: 'teal',
    to: '/rutinas',
    accion: 'Gestionar rutinas',
  },
  {
    titulo: 'Inventario de Máquinas',
    modulo: 'Módulo 3',
    total: equiposStore.totalUnidades,
    unidad: 'unidades en inventario',
    detalle: `${equiposStore.unidadesDisponibles} disponibles · ${equiposStore.equiposEnMantenimiento} en mantenimiento`,
    icono: 'mdi-dumbbell',
    color: 'deep-purple',
    to: '/equipos',
    accion: 'Gestionar equipos',
  },
])
</script>

<template>
  <div>
    <v-sheet color="primary" rounded="xl" class="pa-6 pa-md-8 mb-6">
      <div class="d-flex flex-column flex-md-row align-md-center justify-space-between ga-5">
        <div>
          <div class="text-overline text-white mb-1">Panel general</div>
          <h1 class="text-h4 text-md-h3 font-weight-bold text-white mb-2">
            Bienvenido a FitZone
          </h1>
          <p class="text-body-1 text-white mb-0" style="opacity: 0.86">
            Administra socios, rutinas e inventario desde un solo lugar.
          </p>
        </div>

        <v-btn
          color="white"
          prepend-icon="mdi-account-plus-outline"
          size="large"
          to="/socios"
          variant="flat"
        >
          Registrar socio
        </v-btn>
      </div>
    </v-sheet>

    <v-progress-linear v-if="cargando" class="mb-4 rounded" color="primary" indeterminate />

    <v-alert
      v-for="error in errores"
      :key="error"
      class="mb-4"
      color="error"
      icon="mdi-alert-circle-outline"
      variant="tonal"
    >
      {{ error }}
    </v-alert>

    <div class="d-flex align-center justify-space-between mb-3">
      <div>
        <h2 class="text-h6 font-weight-bold">Resumen del gimnasio</h2>
        <p class="text-body-2 text-medium-emphasis mb-0">
          Indicadores actualizados desde los datos del sistema.
        </p>
      </div>
    </div>

    <v-row>
      <v-col v-for="tarjeta in tarjetas" :key="tarjeta.to" cols="12" md="4">
        <v-card class="h-100 d-flex flex-column" rounded="lg">
          <v-card-text class="pa-6 flex-grow-1">
            <div class="d-flex align-start justify-space-between mb-5">
              <v-avatar :color="tarjeta.color" size="50" variant="tonal">
                <v-icon :icon="tarjeta.icono" size="26" />
              </v-avatar>
              <v-chip size="small" variant="tonal">{{ tarjeta.modulo }}</v-chip>
            </div>

            <div class="text-h3 font-weight-bold lh-1">{{ tarjeta.total }}</div>
            <div class="text-subtitle-2 text-medium-emphasis mt-1">{{ tarjeta.unidad }}</div>
            <p class="text-body-2 text-medium-emphasis mt-4 mb-0">{{ tarjeta.detalle }}</p>
          </v-card-text>

          <v-divider />

          <v-card-actions class="pa-4">
            <v-btn :color="tarjeta.color" :to="tarjeta.to" append-icon="mdi-arrow-right" variant="text">
              {{ tarjeta.accion }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-card class="mt-6" rounded="lg">
      <v-card-text class="pa-6">
        <div class="d-flex flex-column flex-sm-row align-sm-center justify-space-between ga-4">
          <div class="d-flex align-center ga-4">
            <v-avatar color="success" size="46" variant="tonal">
              <v-icon icon="mdi-chart-line" />
            </v-avatar>
            <div>
              <div class="text-subtitle-1 font-weight-bold">Operación centralizada</div>
              <div class="text-body-2 text-medium-emphasis">
                Los cambios de cada módulo se reflejan automáticamente en este resumen.
              </div>
            </div>
          </div>

          <div class="d-flex flex-wrap ga-2">
            <v-chip prepend-icon="mdi-account-check-outline" size="small" variant="tonal">
              {{ sociosStore.sociosActivos }} socios activos
            </v-chip>
            <v-chip prepend-icon="mdi-run" size="small" variant="tonal">
              {{ rutinasStore.rutinasActivas }} rutinas activas
            </v-chip>
            <v-chip prepend-icon="mdi-dumbbell" size="small" variant="tonal">
              {{ equiposStore.unidadesDisponibles }} equipos disponibles
            </v-chip>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>
