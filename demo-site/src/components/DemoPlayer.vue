<template>
  <div class="demo-player">
    <!-- Demo Card -->
    <div class="card hover:shadow-2xl transition-shadow cursor-pointer group" @click="startPresentation">
      <div class="relative overflow-hidden rounded-lg mb-4">
        <img 
          :src="thumbnail" 
          :alt="title"
          class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <button class="btn btn-primary rounded-full w-16 h-16 flex items-center justify-center">
            <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </button>
        </div>
      </div>
      <h3 class="text-xl font-semibold mb-2 text-gray-800">{{ title }}</h3>
      <p class="text-gray-600 text-sm">{{ description }}</p>
      <div class="flex items-center gap-2 mt-4 text-sm text-gray-500">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
        </svg>
        <span>{{ pageCount }} 页</span>
      </div>
    </div>

    <!-- Presentation Mode -->
    <Teleport to="body">
      <div 
        v-if="isPlaying"
        class="fixed inset-0 z-50 bg-gradient-to-br from-primary-900 to-accent-900"
      >
        <PageViewer
          :pages="pages"
          :current-index="currentPageIndex"
          :is-fullscreen="isFullscreen"
          @update:current-index="handleCurrentIndexUpdate"
          @update:is-fullscreen="handleFullscreenUpdate"
        />
        
        <!-- Close Button -->
        <button 
          @click="stopPresentation"
          class="absolute top-4 right-4 z-50 btn btn-secondary px-4 py-2"
        >
          退出演示
        </button>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PageViewer from './PageViewer.vue'
import type { DemoPage } from '@/types'

defineProps<{
  title: string
  description: string
  thumbnail?: string
  pages: DemoPage[]
  pageCount: number
}>()

const isPlaying = ref(false)
const currentPageIndex = ref(0)
const isFullscreen = ref(false)

const startPresentation = () => {
  isPlaying.value = true
  currentPageIndex.value = 0
}

const stopPresentation = () => {
  isPlaying.value = false
  if (document.fullscreenElement) {
    document.exitFullscreen()
  }
}

// Handle updates from PageViewer
const handleCurrentIndexUpdate = (newIndex: number) => {
  currentPageIndex.value = newIndex
}

const handleFullscreenUpdate = (newValue: boolean) => {
  isFullscreen.value = newValue
}
</script>

<style scoped>
.demo-player {
  perspective: 1000px;
}

.card {
  transform: rotateY(0deg);
  transition: transform 0.6s;
}

.card:hover {
  transform: rotateY(5deg) translateY(-5px);
}
</style>
