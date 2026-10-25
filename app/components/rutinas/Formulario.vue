<script setup lang="ts">
import type { NuevaRutina } from '~/stores/rutinas'

defineProps<{
  cargando?: boolean
}>()

const emit = defineEmits<{
  guardar: [datos: NuevaRutina]
  cancelar: []
}>()

const formRef = ref<{ validate: () => Promise<{ valid: boolean }> } | null>(null)

const niveles = ['Principiante', 'Intermedio', 'Avanzado']

const formulario = reactive<NuevaRutina>({
  nombre: '',
  descripcion: '',
  nivel: 'Principiante',
  duracionMinutos: 45,
  entrenador: '',
  activa: true,
})

async function enviar() {
  const resultado = await formRef.value?.validate()

  if (!resultado?.valid) {
    return
  }

  emit('guardar', {
    ...formulario,
    nombre: formulario.nombre.trim(),
    descripcion: formulario.descripcion.trim(),
    entrenador: formulario.entrenador.trim(),
    duracionMinutos: Number(formulario.duracionMinutos),
  })
}
</script>

<template>
  <v-card rounded="lg">
    <v-card-item>
      <v-card-title>Registrar nueva rutina</v-card-title>
      <v-card-subtitle>Define el objetivo, nivel y duración de la rutina.</v-card-subtitle>
    </v-card-item>

    <v-divider />

    <v-form ref="formRef" @submit.prevent="enviar">
      <v-card-text>
        <v-row dense>
          <v-col cols="12" sm="8">
            <v-text-field
              v-model="formulario.nombre"
              label="Nombre de la rutina"
              prepend-inner-icon="mdi-run-fast"
              variant="outlined"
              :rules="[
                v => !!v?.trim() || 'El nombre es obligatorio',
                v => (v?.trim().length ?? 0) >= 3 || 'Debe tener al menos 3 caracteres',
              ]"
            />
          </v-col>

          <v-col cols="12" sm="4">
            <v-select
              v-model="formulario.nivel"
              :items="niveles"
              label="Nivel"
              prepend-inner-icon="mdi-signal"
              variant="outlined"
              :rules="[v => !!v || 'Selecciona un nivel']"
            />
          </v-col>

          <v-col cols="12">
            <v-textarea
              v-model="formulario.descripcion"
              label="Descripción"
              variant="outlined"
              rows="3"
              auto-grow
              :rules="[
                v => !!v?.trim() || 'La descripción es obligatoria',
                v => (v?.trim().length ?? 0) >= 10 || 'Describe la rutina en al menos 10 caracteres',
              ]"
            />
          </v-col>

          <v-col cols="12" sm="6">
            <v-text-field
              v-model.number="formulario.duracionMinutos"
              label="Duración en minutos"
              prepend-inner-icon="mdi-clock-outline"
              type="number"
              min="1"
              variant="outlined"
              :rules="[
                v => Number(v) > 0 || 'La duración debe ser mayor que cero',
                v => Number.isInteger(Number(v)) || 'Ingresa un número entero',
              ]"
            />
          </v-col>

          <v-col cols="12" sm="6">
            <v-text-field
              v-model="formulario.entrenador"
              label="Entrenador responsable"
              prepend-inner-icon="mdi-account-tie-outline"
              variant="outlined"
              :rules="[
                v => !!v?.trim() || 'El entrenador es obligatorio',
                v => (v?.trim().length ?? 0) >= 3 || 'Debe tener al menos 3 caracteres',
              ]"
            />
          </v-col>

          <v-col cols="12">
            <v-switch
              v-model="formulario.activa"
              color="primary"
              label="Rutina activa"
              hide-details
              inset
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
          Guardar rutina
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>
