# Task PRD: 号源状态颜色标识UI

**Feature ID**: FEAT-001
**Feature Name**: 预约挂号功能
**Sub-Feature**: SUB-002 号源查询与选择
**Task ID**: TASK-005
**Created Date**: 2026-04-22
**Status**: TODO
**Language**: zh

---

## 1. Task Overview

### 1.1 Task Summary

开发号源状态颜色标识UI组件，在排班列表和医生详情页中，通过直观的颜色区分显示号源的不同状态，帮助患者快速识别可预约的时段。

### 1.2 Task Objectives

- 定义统一的号源状态颜色规范
- 开发可复用的状态标识组件
- 在排班列表中应用状态标识
- 支持色盲用户的无障碍设计

### 1.3 Related Feature Requirements

- Feature PRD: `feature-prd.md`
- User Story: US-002 (选择具体的日期和时间进行预约)
- Functional Requirement: FR-002 (患者端：号源查询)
- **Blocked by**: TASK-004 (号源实时查询API)

---

## 2. Detailed Requirements

### 2.1 Functional Requirements

| ID | 需求描述 | 优先级 |
|----|---------|--------|
| FR-005-01 | 号源可预约状态（绿色/蓝色） | Must |
| FR-005-02 | 号源已满状态（灰色） | Must |
| FR-005-03 | 号源停诊状态（红色） | Must |
| FR-005-04 | 号源紧张状态（橙色/黄色） | Should |
| FR-005-05 | 剩余号源数量显示 | Should |
| FR-005-06 | 鼠标悬停显示详细信息 | Should |
| FR-005-07 | 无障碍颜色+图标双重标识 | Should |

### 2.2 Technical Requirements

| ID | 技术要求 |
|----|---------|
| TR-005-01 | 支持暗黑模式 | Must |
| TR-005-02 | 颜色符合WCAG AA标准 | Must |
| TR-005-03 | 组件可配置化 | Must |
| TR-005-04 | 支持自定义颜色主题 | Should |

### 2.3 Constraints and Limitations

- 颜色需要与项目整体UI风格一致
- 需要考虑色盲用户的使用体验
- 组件需要支持SSR

---

## 3. Implementation Approach

### 3.1 Recommended Methodology

1. **组件设计**：采用函数式组件设计
   - `SlotStatusBadge.vue` - 状态徽章组件
   - `SlotStatusTag.vue` - 状态标签组件

2. **状态定义**：
   ```typescript
   enum SlotStatus {
     AVAILABLE = 'available',      // 可预约
     LOW_STOCK = 'low_stock',     // 号源紧张
     FULL = 'full',               // 已满
     SUSPENDED = 'suspended'      // 停诊
   }
   ```

3. **颜色配置**：
   ```typescript
   const statusColors = {
     available: { bg: '#52c41a', text: '#fff' },
     low_stock: { bg: '#faad14', text: '#fff' },
     full: { bg: '#d9d9d9', text: '#666' },
     suspended: { bg: '#ff4d4f', text: '#fff' }
   }
   ```

### 3.2 Implementation Steps

1. **Step 1: 定义类型和常量**
   - SlotStatus 枚举
   - 颜色配置常量
   - Props 类型定义

2. **Step 2: 开发状态徽章组件**
   - 状态图标+文字显示
   - 颜色样式应用
   - 悬停提示

3. **Step 3: 开发状态标签组件**
   - 简化版本
   - 仅显示颜色标识

4. **Step 4: 添加无障碍支持**
   - aria-label 属性
   - 颜色+图标双重标识

5. **Step 5: 支持暗黑模式**
   - CSS变量配置
   - 主题切换适配

6. **Step 6: 验证实现**
   - **Validation Step**: 运行 `npm run build` 确保编译通过
   - 运行 `npm run lint` 确保代码风格符合规范

### 3.3 Technical Considerations

- 使用 CSS Custom Properties 管理颜色变量
- 考虑使用 Tailwind CSS 的颜色系统
- 添加 loading 和 disabled 状态

