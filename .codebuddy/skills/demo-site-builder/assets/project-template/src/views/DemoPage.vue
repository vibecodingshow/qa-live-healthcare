<template>
  <div class="demo-page">
    <div class="demo-header">
      <button @click="goHome" class="back-button">← 返回</button>
      <div class="page-info">
        <span>{{ currentIndex + 1 }} / {{ totalPages }}</span>
      </div>
      <button @click="toggleFullscreen" class="fullscreen-button">
        {{ isFullscreen ? '退出全屏' : '全屏' }}
      </button>
    </div>

    <div class="demo-content" v-if="currentPage">
      <h1>{{ currentPage.title }}</h1>
      <div class="markdown-body" v-html="renderedContent"></div>
    </div>
    <div class="empty-state" v-else>
      <p>暂无内容</p>
    </div>

    <div class="demo-footer">
      <button 
        @click="prevPage" 
        :disabled="currentIndex === 0"
        class="nav-button"
      >
        ← 上一页
      </button>
      
      <div class="progress-container">
        <div class="progress-bar">
          <div class="progress" :style="{ width: progressWidth }"></div>
        </div>
      </div>
      
      <button 
        @click="nextPage"
        :disabled="currentIndex >= totalPages - 1"
        class="nav-button"
      >
        下一页 →
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useDemoStore } from '@/stores/demo.store'
import { useFullscreen } from '@/composables/useFullscreen'
import { useKeyboardNavigation } from '@/composables/useKeyboardNavigation'
import { renderMarkdown } from '@/utils/markdownParser'

const props = defineProps<{
  pageId: string
}>()

const router = useRouter()
const demoStore = useDemoStore()
const { isFullscreen, toggleFullscreen } = useFullscreen()

// 键盘导航
useKeyboardNavigation({
  onNavigate: (event) => {
    switch (event.type) {
      case 'next':
        nextPage()
        break
      case 'prev':
        prevPage()
        break
    }
  },
  onToggleFullscreen: () => toggleFullscreen()
})

const currentIndex = computed(() => demoStore.currentPageIndex)
const totalPages = computed(() => demoStore.totalPages)
const currentPage = computed(() => demoStore.currentPage)

const progressWidth = computed(() => {
  if (totalPages.value === 0) return '0%'
  return `${((currentIndex.value + 1) / totalPages.value) * 100}%`
})

const renderedContent = computed(() => {
  if (!currentPage.value) return ''
  return renderMarkdown(currentPage.value.content)
})

function goHome() {
  router.push('/')
}

function prevPage() {
  demoStore.prevPage()
}

function nextPage() {
  demoStore.nextPage()
}
</script>

<style scoped>
.demo-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--background-color, #ffffff);
}

.demo-header {
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

.page-info {
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-color, #1f2937);
}

.demo-content {
  flex: 1;
  padding: 3rem;
  max-width: 1200px;
  margin: 0 auto;
  overflow-y: auto;
}

.demo-content h1 {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: var(--primary-color, #3b82f6);
}

.empty-state {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-color, #1f2937);
}

.demo-footer {
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
}

.progress-bar {
  height: 4px;
  background: var(--border-color, #e2e8f0);
  border-radius: 2px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background: var(--primary-color, #3b82f6);
  transition: width 0.3s ease;
}
</style>
