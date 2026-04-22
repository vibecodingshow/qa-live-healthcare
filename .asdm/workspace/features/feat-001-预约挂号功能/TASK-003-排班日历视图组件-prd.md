# Task PRD: 排班日历视图组件

**Feature ID**: FEAT-001  
**Feature Name**: 预约挂号功能  
**Sub-Feature**: SUB-001 医生排班展示  
**Task ID**: TASK-003  
**Created Date**: 2026-04-22  
**Status**: TODO  
**Language**: zh

---

## 1. Task Overview

### 1.1 Task Summary

开发可复用的排班日历视图组件，支持月视图展示、日期状态标识（可约/已满/停诊）、月份切换等功能，供排班列表页和医生详情页使用。

### 1.2 Task Objectives

- 提供通用的日历视图组件
- 支持多种日期状态展示
- 支持月份前后切换
- 支持日期点击事件
- 可配置化（可预约日期范围、可选时段等）

### 1.3 Related Feature Requirements

- Feature PRD: `feature-prd.md`
- User Story: US-001 (查看医生排班安排)
- Functional Requirement: FR-001 (患者端：医生排班信息展示)
- **Blocked by**: TASK-001 (医生排班列表页面开发)

---

## 2. Detailed Requirements

### 2.1 Functional Requirements

| ID | 需求描述 | 优先级 |
|----|---------|--------|
| FR-003-01 | 月视图日历展示 | Must |
| FR-003-02 | 日期可选状态标识（可约/已满/停诊/不可选） | Must |
| FR-003-03 | 今日高亮标识 | Should |
| FR-003-04 | 过去日期禁用状态 | Must |
| FR-003-05 | 月份切换（上一个月/下一个月） | Must |
| FR-003-06 | 日期点击事件 | Must |
| FR-003-07 | 日期选中状态 | Must |
| FR-003-08 | 可配置显示的月份范围 | Should |
| FR-003-09 | 周起始日可配置（周一/周日） | Should |

### 2.2 Technical Requirements

| ID | 技术要求 |
|----|---------|
| TR-003-01 | 组件props类型安全（TypeScript） |
| TR-003-02 | 支持PC端和移动端 |
| TR-003-03 | 日历切换动画流畅 |
| TR-003-04 | 可独立使用或组合使用 |
| TR-003-05 | 支持暗黑模式 |

### 2.3 Constraints and Limitations

- 组件需独立于具体业务逻辑
- 需要考虑国际化支持
- 性能需满足大数据量渲染

---

## 3. Implementation Approach

### 3.1 Recommended Methodology

1. **组件设计**：采用 Compound Components 模式
   - `ScheduleCalendar.vue` - 主组件
   - `CalendarHeader.vue` - 日历头部（月份切换）
   - `CalendarGrid.vue` - 日历网格
   - `CalendarDay.vue` - 日期单元格

2. **Props 接口设计**：
   ```typescript
   interface CalendarProps {
     markedDates?: DateMark[]
     selectedDate?: Date
     startDate?: Date
     endDate?: Date
     weekStartsOn?: 0 | 1
     disablePast?: boolean
   }
   ```

3. **Event 设计**：
   - `@select`: 日期选择事件
   - `@month-change`: 月份切换事件

### 3.2 Implementation Steps

1. **Step 1: 定义类型和接口**
   - 定义 DateMark 类型（日期标记）
   - 定义组件 Props 接口
   - 定义 Emits 接口

2. **Step 2: 开发日历头部组件**
   - 月份年份显示
   - 左右切换按钮
   - 今日快捷按钮（可选）

3. **Step 3: 开发日历网格组件**
   - 周标题行（周一至周日）
   - 日期网格生成
   - 日期状态计算

4. **Step 4: 开发日期单元格组件**
   - 日期状态样式
   - 点击交互
   - 禁用状态

5. **Step 5: 组装主组件**
   - Props 传递和验证
   - 事件处理
   - 样式整合

6. **Step 6: 添加动画**
   - 月份切换过渡动画

7. **Step 7: 验证实现**
   - **Validation Step**: 运行 `npm run build` 确保编译通过
   - 运行 `npm run lint` 确保代码风格符合规范

### 3.3 Technical Considerations

- 使用 `date-fns` 或 `dayjs` 处理日期计算
- 考虑使用 CSS Grid 布局日历网格
- 动画使用 Vue Transition Group

### 3.4 Reference to Project Context

- `.asdm/contexts/standard-coding-style.md`: Vue组件编码规范
- `.asdm/contexts/data-models.md`: 数据模型规范

---

## 4. Acceptance Criteria

### 4.1 Primary Criteria

