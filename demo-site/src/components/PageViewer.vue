<template>
  <div 
    class="page-viewer min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center p-8"
    :class="{ 'fullscreen': isFullscreen }"
  >
    <div class="max-w-4xl w-full bg-white rounded-2xl shadow-2xl p-12 relative">
      <!-- Page Content -->
      <div 
        class="prose prose-lg max-w-none"
        v-html="renderedContent"
      ></div>

      <!-- Navigation Controls -->
      <div class="absolute bottom-0 left-0 right-0 p-6 flex justify-between items-center border-t border-gray-200">
        <button 
          @click="previousPage"
          :disabled="currentIndex === 0"
          class="btn btn-secondary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← 上一页
        </button>
        
        <div class="flex items-center gap-4">
          <span class="text-gray-600">
            {{ currentIndex + 1 }} / {{ totalPages }}
          </span>
          <button 
            @click="toggleFullscreen"
            class="btn btn-primary px-6 py-3"
          >
            {{ isFullscreen ? '退出全屏' : '全屏播放' }}
          </button>
        </div>
        
        <button 
          @click="nextPage"
          :disabled="currentIndex === totalPages - 1"
          class="btn btn-secondary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          下一页 →
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { marked } from 'marked'
import type { DemoPage } from '@/types'

const props = defineProps<{
  pages: DemoPage[]
  currentIndex: number
  isFullscreen: boolean
}>()

const emit = defineEmits<{
  'update:currentIndex': [value: number]
  'update:isFullscreen': [value: boolean]
}>()

const renderedContent = computed(() => {
  if (props.pages[props.currentIndex]) {
    return marked(props.pages[props.currentIndex].content)
  }
  return ''
})

const totalPages = computed(() => props.pages.length)

const previousPage = () => {
  if (props.currentIndex > 0) {
    emit('update:currentIndex', props.currentIndex - 1)
  }
}

const nextPage = () => {
  if (props.currentIndex < totalPages.value - 1) {
    emit('update:currentIndex', props.currentIndex + 1)
  }
}

const toggleFullscreen = async () => {
  try {
    if (!document.fullscreenElement) {
      const viewer = document.querySelector('.page-viewer')
      if (viewer) {
        await viewer.requestFullscreen()
      }
      emit('update:isFullscreen', true)
    } else {
      await document.exitFullscreen()
      emit('update:isFullscreen', false)
    }
  } catch (err) {
    console.error('Fullscreen error:', err)
  }
}

// Keyboard navigation
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'ArrowLeft') {
    previousPage()
  } else if (e.key === 'ArrowRight') {
    nextPage()
  } else if (e.key === 'Escape' && props.isFullscreen) {
    emit('update:isFullscreen', false)
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.prose h1 {
  @apply text-4xl font-bold text-primary-700 mb-6;
}

.prose h2 {
  @apply text-3xl font-semibold text-primary-600 mb-4 mt-8;
}

.prose h3 {
  @apply text-2xl font-medium text-primary-500 mb-3 mt-6;
}

.prose p {
  @apply text-gray-700 leading-relaxed mb-4;
}

.prose ul, .prose ol {
  @apply my-4 space-y-2;
}

.prose li {
  @apply text-gray-700;
}

.prose code {
  @apply bg-gray-100 px-2 py-1 rounded text-primary-600 font-mono;
}

.prose pre {
  @apply bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4;
}
</style>
