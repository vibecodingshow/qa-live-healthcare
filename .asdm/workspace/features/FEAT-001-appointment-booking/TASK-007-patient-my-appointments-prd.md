# Task PRD: 患者问诊 - 我的预约功能

**Feature ID**: FEAT-001
**Feature Name**: appointment-booking
**Task ID**: TASK-007
**Created Date**: 2026-04-22
**Status**: DONE
**Language**: zh

## 1. Task Overview

### 1.1 Task Summary

- **任务描述**：在 `src/views/Consultation.vue` 的患者门户区域中，在"我的问题"区域下方新增"我的预约"区域，展示当前患者的预约列表，支持取消待确认的预约。
- **任务目的**：让患者可以在问诊页面查看自己的预约记录和状态，并能取消待确认的预约。
- **关联需求**：满足 Feature PRD REQ-004（预约管理 - 患者端）、Story 3 的全部验收标准。

### 1.2 Task Objectives

- 目标 1：在 Consultation.vue 的 `.questions-section` 下方新增"我的预约"区域
- 目标 2：展示当前患者的预约列表，每条预约显示医生姓名、预约日期、时段、状态标签
- 目标 3：状态为 `pending` 的预约显示"取消预约"按钮，其他状态不显示
- 目标 4：点击"取消预约"调用 `store.cancelAppointment()` 并显示成功提示

### 1.3 Related Feature Requirements

- **Feature Requirement**: REQ-004 预约管理 - 患者端
- **Related User Story**: Story 3（AC-3.1 我的预约区域、AC-3.2 预约卡片信息、AC-3.3 取消待确认预约）

## 2. Detailed Requirements

### 2.1 Functional Requirements

- **FR-1**：在 `Consultation.vue` 的 `.patient-portal` 区域内，`.questions-section` 之后新增"我的预约"区域
- **FR-2**：区域标题为"我的预约"，与"我的问题"的 `.section-header` 样式保持一致
- **FR-3**：预约列表使用 `store.getAppointmentsByPatient(currentPatient.id)` 获取数据
- **FR-4**：每条预约使用 `a-card` 展示，内容包含：
  - 医生姓名（卡片标题）
  - 预约日期（格式化为 M/D 或 MM月DD日）
  - 预约时段（如 08:00-08:30）
  - 状态标签（`a-tag`）：pending="待确认"(orange)、confirmed="已确认"(green)、cancelled="已取消"(red)
- **FR-5**：仅 `pending` 状态的预约卡片底部显示"取消预约"按钮（`a-button danger`）
- **FR-6**：点击"取消预约"直接调用 `store.cancelAppointment(id, '患者取消')`，显示 `message.success('预约已取消')`
- **FR-7**：预约列表为空时显示 `a-empty` 组件，描述为"您还没有预约记录"

### 2.2 Technical Requirements

- **TR-1**：预约数据使用 `computed` 计算属性从 Store 获取，与 `myQuestions` 的实现方式一致
- **TR-2**：样式参考 `.my-questions-list` 和 `.question-item`，保持卡片列表风格一致
- **TR-3**：使用 `dayjs` 格式化日期显示
- **TR-4**：取消操作不使用 Modal 确认（与医生端的取消不同，患者端取消操作更轻量）
- **TR-5**：保持与现有 `.patient-portal` 内的间距和布局风格一致

### 2.3 Constraints and Limitations

- 仅修改 `src/views/Consultation.vue` 文件
- 不修改"我的问题"区域的任何代码
- 不修改 Store 方法（TASK-002 已实现）
- 不修改患者验证逻辑

### 2.4 安全要求 (Security Requirements)

