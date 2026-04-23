# Task PRD: 预约挂号页面 - 医生列表与排班

**Feature ID**: FEAT-001
**Feature Name**: appointment-booking
**Task ID**: TASK-004
**Created Date**: 2026-04-22
**Status**: DONE
**Language**: zh

## 1. Task Overview

### 1.1 Task Summary

- **任务描述**：实现 `src/views/Appointment.vue` 预约挂号页面的核心布局和交互——患者身份验证区域、在线医生列表视图、排班详情视图（日期选择 + 时段展示），实现医生选择→日期选择→时段选择的完整浏览流程。
- **任务目的**：让患者可以浏览所有在线医生的排班信息，选择日期和可用时间段，为后续的预约提交（TASK-005）做好准备。
- **关联需求**：满足 Feature PRD REQ-002（预约挂号页面）、Story 1 的 AC-1.1 至 AC-1.3。

### 1.2 Task Objectives

- 目标 1：实现患者身份验证区域（复用 `verifyPatient` 逻辑，与 Consultation.vue 风格一致）
- 目标 2：实现医生列表视图——展示所有在线医生的卡片列表（复用 Doctors.vue 的卡片样式）
- 目标 3：实现排班详情视图——展示所选医生的可预约日期列表（未来 7 天）和日期对应的可预约时段列表（上午/下午分组，已满标记）
- 目标 4：实现两个视图之间的切换导航（点击医生卡片进入排班详情，点击返回按钮回到列表）
- 目标 5：页面顶部添加 `a-alert` 提示"预约数据仅保存在当前会话中，刷新页面后将丢失"

### 1.3 Related Feature Requirements

- **Feature Requirement**: REQ-002 预约挂号页面
- **Related User Story**: Story 1（AC-1.1 医生列表、AC-1.2 日期列表、AC-1.3 时间段列表、AC-1.6 患者身份验证）

## 2. Detailed Requirements

### 2.1 Functional Requirements

- **FR-1**：未验证身份时显示验证表单（姓名 + 生日），验证成功后显示预约主界面
- **FR-2**：医生列表视图展示 `store.getActiveDoctors()` 返回的所有在线医生卡片，卡片显示头像、姓名、职称、科室、专长标签，点击卡片进入排班详情
- **FR-3**：排班详情视图顶部显示"← 返回列表"按钮和所选医生信息（头像 + 姓名 + 职称 + 科室）
- **FR-4**：日期选择区域展示未来 7 天的日期标签（使用 `a-radio-group` 或自定义按钮组），默认选中第一天
- **FR-5**：时段展示区域按"上午"和"下午"分组，使用按钮/标签展示各时段，可用时段可点击选中，已满（`booked`）时段显示为灰色不可点击
- **FR-6**：选中的时段高亮显示（使用 Ant Design 主题色 `#1890ff`）
- **FR-7**：页面顶部显示会话数据提示 `a-alert`（type="warning"）

### 2.2 Technical Requirements

- **TR-1**：组件使用 `<script setup lang="ts">` + Composition API
- **TR-2**：CSS 使用 `<style scoped>` 纯 CSS，主色 `#1890ff`，渐变 `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- **TR-3**：日期计算使用 `dayjs`（已安装），排班数据从 `store.getSlotsByDoctorAndDate()` 获取
- **TR-4**：响应式适配使用 `@media (max-width: 768px)` 断点
- **TR-5**：页面最大宽度 `1200px`，内边距 `24px`，页面背景 `#f0f2f5`

### 2.3 Constraints and Limitations

- 不实现预约提交功能（由 TASK-005 负责），本任务仅实现浏览和选择
- 不修改任何现有组件文件
- 底部"预约挂号"按钮在本任务中可显示但禁用（placeholder），TASK-005 中激活

### 2.4 安全要求 (Security Requirements)

- **SEC-1**：患者身份验证表单的输入必须使用 `v-model` 双向绑定，不使用 `v-html` 渲染用户输入，防止 XSS 攻击
- **SEC-2**：医生列表数据中显示的姓名、职称、专长等信息从 Store 静态数据获取，不涉及用户输入，无注入风险
- **SEC-3**：日期和时段选择控件使用组件化按钮（`a-button`、`a-radio-group`），不接受自由文本输入，防止日期/时间注入
- **SEC-4**：`dayjs` 日期计算仅用于前端展示，不涉及服务端交互，无日期操纵风险
- **SEC-5**：页面顶部的会话数据提示 `a-alert` 明确告知用户数据不持久化，防止用户误以为数据已安全保存

