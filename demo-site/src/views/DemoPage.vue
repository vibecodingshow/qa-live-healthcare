<template>
  <div 
    class="demo-page min-h-screen bg-gradient-to-br from-primary-100 to-accent-100 flex flex-col"
    :class="{ 'fullscreen': isFullscreen }"
    @keydown="handleKeydown"
    tabindex="0"
    ref="pageRef"
  >
    <!-- Loading State -->
    <div v-if="isLoading" class="flex-1 flex items-center justify-center">
      <div class="text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p class="text-gray-600">加载演示内容...</p>
      </div>
    </div>

    <!-- Demo Content -->
    <div v-else class="flex-1 flex items-center justify-center p-4 sm:p-8">
      <div class="max-w-5xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        <!-- Header -->
        <div class="bg-gradient-to-r from-primary-600 to-accent-600 text-white p-4 sm:p-6">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 class="text-2xl sm:text-3xl font-bold">{{ currentSlide?.title || '演示页面' }}</h2>
              <p class="text-primary-100 mt-1 text-sm sm:text-base">页面 {{ currentIndex + 1 }} / {{ totalSlides }}</p>
            </div>
            <div class="flex gap-2">
              <button 
                @click="toggleFullscreen"
                class="btn bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 text-sm"
              >
                {{ isFullscreen ? '退出全屏' : '全屏' }}
              </button>
              <button 
                @click="goHome"
                class="btn bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 text-sm"
              >
                首页
              </button>
            </div>
          </div>
        </div>

        <!-- Content -->
        <div class="p-6 sm:p-12 min-h-[400px] sm:min-h-[500px] overflow-auto">
          <div 
            class="prose prose-lg max-w-none"
            v-html="renderedContent"
          ></div>
        </div>

        <!-- Navigation -->
        <div class="bg-gray-50 p-4 sm:p-6 border-t">
          <div class="flex justify-between items-center gap-4">
            <button 
              @click="prevSlide"
              :disabled="currentIndex === 0"
              class="btn btn-secondary px-4 sm:px-6 py-2 sm:py-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <span class="hidden sm:inline">上一页</span>
              <span class="sm:hidden">←</span>
              <svg class="w-4 h-4 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>

            <!-- Progress Indicators -->
            <div class="flex gap-1 sm:gap-2 flex-wrap justify-center max-w-xs sm:max-w-none">
              <button 
                v-for="(slide, index) in slides" 
                :key="index"
                @click="goToSlide(index)"
                class="w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all"
                :class="index === currentIndex ? 'bg-primary-600' : 'bg-gray-300 hover:bg-gray-400'"
                :title="slide.title"
              ></button>
            </div>

            <button 
              @click="nextSlide"
              :disabled="currentIndex === totalSlides - 1"
              class="btn btn-primary px-4 sm:px-6 py-2 sm:py-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <span class="hidden sm:inline">下一页</span>
              <span class="sm:hidden">→</span>
              <svg class="w-4 h-4 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </div>

          <!-- Keyboard Tips -->
          <div class="mt-4 text-center text-xs sm:text-sm text-gray-500">
            <span class="hidden sm:inline">
              使用 <kbd class="px-2 py-1 bg-gray-200 rounded">←</kbd> <kbd class="px-2 py-1 bg-gray-200 rounded">→</kbd> 键切换页面
              · <kbd class="px-2 py-1 bg-gray-200 rounded">F</kbd> 全屏
              · <kbd class="px-2 py-1 bg-gray-200 rounded">ESC</kbd> 返回
            </span>
            <span class="sm:hidden">左右滑动切换页面</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { marked } from 'marked'
import { useDemoStore } from '@/stores'
import type { Slide } from '@/types'

const route = useRoute()
const router = useRouter()
const demoStore = useDemoStore()

const pageRef = ref<HTMLElement | null>(null)

const currentIndex = computed(() => {
  const index = parseInt(route.params.index as string)
  console.log('Current index from route:', index)
  return isNaN(index) ? 0 : Math.max(0, Math.min(index, totalSlides.value - 1))
})

const slides = computed(() => demoStore.presentation?.slides || [])
const presentation = computed(() => demoStore.presentation)
const isLoading = computed(() => demoStore.isLoading)
const isFullscreen = ref(false)
const totalSlides = computed(() => slides.value.length)

