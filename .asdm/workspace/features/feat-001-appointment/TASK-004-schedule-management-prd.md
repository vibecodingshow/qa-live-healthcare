# Task PRD: 实现医生排班管理界面

**Feature ID**: feat-001-appointment
**Feature Name**: 预约挂号功能
**Task ID**: task-004-schedule-management
**Created Date**: 2026-04-21
**Status**: TODO
**Language**: 简体中文

## 1. Task Overview

### 1.1 Task Summary

实现医生端的排班管理界面，让医生可以设置和管理自己的门诊时间表，包括添加、编辑、删除排班，设置可用时间段等功能。该界面仅对已登录的医生可见，是预约挂号功能的重要管理模块。

### 1.2 Task Objectives

**目标1**: 创建医生排班管理页面
**目标2**: 实现排班列表展示功能
**目标3**: 实现新增排班功能
**目标4**: 实现编辑和删除排班功能
**目标5**: 设置排班可用性
**目标6**: 设置最大预约数

### 1.3 Related Feature Requirements

- Feature requirement: REQ-002 (医生排班管理)
- Related user story: Story 2 (医生排班管理)
- Dependencies: TASK-002 (医生排班管理数据)

## 2. Detailed Requirements

### 2.1 Functional Requirements

**FR-001**: 排班管理页面
- 页面路径: `/doctor/schedule` 或 `/doctor/room/schedule`
- 仅登录医生可访问
- 显示当前医生的所有排班

**FR-002**: 排班列表
- 按日期排序显示排班
- 显示日期、时间段、状态、预约数
- 支持快捷操作（编辑、删除）

**FR-003**: 新增排班
- 日期选择（只能选择未来日期）
- 开始时间和结束时间设置
- 最大预约数设置
- 默认设置为可用状态

**FR-004**: 编辑排班
- 修改日期、时间段
- 修改可用状态
- 修改最大预约数
- 不能编辑已过去的排班

**FR-005**: 删除排班
- 确认删除提示
- 删除前检查是否有预约
- 有预约时提示不能删除

### 2.2 Technical Requirements

**TR-001**: 路由保护
- 需要医生登录才能访问
- 使用路由守卫验证

**TR-002**: 表单验证
- 日期不能是过去时间
- 时间段必须有效
- 最大预约数必须大于0

**TR-003**: 组件开发
- 使用Vue 3 Composition API
- 遵循现有组件风格
- 复用Ant Design Vue组件

### 2.3 Constraints and Limitations

- 排班编辑只能在医生工作室页面内
- 删除有预约的排班需要特殊处理
- 过去日期的排班不能编辑

## 3. Implementation Approach

### 3.1 Recommended Methodology

**步骤1**: 创建排班管理组件
- 在DoctorRoom.vue中添加排班管理区域
- 或创建独立的 `ScheduleManager.vue` 组件

**步骤2**: 实现排班列表
- 从Store获取当前医生的排班
- 按日期排序显示
- 显示状态标签

**步骤3**: 实现新增排班表单
- 使用Ant Design Vue Form
- 日期选择器 + 时间选择器
- 数字输入框设置最大预约数

**步骤4**: 实现编辑和删除功能
- 编辑表单复用新增表单
- 删除使用Ant Design Vue Modal确认

**验证步骤**: 构建和测试
- 命令：`npm run build`
- 预期：编译成功

### 3.2 Implementation Steps

1. 在DoctorRoom.vue中添加排班管理区域
2. 实现排班列表显示
3. 实现新增排班表单
4. 实现编辑排班功能
5. 实现删除排班功能
6. 添加路由保护
7. 测试完整流程

### 3.3 Technical Considerations

- 排班管理应集成到医生工作室
- 使用Tab切换或折叠面板
- 保持界面简洁

### 3.4 Reference to Project Context

- 现有 `src/views/DoctorRoom.vue`: 医生工作室参考
- 现有 `src/components/`: 组件目录参考

## 4. Acceptance Criteria

### 4.1 Primary Criteria

**AC-001**: 排班管理页面可访问
- 验收标准：登录医生可访问排班管理页面
- **验证工具**: 手动测试或编译成功

**AC-002**: 排班列表显示正确
- 验收标准：显示当前医生的所有排班
- **验证工具**: 页面功能测试

**AC-003**: 新增排班功能正常
- 验收标准：可成功创建新排班
- **验证工具**: 填写表单并提交

**AC-004**: 编辑排班功能正常
- 验收标准：可成功修改排班信息
- **验证工具**: 编辑表单测试

**AC-005**: 删除排班功能正常
- 验收标准：可成功删除排班
- **验证工具**: 删除操作测试

**AC-006**: 编译无错误
- **验证工具**: `npm run build` 退出码 0

### 4.2 Edge Cases

**EC-001**: 无排班数据
- 场景：医生尚未创建任何排班
- 预期：显示空状态提示

**EC-002**: 编辑已过期的排班
- 场景：尝试编辑过去日期的排班
- 预期：禁用编辑按钮或显示提示

**EC-003**: 删除有预约的排班
- 场景：排班已有患者预约
- 预期：显示警告，阻止删除

## 5. Dependencies

### 5.1 Task Dependencies

- **Depends on**: TASK-002 (医生排班管理数据)
- **Blocks**: 无（独立功能）

### 5.2 External Dependencies

- Vue 3: 前端框架
- Ant Design Vue: UI组件库
- Pinia: 状态管理

## 6. Estimated Effort

### 6.1 Effort Estimate

- **Estimated effort**: 1.5小时
- **Complexity**: Low
- **Risk**: Low

## 7. Testing Strategy

### 7.1 Automated Validation

**Build validation**:
- 命令: `npm run build`
- 预期: 编译成功
- 退出码: 0

### 7.2 Manual Testing

- 登录医生账号测试排班管理
- 测试新增、编辑、删除功能

## 8. Implementation Notes

### 排班管理界面布局

```
┌─────────────────────────────────────────┐
│  排班管理                                 │
├─────────────────────────────────────────┤
│  [+ 新增排班]                             │
├─────────────────────────────────────────┤
│  ┌─────────────────────────────────────┐ │
│  │ 2026-04-22 09:00-12:00             │ │
│  │ 可用 | 3/10 预约    [编辑] [删除]    │ │
│  └─────────────────────────────────────┘ │
│  ┌─────────────────────────────────────┐ │
│  │ 2026-04-23 14:00-17:00             │ │
│  │ 不可用 | 0/5 预约     [编辑] [删除]   │ │
│  └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

## 9. Deliverables

1. **更新的DoctorRoom.vue**: 添加排班管理功能
2. **排班管理表单组件**: 新增/编辑排班表单
3. **更新的Store**: 添加排班CRUD方法