- **SEC-1**："我的预约"区域通过 `store.getAppointmentsByPatient(currentPatient.id)` 获取数据，实现患者数据隔离——仅展示当前验证患者的预约记录，不暴露其他患者的数据
- **SEC-2**：未验证身份时"我的预约"区域不渲染（`v-if="currentPatient"` 控制），防止未授权数据访问
- **SEC-3**：预约卡片中显示的医生姓名、日期、时段等信息来自 Store 数据，不拼接用户输入，无 XSS 风险
- **SEC-4**：取消预约操作使用固定的取消原因文本 `'患者取消'`，不接受用户输入，无注入风险
- **SEC-5**：仅 `pending` 状态的预约显示取消按钮，防止用户对已确认或已取消的预约执行非法操作

### 2.5 合规要求 (Compliance Requirements)

- **CMP-1**：患者数据隔离——每个患者只能查看和操作自己的预约记录，满足数据隐私保护要求
- **CMP-2**：取消预约自动记录取消原因 `'患者取消'`，满足操作留痕和可追溯要求
- **CMP-3**：状态标签使用语义化颜色区分（待确认=orange、已确认=green、已取消=red），确保患者对预约状态有清晰的认知
- **CMP-4**：预约列表为空时显示友好提示"您还没有预约记录"（`a-empty`），避免空状态下的用户困惑
- **CMP-5**：患者端取消操作使用固定原因文本，与医生端需填写原因的操作区分，体现不同角色的操作规范

## 3. Implementation Approach

### 3.1 Recommended Methodology

- 在现有 `.questions-section` 的 `</div>` 之后，新增一个 `.appointments-section` 区域
- 预约卡片使用 `a-card`，布局参考现有 `.question-item` 的卡片样式
- 新增一个 `computed` 属性 `myAppointments` 获取当前患者的预约列表

### 3.2 Implementation Steps

1. **新增计算属性**：在 `Consultation.vue` 的 `<script setup>` 中添加 `myAppointments` computed
2. **新增 template 区域**：在 `.questions-section` 之后添加"我的预约"区域的 HTML
3. **实现取消功能**：添加 `cancelAppointment` 函数
4. **添加样式**：预约卡片、区域标题等样式
5. **验证步骤**：运行 `npm run build` 确认编译通过

### 3.3 Technical Considerations

- 计算属性示例：
  ```typescript
  const myAppointments = computed(() =>
    currentPatient.value
      ? store.getAppointmentsByPatient(currentPatient.value.id)
      : []
  );
  ```
- 取消函数示例：
  ```typescript
  const cancelAppointment = (appointmentId: string) => {
    store.cancelAppointment(appointmentId, '患者取消');
    message.success('预约已取消');
  };
  ```
- 预约卡片可使用 `a-card` 的 `#title` 插槽显示医生姓名和状态标签（与 `.question-item` 的 `#title` 插槽风格一致）

### 3.4 Reference to Project Context

- `.asdm/contexts/standard-coding-style.md`：编码风格指南
- Feature PRD 第 5.4 节：Consultation.vue 我的预约区域布局设计

## 4. Acceptance Criteria

### 4.1 Primary Criteria

- **AC-1**：验证身份后的患者门户中，"我的问题"下方显示"我的预约"区域
  - Test method：浏览器检查页面渲染
  - **Validation tool**: `npm run build`（exit code 0）
- **AC-2**：预约列表正确展示当前患者的预约记录，包含医生姓名、日期、时段、状态，按日期降序排列
  - Test method：浏览器检查卡片内容，验证排列顺序为最新日期在前
  - **Validation tool**: `npm run build`（exit code 0）
- **AC-3**：状态标签颜色正确：待确认=orange、已确认=green、已取消=red
  - Test method：浏览器检查标签颜色
  - **Validation tool**: `npm run build`（exit code 0）
- **AC-4**：仅 pending 状态的预约显示"取消预约"按钮
  - Test method：浏览器检查按钮可见性
  - **Validation tool**: `npm run build`（exit code 0）
- **AC-5**：点击"取消预约"后预约状态变为 cancelled，显示成功提示
  - Test method：浏览器交互测试
  - **Validation tool**: `npm run build`（exit code 0）
