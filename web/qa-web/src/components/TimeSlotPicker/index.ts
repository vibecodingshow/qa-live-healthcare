/**
 * 时段选择器组件库入口文件
 */

import TimeSlotPicker from './TimeSlotPicker.vue'
import TimeSlotItem from './TimeSlotItem.vue'

export { TimeSlotPicker, TimeSlotItem }

export * from './types'
export * from './animations'
export * from './keyboard-navigation'

// 默认导出
import type { App } from 'vue'

export default {
  install(app: App) {
    app.component('TimeSlotPicker', TimeSlotPicker)
    app.component('TimeSlotItem', TimeSlotItem)
  }
}

declare module 'vue' {
  export interface GlobalComponents {
    TimeSlotPicker: typeof TimeSlotPicker
    TimeSlotItem: typeof TimeSlotItem
  }
}