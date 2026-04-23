/**
 * 键盘导航组合式函数
 * 提供键盘快捷键导航功能的Composable
 */

import { ref, onMounted, onUnmounted, computed } from 'vue'
import type { KeyboardShortcut, NavigationEvent } from '@/types'

/**
 * 键盘导航状态管理
 */
export function useKeyboardNavigation(options: {
  onNavigate?: (event: NavigationEvent) => void
  onToggleFullscreen?: () => void
  onTogglePlay?: () => void
  onGoHome?: () => void
  enabled?: boolean
}) {
  const {
    onNavigate,
    onToggleFullscreen,
    onTogglePlay,
    onGoHome,
    enabled = true
  } = options

  /** 是否启用 */
  const isEnabled = ref(enabled)

  /** 快捷键映射 */
  const shortcuts = computed<KeyboardShortcut[]>(() => [
    {
      key: 'ArrowRight',
      description: '下一页',
      handler: () => onNavigate?.({ type: 'next' })
    },
    {
      key: 'ArrowLeft',
      description: '上一页',
      handler: () => onNavigate?.({ type: 'prev' })
    },
    {
      key: 'ArrowDown',
      description: '下一页',
      handler: () => onNavigate?.({ type: 'next' })
    },
    {
      key: 'ArrowUp',
      description: '上一页',
      handler: () => onNavigate?.({ type: 'prev' })
    },
    {
      key: 'Home',
      description: '第一页',
      handler: () => onNavigate?.({ type: 'first' })
    },
    {
      key: 'End',
      description: '最后一页',
      handler: () => onNavigate?.({ type: 'last' })
    },
    {
      key: 'Space',
      description: '播放/暂停',
      handler: () => onTogglePlay?.()
    },
    {
      key: 'f',
      modifiers: [],
      description: '全屏切换',
      handler: () => onToggleFullscreen?.()
    },
    {
      key: 'Escape',
      description: '退出全屏/返回首页',
      handler: () => onGoHome?.()
    }
  ])

  /**
   * 处理键盘事件
   */
  function handleKeydown(event: KeyboardEvent): void {
    if (!isEnabled.value) return

    // 检查是否在输入框中
    const target = event.target as HTMLElement
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable
    ) {
      return
    }

    // 查找匹配的快捷键
    const shortcut = shortcuts.value.find(s => {
      if (s.key !== event.key) return false
      
      // 检查修饰键
      const modifiers = s.modifiers || []
      if (modifiers.includes('ctrl') !== event.ctrlKey) return false
      if (modifiers.includes('alt') !== event.altKey) return false
      if (modifiers.includes('shift') !== event.shiftKey) return false
      if (modifiers.includes('meta') !== event.metaKey) return false
      
      return true
    })

    if (shortcut) {
      event.preventDefault()
      shortcut.handler()
    }
  }

  /**
   * 启用键盘导航
   */
  function enable(): void {
    isEnabled.value = true
  }

  /**
   * 禁用键盘导航
   */
  function disable(): void {
    isEnabled.value = false
  }

  /**
   * 获取快捷键提示文本
   */
  function getShortcutHints(): string[] {
    return shortcuts.value.map(s => {
      const modifiers = s.modifiers?.join('+') || ''
      return `${modifiers}${modifiers ? '+' : ''}${s.key}: ${s.description}`
    })
  }

  onMounted(() => {
    document.addEventListener('keydown', handleKeydown)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
  })

  return {
    isEnabled,
    shortcuts,
    enable,
    disable,
    getShortcutHints
  }
}
