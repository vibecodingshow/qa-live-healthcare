# Task PRD: 号源余量更新机制

**Feature ID**: FEAT-001
**Feature Name**: 预约挂号功能
**Sub-Feature**: SUB-002 号源查询与选择
**Task ID**: TASK-007
**Created Date**: 2026-04-22
**Status**: TODO
**Language**: zh

---

## 1. Task Overview

### 1.1 Task Summary

实现号源余量的实时更新机制，包括前端实时同步号源变化、WebSocket推送更新、以及号源锁定后的余量扣减逻辑。

### 1.2 Task Objectives

- 实现号源余量的实时查询
- 支持WebSocket推送号源变化
- 实现号源锁定和释放机制
- 保证号源数据一致性

### 1.3 Related Feature Requirements

- Feature PRD: `feature-prd.md`
- User Story: US-002 (选择具体的日期和时间进行预约)
- Functional Requirement: FR-009 (系统：预约冲突检测)
- **Blocked by**: TASK-004 (号源实时查询API)

---

## 2. Detailed Requirements

### 2.1 Functional Requirements

| ID | 需求描述 | 优先级 |
|----|---------|--------|
| FR-007-01 | 轮询方式更新号源余量 | Must |
| FR-007-02 | WebSocket推送更新（可选） | Should |
| FR-007-03 | 号源锁定机制（防止超卖） | Must |
| FR-007-04 | 号源释放机制（超时释放） | Must |
| FR-007-05 | 预约成功后号源扣减 | Must |
| FR-007-06 | 取消预约后号源释放 | Must |
| FR-007-07 | 号源余量前端实时展示 | Must |
| FR-007-08 | 乐观更新与回滚 | Should |

### 2.2 Technical Requirements

| ID | 技术要求 |
|----|---------|
| TR-007-01 | 号源锁定超时时间：10分钟 | Must |
| TR-007-02 | 轮询间隔：30秒 | Must |
| TR-007-03 | WebSocket心跳：60秒 | Should |
| TR-007-04 | 分布式锁支持 | Must |

### 2.3 Constraints and Limitations

- 需要分布式锁防止并发超卖
- 需要处理锁超时释放
- 需要考虑网络异常情况

---

## 3. Implementation Approach

### 3.1 Recommended Methodology

1. **前端实现**：
   - PollingService：轮询服务
   - WebSocketService：WebSocket服务
   - SlotStore：号源状态管理（Pinia）

2. **后端实现**：
   - SlotLockService：号源锁定服务
   - DistributedLock：分布式锁实现
   - ScheduledTask：超时释放定时任务

3. **锁机制**：
   ```
   1. 用户选择时段 → 尝试获取锁
   2. 获取成功 → 锁定号源10分钟
   3. 用户完成预约 → 扣减号源，释放锁
   4. 用户超时未操作 → 自动释放锁
   5. 其他用户查询 → 看到最新余量
   ```

### 3.2 Implementation Steps

1. **Step 1: 后端-号源锁定服务开发**
   - Redis分布式锁实现
   - 锁定/解锁API

2. **Step 2: 后端-超时释放定时任务**
   - 定时扫描超时锁
   - 自动释放号源

3. **Step 3: 前端-轮询服务开发**
   - 定时轮询号源数据
   - 数据更新回调

4. **Step 4: 前端-WebSocket服务开发**
   - 连接管理
   - 消息处理
   - 心跳检测

5. **Step 5: 前端-号源状态管理**
   - Pinia Store
   - 状态更新逻辑

6. **Step 6: 前后端联调测试**
   - **Validation Step**: 运行 `mvn clean compile` 确保编译通过
   - 运行 `npm run build` 确保前端编译通过

### 3.3 Technical Considerations

- 使用Redis SETNX实现分布式锁
- 考虑使用Lua脚本保证原子性
- 前端使用VueUse简化WebSocket处理

### 3.4 Reference to Project Context

- `.asdm/contexts/api.md`: API接口规范
- `.asdm/contexts/architecture.md`: 系统架构文档

---

## 4. Acceptance Criteria

### 4.1 Primary Criteria

| 验收标准 | 测试方法 | 验证工具 |
|---------|---------|----------|
| 号源锁定成功 | 并发请求测试 | JMeter |
| 超时自动释放 | 等待超时验证 | 功能测试 |
| 预约后余量扣减 | 完成预约检查余量 | 功能测试 |
| 取消后余量恢复 | 取消预约检查余量 | 功能测试 |
| 前端余量实时更新 | 监控数据变化 | 功能测试 |
| **后端编译无错误** | 运行构建命令 | `mvn clean compile` |
| **前端编译无错误** | 运行构建命令 | `npm run build` |

