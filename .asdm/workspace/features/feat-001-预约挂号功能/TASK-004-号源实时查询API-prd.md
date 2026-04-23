# Task PRD: 号源实时查询API

**Feature ID**: FEAT-001
**Feature Name**: 预约挂号功能
**Sub-Feature**: SUB-002 号源查询与选择
**Task ID**: TASK-004
**Created Date**: 2026-04-22
**Status**: TODO
**Language**: zh

---

## 1. Task Overview

### 1.1 Task Summary

开发号源实时查询API接口，为前端提供准确的号源数据查询能力，包括号源数量、预约状态、时间段信息等。

### 1.2 Task Objectives

- 提供按医生/科室查询号源列表的API
- 支持按日期范围筛选号源
- 返回号源的实时剩余数量
- 提供号源状态的准确标识

### 1.3 Related Feature Requirements

- Feature PRD: `feature-prd.md`
- User Story: US-002 (选择具体的日期和时间进行预约)
- Functional Requirement: FR-002 (患者端：号源查询)
- **Blocked by**: 无

---

## 2. Detailed Requirements

### 2.1 Functional Requirements

| ID | 需求描述 | 优先级 |
|----|---------|--------|
| FR-004-01 | 按医生ID查询号源列表 | Must |
| FR-004-02 | 按科室ID查询号源列表 | Must |
| FR-004-03 | 支持日期范围筛选 | Must |
| FR-004-04 | 返回号源剩余数量 | Must |
| FR-004-05 | 返回号源状态（可预约/已满/停诊） | Must |
| FR-004-06 | 返回时段信息（上午/下午/晚上） | Must |
| FR-004-07 | 支持分页查询 | Should |
| FR-004-08 | 返回号源锁定状态 | Should |

### 2.2 Technical Requirements

| ID | 技术要求 |
|----|---------|
| TR-004-01 | API响应时间 < 200ms |
| TR-004-02 | 支持高并发查询（1000+ QPS） |
| TR-004-03 | 数据缓存策略（Redis） |
| TR-004-04 | 统一的错误码响应 |

### 2.3 Constraints and Limitations

- 号源数据需要与排班系统保持同步
- 需要考虑分布式缓存一致性
- 数据权限控制（部分号源可能对特定用户开放）

---

## 3. Implementation Approach

### 3.1 Recommended Methodology

采用 RESTful API 设计规范：

1. **接口设计**：
   - `GET /api/schedule/doctor/{doctorId}/slots` - 按医生查询号源
   - `GET /api/schedule/department/{deptId}/slots` - 按科室查询号源

2. **数据模型**：
   - ScheduleSlot: 号源数据结构
   - SlotStatus: 号源状态枚举

3. **缓存策略**：
   - 使用 Redis 缓存号源数据
   - 缓存失效时间：5分钟
   - 数据变更时主动刷新缓存

### 3.2 Implementation Steps

1. **Step 1: 设计数据库表结构**
   - 排班表 (schedule)
   - 号源表 (schedule_slot)
   - 索引优化

2. **Step 2: 开发 Service 层**
   - ScheduleService
   - SlotService

3. **Step 3: 开发 Controller 层**
   - 定义API接口
   - 参数校验

4. **Step 4: 实现缓存逻辑**
   - Redis缓存读写
   - 缓存更新机制

5. **Step 5: 验证实现**
   - **Validation Step**: 运行 `mvn clean compile` 确保编译通过
   - 运行单元测试

### 3.3 Technical Considerations

- 使用数据库索引优化查询性能
- 考虑使用读写分离减轻数据库压力
- 号源数据变更需同步更新缓存

### 3.4 Reference to Project Context

- `.asdm/contexts/api.md`: API接口规范
- `.asdm/contexts/data-models.md`: 数据模型规范

---

## 4. Acceptance Criteria

### 4.1 Primary Criteria

