<script setup lang="ts">
import type { Socio } from '~/stores/socios'

defineProps<{
  socios: Socio[]
}>()

function iniciales(nombre: string): string {
  return nombre
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte.charAt(0).toUpperCase())
    .join('')
}

function formatearFecha(fecha: string): string {
  const valor = new Date(`${fecha}T00:00:00`)

  if (Number.isNaN(valor.getTime())) {
    return fecha
  }

  return new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium' }).format(valor)
}
</script>

<template>
  <v-row v-if="socios.length > 0">
    <v-col v-for="socio in socios" :key="socio.id" cols="12" sm="6" lg="4">
      <v-card class="h-100" rounded="lg">
        <v-card-item>
          <template #prepend>
            <v-avatar color="primary" size="44" variant="tonal">
              <span class="font-weight-bold">{{ iniciales(socio.nombre) }}</span>
            </v-avatar>
          </template>

          <v-card-title class="text-body-1 font-weight-bold">{{ socio.nombre }}</v-card-title>
          <v-card-subtitle>{{ socio.email }}</v-card-subtitle>

          <template #append>
            <v-chip
              :color="socio.activo ? 'success' : 'grey'"
              size="small"
              variant="tonal"
            >
              {{ socio.activo ? 'Activo' : 'Inactivo' }}
            </v-chip>
          </template>
        </v-card-item>

        <v-divider />

        <v-card-text class="pt-4">
          <div class="d-flex flex-column ga-3 text-body-2">
            <div class="d-flex align-center ga-2">
              <v-icon icon="mdi-phone-outline" size="18" color="medium-emphasis" />
              <span>{{ socio.telefono }}</span>
            </div>
            <div class="d-flex align-center ga-2">
              <v-icon icon="mdi-card-account-details-outline" size="18" color="medium-emphasis" />
              <span>Membresía {{ socio.membresia }}</span>
            </div>
            <div class="d-flex align-center ga-2">
              <v-icon icon="mdi-calendar-start-outline" size="18" color="medium-emphasis" />
              <span>Desde {{ formatearFecha(socio.fechaInicio) }}</span>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>

  <v-alert v-else color="info" icon="mdi-account-search" variant="tonal">
    No se encontraron socios que coincidan con la búsqueda.
  </v-alert>
</template>
