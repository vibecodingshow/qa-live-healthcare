# Task PRD: 医生排班页面

**Feature ID**: FEAT-001-appointment-booking
**Feature Name**: 预约挂号功能
**Task ID**: TASK-003
**Created Date**: 2026-05-20
**Status**: TODO
**Language**: zh

## 1. Task Overview

### 1.1 Task Summary
开发医生排班管理页面，医生可以设置出诊日期、可预约时段和号源数量。

### 1.2 Task Objectives
- 创建 `src/views/DoctorSchedule.vue` 页面
- 实现日期选择和时段配置功能
- 支持设置每个时段的号源数量
- 预览和保存排班配置

### 1.3 Related Feature Requirements
- Feature Requirement: REQ-001 (医生排班管理)
- User Story: Story 4

## 2. Detailed Requirements

### 2.1 Functional Requirements
- 选择出诊日期（支持选择未来 7 天）
- 为每个时段（上午/下午/晚上）设置：
  - 是否出诊（开关）
  - 可预约号源数（数字输入，0-50）
- 展示当前排班设置
- 保存排班到本地存储

### 2.2 Technical Requirements
- 使用 Vue Router 配置路由 `/doctor/schedule`
- 页面放置于 `src/views/` 目录
- 使用 Ant Design Vue Form、DatePicker、InputNumber
- 引用 TASK-001 的数据接口

## 3. Implementation Approach

### 3.1 Recommended Methodology
- 创建 `src/views/DoctorSchedule.vue`
- 使用 Ant Design Vue 表单组件
- 调用 `src/data/appointment.ts` 存储函数

### 3.2 Implementation Steps
1. 创建 `src/views/DoctorSchedule.vue`
2. 设置路由配置（添加到 `src/router/`）
3. 实现表单结构：
   - DatePicker 选择日期
   - 三个时段配置卡片（上午/下午/晚上）
   - 每个卡片含 Switch 和 InputNumber
4. 实现 `loadSchedule()` 加载现有排班
5. 实现 `saveSchedule()` 保存排班
6. 添加表单验证
7. **Validation Step**: 运行 `npm run build` 验证编译

## 4. Acceptance Criteria

### 4.1 Primary Criteria
- **Criterion 1**: 可以选择日期并配置三个时段
  - Test method: 手动操作验证
  - **Validation tool**: `npm run build`
- **Criterion 2**: 可以保存和加载排班配置
  - Test method: 保存后刷新页面验证数据保留
  - **Validation tool**: `npm run build`
- **Criterion 3**: 路由正确配置
  - Test method: 访问 `/doctor/schedule` 验证页面加载

### 4.2 Edge Cases
- 未登录用户访问时重定向到登录页
- 保存失败时的错误提示

## 5. Dependencies

### 5.1 Task Dependencies
- **Depends on**: TASK-001 (数据模型设计)
- **Blocks**: 无

### 5.2 External Dependencies
- `src/data/appointment.ts`
- Vue Router
- Ant Design Vue

## 6. Estimated Effort

### 6.1 Effort Estimate
- **Estimated effort**: 1.5 小时
- **Complexity**: Medium
- **Risk**: Low

## 7. Testing Strategy

### 7.1 Automated Validation (Required)
- **Build validation**: `npm run build`
- **Exit criteria**: 命令 exit code 为 0

## 8. Implementation Notes

- 参考 `src/views/DoctorLogin.vue` 的页面风格
- 添加权限检查（模拟医生登录状态）

## 9. Deliverables

- `src/views/DoctorSchedule.vue`
- 更新 `src/router/` 路由配置
- **Build output**: TypeScript 编译无错误

---
