# Task PRD: 医生诊室 - 预约管理功能

**Feature ID**: FEAT-001
**Feature Name**: appointment-booking
**Task ID**: TASK-006
**Created Date**: 2026-04-22
**Status**: DONE
**Language**: zh

## 1. Task Overview

### 1.1 Task Summary

- **任务描述**：在 `src/views/DoctorRoom.vue` 中新增"预约管理"标签页，使用 `a-tabs` 组件将现有问诊管理内容包裹为第一个 tab，新增预约管理为第二个 tab。预约管理 tab 按日期分组展示该医生的预约列表，支持确认和取消操作（取消需填写原因）。
- **任务目的**：让医生可以在诊室页面查看和管理患者的预约挂号请求，完成确认/取消操作。
- **关联需求**：满足 Feature PRD REQ-003（预约管理 - 医生端）、Story 2 的全部验收标准。

### 1.2 Task Objectives

- 目标 1：使用 `a-tabs` 组件重构 DoctorRoom.vue 布局，现有内容放入"问诊管理"tab
- 目标 2：新增"预约管理"tab，展示当前医生的预约列表
- 目标 3：预约列表按日期分组展示，每组显示日期标题和该日预约记录
- 目标 4：每条预约记录显示患者姓名、预约时段、预约状态标签（待确认=orange、已确认=green、已取消=red）
- 目标 5：待确认和已确认的预约可执行"确认"和"取消"操作，已取消的预约不可操作
- 目标 6：取消预约时弹出 Modal 要求填写取消原因

### 1.3 Related Feature Requirements

- **Feature Requirement**: REQ-003 预约管理 - 医生端
- **Related User Story**: Story 2（AC-2.1 预约标签页、AC-2.2 按日期分组展示、AC-2.3 确认操作、AC-2.4 取消操作+原因）

## 2. Detailed Requirements

### 2.1 Functional Requirements

- **FR-1**：`a-tabs` 包裹现有 `.questions-section` 和 `.answered-section`，作为第一个 tab（key="questions"，标题"问诊管理"）
- **FR-2**：第二个 tab（key="appointments"，标题"预约管理"）展示预约列表
- **FR-3**：预约列表按日期降序排列，使用计算属性对 `store.getAppointmentsByDoctor(currentDoctor.id)` 的结果按 `date` 分组
- **FR-4**：每组日期标题使用 `a-divider` 或标题样式显示日期（格式 YYYY-MM-DD）
- **FR-5**：每条预约卡片显示：患者姓名（带 UserOutlined 图标）、时段（如 08:00-08:30）、状态标签（`a-tag`）
- **FR-6**：操作按钮规则：
  - `pending` 状态：显示"确认"（primary）和"取消"（default）按钮
  - `confirmed` 状态：仅显示"取消"按钮
  - `cancelled` 状态：不显示操作按钮，显示取消原因文本
- **FR-7**：点击"取消"按钮弹出 `a-modal`，包含 `a-textarea` 用于填写取消原因，取消原因为必填项
- **FR-8**：确认操作调用 `store.confirmAppointment(id)`，取消操作调用 `store.cancelAppointment(id, reason)`

### 2.2 Technical Requirements

- **TR-1**：`a-tabs` 使用 `v-model:activeKey` 绑定当前 tab
- **TR-2**：日期分组使用 `computed` 计算属性，返回 `Map<string, Appointment[]>` 或类似结构
- **TR-3**：取消原因 Modal 使用 `a-modal` + `a-textarea`，验证非空
- **TR-4**：操作反馈使用 `message.success()`（与现有 `message.success('回复成功')` 风格一致）
- **TR-5**：不修改现有的问诊管理逻辑和样式，仅通过 `a-tabs` 包裹

### 2.3 Constraints and Limitations

- 仅修改 `src/views/DoctorRoom.vue` 文件
- 不修改现有的问诊管理功能代码（`.questions-section`、`.answered-section` 内部代码不变）
- 不修改 Store 方法（TASK-002 已实现）
- 现有的回复 Modal 和新增加的取消原因 Modal 为两个独立的 Modal

### 2.4 安全要求 (Security Requirements)

- **SEC-1**：预约管理 tab 仅展示当前登录医生自己的预约（通过 `store.getAppointmentsByDoctor(currentDoctor.id)` 过滤），不允许跨医生查看或操作其他医生的预约记录
- **SEC-2**：取消原因 `a-textarea` 的输入内容必须限制最大长度（建议 200 字符），防止超长文本存储
- **SEC-3**：取消原因输入框使用 `v-model` 绑定，不使用 `v-html` 渲染，防止 XSS
- **SEC-4**：操作按钮（确认/取消）根据预约状态动态显示，已取消的预约不显示操作按钮，防止非法状态操作
- **SEC-5**：取消原因 Modal 的非空验证必须在提交前执行，不允许提交空原因的取消请求

