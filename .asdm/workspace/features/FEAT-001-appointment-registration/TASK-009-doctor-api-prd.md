# Task PRD: 医生端 - API 接口实现

**Feature ID**: FEAT-001
**Feature Name**: 预约挂号功能
**Task ID**: TASK-009
**Created Date**: 2026-04-22
**Status**: TODO
**Language**: zh (简体中文)

## 1. Task Overview

### 1.1 Task Summary

本任务实现医生端预约管理相关的所有 API 接口，包括获取医生预约列表、确认/拒绝预约、获取排班列表、创建/更新/删除排班等核心接口。

### 1.2 Task Objectives

- 实现医生端预约管理相关 API 接口
- 实现医生排班管理相关 API 接口
- 创建 API 服务模块
- 提供统一的错误处理机制

### 1.3 Related Feature Requirements

- **Feature Requirement**: REQ-006（医生预约列表）, REQ-007（预约审核处理）, REQ-008（医生排班设置）
- **Related User Story**: Story 5, Story 6
- **Technical Spec**: 第5.2节 API Interface Design

## 2. Detailed Requirements

### 2.1 Functional Requirements

- 实现 `getDoctorAppointments()` 获取医生预约列表接口
- 实现 `confirmAppointment(id)` 确认预约接口
- 实现 `rejectAppointment(id, reason)` 拒绝预约接口
- 实现 `getDoctorSchedule()` 获取医生排班接口
- 实现 `createSchedule()` 创建排班接口
- 实现 `updateSchedule(id)` 更新排班接口
- 实现 `deleteSchedule(id)` 删除排班接口
- 实现 `setMaxAppointments(timeSlotId, max)` 设置最大预约数接口

### 2.2 Technical Requirements

- API 服务文件位置：`src/api/doctor-appointment.ts`
- 使用 Fetch API 或 axios（与患者端一致）
- 实现请求拦截器和响应拦截器
- TypeScript 类型安全
- 错误码统一处理

### 2.3 Constraints and Limitations

- 医生只能管理自己的预约
- 排班设置需提前配置
- 拒绝预约需提供原因

## 3. Implementation Approach

### 3.1 Recommended Methodology

采用分层架构设计（与患者端一致）：
1. 定义 API 响应类型
2. 实现基础请求工具
3. 实现业务 API 函数
4. 统一错误处理

### 3.2 Implementation Steps

1. **创建 API 服务文件**
   - 创建 `src/api/doctor-appointment.ts`
   - 复用 `src/api/request.ts`（TASK-006）

2. **定义 API 类型**
   ```typescript
   // 复用 TASK-006 的响应类型
   import type { ApiResponse, Appointment } from '@/types/appointment';
   ```

3. **实现请求工具**
   - 复用 TASK-006 的 request 模块

4. **实现业务 API**
   - 预约管理接口
   - 排班管理接口

5. **验证步骤**
   - 运行 `npm run build` 确保编译通过
   - 运行 `npm run lint` 确保代码风格

### 3.3 Technical Considerations

- 与患者端 API 保持一致的模式
- 医生端特有接口需要权限验证
- 批量操作支持

### 3.4 Reference to Project Context

- `.asdm/contexts/standard-project-structure.md`: 项目结构
- `.asdm/contexts/api.md`: API 设计规范
- TASK-006: 患者端 API 实现参考

## 4. Acceptance Criteria

### 4.1 Primary Criteria

- **Criterion 1**: 所有医生端 API 接口函数已实现并导出
  - Test method: 检查函数存在性
  - **Validation tool**: `npm run build` - 编译成功

- **Criterion 2**: API 请求/响应类型完整
  - Test method: TypeScript 编译检查
  - **Validation tool**: `npx tsc --noEmit`

- **Criterion 3**: 权限验证机制完善
  - Test method: 测试未授权场景
  - **Validation tool**: `npm run test`

### 4.2 Edge Cases

- 医生无预约时的空列表处理
- 排班时间冲突检测
- 并发操作冲突处理

### 4.3 Negative Tests

- 无效预约 ID 被正确拒绝
- 未授权操作被正确拦截
- 重复操作被正确处理

## 5. Dependencies

### 5.1 Task Dependencies

- **Depends on**: TASK-001（数据模型和类型定义）, TASK-002（工具函数）
- **Blocks**: TASK-007, TASK-008

### 5.2 External Dependencies

- axios 或 Fetch API
- dayjs 1.11.19
- TASK-006 的 request 模块

### 5.3 Prerequisites

- TASK-001, TASK-002, TASK-006 已完成
- API 类型定义可用

## 6. Estimated Effort

### 6.1 Effort Estimate

- **Estimated effort**: 2 hours
- **Complexity**: Medium
- **Risk**: Low

### 6.2 Effort Factors

- 大部分模式与患者端一致
- 排班管理接口较复杂

## 7. Testing Strategy

### 7.1 Automated Validation (Required)

- **Build validation**: `npm run build`
- **Type checking**: `npx tsc --noEmit`
- **Linting**: `npm run lint`
- **Exit criteria**: 所有命令退出码为 0

### 7.2 Unit Testing

- API 函数单元测试（Mock）
- 错误处理测试

### 7.3 Integration Testing

- 与实际后端 API 集成测试

### 7.4 Manual Testing

- API 接口 Postman 测试

## 8. Implementation Notes

- API 服务放置在 `src/api/` 目录
- 与患者端 API 保持一致的命名风格
- 错误信息本地化处理
- 请求参数校验

## 9. Risks and Mitigations

### Risk 1: API 接口变更

- **Description**: 后端 API 规范变更
- **Impact**: Medium
- **Mitigation**: 定义清晰的类型接口

### Risk 2: 权限控制

- **Description**: 医生越权操作
- **Impact**: High
- **Mitigation**: 前端权限校验 + 后端权限验证

## 10. Deliverables

- `src/api/doctor-appointment.ts` - 医生端预约 API 服务
- 单元测试文件
- API 接口文档

**Mandatory Deliverable**: Validation Results
- **Build output**: TypeScript 编译成功
- **Test results**: 单元测试通过
- **Validation log**: 验证命令执行记录

## 11. 安全与合规要求

### 11.1 安全要求

- **身份验证**: 医生端 API 需验证医生身份和执业资格
- **权限控制**: API 需验证请求者是否为对应医生本人
- **操作审计**: 预约审核和排班管理操作需记录审计日志

### 11.2 合规要求

- **数据隔离**: 医生间数据完全隔离，确保患者隐私
- **操作合规**: 拒绝预约必须提供合规理由
- **排班规范**: 排班设置需符合医疗机构管理规定

---

**Document Version**: 1.1
**Created Date**: 2026-04-22
**Last Updated**: 2026-04-22
**Created by**: ASDM PRD Builder
**Feature**: FEAT-001-appointment-registration
