# Task PRD: 预约记录页面

**Feature ID**: FEAT-001-appointment-booking
**Feature Name**: 预约挂号功能
**Task ID**: TASK-005
**Created Date**: 2026-05-20
**Status**: TODO
**Language**: zh

## 1. Task Overview

### 1.1 Task Summary
开发我的预约记录页面，患者可以查看预约历史、待就诊预约，并支持取消预约。

### 1.2 Task Objectives
- 创建 `src/views/MyAppointments.vue` 页面
- 展示预约列表（待就诊/历史）
- 支持取消未就诊的预约
- 显示预约详情

### 1.3 Related Feature Requirements
- Feature Requirement: REQ-004 (预约记录管理)
- User Story: Story 3

## 2. Detailed Requirements

### 2.1 Functional Requirements
- Tab 切换：待就诊 / 历史记录
- 预约卡片展示：
  - 医生姓名、科室
  - 预约日期和时间段
  - 预约状态
  - 挂号单号
- 待就诊预约支持"取消"操作
- 点击预约查看详情弹窗

### 2.2 Technical Requirements
- 路由配置：`/my-appointments`
- 使用 Ant Design Vue Tabs、Card、Modal
- 调用 `src/data/appointment.ts` 查询和取消

## 3. Implementation Approach

### 3.1 Recommended Methodology
- 创建 `src/views/MyAppointments.vue`
- 使用 Tabs 组件切换列表
- 调用数据接口获取预约记录

### 3.2 Implementation Steps
1. 创建 `src/views/MyAppointments.vue`
2. 配置路由 `/my-appointments`
3. 实现 Tab 结构：待就诊 / 历史
4. 实现 `loadAppointments()` 获取当前用户预约
5. 实现预约卡片渲染
6. 实现取消确认弹窗
7. 实现 `cancelAppointment()` 取消逻辑
8. **Validation Step**: 运行 `npm run build` 验证编译

## 4. Acceptance Criteria

### 4.1 Primary Criteria
- **Criterion 1**: 正确展示待就诊预约列表
  - Test method: 创建预约后查看页面
  - **Validation tool**: `npm run build`
- **Criterion 2**: 可以取消未就诊预约
  - Test method: 点击取消按钮验证
  - **Validation tool**: `npm run build`
- **Criterion 3**: Tab 切换正常
  - Test method: 切换 Tab 验证列表变化

### 4.2 Edge Cases
- 无预约记录时显示空状态
- 取消确认的二次确认

## 5. Dependencies

### 5.1 Task Dependencies
- **Depends on**: TASK-001 (数据模型设计)
- **Blocks**: 无

### 5.2 External Dependencies
- `src/data/appointment.ts`
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

- 添加刷新按钮
- 参考 `src/views/Doctors.vue` 列表风格

## 9. Deliverables

- `src/views/MyAppointments.vue`
- 更新路由配置
- **Build output**: TypeScript 编译无错误

---