### 2.5 合规要求 (Compliance Requirements)

- **CMP-1**：会话数据提示（`a-alert` type="warning"）满足知情同意要求，明确告知用户"预约数据仅保存在当前会话中，刷新页面后将丢失"
- **CMP-2**：患者身份验证复用 `store.verifyPatient()` 逻辑，确保患者身份识别的合规性和一致性
- **CMP-3**：医生列表仅展示 `isActive: true` 的在线医生，不暴露离线医生信息，遵循数据最小化原则
- **CMP-4**：排班信息展示遵循医疗场景下的信息透明原则——患者可查看医生的完整排班和可用时段

## 3. Implementation Approach

### 3.1 Recommended Methodology

- 页面布局采用条件渲染：`v-if="!currentPatient"` 显示验证区域，`v-else` 显示预约主界面
- 预约主界面内部采用 `v-if="!selectedDoctor"` / `v-else` 切换医生列表和排班详情两个视图
- 医生卡片样式参考 `Doctors.vue` 的 `doctor-card` 样式（grid 布局、圆角卡片、hover 效果）
- 时段选择使用 `a-button` 组件，通过 `:disabled` 和 `:type` 控制可用/已满/选中状态

### 3.2 Implementation Steps

**步骤 0：声明响应式变量**

在 `<script setup lang="ts">` 顶部声明以下变量：

```typescript
import { ref, computed } from 'vue'
import { useStore } from '../store'
import dayjs from 'dayjs'

const store = useStore()

// 身份验证
const patientName = ref('')
const patientBirthday = ref('')
const currentPatient = ref(store.currentPatient)

// 视图切换
const selectedDoctor = ref<any>(null)
const selectedDate = ref(dayjs().add(1, 'day').format('YYYY-MM-DD'))
const selectedSlot = ref<any>(null)
```

**步骤 1：搭建页面骨架**

创建/替换 `Appointment.vue`，结构如下：

```html
<template>
  <div class="appointment">
    <!-- 身份验证区域 -->
    <div v-if="!currentPatient" class="auth-section">...</div>
    <!-- 预约主界面 -->
    <div v-else class="appointment-container">
      <a-alert message="预约数据仅保存在当前会话中，刷新页面后将丢失" type="warning" show-icon style="margin-bottom: 24px" />
      <!-- 医生列表视图 -->
      <div v-if="!selectedDoctor">...</div>
      <!-- 排班详情视图 -->
      <div v-else>...</div>
    </div>
  </div>
</template>
```

**步骤 2：实现身份验证**

复用 `store.verifyPatient()` 逻辑，参考 `Consultation.vue` 的验证表单样式（`.auth-section`、`.auth-card`）。验证成功后设置 `currentPatient.value`。

**步骤 3：实现医生列表视图**

```html
<div class="doctor-grid">
  <a-card v-for="doctor in activeDoctors" :key="doctor.id"
    class="doctor-card" hoverable @click="selectedDoctor = doctor">
    <template #cover>
      <img :src="doctor.avatar" :alt="doctor.name" />
    </template>
    <a-card-meta :title="doctor.name" :description="doctor.department">
      <template #description>
        <p>{{ doctor.title }}</p>
        <div><a-tag v-for="tag in doctor.specialties" :key="tag">{{ tag }}</a-tag></div>
      </template>
    </a-card-meta>
  </a-card>
</div>
```

计算属性：`const activeDoctors = computed(() => store.getActiveDoctors())`

**步骤 4：实现排班详情视图**

4a. 日期选择（未来 7 天按钮组）：

```typescript
const next7Days = computed(() => {
  return Array.from({ length: 7 }, (_, i) => {
    const d = dayjs().add(i + 1, 'day')
    return { date: d.format('YYYY-MM-DD'), label: d.format('M/D'), fullLabel: d.format('YYYY年MM月DD日 dddd') }
  })
})
```

