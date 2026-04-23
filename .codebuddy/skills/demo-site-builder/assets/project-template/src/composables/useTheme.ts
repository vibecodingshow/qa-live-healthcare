/**
 * 主题管理组合式函数
 * 提供主题切换和管理功能的Composable
 */

import { ref, watch, onMounted } from 'vue'

export type ThemeMode = 'light' | 'dark' | 'auto'

export interface ThemeConfig {
  /** 主题模式 */
  mode: ThemeMode
  /** 主色调 */
  primaryColor?: string
  /** 次要色调 */
  secondaryColor?: string
  /** 背景色 */
  backgroundColor?: string
  /** 文字色 */
  textColor?: string
}

const STORAGE_KEY = 'demo-site-theme'

/**
 * 主题状态管理
 */
export function useTheme(initialMode?: ThemeMode) {
  const mode = ref<ThemeMode>(initialMode || 'light')
  const actualMode = ref<'light' | 'dark'>('light')
  const config = ref<ThemeConfig>({
    mode: 'light',
    primaryColor: '#3b82f6',
    secondaryColor: '#64748b',
    backgroundColor: '#ffffff',
    textColor: '#1f2937'
  })

  /**
   * 从本地存储加载主题
   */
  function loadTheme(): void {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const savedConfig = JSON.parse(saved)
        mode.value = savedConfig.mode || 'light'
        config.value = { ...config.value, ...savedConfig }
      }
    } catch (error) {
      console.error('加载主题失败:', error)
    }
  }

  /**
   * 保存主题到本地存储
   */
  function saveTheme(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        mode: mode.value,
        ...config.value
      }))
    } catch (error) {
      console.error('保存主题失败:', error)
    }
  }

  /**
   * 更新实际主题
   */
  function updateActualMode(): void {
    if (mode.value === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      actualMode.value = prefersDark ? 'dark' : 'light'
    } else {
      actualMode.value = mode.value
    }
    applyTheme()
  }

  /**
   * 应用主题到文档
   */
  function applyTheme(): void {
    const html = document.documentElement
    
    // 移除旧主题类
    html.classList.remove('theme-light', 'theme-dark')
    
    // 添加新主题类
    html.classList.add(`theme-${actualMode.value}`)
    
    // 设置CSS变量
    html.style.setProperty('--primary-color', config.value.primaryColor || '#3b82f6')
    html.style.setProperty('--secondary-color', config.value.secondaryColor || '#64748b')
    html.style.setProperty('--background-color', config.value.backgroundColor || '#ffffff')
    html.style.setProperty('--text-color', config.value.textColor || '#1f2937')
  }

  /**
   * 设置主题模式
   */
  function setMode(newMode: ThemeMode): void {
    mode.value = newMode
    updateActualMode()
    saveTheme()
  }

  /**
   * 切换主题
   */
  function toggleTheme(): void {
    const newMode = actualMode.value === 'light' ? 'dark' : 'light'
    mode.value = newMode
    updateActualMode()
    saveTheme()
  }

  /**
   * 设置主题配置
   */
  function setConfig(newConfig: Partial<ThemeConfig>): void {
    config.value = { ...config.value, ...newConfig }
    updateActualMode()
    saveTheme()
  }

  /**
   * 重置为默认主题
   */
  function resetTheme(): void {
    mode.value = 'light'
    config.value = {
      mode: 'light',
      primaryColor: '#3b82f6',
      secondaryColor: '#64748b',
      backgroundColor: '#ffffff',
      textColor: '#1f2937'
    }
    updateActualMode()
    saveTheme()
  }

  /**
   * 监听系统主题变化
   */
  function handleSystemThemeChange(event: MediaQueryListEvent): void {
    if (mode.value === 'auto') {
      actualMode.value = event.matches ? 'dark' : 'light'
      applyTheme()
    }
  }

  onMounted(() => {
    // 加载保存的主题
    loadTheme()
    
    // 监听系统主题变化
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', handleSystemThemeChange)
    
    // 初始应用主题
    updateActualMode()
  })

  // 监听模式变化
  watch(mode, () => {
    updateActualMode()
  })

  return {
    mode,
    actualMode,
    config,
    setMode,
    toggleTheme,
    setConfig,
    resetTheme
  }
}
