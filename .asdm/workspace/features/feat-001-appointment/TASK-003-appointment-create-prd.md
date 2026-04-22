# Task PRD: 实现预约创建界面和逻辑

**Feature ID**: feat-001-appointment
**Feature Name**: 预约挂号功能
**Task ID**: task-003-appointment-create
**Created Date**: 2026-04-21
**Status**: DONE
**Language**: 简体中文

## 1. Task Overview

### 1.1 Task Summary

实现患者预约挂号的创建界面和业务逻辑，包括选择医生、选择日期和时间段、填写预约信息、提交预约等完整流程。这是预约挂号功能的核心用户交互界面，需要与TASK-001和TASK-002的数据模型紧密配合。

### 1.2 Task Objectives

**目标1**: 创建预约创建页面组件
**目标2**: 实现医生选择功能
**目标3**: 实现日期和时间段选择
**目标4**: 实现预约表单验证
**目标5**: 实现预约提交逻辑
**目标6**: 显示预约结果和确认信息

### 1.3 Related Feature Requirements

- Feature requirement: REQ-001 (预约管理模块)
- Related user story: Story 1 (患者预约门诊)
- Dependencies: TASK-001 (Appointment数据模型), TASK-002 (医生排班管理)

## 2. Detailed Requirements

### 2.1 Functional Requirements

**FR-001**: 预约创建页面
- 页面路径: `/appointment/create` 或 `/appointment/:doctorId`
- 页面标题: "预约挂号"
- 返回导航到医生列表或首页

**FR-002**: 医生选择功能
- 显示医生信息卡片（姓名、科室、职称）
- 显示医生排班信息（可预约日期）
- 支持指定医生ID直接进入

**FR-003**: 日期选择器
- 使用Ant Design Vue的DatePicker组件
- 仅显示有排班的日期
- 不可选择过去日期
- 不可选择周末（可选配置）

**FR-004**: 时间段选择
- 显示选定日期的可预约时间段
- 禁用已满的时间段
- 显示剩余名额
- 使用TimePicker或自定义时段选择

**FR-005**: 预约表单
- 患者姓名（必填）
- 联系方式（可选）
- 预约备注（可选）
- 预约信息确认

**FR-006**: 预约提交
- 表单验证
- 调用Store方法创建预约
- 显示加载状态
- 处理成功和失败情况

### 2.2 Technical Requirements

**TR-001**: 路由配置
- 添加预约创建路由
- 可选：添加路由参数传递医生ID

**TR-002**: 组件开发
- 使用Vue 3 Composition API
- 使用 `<script setup>` 语法
- 遵循现有组件风格

**TR-003**: Store集成
- 使用已有的Pinia Store
- 添加预约相关状态和方法
- 确保数据一致性

**TR-004**: 表单验证
- 使用Ant Design Vue的Form组件
- 必填字段验证
- 格式验证

### 2.3 Constraints and Limitations

- 必须在现有项目结构中开发
- 必须遵循现有代码风格
- 必须使用Ant Design Vue组件
- 预约创建后数据存储在JSON中（当前阶段）

## 3. Implementation Approach

### 3.1 Recommended Methodology

**步骤1**: 创建预约创建页面组件
- 文件位置: `src/views/AppointmentCreate.vue`
- 使用Vue 3 Composition API

**步骤2**: 实现医生选择器
- 复用现有的DoctorCard组件
- 或创建新的AppointmentDoctorCard组件

**步骤3**: 集成日期和时间选择
- 使用Ant Design Vue DatePicker
- 使用Ant Design Vue TimePicker或自定义时段组件

**步骤4**: 实现表单和验证
- 使用Ant Design Vue Form组件
- 添加必填字段验证
- 添加格式验证

**步骤5**: 实现预约提交逻辑
- 调用Store方法创建预约
- 处理响应和错误
- 显示成功/失败消息

**验证步骤**: 构建和测试
- 命令：`npm run build`
- 预期：编译成功，页面可正常访问

### 3.2 Implementation Steps

1. 创建 `src/views/AppointmentCreate.vue`
2. 添加路由配置 `src/router/index.ts`
3. 实现医生选择UI
4. 实现日期选择器
5. 实现时间段选择器
6. 实现预约表单
7. 实现表单验证
8. 实现预约提交逻辑
9. 显示预约结果
10. 测试完整流程

### 3.3 Technical Considerations

- 预约表单应简洁清晰
- 时间段选择应直观易用
- 错误提示应友好明确
- 加载状态应清晰可见

### 3.4 Reference to Project Context

- `.asdm/contexts/standard-project-structure.md`: 项目结构规范
- `.asdm/contexts/standard-coding-style.md`: 代码风格规范
- `.asdm/contexts/architecture.md`: 组件架构设计
- 现有 `src/views/Consultation.vue`: 参考现有页面实现

## 4. Acceptance Criteria

### 4.1 Primary Criteria

