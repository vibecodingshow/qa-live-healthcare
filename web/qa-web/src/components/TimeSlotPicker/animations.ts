/**
 * 时段选择器动画配置
 */

import { computed } from 'vue'

/** 动画配置接口 */
export interface AnimationConfig {
  duration: number
  easing: string
  delay?: number
}

/** 默认动画配置 */
export const defaultAnimationConfig: AnimationConfig = {
  duration: 0.2,
  easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
}

/** 选中动画配置 */
export const selectAnimationConfig: AnimationConfig = {
  duration: 0.15,
  easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
}

/** 悬停动画配置 */
export const hoverAnimationConfig: AnimationConfig = {
  duration: 0.1,
  easing: 'ease-out'
}

/** 获取CSS过渡属性 */
export function getTransitionProperties(config: AnimationConfig): string {
  const { duration, easing, delay = 0 } = config
  return `all ${duration}s ${easing} ${delay}s`
}

/** 创建动画CSS变量 */
export function createAnimationVariables(config: AnimationConfig = defaultAnimationConfig) {
  return {
    '--animation-duration': `${config.duration}s`,
    '--animation-easing': config.easing,
    '--animation-delay': `${config.delay || 0}s`
  }
}

/** 缩放动画 */
export const scaleAnimation = {
  enter: {
    scale: 1,
    opacity: 1
  },
  leave: {
    scale: 0.8,
    opacity: 0
  }
}

/** 淡入淡出动画 */
export const fadeAnimation = {
  enter: {
    opacity: 1
  },
  leave: {
    opacity: 0
  }
}

/** 滑动动画 */
export const slideAnimation = {
  enter: {
    translateY: 0,
    opacity: 1
  },
  leave: {
    translateY: -10,
    opacity: 0
  }
}

/** 创建动画hook */
export function useAnimation(config?: AnimationConfig) {
  const animationConfig = computed(() => config || defaultAnimationConfig)
  
  const transition = computed(() => {
    return getTransitionProperties(animationConfig.value)
  })
  
  const variables = computed(() => {
    return createAnimationVariables(animationConfig.value)
  })
  
  return {
    transition,
    variables,
    config: animationConfig
  }
}