# Task PRD: 预约挂号页面 - 预约提交流程

**Feature ID**: FEAT-001
**Feature Name**: appointment-booking
**Task ID**: TASK-005
**Created Date**: 2026-04-22
**Status**: DONE
**Language**: zh

## 1. Task Overview

### 1.1 Task Summary

- **任务描述**：在 `src/views/Appointment.vue` 中实现预约提交的完整流程——激活"预约挂号"按钮、添加确认弹窗（显示医生信息+日期+时段）、调用 `store.createAppointment()` 提交预约、使用 `message.success` 反馈结果。
- **任务目的**：让患者可以完成从选择时段到提交预约的完整操作闭环，将预约数据持久化到 Store 中。
- **关联需求**：满足 Feature PRD REQ-002（预约挂号页面）、Story 1 的 AC-1.4（确认 Modal）和 AC-1.5（成功提示）。

### 1.2 Task Objectives

- 目标 1：当患者选中了一个可用时段时，"预约挂号"按钮激活可点击
- 目标 2：点击"预约挂号"按钮弹出确认 Modal，展示医生姓名、预约日期、预约时段
- 目标 3：确认后调用 `store.createAppointment()` 创建预约记录，显示 `message.success` 提示
- 目标 4：预约成功后重置选择状态（清空已选时段），刷新排班展示（已预约时段变为已满）
- 目标 5：提交过程使用 `setTimeout` 500ms 模拟异步 + loading 状态（与 `addQuestion` 风格一致）

### 1.3 Related Feature Requirements

- **Feature Requirement**: REQ-002 预约挂号页面
- **Related User Story**: Story 1（AC-1.4 确认 Modal、AC-1.5 成功提示）

## 2. Detailed Requirements

### 2.1 Functional Requirements

- **FR-1**："预约挂号"按钮在未选中时段时 `disabled`，选中时段后激活
- **FR-2**：点击激活的"预约挂号"按钮弹出 `a-modal`，标题为"确认预约"，内容展示：医生姓名、职称、科室、预约日期（格式化为 YYYY年MM月DD日 周X）、预约时段
- **FR-3**：Modal 有"取消"和"确认预约"两个按钮，确认按钮带 loading 状态
- **FR-4**：点击"确认预约"后调用 `store.createAppointment({ patientId, patientName, doctorId, doctorName, date, timeSlot })`
- **FR-5**：预约成功后：关闭 Modal、显示 `message.success('预约挂号成功')`、清空 `selectedSlot`、排班列表自动更新（booked 时段变为灰色）
- **FR-6**：取消 Modal 时仅关闭弹窗，不影响已选时段

### 2.2 Technical Requirements

- **TR-1**：Modal 使用 `a-modal` 组件，`v-model:open` 控制显隐，`:confirmLoading` 绑定 loading 状态
- **TR-2**：异步模拟使用 `setTimeout(() => { ... }, 500)`，与 `Consultation.vue` 中 `submitQuestion` 风格一致
- **TR-3**：日期格式化使用 `dayjs(date).format('YYYY年MM月DD日 dddd')`
- **TR-4**：预约按钮放在排班详情视图底部，使用 `a-button type="primary" size="large" block`

### 2.3 Constraints and Limitations

- 仅修改 `src/views/Appointment.vue` 文件
- 不修改 Store 方法（TASK-002 已实现）
- 不处理并发冲突（纯前端单用户场景，Feature PRD 已说明）

### 2.4 安全要求 (Security Requirements)

- **SEC-1**：提交按钮在 loading 状态下必须禁用（`confirmLoading` 绑定到 Modal 确认按钮），防止用户快速连续点击导致重复提交
- **SEC-2**：Modal 中展示的医生姓名、日期、时段信息必须来自 Store 数据，不拼接用户输入，防止 XSS
- **SEC-3**：`createAppointment` 调用的参数全部来自 Store 已有数据（`currentPatient`、`selectedDoctor`、`selectedSlot`、`selectedDate`），不接受用户自由文本输入，无注入风险
- **SEC-4**：预约成功后的 `message.success` 使用固定文案，不包含用户输入数据
- **SEC-5**：`setTimeout` 模拟异步操作期间，页面应处于 loading 状态不可交互，防止状态不一致。Modal 的 `:maskClosable="false"` 和 `:closable="!submitting"` 应在 loading 期间禁用关闭行为，防止用户在提交过程中意外关闭 Modal 导致状态不一致

### 2.5 合规要求 (Compliance Requirements)

