import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type ThemeMode = 'light' | 'dark' | 'auto'

export const useThemeStore = defineStore('theme', () => {
  // 状态
  const mode = ref<ThemeMode>('light')
  const actualMode = ref<'light' | 'dark'>('light')
  
  // 主题配置
  const config = ref({
    primaryColor: '#3b82f6',
    secondaryColor: '#64748b',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    surfaceColor: '#f8fafc',
    borderColor: '#e2e8f0'
  })

  // 计算属性
  const isLight = computed(() => actualMode.value === 'light')
  const isDark = computed(() => actualMode.value === 'dark')
  const isAuto = computed(() => mode.value === 'auto')

  // 方法
  function initTheme(): void {
    const saved = localStorage.getItem('demo-site-theme')
    if (saved) {
      try {
        const savedConfig = JSON.parse(saved)
        mode.value = savedConfig.mode || 'light'
        Object.assign(config.value, savedConfig)
      } catch (e) {
        console.error('加载主题失败:', e)
      }
    }
    
    // 监听系统主题变化
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', handleSystemThemeChange)
    
    updateActualMode()
    applyTheme()
  }

  function handleSystemThemeChange(event: MediaQueryListEvent): void {
    if (mode.value === 'auto') {
      actualMode.value = event.matches ? 'dark' : 'light'
      applyTheme()
    }
  }

  function updateActualMode(): void {
    if (mode.value === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      actualMode.value = prefersDark ? 'dark' : 'light'
    } else {
      actualMode.value = mode.value
    }
  }

  function applyTheme(): void {
    const html = document.documentElement
    
    // 移除旧主题类
    html.classList.remove('theme-light', 'theme-dark')
    
    // 添加新主题类
    html.classList.add(`theme-${actualMode.value}`)
    
    // 设置CSS变量
    if (actualMode.value === 'dark') {
      html.style.setProperty('--background-color', '#1f2937')
      html.style.setProperty('--text-color', '#f9fafb')
      html.style.setProperty('--surface-color', '#334155')
      html.style.setProperty('--border-color', '#475569')
    } else {
      html.style.setProperty('--background-color', config.value.backgroundColor)
      html.style.setProperty('--text-color', config.value.textColor)
      html.style.setProperty('--surface-color', config.value.surfaceColor)
      html.style.setProperty('--border-color', config.value.borderColor)
    }
    
    html.style.setProperty('--primary-color', config.value.primaryColor)
    html.style.setProperty('--secondary-color', config.value.secondaryColor)
  }

  function setMode(newMode: ThemeMode): void {
    mode.value = newMode
    updateActualMode()
    applyTheme()
    saveTheme()
  }

  function toggleTheme(): void {
    const newMode = actualMode.value === 'light' ? 'dark' : 'light'
    mode.value = newMode
    updateActualMode()
    applyTheme()
    saveTheme()
  }

  function setConfig(newConfig: Partial<typeof config.value>): void {
    Object.assign(config.value, newConfig)
    updateActualMode()
    applyTheme()
    saveTheme()
  }

  function resetTheme(): void {
    mode.value = 'light'
    config.value = {
      primaryColor: '#3b82f6',
      secondaryColor: '#64748b',
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
      surfaceColor: '#f8fafc',
      borderColor: '#e2e8f0'
    }
    updateActualMode()
    applyTheme()
    saveTheme()
  }

  function saveTheme(): void {
    try {
      localStorage.setItem('demo-site-theme', JSON.stringify({
        mode: mode.value,
        ...config.value
      }))
    } catch (e) {
      console.error('保存主题失败:', e)
    }
  }

  return {
    // 状态
    mode,
    actualMode,
    config,
    
    // 计算属性
    isLight,
    isDark,
    isAuto,
    
    // 方法
    initTheme,
    setMode,
    toggleTheme,
    setConfig,
    resetTheme
  }
})
