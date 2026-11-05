<script setup lang="ts">
import type { Equipo, EstadoEquipo } from '~/stores/equipos'

defineProps<{
  equipos: Equipo[]
}>()

const emit = defineEmits<{
  editar: [equipo: Equipo]
  eliminar: [id: string]
}>()

const coloresEstado: Record<EstadoEquipo, string> = {
  Disponible: 'success',
  'En mantenimiento': 'warning',
  'Fuera de servicio': 'error',
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
  <v-card v-if="equipos.length > 0" rounded="lg">
    <v-table hover>
      <thead>
        <tr>
          <th class="text-left font-weight-bold">Equipo</th>
          <th class="text-center font-weight-bold">Cantidad</th>
          <th class="text-left font-weight-bold">Estado</th>
          <th class="text-left font-weight-bold">Adquisición</th>
          <th class="text-right font-weight-bold">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="equipo in equipos" :key="equipo.id">
          <td>
            <div class="font-weight-medium">{{ equipo.nombre }}</div>
            <div class="text-caption text-medium-emphasis">{{ equipo.categoria }}</div>
          </td>
          <td class="text-center">{{ equipo.cantidad }}</td>
          <td>
            <v-chip :color="coloresEstado[equipo.estado]" size="small" variant="tonal">
              {{ equipo.estado }}
            </v-chip>
          </td>
          <td class="text-body-2">{{ formatearFecha(equipo.fechaAdquisicion) }}</td>
          <td class="text-right text-no-wrap">
            <v-btn
              color="primary"
              icon="mdi-pencil"
              size="small"
              variant="text"
              @click="emit('editar', equipo)"
            />
            <v-btn
              color="error"
              icon="mdi-delete"
              size="small"
              variant="text"
              @click="emit('eliminar', equipo.id)"
            />
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-card>

  <v-alert v-else color="info" icon="mdi-dumbbell" variant="tonal">
    No se encontraron equipos que coincidan con la búsqueda.
  </v-alert>
</template>
