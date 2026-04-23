<template>
  <div 
    class="demo-player"
    :class="{ 'is-fullscreen': isFullscreen }"
    ref="playerRef"
  >
    <!-- 顶部导航栏 -->
    <header class="player-header" v-if="showControls">
      <button @click="goHome" class="back-button">
        ← 返回
      </button>
      <div class="page-indicator">
        {{ currentIndex + 1 }} / {{ totalPages }}
      </div>
      <button @click="toggleFullscreen" class="fullscreen-button">
        {{ isFullscreen ? '退出全屏' : '全屏' }}
      </button>
    </header>

    <!-- 主内容区域 -->
    <main class="player-content">
      <div class="page-container" v-if="currentPage">
        <h1 class="page-title">{{ currentPage.title }}</h1>
        <div 
          class="page-body markdown-body"
          v-html="renderedContent"
        ></div>
      </div>
      <div class="empty-state" v-else>
        <p>暂无内容</p>
      </div>
    </main>

    <!-- 底部控制栏 -->
    <footer class="player-footer" v-if="showControls">
      <button 
        @click="prevPage" 
        :disabled="currentIndex === 0"
        class="nav-button"
      >
        ← 上一页
      </button>
      
      <div class="progress-container">
        <div class="progress-bar">
          <div 
            class="progress-fill"
            :style="{ width: progressWidth }"
          ></div>
        </div>
        <div class="page-dots">
          <button
            v-for="(_, index) in pages"
            :key="index"
            @click="goToPage(index)"
            class="dot"
            :class="{ active: index === currentIndex }"
          ></button>
        </div>
      </div>

      <button 
        @click="nextPage"
        :disabled="currentIndex >= totalPages - 1"
        class="nav-button"
      >
        下一页 →
      </button>
    </footer>

    <!-- 快捷键提示 -->
    <div class="keyboard-hints" v-if="showKeyboardHints && !isFullscreen">
      <span>← → 切换页面</span>
      <span>F 全屏</span>
      <span>ESC 退出</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { renderMarkdown } from '@/utils/markdownParser'
import { useFullscreen } from '@/composables/useFullscreen'
import { useKeyboardNavigation } from '@/composables/useKeyboardNavigation'
import type { PageConfig } from '@/types'

const props = defineProps<{
  pages: PageConfig[]
  initialIndex?: number
  showControls?: boolean
  showKeyboardHints?: boolean
}>()

const emit = defineEmits<{
  (e: 'page-change', index: number, page: PageConfig): void
  (e: 'fullscreen-change', isFullscreen: boolean): void
  (e: 'end'): void
}>()

const currentIndex = ref(props.initialIndex || 0)
const playerRef = ref<HTMLElement | null>(null)

const { isFullscreen, toggleFullscreen } = useFullscreen()
const { isEnabled } = useKeyboardNavigation({
  onNavigate: (event) => {
    switch (event.type) {
      case 'next':
        nextPage()
        break
      case 'prev':
        prevPage()
        break
      case 'goto':
        if (event.targetIndex !== undefined) {
          goToPage(event.targetIndex)
        }
        break
    }
  },
  onToggleFullscreen: () => toggleFullscreen(playerRef.value || undefined),
  onGoHome: () => goHome()
})

const currentPage = computed(() => props.pages[currentIndex.value])
const totalPages = computed(() => props.pages.length)

const progressWidth = computed(() => {
  if (totalPages.value === 0) return '0%'
  return `${((currentIndex.value + 1) / totalPages.value) * 100}%`
})

const renderedContent = computed(() => {
  if (!currentPage.value) return ''
  return renderMarkdown(currentPage.value.content)
})

function nextPage() {
  if (currentIndex.value < totalPages.value - 1) {
    currentIndex.value++
    emitPageChange()
  } else {
    emit('end')
  }
}

function prevPage() {
  if (currentIndex.value > 0) {
    currentIndex.value--
    emitPageChange()
  }
}

function goToPage(index: number) {
  if (index >= 0 && index < totalPages.value) {
    currentIndex.value = index
    emitPageChange()
  }
}

function goHome() {
  // 触发路由跳转或自定义事件
}

function emitPageChange() {
  if (currentPage.value) {
    emit('page-change', currentIndex.value, currentPage.value)
  }
}

// 监听全屏状态变化
watch(isFullscreen, (value) => {
  emit('fullscreen-change', value)
})

// 暴露方法给父组件
defineExpose({
  nextPage,
  prevPage,
  goToPage,
  toggleFullscreen
})
</script>

<style scoped>
.demo-player {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--background-color, #ffffff);
  color: var(--text-color, #1f2937);
  transition: background-color 0.3s ease;
}

.demo-player.is-fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
}

.player-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: var(--surface-color, #f8fafc);
  border-bottom: 1px solid var(--border-color, #e2e8f0);
}

.back-button,
.fullscreen-button {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color, #e2e8f0);
  background: white;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
}

.back-button:hover,
.fullscreen-button:hover {
  background: var(--primary-color, #3b82f6);
  color: white;
  border-color: var(--primary-color, #3b82f6);
}

.page-indicator {
  font-size: 1rem;
  font-weight: 500;
}

.player-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}

.page-container {
  max-width: 1000px;
  margin: 0 auto;
}

.page-title {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: var(--primary-color, #3b82f6);
}

.page-body {
  font-size: 1.125rem;
  line-height: 1.8;
}

.player-footer {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 2rem;
  background: var(--surface-color, #f8fafc);
  border-top: 1px solid var(--border-color, #e2e8f0);
}

.nav-button {
  padding: 0.75rem 1.5rem;
  border: 1px solid var(--border-color, #e2e8f0);
  background: white;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
}

.nav-button:hover:not(:disabled) {
  background: var(--primary-color, #3b82f6);
  color: white;
  border-color: var(--primary-color, #3b82f6);
}

.nav-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.progress-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.progress-bar {
  height: 4px;
  background: var(--border-color, #e2e8f0);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--primary-color, #3b82f6);
  transition: width 0.3s ease;
}

.page-dots {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: none;
  background: var(--border-color, #e2e8f0);
  cursor: pointer;
  transition: all 0.2s;
}

.dot.active {
  background: var(--primary-color, #3b82f6);
  transform: scale(1.2);
}

.keyboard-hints {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  display: flex;
  gap: 1rem;
  padding: 0.5rem 1rem;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  border-radius: 0.5rem;
  font-size: 0.875rem;
}

.keyboard-hints span {
  opacity: 0.8;
}
</style>