```html
<div class="date-selector">
  <a-button v-for="d in next7Days" :key="d.date"
    :type="selectedDate === d.date ? 'primary' : 'default'"
    shape="round" size="small" @click="selectedDate = d.date"
    :title="d.fullLabel">
    {{ d.label }}
  </a-button>
</div>
```

4b. 时段展示（上午/下午分组）：

```typescript
const slotsForDate = computed(() => {
  if (!selectedDoctor.value || !selectedDate.value) return []
  return store.getSlotsByDoctorAndDate(selectedDoctor.value.id, selectedDate.value)
})

const morningSlots = computed(() => slotsForDate.value.filter(s => s.period === 'morning'))
const afternoonSlots = computed(() => slotsForDate.value.filter(s => s.period === 'afternoon'))
```

```html
<div class="slot-group">
  <h4>上午</h4>
  <div class="slot-buttons">
    <a-button v-for="slot in morningSlots" :key="slot.id"
      :disabled="slot.status === 'booked'"
      :type="selectedSlot?.id === slot.id ? 'primary' : 'default'"
      size="small" @click="selectedSlot = slot">
      {{ slot.timeSlot }}
    </a-button>
  </div>
</div>
<!-- 下午同理 -->
```

**步骤 5：添加样式**

页面背景 `.appointment { background: #f0f2f5; }`、卡片 `.doctor-card { ... }`、时段按钮 `.slot-buttons { display: flex; flex-wrap: wrap; gap: 8px; }`、响应式 `@media (max-width: 768px) { .doctor-grid { grid-template-columns: 1fr; } }`

**步骤 6：验证**

- 运行 `npm run build` 确认编译通过
- 启动 dev server，验证各视图切换和交互

### 3.3 Technical Considerations

- 日期标签格式化为 `M/D`（如 `4/23`），鼠标悬停显示完整日期（`title` 属性）
- 未来 7 天的日期列表应为计算属性，基于 `dayjs()` 动态生成
- 时段按钮的已满状态通过对比 `appointmentSlots` 中该时段的 `status === 'booked'` 判断（需获取全部排班而非仅 available 的）
- 使用 `store.getSlotsByDoctorAndDate()` 获取某天全部时段（包含 booked），然后判断每个时段状态

### 3.4 Reference to Project Context

- `.asdm/contexts/standard-coding-style.md`：编码风格指南
- `.asdm/contexts/standard-project-structure.md`：项目结构规范
- Feature PRD 第 5.4 节：Appointment.vue 页面布局结构设计

## 4. Acceptance Criteria

### 4.1 Primary Criteria

- **AC-1**：未验证身份时显示验证表单，验证成功后切换到预约主界面
  - Test method：浏览器交互测试
  - **Validation tool**: `npm run build`（exit code 0）
- **AC-2**：医生列表正确展示所有在线医生（doc001/doc002/doc003/doc005），离线医生（doc004）不显示
  - Test method：浏览器检查渲染的卡片数量为 4
  - **Validation tool**: `npm run build`（exit code 0）
- **AC-3**：点击医生卡片切换到排班详情视图，显示医生信息和日期选择
  - Test method：浏览器交互测试
  - **Validation tool**: `npm run build`（exit code 0）
- **AC-4**：日期选择展示未来 7 天，默认选中第一天；切换日期后时段列表更新
  - Test method：浏览器交互测试
  - **Validation tool**: `npm run build`（exit code 0）
- **AC-5**：可用时段可点击选中并高亮，已满时段灰色不可点击
  - Test method：浏览器交互测试
  - **Validation tool**: `npm run build`（exit code 0）
- **AC-6**：点击"← 返回列表"回到医生列表视图，清空已选时段
  - Test method：浏览器交互测试
  - **Validation tool**: `npm run build`（exit code 0）
- **AC-7**：页面顶部显示会话数据提示 `a-alert`，提示文本精确为"预约数据仅保存在当前会话中，刷新页面后将丢失"
  - Test method：浏览器检查 alert 组件渲染和文本内容
  - **Validation tool**: `npm run build`（exit code 0）
- **AC-8**：`npm run build` 构建成功
  - **Validation tool**: `npm run build`（exit code 0）
