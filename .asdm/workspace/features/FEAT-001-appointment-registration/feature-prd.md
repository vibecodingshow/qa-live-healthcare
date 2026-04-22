# Feature PRD: 预约挂号功能

**Feature ID**: FEAT-001
**Feature Name**: 预约挂号功能
**Created Date**: 2026-04-22
**Status**: PLANNED
**Language**: zh (简体中文)

## 1. Overview

### 1.1 Feature Summary

预约挂号功能是医疗问诊平台的核心功能之一，旨在为患者和医生提供便捷的线下门诊预约服务。通过该功能，患者可以在线浏览医生的可预约时间，选择合适的时段进行预约；医生可以管理自己的预约和处理患者的预约请求。

**功能定位**：连接患者与医生的线下门诊服务通道，实现门诊服务的在线化、智能化管理。

### 1.2 与现有问诊功能的区别和联系

| 维度 | 在线问诊 | 预约挂号 |
|------|----------|----------|
| **服务形式** | 线上文字/视频咨询 | 线下门诊面对面就诊 |
| **交互方式** | 实时在线沟通 | 预约指定时间到院就诊 |
| **使用场景** | 轻症咨询、复诊开药 | 需面诊检查的情况 |
| **数据复用** | 共用患者/医生基础数据 | 共用患者/医生基础数据 |

**联系**：
- 共用医生基础数据结构和展示逻辑
- 共用患者身份认证体系
- 可互相导流（问诊后推荐预约面诊，预约前可先问诊）

### 1.3 Objectives

- **核心目标**：为患者和医生提供便捷的在线预约挂号服务，减少现场排队等候时间
- **用户体验**：提供直观的预约界面，支持快速选择医生和时段
- **服务效率**：优化门诊预约流程，提高医院/诊所的服务接待能力
- **数据管理**：建立完善的预约数据管理机制，支持预约状态的实时跟踪
- **双向管理**：同时支持患者端和医生端的预约管理功能

---

## 2. User Stories

### Story 1: 患者查找医生并预约

**As a** 患者
**I want to** 根据科室、医生姓名或擅长领域查找医生
**So that** 我能够找到适合自己的医生进行线下门诊预约

**Acceptance Criteria**:
- ✅ 支持按科室筛选医生列表
- ✅ 支持按医生姓名搜索
- ✅ 显示医生的基本信息（姓名、职称、科室、擅长领域）
- ✅ 显示医生的可预约时段
- ✅ 支持查看医生的排班信息

### Story 2: 患者选择预约时段并确认预约

**As a** 患者
**I want to** 选择具体的预约日期和时间段
**So that** 我能够预约到合适的时间前往门诊就诊

**Acceptance Criteria**:
- ✅ 显示医生未来7天的可预约时段
- ✅ 每个时段显示剩余号源数量
- ✅ 禁止选择已满的时段
- ✅ 显示预约须知和注意事项
- ✅ 支持选择就诊原因或症状描述

### Story 3: 患者管理自己的预约记录

**As a** 患者
**I want to** 查看、取消或修改我的预约记录
**So that** 我能够灵活管理自己的就诊安排

**Acceptance Criteria**:
- ✅ 支持查看所有预约记录（待确认、已确认、待就诊、已完成、已取消）
- ✅ 支持在规定时间内取消预约（就诊前2小时）
- ✅ 显示预约的详细状态
- ✅ 提供取消预约的原因选择
- ✅ 发送预约变更通知

### Story 4: 患者接收预约提醒

**As a** 患者
**I want to** 收到预约时间临近的提醒通知
**So that** 我不会错过预约的就诊时间

**Acceptance Criteria**:
- ✅ 在就诊前24小时发送提醒通知
- ✅ 支持查看历史通知记录
- ✅ 提醒信息包含预约详情和注意事项

### Story 5: 医生查看和管理预约

**As a** 医生
**I want to** 查看今日/本周的预约列表，并处理患者的预约请求
**So that** 我能够有效管理门诊工作安排

**Acceptance Criteria**:
- ✅ 支持查看今日/本周/自定义时间范围的预约列表
- ✅ 显示预约患者的基本信息和就诊原因
- ✅ 支持确认或婉拒新的预约申请
- ✅ 显示预约统计（总预约数、已确认数、待处理数）