**AC-001**: 预约创建页面可访问
- 验收标准：页面可正常加载，无错误
- **验证工具**: 手动测试或 `npm run build` 编译成功

**AC-002**: 医生选择功能正常
- 验收标准：可以查看医生列表，选择医生
- **验证工具**: 页面功能测试

**AC-003**: 日期和时间段选择正常
- 验收标准：可以选择日期和时间段
- **验证工具**: 页面交互测试

**AC-004**: 表单验证正常
- 验收标准：必填字段未填时提示错误
- **验证工具**: 提交空表单测试

**AC-005**: 预约提交成功
- 验收标准：预约创建成功，显示确认信息
- **验证工具**: 完整预约流程测试

**AC-006**: 编译无错误
- **验证工具**: `npm run build` 退出码 0

### 4.2 Edge Cases

**EC-001**: 医生无排班
- 场景：选择的医生没有排班数据
- 预期：显示提示信息

**EC-002**: 日期无可用时段
- 场景：选择的日期已无空闲时段
- 预期：显示提示信息，禁用提交按钮

**EC-003**: 网络错误
- 场景：预约提交时网络错误
- 预期：显示错误提示，允许重试

### 4.3 Negative Tests

**NT-001**: 未选择医生
- 验证：表单应显示验证错误
- 工具：提交前不选择医生

**NT-002**: 未选择日期
- 验证：应显示日期必填提示
- 工具：不选择日期尝试提交

**NT-003**: 未选择时间段
- 验证：应显示时间段必填提示
- 工具：不选择时间段尝试提交

## 5. Dependencies

### 5.1 Task Dependencies

- **Depends on**: TASK-001, TASK-002
- **Blocks**: TASK-005, TASK-006, TASK-007

### 5.2 External Dependencies

- Vue 3: 前端框架
- Ant Design Vue: UI组件库
- Vue Router: 路由管理
- Pinia: 状态管理

### 5.3 Prerequisites

- TASK-001和TASK-002已完成
- 预约数据模型已定义
- 排班数据已可用

## 6. Estimated Effort

### 6.1 Effort Estimate

- **Estimated effort**: 2小时
- **Complexity**: Medium
- **Risk**: Medium

### 6.2 Effort Factors

- 需要实现完整的用户交互流程
- 需要与多个组件和数据源交互
- 表单验证可能需要调整

## 7. Testing Strategy

### 7.1 Automated Validation (Required)

**Build validation**:
- 命令: `npm run build`
- 预期: 编译成功，无错误
- 退出码: 0

**Type checking**:
- 命令: `vue-tsc --noEmit`
- 预期: 无类型错误
- 退出码: 0

### 7.2 Unit Testing

- 可选：测试预约创建逻辑
- 验证预约数据生成正确

### 7.3 Integration Testing

- 测试预约创建页面与Store的集成
- 测试数据流转正确

### 7.4 Manual Testing

- 完整的预约创建流程测试
- 表单验证测试
- 错误处理测试

## 8. Implementation Notes

### 预约创建流程

```
1. 用户进入预约创建页面
   ↓
2. 选择医生（可选，默认从URL参数获取）
   ↓
3. 选择预约日期
   ↓
4. 选择时间段
   ↓
5. 填写预约信息
   ↓
6. 提交预约
   ↓
7. 显示预约结果
```

### 关键组件

- `AppointmentCreate.vue`: 主页面组件
- `DoctorSelect.vue`: 医生选择组件（可选复用）
- `DateSelect.vue`: 日期选择组件
- `TimeSlotSelect.vue`: 时间段选择组件

### Store方法

```typescript
// 需要的Store方法
createAppointment(data: CreateAppointmentInput): Appointment
getAvailableTimeSlots(doctorId: string, date: string): TimeSlot[]
getDoctorSchedule(doctorId: string): Schedule[]
```

## 9. Risks and Mitigations

### Risk 1：时间段冲突

- **描述**: 用户选择的时间段可能被其他人抢先预约
- **影响**: High
- **缓解**: 提交前再次验证时间段可用性

### Risk 2：数据一致性

- **描述**: 多步骤操作可能导致数据不一致
- **影响**: Medium
- **缓解**: 使用单一Store管理所有状态

### Risk 3：用户体验

- **描述**: 预约流程可能过于复杂
- **影响**: Medium
- **缓解**: 简化表单，只保留必填字段

## 10. Deliverables

**交付物清单**:

1. **src/views/AppointmentCreate.vue**: 预约创建页面组件
2. **更新的路由配置**: `src/router/index.ts` 添加预约路由
3. **更新的Store**: 添加预约创建相关方法
4. **更新的数据文件**: 包含测试用预约数据

**Mandatory Deliverable**: Validation Results
- **Build output**: 编译成功日志
- **Test results**: 手动测试结果记录
- **Quality checks**: 类型检查通过
- **Validation log**: 完整的测试执行记录