const currentSlide = computed(() => {
  console.log('Getting current slide for index:', currentIndex.value)
  console.log('Available slides:', slides.value.length)
  if (slides.value[currentIndex.value]) {
    return slides.value[currentIndex.value]
  }
  return null
})

const renderedContent = computed(() => {
  if (!currentSlide.value) return '<p class="text-center text-gray-500">暂无内容</p>'
  
  let content = currentSlide.value.content || ''
  
  // Add children content if available
  if (currentSlide.value.children && currentSlide.value.children.length > 0) {
    content += '\n\n' + currentSlide.value.children.map(child => {
      let childContent = `### ${child.title}\n\n${child.content}`
      return childContent
    }).join('\n\n')
  }
  
  console.log('Rendering content for slide:', currentSlide.value.title)
  return marked(content)
})

const prevSlide = () => {
  if (currentIndex.value > 0) {
    router.push(`/demo/${currentIndex.value - 1}`)
  }
}

const nextSlide = () => {
  if (currentIndex.value < totalSlides.value - 1) {
    router.push(`/demo/${currentIndex.value + 1}`)
  }
}

const goToSlide = (index: number) => {
  router.push(`/demo/${index}`)
}

const goHome = () => {
  if (document.fullscreenElement) {
    document.exitFullscreen()
  }
  router.push('/')
}

const toggleFullscreen = async () => {
  try {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen()
      isFullscreen.value = true
    } else {
      await document.exitFullscreen()
      isFullscreen.value = false
    }
  } catch (err) {
    console.error('Fullscreen error:', err)
  }
}

// Keyboard navigation
const handleKeydown = (e: KeyboardEvent) => {
  console.log('Keydown event:', e.key)
  
  // Ignore if user is typing in an input
  if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
    return
  }
  
  if (e.key === 'ArrowLeft') {
    e.preventDefault()
    prevSlide()
  } else if (e.key === 'ArrowRight') {
    e.preventDefault()
    nextSlide()
  } else if (e.key === 'Escape') {
    e.preventDefault()
    if (isFullscreen.value) {
      toggleFullscreen()
    } else {
      goHome()
    }
  } else if (e.key === 'f' || e.key === 'F') {
    e.preventDefault()
    toggleFullscreen()
  } else if (e.key === 'Home') {
    e.preventDefault()
    goToSlide(0)
  } else if (e.key === 'End') {
    e.preventDefault()
    goToSlide(totalSlides.value - 1)
  }
}

// Load presentation
onMounted(async () => {
  console.log('DemoPage mounted')
  
  // Load presentation if not already loaded
  if (!demoStore.presentation) {
    console.log('Loading presentation...')
    await demoStore.loadPresentation()
  }
  
  // Focus the page for keyboard navigation
  await nextTick()
  if (pageRef.value) {
    pageRef.value.focus()
    console.log('Page focused for keyboard navigation')
  }
  
  // Add keyboard listener
  window.addEventListener('keydown', handleKeydown)
  
  console.log('Slides loaded:', slides.value.length)
})

onUnmounted(() => {
  console.log('DemoPage unmounting')
  window.removeEventListener('keydown', handleKeydown)
})

// Watch for fullscreen changes
watch(() => document.fullscreenElement, (isFull) => {
  isFullscreen.value = !!isFull
})

// Refocus when route changes
watch(() => route.params.index, async () => {
  await nextTick()
  if (pageRef.value) {
    pageRef.value.focus()
  }
})
</script>

<style scoped>
.demo-page {
  outline: none;
}

.prose :deep(h1) {
  @apply text-3xl sm:text-4xl font-bold text-primary-700 mb-6;
}

.prose :deep(h2) {
  @apply text-2xl sm:text-3xl font-semibold text-primary-600 mb-4 mt-8;
}

.prose :deep(h3) {
  @apply text-xl sm:text-2xl font-medium text-primary-500 mb-3 mt-6;
}

.prose :deep(p) {
  @apply text-gray-700 leading-relaxed mb-4 text-sm sm:text-base;
}

.prose :deep(ul),
.prose :deep(ol) {
  @apply my-4 space-y-2;
}

.prose :deep(li) {
  @apply text-gray-700 text-sm sm:text-base;
}

.prose :deep(strong) {
  @apply text-primary-600;
}

kbd {
  font-family: monospace;
}

.fullscreen {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  z-index: 9999 !important;
}
</style>
