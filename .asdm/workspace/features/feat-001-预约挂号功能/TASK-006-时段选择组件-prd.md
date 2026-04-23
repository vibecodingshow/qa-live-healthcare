# Task PRD: 时段选择组件

**Feature ID**: FEAT-001
**Feature Name**: 预约挂号功能
**Sub-Feature**: SUB-002 号源查询与选择
**Task ID**: TASK-006
**Created Date**: 2026-04-22
**Status**: TODO
**Language**: zh

---

## 1. Task Overview

### 1.1 Task Summary

开发时段选择组件，供患者在预约流程中选择具体的就诊时段，支持上午/下午/晚上等多个时段的展示和选择。

### 1.2 Task Objectives

- 展示可选择的时段列表
- 显示每个时段的剩余号源
- 支持单选/多选模式
- 提供选中状态的视觉反馈
- 支持时段不可用状态的禁用处理

### 1.3 Related Feature Requirements

- Feature PRD: `feature-prd.md`
- User Story: US-002 (选择具体的日期和时间进行预约)
- Functional Requirement: FR-003 (患者端：预约时间选择)
- **Blocked by**: TASK-004 (号源实时查询API)

---

## 2. Detailed Requirements

### 2.1 Functional Requirements

| ID | 需求描述 | 优先级 |
|----|---------|--------|
| FR-006-01 | 展示时段列表（上午/下午/晚上） | Must |
| FR-006-02 | 显示时段的可预约时间范围 | Must |
| FR-006-03 | 显示时段剩余号源数量 | Must |
| FR-006-04 | 支持单选模式 | Must |
| FR-006-05 | 支持多选模式（可选） | Should |
| FR-006-06 | 选中状态高亮 | Must |
| FR-006-07 | 不可用时段禁用状态 | Must |
| FR-006-08 | 点击时段触发选中事件 | Must |
| FR-006-09 | 支持滑动快速选择 | Should |

### 2.2 Technical Requirements

| ID | 技术要求 |
|----|---------|
| TR-006-01 | 移动端触摸友好 | Must |
| TR-006-02 | 动画流畅（60fps） | Must |
| TR-006-03 | 组件props类型安全 | Must |
| TR-006-04 | 支持键盘导航 | Should |

### 2.3 Constraints and Limitations

- 需要从API获取时段数据
- 时段数据与医生排班相关
- 需要考虑时段切换动画

---

## 3. Implementation Approach

### 3.1 Recommended Methodology

1. **组件设计**：
   - `TimeSlotPicker.vue` - 时段选择主组件
   - `TimeSlotItem.vue` - 时段项组件

2. **Props 接口**：
   ```typescript
   interface TimeSlotPickerProps {
     slots: TimeSlot[]
     selectedSlot?: TimeSlot
     multiple?: boolean
     disabled?: boolean
   }
   ```

3. **Event 设计**：
   - `@select`: 时段选择事件
   - `@deselect`: 时段取消选择事件

### 3.2 Implementation Steps

1. **Step 1: 定义类型和接口**
   - TimeSlot 类型定义
   - Props 和 Emits 接口

2. **Step 2: 开发时段项组件**
   - 时段信息展示
   - 选中/禁用状态样式
   - 点击交互

3. **Step 3: 开发时段选择器主组件**
   - 时段列表渲染
   - 单选/多选逻辑
   - 状态管理

4. **Step 4: 添加动画效果**
   - 选中动画
   - 禁用状态过渡

5. **Step 5: 添加键盘导航支持**
   - Tab切换
   - Enter/Space选择

6. **Step 6: 验证实现**
   - **Validation Step**: 运行 `npm run build` 确保编译通过
   - 运行 `npm run lint` 确保代码风格符合规范

### 3.3 Technical Considerations

- 使用 CSS Flexbox 或 Grid 布局
- 使用 CSS Transition 处理动画
- 考虑使用 VueUse 的 useVModel

### 3.4 Reference to Project Context

- `.asdm/contexts/standard-coding-style.md`: Vue组件编码规范
- `.asdm/contexts/api.md`: API数据格式

---

## 4. Acceptance Criteria

