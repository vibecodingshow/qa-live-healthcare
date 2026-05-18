# Task PRD: 患者端 - 医生列表页面

**Feature ID**: FEAT-001
**Feature Name**: 预约挂号功能
**Task ID**: TASK-003
**Created Date**: 2026-04-22
**Status**: TODO
**Language**: zh (简体中文)

## 1. Task Overview

### 1.1 Task Summary

本任务实现患者端的医生列表页面，支持按科室筛选医生、按医生姓名搜索，显示医生基本信息（姓名、职称、科室、擅长领域）和可预约时段。

### 1.2 Task Objectives

- 创建医生列表页面组件
- 实现科室筛选功能
- 实现医生姓名搜索功能
- 显示医生可预约时段
- 优化页面加载性能

### 1.3 Related Feature Requirements

- **Feature Requirement**: REQ-001（医生搜索与展示）
- **Related User Story**: Story 1（患者查找医生并预约）
- **Technical Spec**: 第5.1节路由设计

## 2. Detailed Requirements

### 2.1 Functional Requirements

- 页面加载时获取医生列表
- 支持按科室筛选医生（内科、外科、儿科等）
- 支持按医生姓名模糊搜索
- 显示医生卡片信息：姓名、职称、科室、擅长领域
- 显示医生的可预约时段数量
- 支持点击医生卡片进入医生详情页
- 分页加载（每页 10 条）
- Loading 状态和空状态展示

### 2.2 Technical Requirements

- 页面组件位置：`src/views/AppointmentDoctors.vue`
- 使用 Vue 3 Composition API
- 使用 Ant Design Vue 组件库
- 遵循项目编码规范
- 响应式布局设计

### 2.3 Constraints and Limitations

- 搜索防抖处理（300ms）
- 最多显示 100 条医生记录
- 搜索条件组合使用

## 3. Implementation Approach

### 3.1 Recommended Methodology

采用组件化开发：
1. 创建医生卡片子组件
2. 实现搜索和筛选逻辑
3. 集成 API 接口
4. 优化性能

### 3.2 Implementation Steps

1. **创建医生卡片组件**
   - 创建 `src/components/DoctorCard.vue`
   - 展示医生基本信息
   - 显示可预约时段

2. **创建医生列表页面**
   - 创建 `src/views/AppointmentDoctors.vue`
   - 布局结构设计
   - 搜索栏和筛选器

3. **实现搜索和筛选逻辑**
   - 科室筛选下拉框
   - 姓名搜索输入框
   - 防抖处理

4. **集成 API 接口**
   - 调用 `getDoctors()` 接口
   - 处理加载状态
   - 错误处理

5. **验证步骤**
   - 运行 `npm run build` 确保编译通过
   - 运行 `npm run lint` 确保代码风格

### 3.3 Technical Considerations

- 使用 `ref` 和 `computed` 管理状态
- 使用 `watch` 监听筛选条件变化
- 使用 `useDebounceFn` 实现防抖
- 组件按需加载

### 3.4 Reference to Project Context

- `.asdm/contexts/standard-project-structure.md`: 项目结构
- `.asdm/contexts/standard-coding-style.md`: 组件编码规范
- `src/views/Doctors.vue`: 参考现有医生列表页面

## 4. Acceptance Criteria

### 4.1 Primary Criteria

- **Criterion 1**: 医生列表正确显示
  - Test method: 页面加载后显示医生卡片
  - **Validation tool**: `npm run build` - 编译成功

- **Criterion 2**: 科室筛选功能正常
  - Test method: 选择不同科室，列表正确过滤
  - **Validation tool**: 功能测试

- **Criterion 3**: 姓名搜索功能正常
  - Test method: 输入姓名，列表正确过滤
  - **Validation tool**: 功能测试

- **Criterion 4**: 医生卡片点击跳转正常
  - Test method: 点击卡片跳转详情页
  - **Validation tool**: 功能测试

### 4.2 Edge Cases

- 医生列表为空时显示空状态
- 网络错误时显示错误提示
- 搜索无结果时显示提示

### 4.3 Negative Tests

- 非法筛选条件被正确处理
- 超长搜索文本被截断
- 快速切换筛选条件正确处理

## 5. Dependencies

### 5.1 Task Dependencies

- **Depends on**: TASK-001（数据模型和类型定义）, TASK-002（工具函数）
- **Blocks**: TASK-004（依赖 TASK-003）

### 5.2 External Dependencies

- Vue 3.5.10
- Ant Design Vue 4.2.6
- dayjs 1.11.19
- TASK-006 API 接口

### 5.3 Prerequisites

- TASK-001, TASK-002, TASK-006 已完成
- API 接口可用

## 6. Estimated Effort

### 6.1 Effort Estimate

- **Estimated effort**: 2 hours
- **Complexity**: Medium
- **Risk**: Low

### 6.2 Effort Factors

- 参考现有页面实现
- 组件复用性高

## 7. Testing Strategy

### 7.1 Automated Validation (Required)

- **Build validation**: `npm run build`
- **Type checking**: `npx tsc --noEmit`
- **Linting**: `npm run lint`
- **Exit criteria**: 所有命令退出码为 0

### 7.2 Unit Testing

- 组件渲染测试
- 搜索筛选逻辑测试

### 7.3 Integration Testing

- 与 API 接口集成测试

### 7.4 Manual Testing

- 页面功能手动测试
- 响应式布局测试

## 8. Implementation Notes

- 页面放置在 `src/views/` 目录
- 组件放置在 `src/components/` 目录
- 使用 `scoped` 样式
- 添加适当的注释

## 9. Risks and Mitigations

### Risk 1: 性能问题

- **Description**: 大量医生数据导致页面卡顿
- **Impact**: Medium
- **Mitigation**: 分页加载 + 虚拟滚动

### Risk 2: API 响应慢

- **Description**: 医生列表加载时间长
- **Impact**: Low
- **Mitigation**: 骨架屏 + Loading 状态

## 10. Deliverables

- `src/components/DoctorCard.vue` - 医生卡片组件
- `src/views/AppointmentDoctors.vue` - 医生列表页面
- 单元测试文件
- 页面功能验证

**Mandatory Deliverable**: Validation Results
- **Build output**: TypeScript 编译成功
- **Test results**: 单元测试通过
- **Validation log**: 验证命令执行记录

## 11. 安全与合规要求

### 11.1 安全要求

- **身份验证**: 页面访问需验证用户登录状态
- **数据脱敏**: 医生信息展示需符合隐私保护要求
- **输入校验**: 搜索输入需进行 XSS 过滤，防止注入攻击

### 11.2 合规要求

- **响应式设计**: 页面需支持移动端访问，符合无障碍访问标准
- **加载策略**: 使用骨架屏和 Loading 状态，提升用户体验
- **错误处理**: 错误信息需友好提示，不得显示系统详情

---

**Document Version**: 1.1
**Created Date**: 2026-04-22
**Last Updated**: 2026-04-22
**Created by**: ASDM PRD Builder
**Feature**: FEAT-001-appointment-registration