### Story 6: 医生设置出诊时间和可预约人数

**As a** 医生
**I want to** 设置自己的出诊排班和每个时段的预约人数上限
**So that** 我能够合理控制门诊工作量

**Acceptance Criteria**:
- ✅ 支持设置每周的固定出诊时间
- ✅ 支持临时调整出诊日期
- ✅ 可设置每个时段的最大预约人数
- ✅ 可设置预约的开放和关闭时间

---

## 3. Functional Requirements

### 3.1 患者端功能需求

| ID | 需求名称 | 描述 | 优先级 | 关联用户故事 |
|----|---------|------|--------|-------------|
| REQ-001 | 医生搜索与展示 | 提供医生的搜索和列表展示功能 | High | Story 1 |
| REQ-002 | 预约时段管理 | 管理系统中各医生的可预约时段 | High | Story 1, Story 2 |
| REQ-003 | 预约下单与确认 | 支持患者选择时段并提交预约申请 | High | Story 2 |
| REQ-004 | 预约记录管理 | 提供预约记录的查询、取消和状态跟踪 | High | Story 3 |
| REQ-005 | 预约提醒通知 | 在预约时间临近时自动发送提醒 | Medium | Story 4 |

### 3.2 医生端功能需求

| ID | 需求名称 | 描述 | 优先级 | 关联用户故事 |
|----|---------|------|--------|-------------|
| REQ-006 | 医生预约列表 | 医生查看和管理自己的预约 | High | Story 5 |
| REQ-007 | 预约审核处理 | 医生确认或婉拒预约申请 | High | Story 5 |
| REQ-008 | 医生排班设置 | 医生设置出诊时间和可预约人数 | High | Story 6 |

### 3.3 预约状态流转

```
                    ┌─────────────┐
                    │   待确认     │
                    │ (PENDING)   │
                    └──────┬──────┘
                           │
            ┌──────────────┼──────────────┐
            │              │              │
            ▼              ▼              ▼
     ┌──────────┐   ┌──────────┐   ┌──────────┐
     │ 已确认   │   │ 已拒绝   │   │ 已取消   │
     │CONFIRMED │   │ REJECTED │   │CANCELLED│
     └────┬─────┘   └──────────┘   └──────────┘
          │
          ▼
     ┌──────────┐
     │ 待就诊   │
     │SCHEDULED │
     └────┬─────┘
          │
    ┌─────┴─────┐
    │           │
    ▼           ▼
┌──────────┐ ┌──────────┐
│ 已完成   │ │ 已取消   │
│COMPLETED │ │CANCELLED │
└──────────┘ └──────────┘
```

---

## 4. Scope Definition

### 4.1 In Scope (本次迭代范围内)

**患者端功能**：
- 医生搜索和列表展示
- 预约时段选择和预约创建
- 预约记录查看和管理
- 预约取消功能
- 预约提醒通知（就诊前24小时）

**医生端功能**：
- 预约列表查看和处理
- 预约确认/拒绝操作
- 出诊排班设置
- 可预约人数设置

**公共功能**：
- 预约状态管理和流转
- 预约数据存储和查询
- 基础的数据验证

### 4.2 Out of Scope (本次迭代范围外)

- 在线支付功能（后续迭代）
- 与医院HIS系统集成（后续迭代）
- 预约签到功能（后续迭代）
- 预约评价功能（后续迭代）
- 医生排班模板功能（后续迭代）
- 候诊叫号功能（后续迭代）

---

## 5. Technical Requirements

### 5.1 Architecture Considerations

**前端架构**：
- **框架**：Vue 3 + TypeScript（与现有项目技术栈保持一致）
- **UI组件库**：Ant Design Vue 4.2.6（复用现有组件）
- **状态管理**：使用 Vue Router 管理预约相关状态
- **路由设计**：
  - `/appointment` - 预约首页（医生列表）
  - `/appointment/doctor/:id` - 医生详情和预约
  - `/appointment/my` - 我的预约
  - `/doctor/appointments` - 医生预约管理
  - `/doctor/schedule` - 医生排班设置

**数据模型**：

