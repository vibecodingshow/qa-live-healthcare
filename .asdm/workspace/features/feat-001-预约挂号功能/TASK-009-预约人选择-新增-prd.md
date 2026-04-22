# Task PRD: 预约人选择/新增

**Feature ID**: FEAT-001
**Feature Name**: 预约挂号功能
**Sub-Feature**: SUB-003 预约流程
**Task ID**: TASK-009
**Created Date**: 2026-04-22
**Status**: TODO
**Language**: zh

---

## 1. Task Overview

### 1.1 Task Summary

开发预约人选择和新增功能，支持患者选择已添加的就诊人，或者新增新的就诊人信息，包括姓名、手机号、身份证等信息。

### 1.2 Task Objectives

- 展示已添加的就诊人列表
- 支持选择已有就诊人
- 支持新增就诊人信息
- 支持编辑/删除就诊人
- 支持设置默认就诊人

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
| FR-009-01 | 显示已添加的就诊人列表 | Must |
| FR-009-02 | 选择就诊人功能 | Must |
| FR-009-03 | 新增就诊人表单 | Must |
| FR-009-04 | 编辑就诊人信息 | Should |
| FR-009-05 | 删除就诊人 | Should |
| FR-009-06 | 设置默认就诊人 | Should |
| FR-009-07 | 实名认证状态显示 | Should |
| FR-009-08 | 就诊人数量限制（最多5个） | Should |

### 2.2 Technical Requirements

| ID | 技术要求 |
|----|---------|
| TR-009-01 | 就诊人信息本地缓存 | Should |
| TR-009-02 | 身份证格式校验 | Must |
| TR-009-03 | 手机号格式校验 | Must |
| TR-009-04 | 支持就诊人头像上传 | Should |

### 2.3 Constraints and Limitations

- 就诊人必须实名认证
- 未成年人需监护人信息
- 就诊人信息加密存储

---

## 3. Implementation Approach

### 3.1 Recommended Methodology

1. **组件设计**：
   - `PatientSelector.vue` - 就诊人选择器主组件
   - `PatientCard.vue` - 就诊人卡片
   - `PatientForm.vue` - 新增/编辑表单
   - `PatientList.vue` - 就诊人列表

2. **API设计**：
   - `GET /api/patient/list` - 获取就诊人列表
   - `POST /api/patient` - 新增就诊人
   - `PUT /api/patient/:id` - 更新就诊人
   - `DELETE /api/patient/:id` - 删除就诊人

3. **数据模型**：
   ```typescript
   interface Patient {
     id: string
     name: string
     idCard: string
     phone: string
     gender: 'male' | 'female'
     birthday: string
     relationship: string
     isDefault: boolean
     avatar?: string
   }
   ```

### 3.2 Implementation Steps

1. **Step 1: 就诊人API服务开发**
   - API接口定义
   - Service层开发

2. **Step 2: 就诊人卡片组件开发**
   - 卡片布局
   - 选中状态
   - 操作按钮

3. **Step 3: 新增/编辑表单组件**
   - 表单字段定义
   - 校验规则
   - 提交处理

4. **Step 4: 就诊人选择器组件**
   - 列表展示
   - 选择逻辑
   - 新增入口

5. **Step 5: 验证实现**
   - **Validation Step**: 运行 `npm run build` 确保编译通过
   - 运行 `npm run lint` 确保代码风格符合规范

### 3.3 Technical Considerations

- 使用 Pinia 管理就诊人列表状态
- 就诊人信息缓存到本地，加快加载
- 身份证号脱敏显示（部分隐藏）

### 3.4 Reference to Project Context

- `.asdm/contexts/standard-coding-style.md`: Vue组件编码规范
- `.asdm/contexts/api.md`: API接口规范

---

## 4. Acceptance Criteria

### 4.1 Primary Criteria