| 验收标准 | 测试方法 | 验证工具 |
|---------|---------|----------|
| 日历正确显示当前月份 | 验证日期和星期对应 | 手动测试 |
| 日期状态正确标识 | 对比传入的 markedDates | 功能测试 |
| 月份切换正常 | 点击切换按钮验证 | 功能测试 |
| 点击日期触发事件 | 监听 select 事件 | 单元测试 |
| 过去日期禁用 | 测试过去日期是否可选 | 功能测试 |
| 组件可复用 | 在不同页面使用验证 | 集成测试 |
| **代码编译无错误** | 运行构建命令 | `npm run build` |
| **代码风格符合规范** | 运行lint检查 | `npm run lint` |

### 4.2 Edge Cases

| 边界情况 | 预期行为 |
|---------|---------|
| markedDates 为空 | 所有可选日期正常显示 |
| selectedDate 不在 markedDates 中 | 正确处理，不报错 |
| 快速连续点击切换月份 | 防抖处理 |
| 跨年月份切换 | 正确处理年份变化 |

### 4.3 Negative Tests

| 负向测试用例 | 预期行为 |
|------------|---------|
| 传入无效日期格式 | 友好的错误提示或默认值处理 |
| Props 类型错误 | TypeScript 编译警告 |

---

## 5. Dependencies

### 5.1 Task Dependencies

| 类型 | 依赖任务 | 说明 |
|------|---------|------|
| Blocked by | TASK-001 | 依赖排班数据结构定义 |

### 5.2 External Dependencies

| 依赖类型 | 依赖内容 | 说明 |
|---------|---------|------|
| 工具库 | date-fns 或 dayjs | 日期处理 |

### 5.3 Prerequisites

- TASK-001 已完成
- 日期处理工具库可用

---

## 6. Estimated Effort

### 6.1 Effort Estimate

| 指标 | 值 |
|------|---|
| 预估工时 | 8小时 |
| Story Points | 5 |
| 复杂度 | High |
| 风险 | Medium |

### 6.2 Effort Factors

| 影响因素 | 影响说明 |
|---------|---------|
| 组件复杂度 | 通用组件需考虑多种场景 |
| 动画效果 | 流畅动画需要较多调试 |
| 测试覆盖 | 需覆盖多种日期状态 |

---

## 7. Testing Strategy

### 7.1 Automated Validation (Required)

| 验证类型 | 命令 | 成功标准 |
|---------|------|---------|
| 构建验证 | `npm run build` | Exit code 0，无编译错误 |
| 代码质量 | `npm run lint` | Exit code 0，无lint错误 |
| 类型检查 | `npm run type-check` | Exit code 0 |

### 7.2 Unit Testing

- 日期计算逻辑测试
- Props 验证测试
- 事件触发测试
- 状态计算测试
- **Validation command**: `npm run test:unit`
- **Success criteria**: 所有测试通过，覆盖率 > 80%

### 7.3 Integration Testing

- 组件组合使用测试
- 事件数据传递测试
- **Validation command**: `npm run test:e2e`
- **Success criteria**: E2E测试通过

### 7.4 Manual Testing

- 不同屏幕尺寸适配
- 键盘导航支持
- 触摸滑动切换月份

---

## 8. Implementation Notes

- 组件应使用 `<script setup>` 语法
- 所有 Props 应有默认值
- 组件应支持按需引入
- 考虑添加 loading 状态支持

---

## 9. Risks and Mitigations

### Risk 1: 日期处理边界情况

- **Impact**: High
- **Mitigation**: 充分测试日期边界场景，使用成熟的日期库

### Risk 2: 移动端触摸交互

- **Impact**: Medium
- **Mitigation**: 参考现有项目实现，参考 Material Design 交互规范

---

## 10. Deliverables

| 交付物 | 说明 |
|-------|------|
| 日历组件目录 | `src/components/ScheduleCalendar/` |
| 主组件文件 | `index.vue` |
| 头部组件 | `CalendarHeader.vue` |
| 网格组件 | `CalendarGrid.vue` |
| 日期单元格组件 | `CalendarDay.vue` |
| 类型定义 | `types.ts` |
| 单元测试 | `__tests__/ScheduleCalendar.test.ts` |
| Storybook 文档 | `stories/ScheduleCalendar.stories.ts` |

### Mandatory Deliverable: Validation Results

- **Build output**: 编译成功日志，exit code 0
- **Test results**: 单元测试通过率 100%，覆盖率 > 80%
- **Quality checks**: ESLint 检查通过

---

**Document Owner:** AI Assistant  
**Last Updated:** 2026-04-22