- **AC-6**：无预约记录时显示 `a-empty` 组件，描述文本精确为"您还没有预约记录"
  - Test method：使用无预约的患者身份验证后检查空状态提示文本
  - **Validation tool**: `npm run build`（exit code 0）
- **AC-7**：现有的"我的问题"区域功能和样式不受影响
  - Test method：检查问题列表、提交问题等功能正常
  - **Validation tool**: `npm run build`（exit code 0）
- **AC-8**：`npm run build` 构建成功
  - **Validation tool**: `npm run build`（exit code 0）

### 4.2 Edge Cases

- 未验证身份时不显示"我的预约"区域（与"我的问题"行为一致）
- 患者有多条预约时按日期倒序排列

### 4.3 Negative Tests

- 现有的问题提交、问题回复查看功能不受影响
- `store.cancelAppointment()` 对不存在 ID 的调用静默处理

## 5. Dependencies

### 5.1 Task Dependencies

- **Depends on**: TASK-002（Store 方法：cancelAppointment、getAppointmentsByPatient）
- **Blocks**: 无

### 5.2 External Dependencies

- `ant-design-vue`：`a-card`、`a-tag`、`a-button`、`a-empty`
- `dayjs`：日期格式化
- `store.cancelAppointment()`、`store.getAppointmentsByPatient()`：TASK-002 实现

### 5.3 Prerequisites

- TASK-002 已完成，Store 中已有 cancelAppointment 和 getAppointmentsByPatient 方法

## 6. Estimated Effort

### 6.1 Effort Estimate

- **Estimated effort**: 1 hour
- **Complexity**: Low
- **Risk**: Low

### 6.2 Effort Factors

- 修改量小，在现有组件中追加一个区域
- 逻辑简单，列表展示 + 取消操作

## 7. Testing Strategy

### 7.1 Automated Validation (Required)

- **Build validation**: `npm run build`
- **Exit criteria**: exit code 0

### 7.2 Functional Testing

- 未验证身份时验证"我的预约"区域不显示
- 验证身份后验证"我的预约"区域出现在"我的问题"下方
- 有预约记录时验证卡片显示医生姓名、日期、时段、状态标签且颜色正确
- 仅 `pending` 状态的预约显示"取消预约"按钮
- `confirmed` 和 `cancelled` 状态的预约不显示"取消预约"按钮
- 点击"取消预约"验证状态变为 `cancelled`，成功提示显示
- 无预约记录时验证显示 `a-empty` 组件和提示文本
- 多条预约时验证按日期倒序排列

### 7.3 Security Verification

- 以患者 A 身份验证登录，验证仅显示患者 A 的预约记录
- 以患者 B 身份验证登录，验证仅显示患者 B 的预约记录
- 验证两个患者之间不可互相查看对方的预约

### 7.4 Regression Testing

- 验证"我的问题"区域功能不受影响（问题列表、提交问题、查看回复）
- 验证患者验证逻辑不受影响
- 验证问诊页面的其他功能区域正常

## 8. Implementation Notes

- "我的预约"区域整体样式参考"我的问题"区域（`.questions-section`），保持视觉一致性
- 预约卡片使用 `a-card` 与 `.question-item` 相同的 class 结构
- 取消按钮使用 `a-button danger size="small"`，放在卡片底部右侧
- 预约信息布局参考 Feature PRD 5.4 节的 Consultation.vue 我的预约区域 ASCII 布局图
- 需要在 import 中引入 `Appointment` 类型（如果类型推断需要的话），或通过 Store 方法隐式推断

## 9. Risks and Mitigations

### Risk 1

- **Description**: 在 Consultation.vue 中追加代码可能使文件过大（当前已 481 行）
- **Impact**: Low
- **Mitigation**: 新增区域代码量约 60-80 行，总行数控制在 560 行以内，可接受

## 10. Deliverables

- `src/views/Consultation.vue`：新增"我的预约"区域
- **Build output**: `npm run build` 成功，exit code 0

---

*此任务 PRD 由 Task Breakdown 工具集生成。*
