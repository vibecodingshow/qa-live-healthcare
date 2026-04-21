# Task PRD: 开发预约表单页面

**Feature ID**: FEAT-001
**Feature Name**: 预约挂号
**Task ID**: TASK-005
**Created Date**: 2026-04-21
**Status**: TODO
**Language**: zh

## 1. Task Overview

### 1.1 Task Summary

本任务创建患者预约医生的表单页面 `BookAppointment.vue`。页面展示医生信息，支持日期选择器（只显示有门诊的日期）、时段选择器（只显示可预约的时段），以及预约表单（就诊原因等），并实现表单验证和预约提交功能。

### 1.2 Task Objectives

- 创建 `src/views/BookAppointment.vue` 页面组件
- 实现医生信息展示
- 实现日期选择器（只显示有门诊的日期）
- 实现时段选择器（只显示可预约的时段）
- 实现预约表单（就诊原因、联系方式等）
- 实现表单验证
- 实现预约提交功能
- 预约成功后跳转到预约详情页

### 1.3 Related Feature Requirements

- **Feature Requirement**: REQ-002 预约列表展示
- **Feature Requirement**: REQ-003 预约表单
- **Related User Story**: Story 1
- **Related Task**: TASK-003 (前置依赖)

## 2. Detailed Requirements

### 2.1 Functional Requirements

| ID | Requirement | Description |
|----|-------------|-------------|
| FR-001 | 医生信息展示 | 显示医生头像、姓名、职称、科室等 |
| FR-002 | 日期选择器 | 仅显示医生有门诊的日期 |
| FR-003 | 时段选择器 | 仅显示可预约的时段 |
| FR-004 | 预约表单 | 就诊原因（必填）、联系方式等 |
| FR-005 | 表单验证 | 就诊原因必填，字符限制 |
| FR-006 | 预约提交 | 调用 Store 方法创建预约 |
| FR-007 | 提交后跳转 | 成功预约后跳转到预约详情 |

### 2.2 Technical Requirements

| ID | Requirement | Description |
|----|-------------|-------------|
| TR-001 | 组件规范 | 使用 Vue 3 Composition API + `<script setup>` |
| TR-002 | UI 框架 | 使用 Ant Design Vue DatePicker、TimePicker |
| TR-003 | 状态管理 | 使用 Store 中的预约方法 |
| TR-004 | 路由参数 | 从路由获取 doctorId 参数 |
| TR-005 | 日期处理 | 使用 dayjs 库处理日期 |

### 2.3 Constraints and Limitations

| ID | Constraint | Description |
|----|------------|-------------|
| CL-001 | 仅患者可用 | 页面仅供已登录患者访问 |
| CL-002 | 需选择时段 | 必须先选日期再选时段 |

## 3. Implementation Approach

### 3.1 Recommended Methodology

**参考现有页面**：
1. 参考 `Consultation.vue` 的表单布局
2. 参考 `Doctors.vue` 的医生信息展示
3. 复用 Ant Design Vue 表单组件

### 3.2 Implementation Steps

1. **创建页面组件**
   - 在 `src/views/` 创建 `BookAppointment.vue`

2. **获取医生信息**
   - 从路由参数获取 doctorId
   - 从 Store 获取医生详情

3. **实现日期选择器**
   - 获取医生的门诊日期
   - 禁用无门诊的日期

4. **实现时段选择器**
   - 用户选择日期后获取可用时段
   - 禁用已满的时段

5. **实现预约表单**
   - 就诊原因（必填，最少5个字符）
   - 联系方式（可选）

6. **实现表单验证**
   - 使用 a-form 的 rules 属性
   - 提交前验证

7. **实现预约提交**
   - 调用 `addAppointment()` 方法
   - 成功后跳转到详情页

8. **验证功能**
   - 构建测试
   - 功能验证

### 3.3 Technical Considerations

- **日期格式**: 使用 dayjs，格式化为 YYYY-MM-DD
- **时段格式**: 字符串格式 "09:00-09:30"
- **组件引用**: 从 `@/store` 导入 store

### 3.4 Reference to Project Context

- `.asdm/contexts/standard-project-structure.md`: views 目录规范
- `.asdm/workspace/features/FEAT-001-appointment-booking/TASK-003-implement-appointment-store-prd.md`: Store 方法
- `src/views/Consultation.vue`: 表单页面参考

## 4. Acceptance Criteria

### 4.1 Primary Criteria

| Criterion | Test Method | Validation Tool |
|-----------|-------------|-----------------|
| **AC-001**: 页面正常显示医生信息 | 打开页面查看 | 浏览器测试 |
| **AC-002**: 日期选择器只显示有门诊的日期 | 选择日期 | 浏览器测试 |
| **AC-003**: 时段选择器只显示可预约时段 | 选择时段 | 浏览器测试 |
| **AC-004**: 表单验证正常 | 提交空表单 | 浏览器测试 |
| **AC-005**: 预约提交成功 | 填写表单并提交 | 浏览器测试 |
| **AC-006**: 成功后跳转到详情页 | 提交后查看 | 浏览器测试 |
| **AC-007**: TypeScript 编译无错误 | 运行 `tsc --noEmit` | **Validation tool**: `npm run build` |