| 验收标准 | 测试方法 | 验证工具 |
|---------|---------|----------|
| 就诊人列表正确显示 | 验证列表渲染 | 功能测试 |
| 选择就诊人正常 | 点击验证选中状态 | 功能测试 |
| 新增就诊人成功 | 填写表单提交验证 | 功能测试 |
| 编辑就诊人成功 | 修改信息提交验证 | 功能测试 |
| 删除就诊人成功 | 删除后列表验证 | 功能测试 |
| **代码编译无错误** | 运行构建命令 | `npm run build` |
| **代码风格符合规范** | 运行lint检查 | `npm run lint` |

### 4.2 Edge Cases

| 边界情况 | 预期行为 |
|---------|---------|
| 无就诊人记录 | 显示空状态和新增按钮 |
| 就诊人已达上限 | 禁用新增按钮 |
| 删除默认就诊人 | 提示确认，自动切换默认 |
| 身份证格式错误 | 实时校验提示 |

### 4.3 Negative Tests

| 负向测试用例 | 预期行为 |
|------------|---------|
| 重复身份证添加 | 提示"该证件已添加" |
| 手机号格式错误 | 实时校验提示 |
| 删除正在预约的就诊人 | 提示无法删除 |

---

## 5. Dependencies

### 5.1 Task Dependencies

| 类型 | 依赖任务 | 说明 |
|------|---------|------|
| Blocked by | TASK-008 | 依赖表单页面集成 |

### 5.2 External Dependencies

| 依赖类型 | 依赖内容 | 说明 |
|---------|---------|------|
| API | 就诊人CRUD接口 | 后端接口 |
| 认证 | 实名认证接口 | 实名认证状态 |

### 5.3 Prerequisites

- TASK-008 已完成
- 后端就诊人接口可用

---

## 6. Estimated Effort

### 6.1 Effort Estimate

| 指标 | 值 |
|------|---|
| 预估工时 | 6小时 |
| Story Points | 3 |
| 复杂度 | Medium |
| 风险 | Low |

### 6.2 Effort Factors

| 影响因素 | 影响说明 |
|---------|---------|
| 表单字段数量 | 影响开发时间 |
| 校验规则复杂度 | 实名认证规则 |

---

## 7. Testing Strategy

### 7.1 Automated Validation (Required)

| 验证类型 | 命令 | 成功标准 |
|---------|------|---------|
| 构建验证 | `npm run build` | Exit code 0 |
| 代码质量 | `npm run lint` | Exit code 0 |
| 类型检查 | `npm run type-check` | Exit code 0 |

### 7.2 Unit Testing

- 组件渲染测试
- 表单校验测试
- API调用测试
- **Validation command**: `npm run test:unit`
- **Success criteria**: 所有测试通过

### 7.3 Integration Testing

- 与预约表单集成测试
- **Validation command**: `npm run test:e2e`
- **Success criteria**: E2E测试通过

### 7.4 Manual Testing

- 表单交互测试
- 多设备适配测试

---

## 8. Implementation Notes

- 就诊人身份证号存储需加密
- 身份证号显示时需脱敏
- 考虑添加就诊人头像功能

---

## 9. Risks and Mitigations

### Risk 1: 就诊人信息安全

- **Impact**: High
- **Mitigation**: 数据加密存储，敏感信息脱敏显示

### Risk 2: 实名认证失败

- **Impact**: Medium
- **Mitigation**: 提供清晰的错误提示和解决方案

---

## 10. Deliverables

| 交付物 | 说明 |
|-------|------|
| 就诊人API服务 | `src/services/patient.ts` |
| 就诊人卡片组件 | `src/components/PatientCard.vue` |
| 新增/编辑表单 | `src/components/PatientForm.vue` |
| 就诊人列表组件 | `src/components/PatientList.vue` |
| 就诊人选择器 | `src/components/PatientSelector.vue` |
| 单元测试 | `__tests__/PatientSelector.test.ts` |

### Mandatory Deliverable: Validation Results

- **Build output**: 编译成功日志
- **Test results**: 单元测试通过率 100%

---

**Document Owner:** AI Assistant
**Last Updated:** 2026-04-22