- **CMP-1**：确认 Modal 作为用户知情同意机制——预约前必须展示完整信息（医生、日期、时段）并要求用户主动点击"确认预约"，满足医疗预约场景下的知情同意要求
- **CMP-2**：Modal 中日期格式化为"YYYY年MM月DD日 周X"，使用用户友好的格式，确保信息传达清晰无歧义
- **CMP-3**：预约成功提示 `message.success('预约挂号成功')` 提供操作结果反馈，满足用户体验的知情权
- **CMP-4**：预约创建后 Store 自动设置 `createdAt` 和 `updatedAt` 时间戳，满足操作审计要求

## 3. Implementation Approach

### 3.1 Recommended Methodology

- 在 TASK-004 已实现的页面基础上扩展
- 新增响应式状态：`confirmModalVisible`(ref<boolean>)、`submitting`(ref<boolean>)
- 在"预约挂号"按钮上绑定 `:disabled="!selectedSlot"` 和 `@click="showConfirmModal"`
- Modal 确认回调中实现提交流程

### 3.2 Implementation Steps

**步骤 1：声明新增响应式变量**

在 `<script setup>` 中添加：

```typescript
const confirmModalVisible = ref(false)
const submitting = ref(false)
```

**步骤 2：激活预约按钮**

将 TASK-004 中 placeholder 的"预约挂号"按钮修改为：

```html
<a-button type="primary" size="large" block
  :disabled="!selectedSlot"
  @click="confirmModalVisible = true">
  预约挂号
</a-button>
```

**步骤 3：实现确认 Modal**

在 template 末尾（`</div>` 之前）添加：

```html
<a-modal
  v-model:open="confirmModalVisible"
  title="确认预约"
  :confirmLoading="submitting"
  :maskClosable="false"
  :closable="!submitting"
  okText="确认预约"
  cancelText="取消"
  @ok="handleSubmitAppointment"
  @cancel="confirmModalVisible = false">
  <div v-if="selectedDoctor && selectedDate && selectedSlot">
    <p><strong>医生：</strong>{{ selectedDoctor.name }}（{{ selectedDoctor.title }}·{{ selectedDoctor.department }}）</p>
    <p><strong>日期：</strong>{{ dayjs(selectedDate).format('YYYY年MM月DD日 dddd') }}</p>
    <p><strong>时段：</strong>{{ selectedSlot.timeSlot }}</p>
  </div>
</a-modal>
```

**步骤 4：实现 @ok 提交处理函数**

```typescript
const handleSubmitAppointment = () => {
  submitting.value = true
  setTimeout(() => {
    const result = store.createAppointment({
      patientId: currentPatient.value.id,
      patientName: currentPatient.value.name,
      doctorId: selectedDoctor.value.id,
      doctorName: selectedDoctor.value.name,
      date: selectedDate.value,
      timeSlot: selectedSlot.value.timeSlot
    })
    if (result) {
      message.success('预约挂号成功')
      selectedSlot.value = null          // 清空已选时段
      confirmModalVisible.value = false  // 关闭 Modal
      // 排班列表自动更新（reactive 响应式）
    } else {
      message.error('预约失败，该时段已被预约')
    }
    submitting.value = false
  }, 500)
}
```

**步骤 5：验证**

- 运行 `npm run build` 确认编译通过
- 完整流程测试：选时段 → 弹 Modal → 确认 → 验证成功提示和排班更新

### 3.3 Technical Considerations

- `createAppointment` 调用需传入的 6 个字段均可从 `selectedDoctor`、`selectedSlot`、`currentPatient`、`selectedDate` 获取
- 提交后清空 `selectedSlot` 即可，由于 `appointmentSlots` 是 reactive 的，`createAppointment` 内部修改的排班状态会自动反映到视图
- Modal 中应展示完整的医生信息和预约详情，让患者确认无误

### 3.4 Reference to Project Context

- `.asdm/contexts/standard-coding-style.md`：编码风格指南
- Feature PRD 第 5.4 节：Modal 布局设计

## 4. Acceptance Criteria

### 4.1 Primary Criteria

- **AC-1**：未选中时段时"预约挂号"按钮禁用，选中时段后激活
  - Test method：浏览器交互测试
  - **Validation tool**: `npm run build`（exit code 0）
- **AC-2**：点击按钮弹出确认 Modal，展示医生信息（姓名、职称、科室）和预约时间详情，日期格式包含星期（如"2026年04月23日 星期四"）
  - Test method：浏览器检查 Modal 内容和日期格式
  - **Validation tool**: `npm run build`（exit code 0）