### 4.2 Edge Cases

| Edge Case | Expected Behavior |
|-----------|------------------|
| 医生 ID 无效 | 显示错误或返回上一页 |
| 所有时段已满 | 提示无可用时段 |
| 提交失败 | 显示错误提示 |

### 4.3 Negative Tests

| Negative Test | Expected Behavior |
|---------------|------------------|
| 不填写就诊原因提交 | 表单验证失败 |
| 不选择日期直接选时段 | 时段选择器禁用 |

## 5. Dependencies

### 5.1 Task Dependencies

- **Depends on**: TASK-003 实现预约 Store 状态管理
- **Blocks**: 无直接阻塞

### 5.2 External Dependencies

| Dependency | Description |
|------------|-------------|
| `src/views/BookAppointment.vue` | 需要创建的文件 |
| `src/store/index.ts` | 获取预约方法 |
| `src/router/index.ts` | 路由配置（将在 TASK-009 完成） |

### 5.3 Prerequisites

| Prerequisite | Description |
|--------------|-------------|
| TASK-003 已完成 | 提供 Store 方法 |
| 路由已配置 | 可在 TASK-009 后测试完整功能 |

## 6. Estimated Effort

### 6.1 Effort Estimate

- **Estimated effort**: 2 小时
- **Complexity**: Medium
- **Risk**: Low

### 6.2 Effort Factors

| Factor | Impact |
|--------|--------|
| 有现有表单参考 | 降低复杂度 |
| 需要日期时段联动 | 增加工作量 |

## 7. Testing Strategy

### 7.1 Automated Validation (Required)

| Validation | Command | Success Criteria |
|------------|---------|------------------|
| **类型检查** | `tsc --noEmit` | 无编译错误 |
| **构建验证** | `npm run build` | 构建成功 |
| **Linter** | `npm run lint` | 无 lint 错误 |

### 7.2 Manual Testing

| Test Case | Description |
|-----------|-------------|
| TC-001 | 打开预约表单页面 |
| TC-002 | 选择有门诊的日期 |
| TC-003 | 选择可预约时段 |
| TC-004 | 填写表单并提交 |
| TC-005 | 提交后跳转详情页 |

## 8. Implementation Notes

### 8.1 页面布局示例

```
┌─────────────────────────────────────┐
│  ← 预约张伟医生                      │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ [头像] 张伟医生                  │ │
│ │ 主任医师 | 心内科                │ │
│ │ 15年临床经验                    │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│  选择预约时间                       │
│  ┌─────────────────────────────────┐ │
│  │ 日期选择器                      │ │
│  └─────────────────────────────────┘ │
│  ┌─────────────────────────────────┐ │
│  │ 时段选择器                      │ │
│  └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│  就诊信息                           │
│  ┌─────────────────────────────────┐ │
│  │ 就诊原因 *                      │ │
│  │ [                            ] │ │
│  └─────────────────────────────────┘ │
│  ┌─────────────────────────────────┐ │
│  │ 联系方式                        │ │
│  │ [                            ] │ │
│  └─────────────────────────────────┘ │
│                                     │
│  [        提交预约        ]         │
└─────────────────────────────────────┘
```

### 8.2 组件代码结构

```vue
<template>
  <div class="book-appointment-page">
    <a-page-header @back="() => $router.back()">
      <template #title>预约 {{ doctor?.name }}</template>
    </a-page-header>
    
    <!-- 医生信息 -->
    <DoctorCard :doctor="doctor" />
    
    <!-- 预约表单 -->
    <a-form :model="form" :rules="rules" @finish="handleSubmit">
      <!-- 日期选择 -->
      <a-form-item name="date">
        <a-date-picker 
          v-model:value="form.date"
          :disabled-date="disabledDate"
          format="YYYY-MM-DD"
        />
      </a-form-item>
      
      <!-- 时段选择 -->
      <a-form-item name="timeSlot">
        <a-select v-model:value="form.timeSlot">
          <a-select-option v-for="slot in availableSlots" :key="slot">
            {{ slot }}
          </a-select-option>
        </a-select>
      </a-form-item>
      
      <!-- 就诊原因 -->
      <a-form-item name="reason" label="就诊原因">
        <a-textarea v-model:value="form.reason" :rows="4" />
      </a-form-item>
      
      <!-- 提交按钮 -->
      <a-form-item>
        <a-button type="primary" html-type="submit" :loading="submitting">
          提交预约
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
```

## 9. Risks and Mitigations

### Risk 1: 路由未配置导致跳转失败

- **Impact**: Low
- **Mitigation**: 在 TASK-009 配置路由后测试

## 10. Deliverables

| Deliverable | Description | File Path |
|-------------|-------------|-----------|
| 预约表单页面 | BookAppointment.vue 组件 | `src/views/BookAppointment.vue` |

**Mandatory Deliverable**: Validation Results
- **Build output**: `npm run build` 成功
- **Type check**: `tsc --noEmit` 无错误

---

## Status Management

| Current Status | 说明 |
|----------------|------|
| TODO | 任务尚未开始 |

### Status Transitions

- `TODO` → `IN PROGRESS`: 开始任务执行
- `IN PROGRESS` → `DONE`: 任务完成并通过验证
