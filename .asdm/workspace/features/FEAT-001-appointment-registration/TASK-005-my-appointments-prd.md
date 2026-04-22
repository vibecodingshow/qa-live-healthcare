# Task PRD: 患者端 - 我的预约页面

**Feature ID**: FEAT-001
**Feature Name**: 预约挂号功能
**Task ID**: TASK-005
**Created Date**: 2026-04-22
**Status**: TODO
**Language**: zh (简体中文)

## 1. Task Overview

### 1.1 Task Summary

本任务实现患者端的预约记录管理页面，支持查看所有预约记录、按状态筛选、查看预约详情、在规定时间内取消预约。

### 1.2 Task Objectives

- 创建我的预约页面组件
- 实现预约列表展示
- 实现状态筛选功能
- 实现预约详情查看
- 实现取消预约功能

### 1.3 Related Feature Requirements

- **Feature Requirement**: REQ-004（预约记录管理）
- **Related User Story**: Story 3（患者管理自己的预约记录）
- **Technical Spec**: 第5.1节路由设计

## 2. Detailed Requirements

### 2.1 Functional Requirements

- 页面加载时获取我的预约列表
- 支持按状态筛选（全部、待确认、已确认、待就诊、已完成、已取消）
- 显示预约列表信息：预约医生、日期、时间、状态
- 支持点击查看预约详情
- 支持在就诊前 2 小时内取消预约
- 提供取消原因选择
- 显示取消预约的提示信息
- 分页加载（每页 10 条）
- Loading 状态和空状态展示

### 2.2 Technical Requirements

- 页面组件位置：`src/views/MyAppointments.vue`
- 使用 Vue 3 Composition API
- 使用 Ant Design Vue 组件库
- 遵循项目编码规范
- 响应式布局设计

### 2.3 Constraints and Limitations

- 取消预约需在就诊前 2 小时完成
- 已完成的预约不能取消
- 已取消的预约不能重复取消

## 3. Implementation Approach

### 3.1 Recommended Methodology

采用 Tab 切换 + 列表展示模式：
1. 创建状态 Tab 切换组件
2. 创建预约列表项组件
3. 实现取消预约流程
4. 集成 API 接口

### 3.2 Implementation Steps

1. **创建预约列表项组件**
   - 创建 `src/components/AppointmentItem.vue`
   - 展示预约基本信息
   - 状态标签显示
   - 取消按钮

2. **创建我的预约页面**
   - 创建 `src/views/MyAppointments.vue`
   - 布局结构设计
   - Tab 切换实现

3. **实现取消预约功能**
   - 取消原因选择弹窗
   - 取消资格校验
   - API 调用

4. **集成 API 接口**
   - 调用 `getMyAppointments()` 接口
   - 调用 `cancelAppointment()` 接口
   - 处理加载状态

5. **验证步骤**
   - 运行 `npm run build` 确保编译通过
   - 运行 `npm run lint` 确保代码风格

### 3.3 Technical Considerations

- 使用 `ref` 和 `computed` 管理状态
- 使用 `watch` 监听筛选条件变化
- 使用 `useRouter` 进行页面跳转
- 使用 TASK-002 的工具函数判断取消资格

### 3.4 Reference to Project Context

- `.asdm/contexts/standard-project-structure.md`: 项目结构
- `.asdm/contexts/standard-coding-style.md`: 组件编码规范
- `.asdm/contexts/data-models.md`: 预约数据模型

## 4. Acceptance Criteria

### 4.1 Primary Criteria

- **Criterion 1**: 预约列表正确显示
  - Test method: 页面加载后显示预约列表
  - **Validation tool**: `npm run build` - 编译成功

- **Criterion 2**: 状态筛选功能正常
  - Test method: 选择不同状态，列表正确过滤
  - **Validation tool**: 功能测试

- **Criterion 3**: 取消预约功能正常
  - Test method: 在可取消时间内成功取消预约
  - **Validation tool**: 功能测试

- **Criterion 4**: 取消资格判断正确
  - Test method: 超过 2 小时限制时不能取消
  - **Validation tool**: 功能测试

### 4.2 Edge Cases

- 预约列表为空时显示空状态
- 网络错误时显示错误提示
- 取消失败时显示错误提示

### 4.3 Negative Tests

- 超过取消时间限制不能取消
- 已完成的预约不能取消
- 取消请求失败后重试

## 5. Dependencies

### 5.1 Task Dependencies

- **Depends on**: TASK-001（数据模型和类型定义）, TASK-002（工具函数）, TASK-006（患者端 API 接口）
- **Blocks**: 无（最终任务）

### 5.2 External Dependencies

- Vue 3.5.10
- Vue Router 4.6.3
- Ant Design Vue 4.2.6
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
- 取消逻辑复用 TASK-002

## 7. Testing Strategy

### 7.1 Automated Validation (Required)

- **Build validation**: `npm run build`
- **Type checking**: `npx tsc --noEmit`
- **Linting**: `npm run lint`
- **Exit criteria**: 所有命令退出码为 0

### 7.2 Unit Testing

- 组件渲染测试
- 取消资格判断测试

### 7.3 Integration Testing

- 与 API 接口集成测试
- 取消预约流程测试

### 7.4 Manual Testing

- 页面功能手动测试
- 取消流程端到端测试

## 8. Implementation Notes

- 页面放置在 `src/views/` 目录
- 组件放置在 `src/components/` 目录
- 使用 `scoped` 样式
- 添加适当的注释
- 添加 Loading 状态

## 9. Risks and Mitigations

### Risk 1: 取消冲突

- **Description**: 预约在取消前被完成
- **Impact**: Low
- **Mitigation**: 乐观锁 + 错误提示

### Risk 2: 并发请求

- **Description**: 快速点击导致多次取消
- **Impact**: Low
- **Mitigation**: 请求防抖 + loading 状态

## 10. Deliverables

- `src/components/AppointmentItem.vue` - 预约列表项组件
- `src/views/MyAppointments.vue` - 我的预约页面
- 单元测试文件
- 页面功能验证

**Mandatory Deliverable**: Validation Results
- **Build output**: TypeScript 编译成功
- **Test results**: 单元测试通过
- **Validation log**: 验证命令执行记录

## 11. 安全与合规要求

### 11.1 安全要求

- **隐私保护**: 预约记录仅允许本人查看，防止信息泄露
- **操作审计**: 取消预约操作需记录日志，便于追溯
- **权限控制**: 仅允许在规定时间内取消本人预约

### 11.2 合规要求

- **数据保留**: 预约记录需保留一定期限，符合医疗数据管理规范
- **取消通知**: 取消操作需发送通知给相关方
- **状态同步**: 预约状态变更需实时同步，不得出现状态不一致

---

**Document Version**: 1.1
**Created Date**: 2026-04-22
**Last Updated**: 2026-04-22
**Created by**: ASDM PRD Builder
**Feature**: FEAT-001-appointment-registration
