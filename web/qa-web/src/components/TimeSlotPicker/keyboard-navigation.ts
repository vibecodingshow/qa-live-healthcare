/**
 * 时段选择器键盘导航管理
 */

import { ref, computed, type Ref } from 'vue'
import type { TimeSlot } from './types'

/** 键盘导航方向 */
export enum NavigationDirection {
  UP = 'up',
  DOWN = 'down',
  LEFT = 'left',
  RIGHT = 'right',
  NEXT = 'next',
  PREVIOUS = 'previous'
}

/** 键盘导航配置 */
export interface KeyboardNavigationConfig {
  /** 是否启用键盘导航 */
  enabled: boolean
  /** 是否循环导航 */
  loop: boolean
  /** 网格布局时的列数 */
  columns: number
  /** 是否支持方向键导航 */
  arrowKeys: boolean
  /** 是否支持Tab导航 */
  tabNavigation: boolean
  /** Home键行为 */
  homeKey: 'first' | 'start'
  /** End键行为 */
  endKey: 'last' | 'end'
}

/** 默认键盘导航配置 */
export const defaultKeyboardConfig: KeyboardNavigationConfig = {
  enabled: true,
  loop: true,
  columns: 3,
  arrowKeys: true,
  tabNavigation: true,
  homeKey: 'first',
  endKey: 'last'
}

/** 键盘导航状态 */
export interface NavigationState {
  /** 当前焦点索引 */
  focusedIndex: number
  /** 是否启用导航 */
  enabled: boolean
  /** 导航项总数 */
  totalItems: number
  /** 是否循环模式 */
  loopMode: boolean
}

/** 键盘导航hook */
export function useKeyboardNavigation(
  slots: Ref<TimeSlot[]>,
  config: Partial<KeyboardNavigationConfig> = {}
) {
  const navigationConfig = { ...defaultKeyboardConfig, ...config }
  
  // 焦点状态
  const focusedIndex = ref(-1)
  const isNavigating = ref(false)
  
  // 计算可用时段索引
  const availableSlotIndices = computed(() => {
    return slots.value
      .map((slot, index) => ({ slot, index }))
      .filter(({ slot }) => 
        slot.status !== 'full' && slot.status !== 'suspended'
      )
      .map(({ index }) => index)
  })
  
  // 焦点时段
  const focusedSlot = computed(() => {
    if (focusedIndex.value === -1 || !slots.value[focusedIndex.value]) {
      return null
    }
    return slots.value[focusedIndex.value]
  })
  
  // 导航到指定索引
  function navigateTo(index: number) {
    if (index < 0 || index >= slots.value.length) return
    
    focusedIndex.value = index
    isNavigating.value = true
    
    // 触发焦点事件
    setTimeout(() => {
      isNavigating.value = false
    }, 100)
  }
  
  // 根据方向导航
  function navigate(direction: NavigationDirection) {
    if (!navigationConfig.enabled || availableSlotIndices.value.length === 0) return
    
    const currentIndex = focusedIndex.value
    const total = availableSlotIndices.value.length
    const currentPosition = availableSlotIndices.value.indexOf(currentIndex)
    
    let newPosition = -1
    
    switch (direction) {
      case NavigationDirection.NEXT:
      case NavigationDirection.RIGHT:
        newPosition = currentPosition + 1
        if (newPosition >= total) {
          newPosition = navigationConfig.loop ? 0 : currentPosition
        }
        break
        
      case NavigationDirection.PREVIOUS:
      case NavigationDirection.LEFT:
        newPosition = currentPosition - 1
        if (newPosition < 0) {
          newPosition = navigationConfig.loop ? total - 1 : currentPosition
        }
        break
        
      case NavigationDirection.UP:
        if (navigationConfig.columns > 1) {
          newPosition = currentPosition - navigationConfig.columns
          if (newPosition < 0) {
            newPosition = navigationConfig.loop ? total - 1 : currentPosition
          }
        }
        break
        
      case NavigationDirection.DOWN:
        if (navigationConfig.columns > 1) {
          newPosition = currentPosition + navigationConfig.columns
          if (newPosition >= total) {
            newPosition = navigationConfig.loop ? 0 : currentPosition
          }
        }
        break
    }
    
    if (newPosition !== -1 && newPosition !== currentPosition) {
      navigateTo(availableSlotIndices.value[newPosition])
    }
  }
  
  // 导航到第一个
  function navigateToFirst() {
    if (availableSlotIndices.value.length > 0) {
      navigateTo(availableSlotIndices.value[0])
    }
  }
  
  // 导航到最后一个
  function navigateToLast() {
    if (availableSlotIndices.value.length > 0) {
      navigateTo(availableSlotIndices.value[availableSlotIndices.value.length - 1])
    }
  }
  
  // 处理键盘事件
  function handleKeydown(event: KeyboardEvent) {
    if (!navigationConfig.enabled) return
    
    const key = event.key
    const isArrowKey = key.startsWith('Arrow')
    
    // 如果当前没有焦点，先聚焦到第一个可用项
    if (focusedIndex.value === -1 && availableSlotIndices.value.length > 0) {
      navigateToFirst()
      return
    }
    
    // 阻止默认行为
    if (isArrowKey || key === 'Tab' || key === 'Home' || key === 'End') {
      event.preventDefault()
    }
    
    // 处理按键
    switch (key) {
      case 'ArrowRight':
        if (navigationConfig.arrowKeys) {
          navigate(NavigationDirection.RIGHT)
        }
        break
        
      case 'ArrowLeft':
        if (navigationConfig.arrowKeys) {
          navigate(NavigationDirection.LEFT)
        }
        break
        
      case 'ArrowUp':
        if (navigationConfig.arrowKeys) {
          navigate(NavigationDirection.UP)
        }
        break
        
      case 'ArrowDown':
        if (navigationConfig.arrowKeys) {
          navigate(NavigationDirection.DOWN)
        }
        break
        
      case 'Tab':
        if (navigationConfig.tabNavigation) {
          if (event.shiftKey) {
            navigate(NavigationDirection.PREVIOUS)
          } else {
            navigate(NavigationDirection.NEXT)
          }
        }
        break
        
      case 'Home':
        if (navigationConfig.homeKey === 'first') {
          navigateToFirst()
        }
        break
        
      case 'End':
        if (navigationConfig.endKey === 'last') {
          navigateToLast()
        }
        break
        
      case 'Enter':
      case ' ':
        if (focusedSlot.value) {
          // 触发选择事件
          event.preventDefault()
          // 这里需要调用选择逻辑，由父组件处理
          return { type: 'select', slot: focusedSlot.value }
        }
        break
    }
    
    return null
  }
  
  // 重置导航状态
  function resetNavigation() {
    focusedIndex.value = -1
    isNavigating.value = false
  }
  
  return {
    focusedIndex,
    focusedSlot,
    isNavigating,
    navigationConfig,
    navigateTo,
    navigate,
    navigateToFirst,
    navigateToLast,
    handleKeydown,
    resetNavigation,
    availableSlotIndices
  }
}