# Task PRD: 路由配置

**Feature ID**: FEAT-001-appointment-booking
**Feature Name**: 预约挂号功能
**Task ID**: TASK-006
**Created Date**: 2026-05-20
**Status**: TODO
**Language**: zh

## 1. Task Overview

### 1.1 Task Summary
配置预约功能相关的路由，实现页面导航和路由守卫。

### 1.2 Task Objectives
- 更新 `src/router/index.ts` 添加预约相关路由
- 配置懒加载
- 添加路由守卫（权限控制）

### 1.3 Related Feature Requirements
- 所有预约功能页面需要路由支持
- User Story: Story 1, Story 2, Story 3, Story 4

## 2. Detailed Requirements

### 2.1 Functional Requirements
- 添加路由：
  - `/appointment/:doctorId` - 预约表单页
  - `/my-appointments` - 我的预约页
  - `/doctor/schedule` - 医生排班页
- 路由守卫：
  - 预约表单需要登录
  - 医生排班需要医生权限

### 2.2 Technical Requirements
- 使用 Vue Router 4.6
- 路由文件：`src/router/index.ts`
- 使用动态导入实现懒加载

## 3. Implementation Approach

### 3.1 Recommended Methodology
- 更新现有路由配置
- 添加路由元信息（meta）用于权限控制
- 实现简单的路由守卫逻辑

### 3.2 Implementation Steps
1. 读取现有 `src/router/index.ts`
2. 添加预约相关路由配置：
   ```typescript
   {
     path: '/appointment/:doctorId',
     component: () => import('../views/AppointmentBooking.vue'),
     meta: { requiresAuth: true }
   },
   {
     path: '/my-appointments',
     component: () => import('../views/MyAppointments.vue'),
     meta: { requiresAuth: true }
   },
   {
     path: '/doctor/schedule',
     component: () => import('../views/DoctorSchedule.vue'),
     meta: { requiresAuth: true, requiresDoctor: true }
   }
   ```
3. 添加路由守卫（beforeEach）
4. 更新首页或导航的链接
5. **Validation Step**: 运行 `npm run build` 验证编译

## 4. Acceptance Criteria

### 4.1 Primary Criteria
- **Criterion 1**: 所有预约页面路由正确配置
  - Test method: 访问各路由验证页面加载
  - **Validation tool**: `npm run build`
- **Criterion 2**: 懒加载正常工作
  - Test method: Network 面板查看按需加载
  - **Validation tool**: `npm run build`

### 4.2 Edge Cases
- 无效 doctorId 的处理（404 或重定向）
- 未登录访问受保护路由的重定向

## 5. Dependencies

### 5.1 Task Dependencies
- **Depends on**: TASK-001 (数据模型设计)
- **Blocks**: 无（其他任务依赖此任务完成路由配置）

### 5.2 External Dependencies
- Vue Router 4.6

## 6. Estimated Effort

### 6.1 Effort Estimate
- **Estimated effort**: 0.5 小时
- **Complexity**: Low
- **Risk**: Low

## 7. Testing Strategy

### 7.1 Automated Validation (Required)
- **Build validation**: `npm run build`
- **Exit criteria**: 命令 exit code 为 0

## 8. Implementation Notes

- 保持现有路由不变
- 路由顺序：动态路由放在静态路由后面

## 9. Deliverables

- 更新 `src/router/index.ts`
- **Build output**: TypeScript 编译无错误

---