- **AC-9**：响应式布局——在 768px 以下断点，医生卡片网格从多列变为单列布局
  - Test method：缩小浏览器窗口至 768px 以下，验证卡片变为纵向排列
  - **Validation tool**: `npm run build`（exit code 0）

### 4.2 Edge Cases

- 如果某个医生某天没有任何排班数据（JSON 中缺失），显示"该日暂无排班"
- 如果某个医生某天所有时段都已 booked，显示"该日已约满"
- 移动端下卡片网格变为单列布局

### 4.3 Negative Tests

- 已验证身份后刷新页面，身份状态丢失（符合预期），需重新验证
- 访问 `/appointment` 时排班数据为空（JSON 未加载），不应报错

## 5. Dependencies

### 5.1 Task Dependencies

- **Depends on**: TASK-001（数据模型和 JSON 数据文件）、TASK-002（Store 方法）、TASK-003（路由配置和占位组件）
- **Blocks**: TASK-005（预约提交依赖本任务的时段选择状态）

### 5.2 External Dependencies

- `ant-design-vue`：`a-card`、`a-alert`、`a-button`、`a-tag`、`a-empty`、`a-badge`
- `@ant-design/icons-vue`：`CalendarOutlined`、`LeftOutlined`、`UserOutlined`
- `dayjs`：日期计算和格式化

### 5.3 Prerequisites

- TASK-001、TASK-002、TASK-003 均已完成

## 6. Estimated Effort

### 6.1 Effort Estimate

- **Estimated effort**: 2 hours
- **Complexity**: Medium
- **Risk**: Medium

### 6.2 Effort Factors

- 页面交互较复杂，包含多个视图切换
- 时段选择和日期联动的状态管理需仔细实现

## 7. Testing Strategy

### 7.1 Automated Validation (Required)

- **Build validation**: `npm run build`
- **Exit criteria**: exit code 0

### 7.2 Functional Testing

- 未验证身份时验证页面显示验证表单（非预约主界面）
- 输入错误身份信息验证验证失败提示
- 输入正确身份信息验证切换到预约主界面
- 验证医生列表仅展示 4 个在线医生（doc001/doc002/doc003/doc005），doc004 不显示
- 点击每个医生卡片验证进入排班详情，医生信息显示正确
- 验证日期选择展示 7 天，默认选中第一天
- 切换不同日期验证时段列表更新
- 点击可用时段验证高亮，再点击其他可用时段验证切换
- 点击已满（booked）时段验证不可点击
- 点击"← 返回列表"验证回到医生列表，已选时段清空

### 7.3 Edge Case Testing

- 选择某医生后，如果该医生某天无排班数据，验证显示"该日暂无排班"
- 选择某医生后，如果某天所有时段已 booked，验证显示"该日已约满"
- 缩小浏览器窗口至 768px 以下，验证卡片网格变为单列布局

### 7.4 Security Verification

- 在验证表单的姓名输入框中输入 `<script>alert(1)</script>`，验证提交后页面不执行脚本（XSS 防护）
- 验证页面顶部会话数据提示正常显示

### 7.5 Regression Testing

- 验证现有页面（首页、问诊、医生、关于）功能不受影响
- 验证导航菜单功能正常

## 8. Implementation Notes

- 验证表单样式参考 `Consultation.vue` 的 `.auth-section` 和 `.auth-card` 样式
- 医生卡片样式参考 `Doctors.vue` 的 `.doctor-card` 样式
- 排班详情视图的布局参考 Feature PRD 第 5.4 节的 ASCII 布局图
- 日期按钮使用 `a-button` shape="round" size="small"，选中时 type="primary"
- 时段按钮使用 `a-button` size="small"，选中时 type="primary"，已满时 disabled

## 9. Risks and Mitigations

### Risk 1

- **Description**: 页面组件较大（预估 300+ 行），代码组织需清晰
- **Impact**: Low
- **Mitigation**: 将页面逻辑按视图拆分为清晰的代码段，使用注释分隔

## 10. Deliverables

- `src/views/Appointment.vue`：完整的预约挂号页面组件（医生列表 + 排班详情 + 身份验证）
- **Build output**: `npm run build` 成功，exit code 0

---

*此任务 PRD 由 Task Breakdown 工具集生成。*
