<template>
  <div class="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-primary-50 via-white to-accent-50">
    <div class="text-center max-w-4xl w-full">
      <!-- Header -->
      <h1 class="text-5xl font-bold text-gray-900 mb-6 animate-fade-in">
        {{ presentation?.title || '医疗面试系统演示' }}
      </h1>
      
      <p class="text-xl text-gray-600 mb-8 animate-slide-up">
        基于AI Coding的交互式演示站点 - 点击开始探索
      </p>
      
      <!-- Features Grid -->
      <div class="bg-white rounded-2xl shadow-xl p-8 mb-8 animate-slide-up">
        <h2 class="text-2xl font-semibold text-gray-800 mb-6">✨ 核心功能</h2>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div 
            v-for="(slide, index) in presentation?.slides.slice(0, 6)" 
            :key="slide.id"
            class="p-4 border border-gray-200 rounded-lg hover:border-primary-400 hover:bg-primary-50 transition-all cursor-pointer"
          >
            <div class="flex items-center gap-2 mb-2">
              <span class="bg-primary-100 text-primary-600 px-2 py-1 rounded text-sm font-medium">
                {{ index + 1 }}
              </span>
              <h3 class="font-medium text-gray-800">{{ slide.title }}</h3>
            </div>
            <p class="text-sm text-gray-600 line-clamp-2">{{ slide.content || slide.children[0]?.content }}</p>
          </div>
        </div>
      </div>
      
      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center mb-8">
        <button 
          @click="startPresentation" 
          class="btn btn-primary text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
        >
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
          🚀 开始演示
        </button>
        <button 
          @click="toggleFullscreen" 
          class="btn btn-secondary text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
          </svg>
          {{ isFullscreen ? '退出全屏' : '全屏模式' }}
        </button>
      </div>
      
      <!-- Tips -->
      <div class="bg-gray-50 rounded-xl p-6 text-sm text-gray-600">
        <h3 class="font-semibold mb-3">💡 使用提示</h3>
        <ul class="list-disc list-inside space-y-2 text-left">
          <li>使用键盘 <kbd class="px-2 py-1 bg-gray-200 rounded">←</kbd> <kbd class="px-2 py-1 bg-gray-200 rounded">→</kbd> 方向键切换页面</li>
          <li>按 <kbd class="px-2 py-1 bg-gray-200 rounded">F</kbd> 键进入全屏模式</li>
          <li>按 <kbd class="px-2 py-1 bg-gray-200 rounded">ESC</kbd> 键退出全屏</li>
          <li>点击播放按钮可快速进入演示</li>
        </ul>
      </div>

      <!-- Progress Bar -->
      <div v-if="presentation" class="mt-8">
        <div class="flex justify-between text-sm text-gray-500 mb-2">
          <span>演示进度</span>
          <span>{{ currentSlide + 1 }} / {{ totalSlides }}</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div 
            class="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full transition-all duration-300"
            :style="{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDemoStore } from '@/stores'

const router = useRouter()
const demoStore = useDemoStore()

// Load presentation on mount
onMounted(() => {
  if (!demoStore.presentation) {
    demoStore.loadPresentation()
  }
})

const presentation = computed(() => demoStore.presentation)
const isFullscreen = computed(() => demoStore.isFullscreen)
const currentSlide = computed(() => demoStore.currentSlide)
const totalSlides = computed(() => demoStore.totalSlides)

const startPresentation = () => {
  router.push('/demo/0')
}

const toggleFullscreen = () => {
  demoStore.toggleFullscreen()
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

kbd {
  font-family: monospace;
}
</style>
