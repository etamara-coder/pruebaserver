<script setup lang="ts">
import type { Rutina } from '~/stores/rutinas'

defineProps<{
  rutinas: Rutina[]
}>()

const emit = defineEmits<{
  eliminar: [rutina: Rutina]
}>()

function colorNivel(nivel: Rutina['nivel']): string {
  const colores: Record<Rutina['nivel'], string> = {
    Principiante: 'success',
    Intermedio: 'warning',
    Avanzado: 'error',
  }

  return colores[nivel]
}
</script>

<template>
  <v-row v-if="rutinas.length > 0">
    <v-col v-for="rutina in rutinas" :key="rutina.id" cols="12" md="6" lg="4">
      <v-card class="h-100 d-flex flex-column" rounded="lg">
        <v-card-item>
          <template #prepend>
            <v-avatar color="teal" size="44" variant="tonal">
              <v-icon icon="mdi-run-fast" />
            </v-avatar>
          </template>

          <v-card-title class="text-body-1 font-weight-bold">{{ rutina.nombre }}</v-card-title>
          <v-card-subtitle>{{ rutina.entrenador }}</v-card-subtitle>

          <template #append>
            <v-chip
              :color="rutina.activa ? 'success' : 'grey'"
              size="small"
              variant="tonal"
            >
              {{ rutina.activa ? 'Activa' : 'Inactiva' }}
            </v-chip>
          </template>
        </v-card-item>

        <v-divider />

        <v-card-text class="flex-grow-1 pt-4">
          <p class="text-body-2 text-medium-emphasis mb-4">{{ rutina.descripcion }}</p>

          <div class="d-flex flex-wrap ga-2">
            <v-chip :color="colorNivel(rutina.nivel)" prepend-icon="mdi-signal" size="small" variant="tonal">
              {{ rutina.nivel }}
            </v-chip>
            <v-chip prepend-icon="mdi-clock-outline" size="small" variant="tonal">
              {{ rutina.duracionMinutos }} min
            </v-chip>
          </div>
        </v-card-text>

        <v-card-actions class="px-4 pb-4">
          <v-icon icon="mdi-account-tie-outline" size="18" color="medium-emphasis" />
          <span class="text-caption text-medium-emphasis">Entrenador: {{ rutina.entrenador }}</span>
          <v-spacer />
          <v-btn
            aria-label="Eliminar rutina"
            color="error"
            icon="mdi-delete-outline"
            size="small"
            variant="text"
            @click="emit('eliminar', rutina)"
          />
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>

  <v-alert v-else color="info" icon="mdi-run" variant="tonal">
    No se encontraron rutinas que coincidan con la búsqueda.
  </v-alert>
</template>