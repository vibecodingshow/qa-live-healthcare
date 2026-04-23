# Task PRD: 路由配置与导航集成

**Feature ID**: FEAT-001
**Feature Name**: appointment-booking
**Task ID**: TASK-003
**Created Date**: 2026-04-22
**Status**: DONE
**Language**: zh

## 1. Task Overview

### 1.1 Task Summary

- **任务描述**：在 `src/router/index.ts` 中新增 `/appointment` 路由，在 `src/components/AppHeader.vue` 导航菜单中新增"预约挂号"入口，在 `src/components/AppFooter.vue` 快速链接中新增预约挂号链接。
- **任务目的**：为预约挂号页面提供路由访问能力和导航入口，使患者可以通过顶部菜单和页脚链接访问预约挂号功能。
- **关联需求**：满足 Feature PRD REQ-006（导航集成）。

### 1.2 Task Objectives

- 目标 1：在路由表中新增 `/appointment` 路由，指向 `Appointment.vue` 组件
- 目标 2：在 AppHeader 导航菜单的"问诊"和"医生"之间新增"预约挂号"菜单项
- 目标 3：在 AppHeader 的 `selectedKeys` watch 逻辑中新增 `/appointment` 路径匹配
- 目标 4：在 AppFooter 快速链接列表中新增"预约挂号"链接

### 1.3 Related Feature Requirements

- **Feature Requirement**: REQ-006 导航集成
- **Related User Story**: Story 1（患者访问预约挂号页面）

## 2. Detailed Requirements

### 2.1 Functional Requirements

- **FR-1**：路由表新增一条记录 `{ path: '/appointment', name: 'Appointment', component: Appointment }`，放在 `/consultation/:doctorUsername` 路由之后
- **FR-2**：AppHeader 新增菜单项，key 为 `appointment`，图标使用 `CalendarOutlined`，显示文本为"预约挂号"，点击导航至 `/appointment`
- **FR-3**：AppHeader 的 `watch(route.path)` 逻辑中新增 `/appointment` 的 `selectedKeys` 匹配（`else if (newPath.startsWith('/appointment')) { selectedKeys.value = ['appointment']; }`）
- **FR-4**：AppFooter 快速链接中在"问诊"链接之后新增"预约挂号"链接，href 为 `/appointment`
- **FR-5**：import `CalendarOutlined` 图标组件

### 2.2 Technical Requirements

- **TR-1**：路由 import 语句新增 `import Appointment from '../views/Appointment.vue';`（此时该文件尚不存在，可创建一个空的占位组件，或在后续任务中创建）
- **TR-2**：AppHeader 菜单项按以下顺序排列：首页 → 问诊 → **预约挂号** → 医生 → 关于
- **TR-3**：AppHeader 中 `CalendarOutlined` 的 import 需添加到现有图标 import 语句中
- **TR-4**：保持与现有代码完全一致的缩进（2 空格）和代码风格

### 2.3 Constraints and Limitations

- 不修改现有的 7 条路由配置（仅追加）
- 不修改现有的 4 个菜单项的 key 和文本（仅追加）
- 不修改 AppHeader 的 CSS 样式
- AppFooter 仅在"快速链接"区域追加一个 `<li>` 项

### 2.4 安全要求 (Security Requirements)

- **SEC-1**：`/appointment` 路由不应包含动态参数中可能存在的路径注入风险（当前为静态路由，无此风险）
- **SEC-2**：导航菜单项中所有链接路径必须以 `/` 开头的相对路径，禁止使用外部 URL 或 `javascript:` 伪协议
- **SEC-3**：AppFooter 中的"预约挂号"链接 `href` 必须为 `/appointment`，不得包含查询参数或外部域名

### 2.5 合规要求 (Compliance Requirements)

- **CMP-1**：导航菜单项文本"预约挂号"使用规范中文表述，不包含误导性或营销性用语
- **CMP-2**：页面路由命名 `name: 'Appointment'` 遵循 PascalCase 命名规范，与现有路由命名风格一致（`Consultation`、`Doctors`、`About`）
- **CMP-3**：新增菜单项的图标使用 `CalendarOutlined`，语义准确表达"预约/日历"含义

## 3. Implementation Approach

### 3.1 Recommended Methodology

- **路由文件**：在 `src/router/index.ts` 中，在现有路由数组末尾追加新路由（或按功能分组插入适当位置）
- **AppHeader**：在菜单项中插入新的 `a-menu-item`，并在 import 和 watch 中做对应修改
- **AppFooter**：在快速链接列表中追加一个 `<li>` 元素

### 3.2 Implementation Steps

1. **创建占位组件**（如 TASK-004 尚未完成）：创建 `src/views/Appointment.vue`，内容为最小化的空页面（仅有 template 和 basic style），确保路由注册不报错
2. **注册路由**：在 `src/router/index.ts` 中新增 import 和路由记录
3. **修改 AppHeader**：新增菜单项、图标 import、watch 路径匹配
4. **修改 AppFooter**：新增快速链接
5. **验证步骤**：运行 `npm run build` 确认编译通过

### 3.3 Technical Considerations

