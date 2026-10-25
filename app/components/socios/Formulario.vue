<script setup lang="ts">
import type { NuevoSocio } from '~/stores/socios'

defineProps<{
  cargando?: boolean
}>()

const emit = defineEmits<{
  guardar: [datos: NuevoSocio]
  cancelar: []
}>()

const formRef = ref<{ validate: () => Promise<{ valid: boolean }> } | null>(null)

const membresias = ['Mensual', 'Trimestral', 'Anual']

const formulario = reactive<NuevoSocio>({
  nombre: '',
  email: '',
  telefono: '',
  membresia: 'Mensual',
  fechaInicio: new Date().toISOString().slice(0, 10),
  activo: true,
})

async function enviar() {
  const resultado = await formRef.value?.validate()

  if (!resultado?.valid) {
    return
  }

  emit('guardar', {
    ...formulario,
    nombre: formulario.nombre.trim(),
    email: formulario.email.trim().toLowerCase(),
    telefono: formulario.telefono.trim(),
  })
}
</script>

<template>
  <v-card rounded="lg">
    <v-card-item>
      <v-card-title>Registrar nuevo socio</v-card-title>
      <v-card-subtitle>Completa los datos de afiliación y membresía.</v-card-subtitle>
    </v-card-item>

    <v-divider />

    <v-form ref="formRef" @submit.prevent="enviar">
      <v-card-text>
        <v-row dense>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="formulario.nombre"
              label="Nombre completo"
              prepend-inner-icon="mdi-account-outline"
              variant="outlined"
              :rules="[
                v => !!v?.trim() || 'El nombre es obligatorio',
                v => (v?.trim().length ?? 0) >= 3 || 'Debe tener al menos 3 caracteres',
              ]"
            />
          </v-col>

          <v-col cols="12" sm="6">
            <v-text-field
              v-model="formulario.email"
              label="Correo electrónico"
              prepend-inner-icon="mdi-email-outline"
              type="email"
              variant="outlined"
              :rules="[
                v => !!v?.trim() || 'El correo es obligatorio',
                v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v ?? '') || 'Ingresa un correo válido',
              ]"
            />
          </v-col>

          <v-col cols="12" sm="6">
            <v-text-field
              v-model="formulario.telefono"
              label="Teléfono"
              prepend-inner-icon="mdi-phone-outline"
              variant="outlined"
              :rules="[
                v => !!v?.trim() || 'El teléfono es obligatorio',
                v => (v?.replace(/\D/g, '').length ?? 0) >= 7 || 'Debe tener al menos 7 dígitos',
              ]"
            />
          </v-col>

          <v-col cols="12" sm="6">
            <v-select
              v-model="formulario.membresia"
              :items="membresias"
              label="Tipo de membresía"
              prepend-inner-icon="mdi-card-account-details-outline"
              variant="outlined"
              :rules="[v => !!v || 'Selecciona una membresía']"
            />
          </v-col>

          <v-col cols="12" sm="6">
            <v-text-field
              v-model="formulario.fechaInicio"
              label="Fecha de inicio"
              prepend-inner-icon="mdi-calendar-start-outline"
              type="date"
              variant="outlined"
              :rules="[v => !!v || 'La fecha de inicio es obligatoria']"
            />
          </v-col>

          <v-col cols="12" sm="6" class="d-flex align-center">
            <v-switch
              v-model="formulario.activo"
              color="primary"
              label="Socio activo"
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
          Guardar socio
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>
