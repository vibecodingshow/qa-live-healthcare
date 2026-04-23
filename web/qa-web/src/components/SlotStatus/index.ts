// 导出类型定义
export * from './types'

// 导出组件
import SlotStatusBadge from './SlotStatusBadge.vue'
import SlotStatusTag from './SlotStatusTag.vue'

export { SlotStatusBadge, SlotStatusTag }

// 默认导出
export default {
  install(app: any) {
    app.component('SlotStatusBadge', SlotStatusBadge)
    app.component('SlotStatusTag', SlotStatusTag)
  }
}