### 4.1 Primary Criteria

| 验收标准 | 测试方法 | 验证工具 |
|---------|---------|----------|
| 时段列表正确显示 | 验证各时段渲染 | 功能测试 |
| 选中状态正确 | 点击验证样式变化 | 功能测试 |
| 禁用状态正确 | 测试不可用时段 | 功能测试 |
| 事件正确触发 | 监听select事件 | 单元测试 |
| 移动端交互正常 | 手机真机测试 | 手动测试 |
| **代码编译无错误** | 运行构建命令 | `npm run build` |
| **代码风格符合规范** | 运行lint检查 | `npm run lint` |

### 4.2 Edge Cases

| 边界情况 | 预期行为 |
|---------|---------|
| slots为空数组 | 显示"暂无可选时段" |
| 只有一个可用时段 | 自动选中和滚动 |
| 快速连续点击 | 防抖处理 |

### 4.3 Negative Tests

| 负向测试用例 | 预期行为 |
|------------|---------|
| 传入无效slots数据 | 显示友好错误提示 |
| 在禁用状态下点击 | 无响应 |

---

## 5. Dependencies

### 5.1 Task Dependencies

| 类型 | 依赖任务 | 说明 |
|------|---------|------|
| Blocked by | TASK-004 | 依赖时段数据格式定义 |

### 5.2 External Dependencies

| 依赖类型 | 依赖内容 | 说明 |
|---------|---------|------|
| 图标库 | @iconify/vue | 时段图标 |

### 5.3 Prerequisites

- TASK-004 已完成
- TASK-005 已完成（状态标识）

---

## 6. Estimated Effort

### 6.1 Effort Estimate

| 指标 | 值 |
|------|---|
| 预估工时 | 6小时 |
| Story Points | 3 |
| 复杂度 | Medium |
| 风险 | Low |

### 6.2 Effort Factors

| 影响因素 | 影响说明 |
|---------|---------|
| 动画复杂度 | 流畅动画需要调试 |
| 移动端适配 | 需要真机测试 |

---

## 7. Testing Strategy

### 7.1 Automated Validation (Required)

| 验证类型 | 命令 | 成功标准 |
|---------|------|---------|
| 构建验证 | `npm run build` | Exit code 0 |
| 代码质量 | `npm run lint` | Exit code 0 |
| 类型检查 | `npm run type-check` | Exit code 0 |

### 7.2 Unit Testing

- 组件渲染测试
- 单选逻辑测试
- 多选逻辑测试
- 事件触发测试
- **Validation command**: `npm run test:unit`
- **Success criteria**: 所有测试通过

### 7.3 Integration Testing

- 与日历组件集成测试
- 完整预约流程测试
- **Validation command**: `npm run test:e2e`
- **Success criteria**: E2E测试通过

### 7.4 Manual Testing

- 多设备交互测试
- 动画流畅度测试
- 无障碍测试

---

## 8. Implementation Notes

- 组件应使用 `<script setup lang="ts">` 语法
- 导出的组件应包含组件类型
- 提供完整的Props默认值
- 考虑添加slot支持自定义内容

---

## 9. Risks and Mitigations

### Risk 1: 移动端点击延迟

- **Impact**: Medium
- **Mitigation**: 使用 `-webkit-tap-highlight-color: transparent` 优化

### Risk 2: 动画性能问题

- **Impact**: Low
- **Mitigation**: 使用CSS transform，避免layout thrashing

---

## 10. Deliverables

| 交付物 | 说明 |
|-------|------|
| 类型定义 | `TimeSlot.ts` |
| 时段项组件 | `TimeSlotItem.vue` |
| 时段选择器组件 | `TimeSlotPicker.vue` |
| 单元测试 | `__tests__/TimeSlotPicker.test.ts` |
| Storybook文档 | `stories/TimeSlotPicker.stories.ts` |

### Mandatory Deliverable: Validation Results

- **Build output**: 编译成功日志
- **Test results**: 单元测试通过率 100%
- **质量检查**: ESLint检查通过

---

**Document Owner:** AI Assistant
**Last Updated:** 2026-04-22
