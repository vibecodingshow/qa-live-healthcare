<template>
  <div id="app" :class="themeClass">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useThemeStore } from '@/stores/theme.store'

const themeStore = useThemeStore()

const themeClass = computed(() => ({
  'theme-light': themeStore.isLight,
  'theme-dark': themeStore.isDark
}))

onMounted(() => {
  themeStore.initTheme()
})
</script>

<style>
#app {
  min-height: 100vh;
  transition: background-color 0.3s ease;
}

.theme-light {
  --bg-primary: #ffffff;
  --text-primary: #1f2937;
}

.theme-dark {
  --bg-primary: #1f2937;
  --text-primary: #f9fafb;
}
</style>