- **AC-3**：确认预约后显示 `message.success('预约挂号成功')`，Modal 关闭
  - Test method：浏览器交互测试
  - **Validation tool**: `npm run build`（exit code 0）
- **AC-4**：预约成功后已选时段清空，对应排班时段变为已满（booked）状态
  - Test method：预约成功后检查同一时段是否变为灰色不可点击
  - **Validation tool**: `npm run build`（exit code 0）
- **AC-5**：提交过程有 loading 状态（按钮显示加载动画）
  - Test method：浏览器检查 loading 效果
  - **Validation tool**: `npm run build`（exit code 0）
- **AC-6**：`npm run build` 构建成功
  - **Validation tool**: `npm run build`（exit code 0）
- **AC-7**：loading 期间 Modal 的遮罩层点击（maskClosable）和关闭按钮（closable）均不可用，防止意外中断提交
  - Test method：在 loading 状态下点击 Modal 遮罩层和右上角关闭按钮，验证 Modal 不会关闭
  - **Validation tool**: `npm run build`（exit code 0）

### 4.2 Edge Cases

- 在 loading 状态下点击 Modal 取消按钮，不应中断提交（Modal 的 closable 和 maskClosable 在 loading 时可保持可用）
- 快速连续点击"确认预约"按钮，loading 状态应防止重复提交

### 4.3 Negative Tests

- 未选中时段时 Modal 不会弹出
- 现有的排班浏览功能不受影响

## 5. Dependencies

### 5.1 Task Dependencies

- **Depends on**: TASK-004（预约页面医生列表和排班视图已实现，包含 selectedSlot 状态）
- **Blocks**: 无

### 5.2 External Dependencies

- `ant-design-vue`：`a-modal`、`a-button`
- `dayjs`：日期格式化
- `store.createAppointment()`：TASK-002 实现

### 5.3 Prerequisites

- TASK-004 已完成，`Appointment.vue` 中已有 `selectedSlot`、`selectedDoctor`、`selectedDate` 等响应式状态

## 6. Estimated Effort

### 6.1 Effort Estimate

- **Estimated effort**: 1.5 hours
- **Complexity**: Low
- **Risk**: Low

### 6.2 Effort Factors

- 逻辑清晰，仅需在已有页面基础上添加 Modal 和提交逻辑

## 7. Testing Strategy

### 7.1 Automated Validation (Required)

- **Build validation**: `npm run build`
- **Exit criteria**: exit code 0

### 7.2 Functional Testing

- 未选中时段时验证"预约挂号"按钮为禁用状态
- 选中时段后验证按钮激活
- 点击激活的按钮验证弹出确认 Modal
- Modal 中验证医生姓名、职称、科室、日期（含星期）、时段信息显示正确
- 点击 Modal"取消"按钮验证仅关闭弹窗，已选时段保留
- 点击"确认预约"验证 loading 状态显示（按钮加载动画）
- 预约成功后验证 Modal 关闭、成功提示显示
- 预约成功后验证已选时段清空
- 预约成功后验证同一时段变为已满（灰色不可点击）

### 7.3 Security Testing

- 在 loading 状态下尝试点击"确认预约"按钮，验证重复提交被阻止
- 在 loading 状态下点击 Modal 取消按钮，验证行为正确（不应中断提交）
- 快速连续点击"预约挂号"按钮（非 Modal 内按钮），验证只弹出一个 Modal

### 7.4 Regression Testing

- 预约成功后返回医生列表，重新进入排班详情，验证排班状态正确反映
- 验证排班浏览功能（医生选择、日期切换、时段选择）不受影响

## 8. Implementation Notes

- Modal 内容参考 Feature PRD 5.4 节：`a-modal: 预约确认弹窗`
- Modal 中信息展示使用简单的文本段落，不需要复杂布局
- 成功提示使用 `message.success('预约挂号成功！')`，与现有 `message.success('问题提交成功')` 风格一致
- 取消 Modal 使用 `@cancel` 事件，仅关闭 Modal 不清空选择

## 9. Risks and Mitigations

### Risk 1

- **Description**: createAppointment 内部修改了 appointmentSlots 的 status，但视图可能未及时更新
- **Impact**: Low
- **Mitigation**: reactive 深层响应式会自动更新，无需手动触发

## 10. Deliverables

- `src/views/Appointment.vue`：新增预约确认 Modal 和提交逻辑
- **Build output**: `npm run build` 成功，exit code 0

---

*此任务 PRD 由 Task Breakdown 工具集生成。*