### 2.5 合规要求 (Compliance Requirements)

- **CMP-1**：取消预约时要求填写取消原因（必填），满足医疗预约场景下的操作留痕和可追溯要求
- **CMP-2**：已取消的预约保留并显示取消原因文本，便于后续审计和患者查询
- **CMP-3**：状态标签使用语义化颜色区分（待确认=orange、已确认=green、已取消=red），确保状态信息传达清晰
- **CMP-4**：预约操作（确认/取消）后通过 `message.success()` 提供即时反馈，满足操作透明度要求
- **CMP-5**：预约按日期分组展示，时间倒序排列，便于医生按时间线管理预约

## 3. Implementation Approach

### 3.1 Recommended Methodology

- 使用 `a-tabs` 包裹现有的两个 section，将它们的样式和布局保持不变
- 新增一个 `a-tab-pane` 作为预约管理 tab
- 预约列表使用 `v-for` 嵌套渲染：外层遍历日期分组，内层遍历该日期下的预约记录
- 取消操作复用 Modal 模式，参考现有 `answerModalVisible` 的实现方式

### 3.2 Implementation Steps

1. **重构布局**：在 DoctorRoom.vue 的 `.room-container` 内（`.room-url` 之后），用 `a-tabs` 包裹 `.questions-section` 和 `.answered-section`
2. **新增预约 tab**：添加第二个 `a-tab-pane`，包含预约列表的 template 代码
3. **实现分组逻辑**：编写计算属性 `groupedAppointments`，将预约按日期分组并排序
4. **实现确认/取消操作**：添加操作按钮的事件处理函数
5. **实现取消 Modal**：添加取消原因 Modal 的 template 和逻辑
6. **添加样式**：预约卡片、分组标题、操作按钮等样式
7. **验证步骤**：运行 `npm run build` 确认编译通过

### 3.3 Technical Considerations

- `a-tabs` 默认样式可能需要微调以匹配现有页面风格（背景色、内边距等）
- 日期分组计算属性示例逻辑：
  ```typescript
  const groupedAppointments = computed(() => {
    if (!currentDoctor.value) return [];
    const appointments = store.getAppointmentsByDoctor(currentDoctor.value.id);
    const groups: Record<string, Appointment[]> = {};
    appointments.forEach(apt => {
      if (!groups[apt.date]) groups[apt.date] = [];
      groups[apt.date].push(apt);
    });
    return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));
  });
  ```
- 现有 `.questions-section` 和 `.answered-section` 的 `margin-bottom` 样式在 tabs 内可能需要调整

### 3.4 Reference to Project Context

- `.asdm/contexts/standard-coding-style.md`：编码风格指南
- Feature PRD 第 5.4 节：DoctorRoom.vue 预约管理标签页布局设计

## 4. Acceptance Criteria

### 4.1 Primary Criteria

- **AC-1**：DoctorRoom 页面显示"问诊管理"和"预约管理"两个标签页，默认显示"问诊管理"
  - Test method：浏览器检查 tabs 渲染
  - **Validation tool**: `npm run build`（exit code 0）
- **AC-2**：切换到"预约管理"tab 显示当前医生的预约列表，按日期降序分组，组内按时段排序
  - Test method：浏览器交互测试，验证日期组从新到旧排列，同组内时段按时间先后排列
  - **Validation tool**: `npm run build`（exit code 0）
- **AC-3**：每条预约显示患者姓名、时段、状态标签（颜色正确）
  - Test method：浏览器检查渲染内容
  - **Validation tool**: `npm run build`（exit code 0）
- **AC-4**：pending 预约可确认和取消，confirmed 预约仅可取消，cancelled 预约无操作按钮
  - Test method：浏览器交互测试
  - **Validation tool**: `npm run build`（exit code 0）
- **AC-5**：确认操作后状态变为 confirmed，取消操作后状态变为 cancelled 并显示取消原因
  - Test method：浏览器交互测试
  - **Validation tool**: `npm run build`（exit code 0）
- **AC-6**：取消时弹出 Modal 要求填写原因，原因为空时提示错误
  - Test method：浏览器交互测试
  - **Validation tool**: `npm run build`（exit code 0）
- **AC-7**：现有的问诊管理功能（问题回复、标记已解答）不受影响
  - Test method：切换回"问诊管理"tab 验证功能正常
  - **Validation tool**: `npm run build`（exit code 0）
