# Task PRD: 患者端 - API 接口实现

**Feature ID**: FEAT-001
**Feature Name**: 预约挂号功能
**Task ID**: TASK-006
**Created Date**: 2026-04-22
**Status**: TODO
**Language**: zh (简体中文)

## 1. Task Overview

### 1.1 Task Summary

本任务实现患者端预约相关的所有 API 接口，包括获取医生列表、获取医生排班、创建预约、获取预约列表、取消预约等核心接口。

### 1.2 Task Objectives

- 实现患者端预约相关 API 接口
- 创建 API 服务模块
- 实现请求参数验证
- 提供统一的错误处理机制

### 1.3 Related Feature Requirements

- **Feature Requirement**: REQ-001（医生搜索与展示）, REQ-002（预约时段管理）, REQ-003（预约下单与确认）, REQ-004（预约记录管理）, REQ-005（预约提醒通知）
- **Related User Story**: Story 1, Story 2, Story 3, Story 4
- **Technical Spec**: 第5.2节 API Interface Design

## 2. Detailed Requirements

### 2.1 Functional Requirements

- 实现 `getDoctors()` 获取医生列表接口
- 实现 `getDoctorDetail(id)` 获取医生详情接口
- 实现 `getDoctorSchedule(id)` 获取医生排班接口
- 实现 `createAppointment()` 创建预约接口
- 实现 `getMyAppointments()` 获取我的预约列表接口
- 实现 `getAppointmentDetail(id)` 获取预约详情接口
- 实现 `cancelAppointment(id, reason)` 取消预约接口

### 2.2 Technical Requirements

- API 服务文件位置：`src/api/appointment.ts`
- 使用 Fetch API 或 axios（待定）
- 实现请求拦截器和响应拦截器
- TypeScript 类型安全
- 错误码统一处理

### 2.3 Constraints and Limitations

- 取消预约需提供取消原因
- 预约创建需验证号源
- 列表查询支持分页

## 3. Implementation Approach

### 3.1 Recommended Methodology

采用分层架构设计：
1. 定义 API 响应类型
2. 实现基础请求工具
3. 实现业务 API 函数
4. 统一错误处理

### 3.2 Implementation Steps

1. **创建 API 服务文件**
   - 创建 `src/api/appointment.ts`
   - 创建 `src/api/request.ts`（请求工具）

2. **定义 API 类型**
   ```typescript
   interface ApiResponse<T> {
     code: number;
     message: string;
     data: T;
   }
   ```

3. **实现请求工具**
   - GET 请求封装
   - POST 请求封装
   - 错误处理机制

4. **实现业务 API**
   - 医生相关接口
   - 预约相关接口

5. **验证步骤**
   - 运行 `npm run build` 确保编译通过
   - 运行 `npm run lint` 确保代码风格

### 3.3 Technical Considerations

- 使用项目现有的 API 封装模式
- 实现 loading 状态管理
- 实现请求取消功能
- 添加请求日志

### 3.4 Reference to Project Context

- `.asdm/contexts/standard-project-structure.md`: 项目结构
- `.asdm/contexts/api.md`: API 设计规范

## 4. Acceptance Criteria

### 4.1 Primary Criteria

- **Criterion 1**: 所有 API 接口函数已实现并导出
  - Test method: 检查函数存在性
  - **Validation tool**: `npm run build` - 编译成功

- **Criterion 2**: API 请求/响应类型完整
  - Test method: TypeScript 编译检查
  - **Validation tool**: `npx tsc --noEmit`

- **Criterion 3**: 错误处理机制完善
  - Test method: 测试异常场景
  - **Validation tool**: `npm run test`

### 4.2 Edge Cases

- 网络错误处理
- 超时处理
- 并发请求处理

### 4.3 Negative Tests

- 无效参数被正确拒绝
- 未授权请求返回正确错误码
- 服务器错误被正确处理

## 5. Dependencies

### 5.1 Task Dependencies

- **Depends on**: TASK-001（数据模型和类型定义）, TASK-002（工具函数）
- **Blocks**: TASK-003, TASK-004, TASK-005, TASK-007, TASK-008

### 5.2 External Dependencies

- axios 或 Fetch API
- dayjs 1.11.19

### 5.3 Prerequisites

- TASK-001, TASK-002 已完成
- API 类型定义可用

## 6. Estimated Effort

### 6.1 Effort Estimate

- **Estimated effort**: 2 hours
- **Complexity**: Medium
- **Risk**: Low

### 6.2 Effort Factors

- 需要与后端 API 保持一致
- 错误处理逻辑复杂

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
- 统一使用 async/await 风格
- 错误信息本地化处理
- 请求参数校验

## 9. Risks and Mitigations

### Risk 1: API 接口变更

- **Description**: 后端 API 规范变更
- **Impact**: Medium
- **Mitigation**: 定义清晰的类型接口

### Risk 2: 并发问题

- **Description**: 同一时段多次预约冲突
- **Impact**: High
- **Mitigation**: 前端乐观锁 + 后端唯一约束

## 10. Deliverables

- `src/api/request.ts` - 请求工具模块
- `src/api/appointment.ts` - 预约 API 服务
- 单元测试文件
- API 接口文档

**Mandatory Deliverable**: Validation Results
- **Build output**: TypeScript 编译成功
- **Test results**: 单元测试通过
- **Validation log**: 验证命令执行记录

## 11. 安全与合规要求

### 11.1 安全要求

- **身份验证**: 所有 API 请求需携带有效的身份认证 token
- **传输安全**: API 通信必须使用 HTTPS 协议
- **参数校验**: 所有请求参数必须在前端进行校验
- **错误处理**: API 错误信息不得泄露系统内部细节

### 11.2 合规要求

- **数据脱敏**: API 响应中的敏感信息需进行脱敏处理
- **限流保护**: 实现请求限流，防止恶意攻击
- **日志记录**: 关键操作需记录审计日志

---

**Document Version**: 1.1
**Created Date**: 2026-04-22
**Last Updated**: 2026-04-22
**Created by**: ASDM PRD Builder
**Feature**: FEAT-001-appointment-registration
