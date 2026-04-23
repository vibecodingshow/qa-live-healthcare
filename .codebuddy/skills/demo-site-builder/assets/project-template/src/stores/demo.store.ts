import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Page } from '@/types'

export const useDemoStore = defineStore('demo', () => {
  // 状态
  const currentPageIndex = ref(0)
  const pages = ref<Page[]>([])
  const isPlaying = ref(false)
  const isFullscreen = ref(false)
  const isLoading = ref(false)

  // 计算属性
  const totalPages = computed(() => pages.value.length)
  const currentPage = computed(() => pages.value[currentPageIndex.value])
  const hasNextPage = computed(() => currentPageIndex.value < totalPages.value - 1)
  const hasPrevPage = computed(() => currentPageIndex.value > 0)
  const progress = computed(() => {
    if (totalPages.value === 0) return 0
    return ((currentPageIndex.value + 1) / totalPages.value) * 100
  })

  // 方法
  function nextPage(): boolean {
    if (hasNextPage.value) {
      currentPageIndex.value++
      return true
    }
    return false
  }

  function prevPage(): boolean {
    if (hasPrevPage.value) {
      currentPageIndex.value--
      return true
    }
    return false
  }

  function goToPage(index: number): boolean {
    if (index >= 0 && index < totalPages.value) {
      currentPageIndex.value = index
      return true
    }
    return false
  }

  function goToFirst(): void {
    currentPageIndex.value = 0
  }

  function goToLast(): void {
    currentPageIndex.value = totalPages.value - 1
  }

  function setPages(newPages: Page[]): void {
    pages.value = newPages
    currentPageIndex.value = 0
  }

  function toggleFullscreen(): void {
    isFullscreen.value = !isFullscreen.value
  }

  function togglePlay(): void {
    isPlaying.value = !isPlaying.value
  }

  function startPlay(): void {
    isPlaying.value = true
  }

  function stopPlay(): void {
    isPlaying.value = false
  }

  function reset(): void {
    currentPageIndex.value = 0
    isPlaying.value = false
    isFullscreen.value = false
  }

  return {
    // 状态
    currentPageIndex,
    pages,
    isPlaying,
    isFullscreen,
    isLoading,
    
    // 计算属性
    totalPages,
    currentPage,
    hasNextPage,
    hasPrevPage,
    progress,
    
    // 方法
    nextPage,
    prevPage,
    goToPage,
    goToFirst,
    goToLast,
    setPages,
    toggleFullscreen,
    togglePlay,
    startPlay,
    stopPlay,
    reset
  }
})