### 4.2 Edge Cases

| 边界情况 | 预期行为 |
|---------|---------|
| 锁获取失败 | 提示"该号源已被锁定" |
| 锁超时临界点提交 | 后端幂等性校验 |
| Redis服务不可用 | 降级处理，拒绝预约 |
| WebSocket断开 | 自动重连，降级轮询 |

### 4.3 Negative Tests

| 负向测试用例 | 预期行为 |
|------------|---------|
| 并发100人抢同一号源 | 只有1人成功锁定 |
| 模拟网络延迟提交 | 超时处理 |
| 重复取消同一预约 | 幂等性处理 |

---

## 5. Dependencies

### 5.1 Task Dependencies

| 类型 | 依赖任务 | 说明 |
|------|---------|------|
| Blocked by | TASK-004 | 依赖号源查询API |
| 关联 | TASK-011 | 预约提交时使用锁定 |

### 5.2 External Dependencies

| 依赖类型 | 依赖内容 | 说明 |
|---------|---------|------|
| 缓存 | Redis | 分布式锁存储 |
| 消息队列 | WebSocket | 实时推送 |

### 5.3 Prerequisites

- TASK-004 已完成
- Redis服务可用
- WebSocket服务器配置完成

---

## 6. Estimated Effort

### 6.1 Effort Estimate

| 指标 | 值 |
|------|---|
| 预估工时 | 12小时 |
| Story Points | 8 |
| 复杂度 | High |
| 风险 | High |

### 6.2 Effort Factors

| 影响因素 | 影响说明 |
|---------|---------|
| 分布式锁实现复杂度 | 需要仔细设计 |
| 并发测试 | 需要充分测试边界情况 |
| 前后端联调 | 涉及多个系统交互 |

---

## 7. Testing Strategy

### 7.1 Automated Validation (Required)

| 验证类型 | 命令 | 成功标准 |
|---------|------|---------|
| 后端构建 | `mvn clean compile` | Exit code 0 |
| 后端测试 | `mvn test` | Exit code 0 |
| 前端构建 | `npm run build` | Exit code 0 |
| 前端测试 | `npm run test` | Exit code 0 |

### 7.2 Unit Testing

- 分布式锁逻辑测试
- 超时释放逻辑测试
- 扣减/恢复逻辑测试
- **Validation command**: `mvn test && npm run test`
- **Success criteria**: 所有测试通过

### 7.3 Integration Testing

- Redis锁集成测试
- WebSocket推送测试
- 完整预约流程测试
- **Validation command**: `mvn verify && npm run test:e2e`
- **Success criteria**: 所有集成测试通过

### 7.4 Manual Testing

- 并发压力测试
- 超时场景测试
- 网络异常恢复测试

---

## 8. Implementation Notes

- 分布式锁的key格式：`slot_lock:{slotId}`
- 锁的value使用UUID，便于识别
- 前端轮询建议使用 exponential backoff

---

## 9. Risks and Mitigations

### Risk 1: 号源超卖

- **Impact**: Critical
- **Mitigation**: Redis分布式锁+数据库乐观锁双重保障

### Risk 2: 锁超时后数据不一致

- **Impact**: High
- **Mitigation**: 定时任务补偿 + 后端幂等校验

### Risk 3: Redis单点故障

- **Impact**: High
- **Mitigation**: Redis Cluster + 降级方案

---

## 10. Deliverables

| 交付物 | 说明 |
|-------|------|
| 后端-分布式锁服务 | `SlotLockService.java` |
| 后端-锁定API | `SlotLockController.java` |
| 后端-超时释放任务 | `SlotLockCleanupTask.java` |
| 前端-轮询服务 | `src/services/SlotPollingService.ts` |
| 前端-WebSocket服务 | `src/services/SlotWebSocketService.ts` |
| 前端-号源Store | `src/stores/slotStore.ts` |
| 后端单元测试 | `SlotLockServiceTest.java` |
| 前端单元测试 | `__tests__/SlotStore.test.ts` |

### Mandatory Deliverable: Validation Results

- **Build output**: 前后端编译成功
- **Test results**: 所有单元测试通过
- **压力测试**: 并发场景通过

---

**Document Owner:** AI Assistant
**Last Updated:** 2026-04-22