```typescript
// 预约记录
interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  scheduleId: string;
  timeSlotId: string;
  appointmentDate: string;    // 预约日期
  appointmentTime: string;    // 预约时间
  status: AppointmentStatus; // 预约状态
  reason?: string;           // 就诊原因
  cancelReason?: string;      // 取消原因
  createdAt: string;
  updatedAt: string;
}

// 医生排班
interface DoctorSchedule {
  id: string;
  doctorId: string;
  workDate: string;           // 工作日期
  timeSlots: TimeSlot[];      // 可预约时段列表
  createdAt: string;
  updatedAt: string;
}

// 时段
interface TimeSlot {
  id: string;
  startTime: string;          // 开始时间
  endTime: string;           // 结束时间
  maxAppointments: number;   // 最大预约人数
  currentAppointments: number;// 当前预约人数
  status: 'available' | 'full' | 'closed';
}
```

### 5.2 API Interface Design

#### 患者端接口

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/doctors` | 获取医生列表（支持科室筛选） |
| GET | `/api/doctors/:id` | 获取医生详情 |
| GET | `/api/doctors/:id/schedule` | 获取医生排班和可预约时段 |
| POST | `/api/appointments` | 创建预约 |
| GET | `/api/appointments` | 获取我的预约列表 |
| GET | `/api/appointments/:id` | 获取预约详情 |
| PUT | `/api/appointments/:id/cancel` | 取消预约 |

#### 医生端接口

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/doctor/appointments` | 获取医生的预约列表 |
| PUT | `/api/doctor/appointments/:id/confirm` | 确认预约 |
| PUT | `/api/doctor/appointments/:id/reject` | 拒绝预约 |
| GET | `/api/doctor/schedule` | 获取医生排班 |
| POST | `/api/doctor/schedule` | 创建排班 |
| PUT | `/api/doctor/schedule/:id` | 更新排班 |
| DELETE | `/api/doctor/schedule/:id` | 删除排班 |

### 5.3 Dependencies

**内部依赖**：
- 现有医生数据模型和展示逻辑
- 现有用户认证系统（患者和医生身份）
- 现有 UI 组件库（Ant Design Vue）
- 现有路由配置系统

**外部依赖**：
- 短信通知服务（用于预约提醒）
- 邮件服务（可选，用于通知）

### 5.4 Constraints

- 必须与现有系统无缝集成，不影响现有功能
- 预约取消时间限制：就诊前2小时可取消
- 每个时段的最大预约人数由医生设置（默认10人）
- 预约只能提前7天创建

---

## 6. Non-Functional Requirements

### 6.1 Performance

- 医生列表查询响应时间 < 500ms
- 预约提交处理时间 < 1s
- 支持至少1000并发用户同时访问
- 页面加载时间 < 3s

### 6.2 Security

- 所有用户操作需要进行身份验证
- 预约数据需要加密存储和传输
- 防止恶意预约和号源抢占行为
- 患者隐私信息保护（遵循医疗数据保护法规）
- 医生只能查看和管理自己的预约
- 患者只能查看和管理自己的预约

### 6.3 Scalability

- 支持水平扩展以应对用户增长
- 数据库设计支持未来功能扩展
- 预留与第三方系统（医院HIS系统）的集成接口

### 6.4 Reliability

- 系统可用性目标：99.5%以上
- 支持预约数据的自动备份
- 提供预约冲突检测和自动处理机制
- 号源超卖保护机制

---

## 7. Success Criteria

| 指标 | 目标值 | 衡量方式 |
|------|--------|----------|
| 预约成功率 | ≥ 99% | 成功预约数 / 预约尝试数 |
| 用户满意度 | ≥ 4.5分 | 用户评分（5分制） |
| 预约取消率 | ≤ 10% | 取消预约数 / 总预约数 |
| 系统响应时间 | < 500ms | API 平均响应时间 |
| 预约完成率 | ≥ 85% | 实际就诊数 / 确认预约数 |

---

## 8. Task Breakdown Principles

### 8.1 Granularity

- 每个任务的工作量控制在1-2小时以内（人类开发者）
- 任务应该专注于单一功能点
- 避免将复杂任务合并成一个

### 8.2 Independence

- 优先设计无依赖或低依赖的任务
- 确保关键路径任务优先完成
- 允许部分功能独立测试和上线

