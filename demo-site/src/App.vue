<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useDemoStore } from './stores/demo.store'

const demoStore = useDemoStore()

onMounted(() => {
  demoStore.loadPresentation()
})
</script>

<style>
#app {
  font-family: 'Inter', 'Noto Sans SC', system-ui, sans-serif;
}
</style>