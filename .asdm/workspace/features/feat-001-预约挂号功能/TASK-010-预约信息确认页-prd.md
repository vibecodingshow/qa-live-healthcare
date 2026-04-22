# Task PRD: 预约信息确认页

**Feature ID**: FEAT-001
**Feature Name**: 预约挂号功能
**Sub-Feature**: SUB-003 预约流程
**Task ID**: TASK-010
**Created Date**: 2026-04-22
**Status**: TODO
**Language**: zh

---

## 1. Task Overview

### 1.1 Task Summary

开发预约信息确认页面，在用户提交预约前展示完整的预约信息供用户核对，确保信息准确无误后进行提交。

### 1.2 Task Objectives

- 展示完整的预约信息摘要
- 医生信息（姓名、科室、职称）
- 预约时间（日期、时段）
- 就诊人信息
- 费用信息（如有）
- 确认和返回修改功能

### 1.3 Related Feature Requirements

- Feature PRD: `feature-prd.md`
- User Story: US-002 (选择具体的日期和时间进行预约)
- Functional Requirement: FR-004 (患者端：预约信息提交)
- **Blocked by**: TASK-008 (预约表单页面)

---

## 2. Detailed Requirements

### 2.1 Functional Requirements

| ID | 需求描述 | 优先级 |
|----|---------|--------|
| FR-010-01 | 显示医生信息 | Must |
| FR-010-02 | 显示预约时间 | Must |
| FR-010-03 | 显示就诊人信息 | Must |
| FR-010-04 | 显示就诊地点 | Must |
| FR-010-05 | 显示费用信息 | Should |
| FR-010-06 | 显示预约须知 | Should |
| FR-010-07 | 确认提交按钮 | Must |
| FR-010-08 | 返回修改入口 | Must |
| FR-010-09 | 取消预约提示 | Should |

### 2.2 Technical Requirements

| ID | 技术要求 |
|----|---------|
| TR-010-01 | 页面加载速度 < 1s | Must |
| TR-010-02 | 数据完整性校验 | Must |
| TR-010-03 | 订单号生成 | Must |

### 2.3 Constraints and Limitations

- 页面数据从预约表单传递
- 需要校验时段是否仍可预约
- 确认页应有防误操作设计

---

## 3. Implementation Approach

### 3.1 Recommended Methodology

1. **页面路由**：
   - 路由：`/appointment/confirm`

2. **数据来源**：
   - 从 AppointmentForm Store 获取数据
   - 校验数据完整性

3. **组件设计**：
   - `AppointmentConfirm.vue` - 确认页主组件
   - `ConfirmSummary.vue` - 信息摘要组件

### 3.2 Implementation Steps

1. **Step 1: 路由和数据校验**
   - 定义路由参数
   - 数据完整性校验

2. **Step 2: 预约摘要组件开发**
   - 医生信息展示
   - 时间信息展示
   - 就诊人信息展示

3. **Step 3: 费用和须知展示**
   - 费用明细
   - 预约注意事项

4. **Step 4: 确认操作开发**
   - 确认按钮
   - 返回修改
   - 取消操作

5. **Step 5: 验证实现**
   - **Validation Step**: 运行 `npm run build` 确保编译通过
   - 运行 `npm run lint` 确保代码风格符合规范

### 3.3 Technical Considerations

- 使用 computed 计算费用
- 预约须知从配置获取
- 考虑使用骨架屏提升体验

### 3.4 Reference to Project Context

- `.asdm/contexts/standard-coding-style.md`: Vue组件编码规范
- UI设计规范文档

---

## 4. Acceptance Criteria

### 4.1 Primary Criteria

| 验收标准 | 测试方法 | 验证工具 |
|---------|---------|----------|
| 所有信息正确展示 | 核对每项数据 | 功能测试 |
| 返回修改功能正常 | 点击返回验证 | 功能测试 |
| 确认提交跳转正确 | 确认后验证跳转 | 功能测试 |
| 数据校验正常 | 测试异常数据 | 边界测试 |
| **代码编译无错误** | 运行构建命令 | `npm run build` |
| **代码风格符合规范** | 运行lint检查 | `npm run lint` |

### 4.2 Edge Cases

| 边界情况 | 预期行为 |
|---------|---------|
| 数据不完整 | 跳转回表单页 |
| 时段已过期 | 提示并跳转选择页 |
| 直接访问确认页 | 跳转表单页 |

### 4.3 Negative Tests

| 负向测试用例 | 预期行为 |
|------------|---------|
| 无数据访问 | 重定向到表单页 |
| 数据被篡改 | 校验失败，提示错误 |

---

## 5. Dependencies

### 5.1 Task Dependencies

| 类型 | 依赖任务 | 说明 |
|------|---------|------|
| Blocked by | TASK-008 | 依赖表单数据 |
| 关联 | TASK-011 | 为提交提供入口 |

### 5.2 External Dependencies

| 依赖类型 | 依赖内容 | 说明 |
|---------|---------|------|
| Store | AppointmentStore | 获取预约数据 |
| 配置 | 预约须知配置 | 就诊提醒信息 |

### 5.3 Prerequisites

- TASK-008 已完成
- 预约Store已定义

---

## 6. Estimated Effort

### 6.1 Effort Estimate

| 指标 | 值 |
|------|---|
| 预估工时 | 4小时 |
| Story Points | 2 |
| 复杂度 | Low |
| 风险 | Low |

### 6.2 Effort Factors

| 影响因素 | 影响说明 |
|---------|---------|
| 信息项数量 | 影响布局时间 |
| 样式复杂度 | 与设计稿匹配度 |

---

## 7. Testing Strategy

### 7.1 Automated Validation (Required)

| 验证类型 | 命令 | 成功标准 |
|---------|------|---------|
| 构建验证 | `npm run build` | Exit code 0 |
| 代码质量 | `npm run lint` | Exit code 0 |
| 类型检查 | `npm run type-check` | Exit code 0 |

### 7.2 Unit Testing

- 数据渲染测试
- 路由守卫测试
- **Validation command**: `npm run test:unit`
- **Success criteria**: 所有测试通过

### 7.3 Integration Testing

- 完整预约流程测试
- **Validation command**: `npm run test:e2e`
- **Success criteria**: E2E测试通过

### 7.4 Manual Testing

- 信息核对测试
- 交互流程测试

---

## 8. Implementation Notes

- 确认页应有明显的视觉区分
- 费用信息应清晰展示
- 预约须知应完整显示

---

## 9. Risks and Mitigations

### Risk 1: 用户误操作提交

- **Impact**: Medium
- **Mitigation**: 添加二次确认弹窗

### Risk 2: 信息展示不清晰

- **Impact**: Low
- **Mitigation**: 与UI设计师确认布局

---

## 10. Deliverables

| 交付物 | 说明 |
|-------|------|
| 确认页主组件 | `src/views/AppointmentConfirm.vue` |
| 信息摘要组件 | `src/components/ConfirmSummary.vue` |
| 单元测试 | `__tests__/AppointmentConfirm.test.ts` |

### Mandatory Deliverable: Validation Results

- **Build output**: 编译成功日志
- **Test results**: 单元测试通过率 100%

---

**Document Owner:** AI Assistant
**Last Updated:** 2026-04-22