### 8.3 Testability

- 每个任务都有明确的验收标准
- 支持独立的功能测试
- 提供必要的测试数据和场景

### 8.4 Task Categories

- **分析与设计**：数据模型设计、API 接口设计、UI/UX 设计
- **代码实现**：前端页面开发、后端接口开发、组件开发
- **测试**：单元测试、集成测试、用户验收测试

### 8.5 Task Count Estimation

基于功能需求，预估需要分解为 **8-10个核心任务**：

| 任务类别 | 预估任务数 | 说明 |
|---------|-----------|------|
| 数据模型和类型定义 | 1-2个 | 预约、排班、时段等数据模型 |
| 患者端页面开发 | 2-3个 | 医生列表、预约确认、我的预约 |
| 医生端页面开发 | 2个 | 预约管理、排班设置 |
| API 接口开发 | 2个 | 患者端接口、医生端接口 |
| 状态管理和通知 | 1-2个 | 预约状态流转、提醒通知 |
| **总计** | **8-10个** | - |

**任务分解将在 `/asdm-prd-breakdown` 阶段执行**

---

## 9. Implementation Notes

### 9.1 数据模型复用

**复用现有数据模型**：
- Patient 信息 → 复用现有用户认证系统
- Doctor 信息 → 复用现有医生数据结构

**新增数据模型**：
- Appointment 预约记录
- DoctorSchedule 医生排班
- TimeSlot 时段信息

### 9.2 性能优化策略

- 对热门医生的号源进行缓存
- 使用索引优化数据库查询
- 实现预约时段的预加载机制
- 实施乐观锁防止号源超卖

### 9.3 与现有系统集成

- 复用现有的医生数据结构和展示逻辑
- 对接现有用户认证系统获取患者信息
- 统一使用项目中的 UI 组件和样式规范
- 保持与在线问诊功能的数据隔离

---

## 10. Risks and Mitigations

### Risk 1: 号源冲突（高）

**Description**：多个用户同时抢预约导致号源超卖

**Mitigation**：
- 使用数据库事务锁保证原子性
- 实施乐观锁或悲观锁机制
- 预留10%的号源作为动态调整

### Risk 2: 高并发压力（高）

**Description**：热门医生放号时出现高并发请求

**Mitigation**：
- 实施请求限流机制
- 使用缓存减轻数据库压力
- 设计异步队列处理预约请求

### Risk 3: 用户体验问题（中）

**Description**：预约流程复杂导致用户流失

**Mitigation**：
- 简化预约流程，减少必填项
- 提供预约进度提示和错误恢复机制
- 收集用户反馈持续优化

### Risk 4: 数据安全风险（高）

**Description**：患者隐私信息泄露

**Mitigation**：
- 实施严格的数据访问控制
- 敏感数据加密存储
- 定期进行安全审计

---

## 11. Appendix

### 11.1 References

- 项目技术栈文档：`.asdm/contexts/standard-project-structure.md`
- 数据模型文档：`.asdm/contexts/data-models.md`
- API 接口文档：`.asdm/contexts/api.md`
- 系统架构文档：`.asdm/contexts/architecture.md`
- 代码规范文档：`.asdm/contexts/standard-coding-style.md`

### 11.2 Glossary

| 术语 | 定义 |
|------|------|
| **预约挂号** | 患者通过线上渠道预约医生门诊服务的行为 |
| **号源** | 医生在特定时段的可用预约名额 |
| **排班** | 医生的工作时间安排 |
| **就诊状态** | 预约从创建到完成过程中的各种状态 |
| **待确认** | 预约已创建，等待医生确认 |
| **已确认** | 医生已确认预约，患者按时就诊 |
| **待就诊** | 预约已确认，等待患者就诊 |
| **已完成** | 患者已完成就诊 |

---

**Document Version**: 1.0
**Last Updated**: 2026-04-22
**Created by**: ASDM PRD Builder
**Feature Status**: PLANNED

---

## 下一步行动

1. **任务分解**：使用 `/asdm-prd-breakdown` 命令将功能分解为具体任务
2. **任务执行**：使用 `/asdm-prd-execution` 命令执行任务开发
3. **状态更新**：根据实际进展更新功能状态