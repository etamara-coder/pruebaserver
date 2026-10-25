<script setup lang="ts">
import type { NuevoEquipo } from '~/stores/equipos'

defineProps<{
  cargando?: boolean
}>()

const emit = defineEmits<{
  guardar: [datos: NuevoEquipo]
  cancelar: []
}>()

const formRef = ref<{ validate: () => Promise<{ valid: boolean }> } | null>(null)

const estados = ['Disponible', 'En mantenimiento', 'Fuera de servicio']

const formulario = reactive<NuevoEquipo>({
  nombre: '',
  categoria: '',
  cantidad: 1,
  estado: 'Disponible',
  fechaAdquisicion: new Date().toISOString().slice(0, 10),
})

async function enviar() {
  const resultado = await formRef.value?.validate()

  if (!resultado?.valid) {
    return
  }

  emit('guardar', {
    ...formulario,
    nombre: formulario.nombre.trim(),
    categoria: formulario.categoria.trim(),
    cantidad: Number(formulario.cantidad),
  })
}
</script>

<template>
  <v-card rounded="lg">
    <v-card-item>
      <v-card-title>Registrar nuevo equipo</v-card-title>
      <v-card-subtitle>Agrega una máquina o implemento al inventario.</v-card-subtitle>
    </v-card-item>

    <v-divider />

    <v-form ref="formRef" @submit.prevent="enviar">
      <v-card-text>
        <v-row dense>
          <v-col cols="12" sm="8">
            <v-text-field
              v-model="formulario.nombre"
              label="Nombre del equipo"
              prepend-inner-icon="mdi-dumbbell"
              variant="outlined"
              :rules="[
                v => !!v?.trim() || 'El nombre es obligatorio',
                v => (v?.trim().length ?? 0) >= 3 || 'Debe tener al menos 3 caracteres',
              ]"
            />
          </v-col>

          <v-col cols="12" sm="4">
            <v-text-field
              v-model.number="formulario.cantidad"
              label="Cantidad"
              prepend-inner-icon="mdi-counter"
              type="number"
              min="1"
              variant="outlined"
              :rules="[
                v => Number(v) > 0 || 'La cantidad debe ser mayor que cero',
                v => Number.isInteger(Number(v)) || 'Ingresa un número entero',
              ]"
            />
          </v-col>

          <v-col cols="12" sm="6">
            <v-text-field
              v-model="formulario.categoria"
              label="Categoría"
              prepend-inner-icon="mdi-tag-outline"
              variant="outlined"
              :rules="[
                v => !!v?.trim() || 'La categoría es obligatoria',
                v => (v?.trim().length ?? 0) >= 3 || 'Debe tener al menos 3 caracteres',
              ]"
            />
          </v-col>

          <v-col cols="12" sm="6">
            <v-select
              v-model="formulario.estado"
              :items="estados"
              label="Estado"
              prepend-inner-icon="mdi-progress-wrench"
              variant="outlined"
              :rules="[v => !!v || 'Selecciona un estado']"
            />
          </v-col>

          <v-col cols="12" sm="6">
            <v-text-field
              v-model="formulario.fechaAdquisicion"
              label="Fecha de adquisición"
              prepend-inner-icon="mdi-calendar-plus-outline"
              type="date"
              variant="outlined"
              :rules="[v => !!v || 'La fecha de adquisición es obligatoria']"
            />
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn :disabled="cargando" variant="text" @click="emit('cancelar')">Cancelar</v-btn>
        <v-btn
          color="primary"
          :loading="cargando"
          prepend-icon="mdi-content-save-outline"
          type="submit"
          variant="flat"
        >
          Guardar equipo
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>