| 验收标准 | 测试方法 | 验证工具 |
|---------|---------|----------|
| API正确返回号源列表 | 调用接口验证返回数据 | Postman/curl |
| 日期筛选正常工作 | 传入不同日期验证结果 | 功能测试 |
| 号源状态标识正确 | 对比数据库实际状态 | 数据库验证 |
| 响应时间符合要求 | 压力测试验证 | JMeter |
| **代码编译无错误** | 运行构建命令 | `mvn clean compile` |
| **单元测试全部通过** | 运行测试命令 | `mvn test` |

### 4.2 Edge Cases

| 边界情况 | 预期行为 |
|---------|---------|
| 医生ID不存在 | 返回空列表，状态码200 |
| 查询日期无号源 | 返回空列表 |
| 缓存未命中 | 回源数据库查询 |
| 数据库连接失败 | 返回503 Service Unavailable |

### 4.3 Negative Tests

| 负向测试用例 | 预期行为 |
|------------|---------|
| 传入无效医生ID格式 | 返回400 Bad Request |
| 日期参数格式错误 | 返回400 Bad Request |
| 超过查询日期范围 | 返回空列表 |

---

## 5. Dependencies

### 5.1 Task Dependencies

| 类型 | 依赖任务 | 说明 |
|------|---------|------|
| 无前置依赖 | - | 可独立开发 |

### 5.2 External Dependencies

| 依赖类型 | 依赖内容 | 说明 |
|---------|---------|------|
| 数据库 | MySQL | 号源数据存储 |
| 缓存 | Redis | 数据缓存 |

### 5.3 Prerequisites

- 数据库表结构已创建
- Redis服务可用

---

## 6. Estimated Effort

### 6.1 Effort Estimate

| 指标 | 值 |
|------|---|
| 预估工时 | 8小时 |
| Story Points | 5 |
| 复杂度 | High |
| 风险 | Medium |

### 6.2 Effort Factors

| 影响因素 | 影响说明 |
|---------|---------|
| 数据库性能 | 需要索引优化 |
| 缓存一致性 | 复杂场景需要仔细设计 |

---

## 7. Testing Strategy

### 7.1 Automated Validation (Required)

| 验证类型 | 命令 | 成功标准 |
|---------|------|---------|
| 构建验证 | `mvn clean compile` | Exit code 0 |
| 单元测试 | `mvn test` | Exit code 0 |
| 集成测试 | `mvn verify` | Exit code 0 |

### 7.2 Unit Testing

- Service层逻辑测试
- 参数校验测试
- **Validation command**: `mvn test`
- **Success criteria**: 所有测试通过

### 7.3 Integration Testing

- API端到端测试
- 数据库交互测试
- 缓存交互测试
- **Validation command**: `mvn verify`
- **Success criteria**: 所有集成测试通过

### 7.4 Manual Testing

- 使用Postman测试各接口
- 性能压力测试

---

## 8. Implementation Notes

- 统一使用JSON格式返回
- 错误响应格式：`{code, message, data}`
- 时间格式统一使用ISO 8601

---

## 9. Risks and Mitigations

### Risk 1: 高并发下数据库压力

- **Impact**: High
- **Mitigation**: 使用Redis缓存，合理设置过期时间

### Risk 2: 缓存与数据库数据不一致

- **Impact**: Medium
- **Mitigation**: 数据变更时主动更新缓存

---

## 10. Deliverables

| 交付物 | 说明 |
|-------|------|
| 数据库表结构 | schedule, schedule_slot |
| Entity类 | ScheduleSlot.java |
| Service类 | ScheduleService.java, SlotService.java |
| Controller类 | ScheduleController.java |
| Mapper接口 | ScheduleSlotMapper.java |
| 单元测试 | ScheduleServiceTest.java |

### Mandatory Deliverable: Validation Results

- **Build output**: 编译成功日志
- **Test results**: 单元测试通过率 100%
- **API文档**: Swagger/OpenAPI 文档

---

**Document Owner:** AI Assistant
**Last Updated:** 2026-04-22
