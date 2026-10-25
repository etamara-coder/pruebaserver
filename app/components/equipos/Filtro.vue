<script setup lang="ts">
const busqueda = defineModel<string>({ required: true })
</script>

<template>
  <v-text-field
    v-model="busqueda"
    label="Buscar equipo por nombre, categoría o estado"
    prepend-inner-icon="mdi-magnify"
    variant="outlined"
    density="comfortable"
    hide-details
  />
</template>
