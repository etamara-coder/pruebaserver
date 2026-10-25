<script setup lang="ts">
const drawer = ref(true)

const enlaces = [
  { titulo: 'Inicio', descripcion: 'Dashboard', to: '/', icono: 'mdi-view-dashboard-outline' },
  { titulo: 'Socios y Membresías', descripcion: 'Módulo 1', to: '/socios', icono: 'mdi-account-group-outline' },
  { titulo: 'Rutinas y Ejercicios', descripcion: 'Módulo 2', to: '/rutinas', icono: 'mdi-run-fast' },
  { titulo: 'Inventario de Máquinas', descripcion: 'Módulo 3', to: '/equipos', icono: 'mdi-dumbbell' },
]
</script>

<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" color="#111827" theme="dark" width="290">
      <div class="pa-5">
        <div class="d-flex align-center ga-3">
          <v-avatar color="primary" size="46" rounded="lg">
            <v-icon icon="mdi-dumbbell" size="28" />
          </v-avatar>
          <div>
            <div class="text-h6 font-weight-bold">FitZone</div>
            <div class="text-caption text-medium-emphasis">Gestión integral del gimnasio</div>
          </div>
        </div>
      </div>

      <v-divider class="mx-3" />

      <v-list nav density="comfortable" class="pa-3">
        <v-list-subheader>MENÚ PRINCIPAL</v-list-subheader>
        <v-list-item
          v-for="enlace in enlaces"
          :key="enlace.to"
          :to="enlace.to"
          :prepend-icon="enlace.icono"
          :title="enlace.titulo"
          :subtitle="enlace.descripcion"
          color="primary"
          rounded="lg"
          exact
        />
      </v-list>

      <template #append>
        <div class="pa-4">
          <v-divider class="mb-4" />
          <div class="d-flex align-center ga-2 text-caption text-medium-emphasis">
            <v-icon icon="mdi-shield-check-outline" size="16" />
            FitZone · Sistema interno
          </div>
        </div>
      </template>
    </v-navigation-drawer>

    <v-app-bar color="surface" border="b" flat>
      <v-app-bar-nav-icon aria-label="Abrir menú de navegación" @click="drawer = !drawer" />
      <v-app-bar-title class="font-weight-bold">FitZone</v-app-bar-title>
      <v-spacer />
      <v-chip class="mr-2 d-none d-sm-flex" color="success" prepend-icon="mdi-check-circle" size="small" variant="tonal">
        Sistema activo
      </v-chip>
      <v-avatar class="mr-4 d-none d-sm-flex" color="primary" size="36">
        <v-icon icon="mdi-account-tie" size="20" />
      </v-avatar>
    </v-app-bar>

    <v-main class="bg-grey-lighten-4">
      <v-container fluid class="pa-4 pa-md-6">
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>