- 如果 `Appointment.vue` 尚未创建，需要创建一个最小的占位组件，否则 `npm run build` 会因为 import 找不到文件而失败
- 占位组件示例：
  ```vue
  <template>
    <div class="appointment">
      <div class="appointment-container">
        <h1>预约挂号</h1>
        <p>功能开发中...</p>
      </div>
    </div>
  </template>
  <script setup lang="ts">
  </script>
  <style scoped>
  .appointment {
    min-height: calc(100vh - 64px);
    padding-top: 64px;
    background: #f0f2f5;
  }
  .appointment-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 24px;
  }
  </style>
  ```

### 3.4 Reference to Project Context

- `.asdm/contexts/standard-coding-style.md`：编码风格指南
- `.asdm/contexts/standard-project-structure.md`：项目结构规范

## 4. Acceptance Criteria

### 4.1 Primary Criteria

- **AC-1**：访问 `/appointment` 路径可以显示页面（不报 404 或白屏）
  - Test method：启动 dev server，浏览器访问 `http://localhost:5173/appointment`
  - **Validation tool**: `npm run build`（exit code 0）
- **AC-2**：AppHeader 导航菜单显示"预约挂号"菜单项，带有日历图标
  - Test method：检查页面渲染
  - **Validation tool**: `npm run build`（exit code 0）
- **AC-3**：点击"预约挂号"菜单项导航至 `/appointment`，且菜单高亮状态正确
  - Test method：浏览器交互测试
  - **Validation tool**: `npm run build`（exit code 0）
- **AC-4**：AppFooter 快速链接区域显示"预约挂号"链接
  - Test method：检查页面渲染
  - **Validation tool**: `npm run build`（exit code 0）
- **AC-5**：`npm run build` 构建成功
  - **Validation tool**: `npm run build`（exit code 0）

### 4.2 Edge Cases

- 在非 `/appointment` 路径下，"预约挂号"菜单项不高亮
- 刷新 `/appointment` 页面后菜单高亮状态保持（依赖 watch immediate）

### 4.3 Negative Tests

- 现有 7 条路由未被修改（路径、组件映射不变）
- 现有 4 个菜单项的功能和样式不受影响
- AppFooter 现有链接不受影响

## 5. Dependencies

### 5.1 Task Dependencies

- **Depends on**: NONE（无前置依赖，但需创建 `Appointment.vue` 占位组件）
- **Blocks**: TASK-004（预约页面依赖路由配置）

### 5.2 External Dependencies

- `@ant-design/icons-vue`：`CalendarOutlined` 图标（已安装）

### 5.3 Prerequisites

- 无前置任务依赖

## 6. Estimated Effort

### 6.1 Effort Estimate

- **Estimated effort**: 0.5 hours
- **Complexity**: Low
- **Risk**: Low

### 6.2 Effort Factors

- 修改量小，仅涉及 3 个文件
- 逻辑简单，无复杂业务

## 7. Testing Strategy

### 7.1 Automated Validation (Required)

- **Build validation**: `npm run build`
- **Exit criteria**: exit code 0

### 7.2 Navigation Functional Testing

- 启动 `npm run dev`，在浏览器地址栏直接输入 `http://localhost:5173/appointment`，验证页面正常渲染（非 404）
- 点击顶部导航"预约挂号"菜单项，验证 URL 变为 `/appointment` 且菜单高亮状态正确
- 点击页脚"预约挂号"链接，验证跳转到 `/appointment`
- 在 `/appointment` 页面刷新浏览器（F5），验证菜单高亮状态保持
- 在其他页面（如首页、问诊）下，验证"预约挂号"菜单项不高亮

### 7.3 Regression Testing

- 验证现有 7 条路由（首页、问诊、医生、关于等）正常工作
- 验证现有 4 个菜单项（首页、问诊、医生、关于）功能和样式不受影响
- 验证 AppFooter 现有链接（首页、问诊、关于）点击跳转正常

### 7.4 Security Verification

- 检查新增路由配置中不包含通配符或 catch-all 等可能被利用的路径模式
- 验证所有新增 `href` 属性值均为 `/appointment`，无外部链接或可疑协议

## 8. Implementation Notes

- AppHeader 中的菜单项顺序建议为：首页(key="home") → 问诊(key="consultation") → **预约挂号(key="appointment")** → 医生(key="doctors") → 关于(key="about")
- `CalendarOutlined` 需要添加到现有的图标 import 语句中（与 `HomeOutlined` 等同行）
- AppFooter 的快速链接中，建议在 `<li><a href="/consultation">问诊</a></li>` 之后插入新链接

## 9. Risks and Mitigations

### Risk 1

- **Description**: 占位组件 `Appointment.vue` 需要存在，否则构建失败
- **Impact**: Medium
- **Mitigation**: 本任务中创建最小化占位组件，TASK-004 中替换为完整实现

## 10. Deliverables

- `src/router/index.ts`：新增 `/appointment` 路由
- `src/components/AppHeader.vue`：新增"预约挂号"菜单项
- `src/components/AppFooter.vue`：新增"预约挂号"快速链接
- `src/views/Appointment.vue`：最小化占位组件（如果 TASK-004 尚未完成）
- **Build output**: `npm run build` 成功，exit code 0

---

*此任务 PRD 由 Task Breakdown 工具集生成。*
