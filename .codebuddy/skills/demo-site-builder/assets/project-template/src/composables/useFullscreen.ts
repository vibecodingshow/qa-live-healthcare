/**
 * 全屏控制组合式函数
 * 提供全屏功能的Composable
 */

import { ref, onMounted, onUnmounted } from 'vue'

/**
 * 全屏状态管理
 */
export function useFullscreen() {
  const isFullscreen = ref(false)
  const isSupported = ref(false)

  /**
   * 检查浏览器是否支持全屏API
   */
  function checkSupport(): boolean {
    return !!(
      document.fullscreenEnabled ||
      (document as any).webkitFullscreenEnabled ||
      (document as any).mozFullScreenEnabled ||
      (document as any).msFullscreenEnabled
    )
  }

  /**
   * 获取当前全屏元素
   */
  function getFullscreenElement(): Element | null {
    return (
      document.fullscreenElement ||
      (document as any).webkitFullscreenElement ||
      (document as any).mozFullScreenElement ||
      (document as any).msFullscreenElement ||
      null
    )
  }

  /**
   * 进入全屏
   */
  async function enterFullscreen(element?: HTMLElement): Promise<boolean> {
    const target = element || document.documentElement

    try {
      if (target.requestFullscreen) {
        await target.requestFullscreen()
      } else if ((target as any).webkitRequestFullscreen) {
        await (target as any).webkitRequestFullscreen()
      } else if ((target as any).mozRequestFullScreen) {
        await (target as any).mozRequestFullScreen()
      } else if ((target as any).msRequestFullscreen) {
        await (target as any).msRequestFullscreen()
      }
      return true
    } catch (error) {
      console.error('进入全屏失败:', error)
      return false
    }
  }

  /**
   * 退出全屏
   */
  async function exitFullscreen(): Promise<boolean> {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen()
      } else if ((document as any).webkitExitFullscreen) {
        await (document as any).webkitExitFullscreen()
      } else if ((document as any).mozCancelFullScreen) {
        await (document as any).mozCancelFullScreen()
      } else if ((document as any).msExitFullscreen) {
        await (document as any).msExitFullscreen()
      }
      return true
    } catch (error) {
      console.error('退出全屏失败:', error)
      return false
    }
  }

  /**
   * 切换全屏状态
   */
  async function toggleFullscreen(element?: HTMLElement): Promise<boolean> {
    if (isFullscreen.value) {
      return await exitFullscreen()
    } else {
      return await enterFullscreen(element)
    }
  }

  /**
   * 全屏状态变化处理
   */
  function handleFullscreenChange(): void {
    isFullscreen.value = !!getFullscreenElement()
  }

  /**
   * 键盘快捷键处理
   */
  function handleKeydown(event: KeyboardEvent): void {
    // F键或F11键切换全屏
    if (event.key === 'F' || event.key === 'F11') {
      event.preventDefault()
      toggleFullscreen()
    }
    // ESC键退出全屏
    if (event.key === 'Escape' && isFullscreen.value) {
      exitFullscreen()
    }
  }

  onMounted(() => {
    isSupported.value = checkSupport()
    
    // 监听全屏状态变化
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
    document.addEventListener('mozfullscreenchange', handleFullscreenChange)
    document.addEventListener('MSFullscreenChange', handleFullscreenChange)
    
    // 监听键盘事件
    document.addEventListener('keydown', handleKeydown)
  })

  onUnmounted(() => {
    // 移除事件监听
    document.removeEventListener('fullscreenchange', handleFullscreenChange)
    document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
    document.removeEventListener('mozfullscreenchange', handleFullscreenChange)
    document.removeEventListener('MSFullscreenChange', handleFullscreenChange)
    
    document.removeEventListener('keydown', handleKeydown)
  })

  return {
    isFullscreen,
    isSupported,
    enterFullscreen,
    exitFullscreen,
    toggleFullscreen
  }
}