- **AC-8**：`npm run build` 构建成功
  - **Validation tool**: `npm run build`（exit code 0）

### 4.2 Edge Cases

- 当前医生没有任何预约时，"预约管理"tab 显示"暂无预约记录"（`a-empty`）
- 预约列表为空时不应显示空的日期分组

### 4.3 Negative Tests

- 现有的 `answerModalVisible` Modal 和新增的 `cancelModalVisible` Modal 互不干扰
- `store.confirmAppointment()` 和 `store.cancelAppointment()` 对不存在 ID 的调用静默处理

## 5. Dependencies

### 5.1 Task Dependencies

- **Depends on**: TASK-002（Store 方法：confirmAppointment、cancelAppointment、getAppointmentsByDoctor）
- **Blocks**: 无

### 5.2 External Dependencies

- `ant-design-vue`：`a-tabs`、`a-tab-pane`、`a-tag`、`a-button`、`a-modal`、`a-textarea`、`a-divider`、`a-empty`
- `@ant-design/icons-vue`：`UserOutlined`（已导入）、`CalendarOutlined`

### 5.3 Prerequisites

- TASK-002 已完成，Store 中已有 confirmAppointment、cancelAppointment、getAppointmentsByDoctor 方法

## 6. Estimated Effort

### 6.1 Effort Estimate

- **Estimated effort**: 1.5 hours
- **Complexity**: Medium
- **Risk**: Low

### 6.2 Effort Factors

- 需要重构现有布局（a-tabs 包裹），但内部代码不变
- 分组逻辑和取消 Modal 需要新增代码

## 7. Testing Strategy

### 7.1 Automated Validation (Required)

- **Build validation**: `npm run build`
- **Exit criteria**: exit code 0

### 7.2 Functional Testing

- 进入医生诊室，验证显示"问诊管理"和"预约管理"两个标签页，默认显示"问诊管理"
- 切换到"预约管理"tab，验证预约列表按日期分组展示
- 验证每条预约卡片显示患者姓名、时段、状态标签且颜色正确
- 对 `pending` 预约点击"确认"按钮，验证状态变为 `confirmed`，成功提示显示
- 对 `pending` 预约点击"取消"按钮，验证弹出取消原因 Modal
- 在 Modal 中不输入原因直接提交，验证非空校验提示
- 在 Modal 中输入原因后提交，验证状态变为 `cancelled`，取消原因文本显示
- 对 `confirmed` 预约验证仅显示"取消"按钮，无"确认"按钮
- 对 `cancelled` 预约验证无操作按钮，显示取消原因

### 7.3 Edge Case Testing

- 当前医生无任何预约时，验证显示"暂无预约记录"（`a-empty`）
- 预约列表为空时验证不显示空的日期分组标题
- 取消原因输入超长文本（>200 字符），验证输入被限制或提示

### 7.4 Security Verification

- 以医生 A 登录，验证预约列表中仅显示医生 A 的预约，不显示其他医生的预约
- 在取消原因文本框中输入 `<script>alert(1)</script>`，验证提交后页面不执行脚本

### 7.5 Regression Testing

- 切换回"问诊管理"tab，验证问题列表、回复功能、标记已解答功能正常
- 验证回复 Modal 和取消原因 Modal 互不干扰（独立开关）

## 8. Implementation Notes

- `a-tabs` 的包裹范围：仅包裹 `.questions-section` 和 `.answered-section`，不包括 `.room-header`、`.room-url` 和回复 Modal
- 预约管理 tab 内的布局参考 Feature PRD 5.4 节的 DoctorRoom 预约管理标签页 ASCII 布局图
- 状态标签颜色：pending → orange，confirmed → green，cancelled → red（与 Consultation.vue 中问题状态标签风格一致）
- 取消原因 Modal 参考 DoctorRoom.vue 中现有的 `answerModalVisible` Modal 实现模式

## 9. Risks and Mitigations

### Risk 1

- **Description**: 使用 a-tabs 包裹现有内容可能影响现有样式（边距、背景色）
- **Impact**: Medium
- **Mitigation**: 添加 tabs 后检查现有 tab 内的样式是否正常，必要时调整 `.questions-section` 和 `.answered-section` 的 margin

## 10. Deliverables

- `src/views/DoctorRoom.vue`：新增 a-tabs 布局 + 预约管理 tab + 取消原因 Modal
- **Build output**: `npm run build` 成功，exit code 0

---

*此任务 PRD 由 Task Breakdown 工具集生成。*