### 3.4 Reference to Project Context

- `.asdm/contexts/standard-coding-style.md`: Vue组件编码规范
- UI设计规范文档

---

## 4. Acceptance Criteria

### 4.1 Primary Criteria

| 验收标准 | 测试方法 | 验证工具 |
|---------|---------|----------|
| 状态颜色正确显示 | 对比设计稿颜色 | 视觉测试 |
| 不同状态正确区分 | 测试4种状态显示 | 功能测试 |
| 暗黑模式正常显示 | 切换主题验证 | 功能测试 |
| 无障碍访问正常 | 屏幕阅读器测试 | 辅助工具 |
| **代码编译无错误** | 运行构建命令 | `npm run build` |
| **代码风格符合规范** | 运行lint检查 | `npm run lint` |

### 4.2 Edge Cases

| 边界情况 | 预期行为 |
|---------|---------|
| 未知状态传入 | 显示默认灰色 |
| 组件未传入状态 | 显示警告，默认为可用 |
| 颜色配置缺失 | 使用内置默认颜色 |

### 4.3 Negative Tests

| 负向测试用例 | 预期行为 |
|------------|---------|
| 传入非法状态值 | 控制台警告，降级处理 |
| 颜色值不合法 | 使用默认值 |

---

## 5. Dependencies

### 5.1 Task Dependencies

| 类型 | 依赖任务 | 说明 |
|------|---------|------|
| Blocked by | TASK-004 | 依赖API返回的状态数据 |

### 5.2 External Dependencies

| 依赖类型 | 依赖内容 | 说明 |
|---------|---------|------|
| 图标库 | @iconify/vue | 状态图标 |
| UI框架 | Tailwind CSS / Element Plus | 样式基础 |

### 5.3 Prerequisites

- TASK-004 已完成
- 项目UI框架已确定

---

## 6. Estimated Effort

### 6.1 Effort Estimate

| 指标 | 值 |
|------|---|
| 预估工时 | 4小时 |
| Story Points | 2 |
| 复杂度 | Low |
| 风险 | Low |

### 6.2 Effort Factors

| 影响因素 | 影响说明 |
|---------|---------|
| UI框架集成 | 已有框架可降低工作量 |
| 无障碍要求 | 需要额外测试时间 |

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
- Props验证测试
- 颜色配置测试
- **Validation command**: `npm run test:unit`
- **Success criteria**: 所有测试通过

### 7.3 Integration Testing

- 组件在页面中使用测试
- **Validation command**: `npm run test:e2e`
- **Success criteria**: E2E测试通过

### 7.4 Manual Testing

- 颜色对比设计稿
- 暗黑模式验证
- 色盲模拟测试

---

## 8. Implementation Notes

- 组件应使用 `<script setup lang="ts">` 语法
- 导出组件类型供外部使用
- 提供组件使用示例文档

---

## 9. Risks and Mitigations

### Risk 1: 颜色不符合设计规范

- **Impact**: Low
- **Mitigation**: 与UI设计师确认颜色值

### Risk 2: 色盲用户识别困难

- **Impact**: Medium
- **Mitigation**: 使用颜色+图标双重标识

---

## 10. Deliverables

| 交付物 | 说明 |
|-------|------|
| 状态枚举定义 | `SlotStatus.ts` |
| 颜色配置常量 | `slotStatusColors.ts` |
| 状态徽章组件 | `SlotStatusBadge.vue` |
| 状态标签组件 | `SlotStatusTag.vue` |
| 单元测试 | `__tests__/SlotStatusBadge.test.ts` |
| Storybook文档 | `stories/SlotStatusBadge.stories.ts` |

### Mandatory Deliverable: Validation Results

- **Build output**: 编译成功日志
- **Test results**: 单元测试通过率 100%
- **视觉验证**: 颜色对比通过

---

**Document Owner:** AI Assistant
**Last Updated:** 2026-04-22
