# Task PRD: 预约表单页面

**Feature ID**: FEAT-001
**Feature Name**: 预约挂号功能
**Sub-Feature**: SUB-003 预约流程
**Task ID**: TASK-008
**Created Date**: 2026-04-22
**Status**: TODO
**Language**: zh

---

## 1. Task Overview

### 1.1 Task Summary

开发预约表单页面，收集患者预约所需的信息，包括就诊人信息、预约时段、病情描述等，为提交预约做准备。

### 1.2 Task Objectives

- 展示预约信息摘要（医生、时间）
- 收集就诊人信息
- 收集病情/症状描述
- 表单数据校验
- 提交预约前的信息确认

### 1.3 Related Feature Requirements

- Feature PRD: `feature-prd.md`
- User Story: US-002 (选择具体的日期和时间进行预约)
- Functional Requirement: FR-004 (患者端：预约信息提交)
- **Blocked by**: TASK-006 (时段选择组件)

---

## 2. Detailed Requirements

### 2.1 Functional Requirements

| ID | 需求描述 | 优先级 |
|----|---------|--------|
| FR-008-01 | 显示预约信息摘要（医生、时间、地点） | Must |
| FR-008-02 | 就诊人选择/新增表单 | Must |
| FR-008-03 | 病情描述文本框 | Should |
| FR-008-04 | 就诊卡/医保卡信息（可选） | Should |
| FR-008-05 | 表单必填项校验 | Must |
| FR-008-06 | 提交前确认弹窗 | Must |
| FR-008-07 | 历史就诊人快速选择 | Should |

### 2.2 Technical Requirements

| ID | 技术要求 |
|----|---------|
| TR-008-01 | 表单数据持久化（防止刷新丢失） | Should |
| TR-008-02 | 移动端表单适配 | Must |
| TR-008-03 | 键盘导航支持 | Should |

### 2.3 Constraints and Limitations

- 需要从URL或路由获取预约信息
- 登录用户可直接选择本人信息
- 未登录用户需先登录或填写完整信息

---

## 3. Implementation Approach

### 3.1 Recommended Methodology

1. **页面路由**：
   - 路由：`/appointment/book?slotId=xxx`

2. **组件结构**：
   - `AppointmentForm.vue` - 表单主组件
   - `AppointmentSummary.vue` - 预约摘要组件
   - `PatientSelector.vue` - 就诊人选择组件
   - `PatientForm.vue` - 新增就诊人表单

3. **表单设计**：
   - 使用 VeeValidate + Yup 进行表单校验
   - Pinia Store 管理表单状态

### 3.2 Implementation Steps

1. **Step 1: 页面路由配置**
   - 定义路由和参数
   - 路由守卫处理

2. **Step 2: 预约摘要组件**
   - 显示医生信息
   - 显示预约时间

3. **Step 3: 就诊人选择组件**
   - 历史就诊人列表
   - 新增就诊人表单

4. **Step 4: 预约表单主组件**
   - 表单布局
   - 字段定义和校验

5. **Step 5: 确认和提交逻辑**
   - 确认弹窗
   - 提交处理

6. **Step 6: 验证实现**
   - **Validation Step**: 运行 `npm run build` 确保编译通过
   - 运行 `npm run lint` 确保代码风格符合规范

### 3.3 Technical Considerations

- 表单状态使用 localStorage 持久化
- 考虑使用 VueUse 的 useStorage
- 敏感信息加密存储

### 3.4 Reference to Project Context

- `.asdm/contexts/standard-coding-style.md`: Vue组件编码规范
- `.asdm/contexts/api.md`: API接口规范

---

## 4. Acceptance Criteria

### 4.1 Primary Criteria

| 验收标准 | 测试方法 | 验证工具 |
|---------|---------|----------|
| 预约摘要正确显示 | 验证各字段渲染 | 功能测试 |
| 就诊人选择正常 | 测试选择和新增 | 功能测试 |
| 表单校验正常 | 测试各种错误输入 | 边界测试 |
| 提交成功跳转正确 | 完成提交验证跳转 | 功能测试 |
| **代码编译无错误** | 运行构建命令 | `npm run build` |
| **代码风格符合规范** | 运行lint检查 | `npm run lint` |

### 4.2 Edge Cases

| 边界情况 | 预期行为 |
|---------|---------|
| 无可选就诊人 | 显示新增就诊人表单 |
| 时段已满 | 提示并返回选择页 |
| 未登录用户访问 | 跳转登录页 |

### 4.3 Negative Tests

| 负向测试用例 | 预期行为 |
|------------|---------|
| 必填项为空提交 | 显示校验错误 |
| 提交时网络断开 | 显示错误提示，可重试 |

---

## 5. Dependencies

### 5.1 Task Dependencies

| 类型 | 依赖任务 | 说明 |
|------|---------|------|
| Blocked by | TASK-006 | 依赖时段选择数据 |

### 5.2 External Dependencies

| 依赖类型 | 依赖内容 | 说明 |
|---------|---------|------|
| 表单库 | VeeValidate + Yup | 表单验证 |
| API | 就诊人相关接口 | 获取就诊人列表 |

### 5.3 Prerequisites

- TASK-006 已完成
- 用户认证系统可用

---

## 6. Estimated Effort

### 6.1 Effort Estimate

| 指标 | 值 |
|------|---|
| 预估工时 | 8小时 |
| Story Points | 5 |
| 复杂度 | Medium |
| 风险 | Low |

### 6.2 Effort Factors

| 影响因素 | 影响说明 |
|---------|---------|
| 表单复杂度 | 就诊人信息字段数量 |
| 校验规则 | 校验规则复杂度 |

---

## 7. Testing Strategy

### 7.1 Automated Validation (Required)

| 验证类型 | 命令 | 成功标准 |
|---------|------|---------|
| 构建验证 | `npm run build` | Exit code 0 |
| 代码质量 | `npm run lint` | Exit code 0 |
| 类型检查 | `npm run type-check` | Exit code 0 |

### 7.2 Unit Testing

- 表单渲染测试
- 校验逻辑测试
- 提交逻辑测试
- **Validation command**: `npm run test:unit`
- **Success criteria**: 所有测试通过

### 7.3 Integration Testing

- 完整预约流程测试
- **Validation command**: `npm run test:e2e`
- **Success criteria**: E2E测试通过

### 7.4 Manual Testing

- 多种设备测试
- 无障碍测试

---

## 8. Implementation Notes

- 使用 `<script setup lang="ts">` 语法
- 表单字段使用 TypeScript 类型定义
- 敏感信息不持久化到 localStorage

---

## 9. Risks and Mitigations

### Risk 1: 时效性信息过期

- **Impact**: Medium
- **Mitigation**: 提交前校验时段有效性

### Risk 2: 重复提交

- **Impact**: Medium
- **Mitigation**: 提交按钮防抖+后端幂等校验

---

## 10. Deliverables

| 交付物 | 说明 |
|-------|------|
| 预约表单页面 | `src/views/AppointmentForm.vue` |
| 预约摘要组件 | `src/components/AppointmentSummary.vue` |
| 就诊人选择组件 | `src/components/PatientSelector.vue` |
| 新增就诊人表单 | `src/components/PatientForm.vue` |
| 单元测试 | `__tests__/AppointmentForm.test.ts` |

### Mandatory Deliverable: Validation Results

- **Build output**: 编译成功日志
- **Test results**: 单元测试通过率 100%

---

**Document Owner:** AI Assistant
**Last Updated:** 2026-04-22
