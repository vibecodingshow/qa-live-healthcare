# Feature PRD: 预约挂号功能

**Feature ID**: FEAT-001-appointment-booking  
**Created Date**: 2026-04-21  
**Status**: PLANNED  
**Language**: zh  
**Parent Document**: 无（顶层功能）

---

## 📋 层次结构概览

```
FEAT-001-预约挂号功能 (Feature Level)
├── TASK-001-设计预约数据模型 (Task Level)
├── TASK-002-实现医生排班管理界面
├── TASK-003-实现患者预约界面
├── TASK-004-开发预约冲突检测逻辑
├── TASK-005-实现预约记录管理功能
├── TASK-006-集成预约功能到主应用
├── TASK-007-实现预约统计功能
└── TASK-008-测试和优化预约功能
```

## 🔗 相关文档链接
- **任务列表**: [task-list.md](./task-list.md)
- **实现设计**: [implementation-prd.md](./implementation-prd.md)
- **各任务PRD**: [TASK-001](./TASK-001-设计预约数据模型-prd.md) | [TASK-002](./TASK-002-实现医生排班管理界面-prd.md) | [TASK-003](./TASK-003-实现患者预约界面-prd.md) | [TASK-004](./TASK-004-开发预约冲突检测逻辑-prd.md) | [TASK-005](./TASK-005-实现预约记录管理功能-prd.md) | [TASK-006](./TASK-006-集成预约功能到主应用-prd.md) | [TASK-007](./TASK-007-实现预约统计功能-prd.md) | [TASK-008](./TASK-008-测试和优化预约功能-prd.md)

## 1. Overview

### 1.1 Feature Summary
为医疗问诊平台添加预约挂号功能，让患者可以预约医生的线下门诊：
- 患者能够查看医生的排班信息
- 患者可以选择合适的门诊时间进行预约
- 医生可以管理自己的排班和预约记录
- 系统自动处理预约冲突和重复预约

### 1.2 Objectives
- **提升患者体验**：提供便捷的在线预约服务
- **优化医生工作**：合理安排门诊时间，减少等待时间
- **提高就诊效率**：减少现场排队，优化医疗资源配置
- **数据化管理**：实现预约数据的数字化管理

## 2. User Stories

### Story 1：患者创建预约
**作为** 患者
**我希望** 能够浏览医生排班并创建预约
**以便** 避免现场排队，合理安排就诊时间

**验收标准**：
- 患者能够查看医生的排班信息
- 患者可以选择可用的时间段进行预约
- 预约成功后收到确认信息
- 支持预约状态管理（待确认、已确认）

### Story 2：患者查看和管理预约
**作为** 患者
**我希望** 能够查看和管理自己的预约记录
**以便** 随时了解就诊安排，必要时取消预约

**验收标准**：
- 患者可以在个人中心查看所有预约记录
- 支持按状态筛选预约（待确认、已确认、已完成、已取消）
- 患者可以取消未开始的预约
- 显示预约详细信息（医生、时间、状态）

### Story 3：医生查看预约
**作为** 医生
**我希望** 能够查看患者的预约列表
**以便** 提前准备门诊工作

**验收标准**：
- 医生可以查看所有分配给自己的预约
- 支持按日期、状态筛选预约
- 显示预约详细信息（患者、时间、症状描述）
- 提供今日预约提醒功能

### Story 4：医生确认预约
**作为** 医生
**我希望** 能够确认或拒绝患者的预约
**以便** 合理安排门诊工作

**验收标准**：
- 医生可以对待确认预约进行确认操作
- 支持拒绝预约并填写理由
- 预约状态自动更新（待确认 → 已确认/已拒绝）
- 患者收到预约状态变更通知

### Story 5：医生完成预约
**作为** 医生
**我希望** 能够标记预约为已完成
**以便** 记录就诊结果

**验收标准**：
- 医生可以标记已完成的预约
- 支持添加就诊备注和诊断结果
- 预约状态自动更新（已确认 → 已完成）
- 预约记录永久保存

## 3. Functional Requirements

### 3.1 患者端功能列表

#### REQ-001：医生排班浏览
- **ID**: REQ-001
- **Description**: 患者可以浏览医生的排班信息
- **Priority**: High
- **验收标准**: 
  - 按科室、日期筛选医生
  - 显示医生的可预约时间段
  - 支持分页和搜索功能

#### REQ-002：预约创建
- **ID**: REQ-002
- **Description**: 患者可以创建新的预约
- **Priority**: High
- **验收标准**:
  - 选择医生和时间段
  - 填写症状描述和联系方式
  - 提交预约后生成预约号

#### REQ-003：预约管理
- **ID**: REQ-003
- **Description**: 患者可以查看和管理自己的预约
- **Priority**: Medium
- **验收标准**:
  - 查看所有预约记录
  - 支持取消未开始的预约
  - 查看预约详情和状态

### 3.2 医生端功能列表

#### REQ-004：排班管理
- **ID**: REQ-004
- **Description**: 医生可以设置和管理门诊排班
- **Priority**: High
- **验收标准**:
  - 设置每周工作时间和休息时间
  - 支持临时调整排班
  - 自动冲突检测

#### REQ-005：预约查看
- **ID**: REQ-005
- **Description**: 医生可以查看分配给自己的预约
- **Priority**: High
- **验收标准**:
  - 按日期、状态筛选预约
  - 查看预约详细信息
  - 今日预约提醒

#### REQ-006：预约状态管理
- **ID**: REQ-006
- **Description**: 医生可以确认、拒绝和完成预约
- **Priority**: High
- **验收标准**:
  - 确认待确认的预约
  - 拒绝预约并说明理由
  - 标记预约为已完成

#### REQ-007：冲突检测
- **ID**: REQ-007
- **Description**: 系统自动检测预约冲突
- **Priority**: High
- **验收标准**:
  - 防止同一时间段重复预约
  - 检测医生时间冲突
  - 提供友好的冲突提示

## 4. Scope Definition

### 4.1 In Scope (本版本包含)
- 医生排班设置和管理
- 患者在线预约功能
- 预约冲突检测
- 预约记录查看和管理
- 基本的预约统计功能
- 移动端适配支持

### 4.2 Out of Scope (后续版本考虑)
- 多科室、多医院支持
- 预约取消和改期费用管理
- 短信/邮件通知功能
- 预约排队系统
- 医生评价和反馈系统
- 预约数据分析报表
- 第三方支付集成

## 4. Non-Functional Requirements

### 4.1 Performance
- 页面加载时间不超过3秒
- 预约操作响应时间不超过2秒
- 支持并发用户数100+

### 4.2 Security
- 预约数据加密存储
- 患者隐私信息保护
- 防止恶意预约行为

### 4.3 Scalability
- 支持医生和患者数量增长
- 可扩展的排班管理功能
- 支持多医院/科室扩展

### 4.4 Reliability
- 预约数据99.9%可用性
- 预约失败率低于1%
- 系统故障恢复时间小于30分钟

## 5. Technical Requirements

### 5.1 与现有问诊功能的区别和联系

#### 业务区别
- **在线问诊**: 实时在线咨询，异步问答模式
- **预约挂号**: 线下门诊预约，时间安排模式

#### 技术联系
- **共享数据模型**: 复用Doctor、Patient基础模型
- **统一认证**: 使用相同的登录认证机制
- **集成导航**: 在现有导航菜单中添加预约入口
- **状态管理**: 扩展Pinia store管理预约状态

### 5.2 数据模型设计

#### 扩展现有模型
```typescript
// 在现有Doctor模型基础上扩展
interface Doctor {
  // 现有字段...
  schedules?: Schedule[]; // 排班信息
  appointmentSettings?: {
    maxAppointmentsPerDay: number;
    appointmentDuration: number; // 分钟
  };
}

// 在现有Patient模型基础上扩展
interface Patient {
  // 现有字段...
  appointments?: Appointment[]; // 预约记录
}
```

#### 新增数据接口
```typescript
// 排班模型
interface Schedule {
  id: string;
  doctorId: string;
  date: string; // YYYY-MM-DD
  timeSlots: TimeSlot[];
  isAvailable: boolean;
}

interface TimeSlot {
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  isBooked: boolean;
}

// 预约模型
interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  scheduleId: string;
  appointmentTime: string; // ISO 8601
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  symptoms: string;        // 症状描述
  notes?: string;         // 医生备注
  createdAt: string;
  updatedAt: string;
}
```

### 5.3 API设计

#### 预约相关API
```typescript
// 获取医生排班
GET /api/doctors/:doctorId/schedules?date=2024-01-01

// 创建预约
POST /api/appointments
{
  patientId: string;
  doctorId: string;
  scheduleId: string;
  appointmentTime: string;
  symptoms: string;
}

// 获取患者预约
GET /api/patients/:patientId/appointments

// 获取医生预约
GET /api/doctors/:doctorId/appointments?status=pending

// 更新预约状态
PATCH /api/appointments/:appointmentId/status
{
  status: 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
}

// 冲突检测API
POST /api/appointments/conflict-check
{
  doctorId: string;
  appointmentTime: string;
  duration: number;
}
```

### 5.4 前端组件设计

#### 患者端组件结构
```
components/
├── Appointment/
│   ├── DoctorSchedule.vue      # 医生排班显示
│   ├── TimeSlotPicker.vue      # 时间选择器
│   ├── AppointmentForm.vue      # 预约表单
│   ├── AppointmentList.vue      # 预约列表
│   └── AppointmentDetail.vue    # 预约详情
└── Schedule/
    ├── ScheduleCalendar.vue     # 排班日历
    └── ScheduleManager.vue      # 排班管理
```

#### 医生端组件结构
```
components/
├── Doctor/
│   ├── AppointmentDashboard.vue # 预约看板
│   ├── AppointmentQueue.vue     # 预约队列
│   ├── ScheduleEditor.vue       # 排班编辑器
│   └── AppointmentDetail.vue    # 预约详情
└── Shared/
    ├── StatusBadge.vue          # 状态标签
    └── TimeDisplay.vue          # 时间显示
```

### 5.5 状态流转设计

#### 预约状态机
```
待确认 (pending) 
    ↓ (医生确认)
已确认 (confirmed)
    ↓ (就诊完成)
已完成 (completed)
    ↓ (患者取消)
已取消 (cancelled)

约束规则:
- 只有患者可以取消"待确认"和"已确认"的预约
- 只有医生可以确认/拒绝"待确认"的预约
- 只有医生可以标记"已确认"的预约为"已完成"
- 系统自动将过期的预约标记为"已取消"
```

### 5.6 架构影响
- **状态管理**: 扩展Pinia store管理预约相关状态
- **路由配置**: 新增预约相关路由页面
- **数据存储**: 新增appointments.json和schedules.json数据文件
- **组件复用**: 复用现有的认证、导航、布局组件

## 6. Success Criteria

### 定量指标
- 预约成功率 > 95%
- 患者满意度评分 > 4.5/5
- 医生使用率 > 80%
- 预约冲突率 < 1%

### 定性指标
- 患者反馈预约流程简单易用
- 医生认为排班管理功能实用
- 系统运行稳定，无明显bug

## 7. Task Breakdown

### 7.1 任务状态管理

| 任务ID | 任务名称 | 状态 | 优先级 | 预估工时 | 负责人 |
|--------|----------|------|--------|----------|--------|
| TASK-001 | 设计预约数据模型 | TODO | High | 2小时 | AI模型 |
| TASK-002 | 实现医生排班管理界面 | TODO | High | 3小时 | AI模型 |
| TASK-003 | 实现患者预约界面 | TODO | High | 3小时 | AI模型 |
| TASK-004 | 开发预约冲突检测逻辑 | TODO | High | 2小时 | AI模型 |
| TASK-005 | 实现预约记录管理功能 | TODO | Medium | 2小时 | AI模型 |
| TASK-006 | 集成预约功能到主应用 | TODO | Medium | 2小时 | AI模型 |
| TASK-007 | 实现预约统计功能 | TODO | Medium | 2小时 | AI模型 |
| TASK-008 | 测试和优化预约功能 | TODO | High | 1小时 | AI模型 |

### 7.2 任务详细说明

#### TASK-001：设计预约数据模型
**目标**: 创建预约相关的数据模型和接口
**验收标准**:
- 定义Appointment、Schedule数据接口
- 扩展Doctor和Patient模型
- 创建数据存储和访问方法
- 确保数据模型与现有系统兼容

#### TASK-002：实现医生排班管理界面
**目标**: 开发医生排班设置和管理功能
**验收标准**:
- 医生可以设置每周工作排班
- 支持排班时间段的增删改查
- 提供排班冲突检测提示
- 界面美观易用，符合设计规范

#### TASK-003：实现患者预约界面
**目标**: 开发患者预约功能界面
**验收标准**:
- 患者可以查看医生排班信息
- 支持按日期、科室筛选医生
- 提供预约时间选择功能
- 显示预约确认信息

#### TASK-004：开发预约冲突检测逻辑
**目标**: 实现预约冲突检测和防止重复预约
**验收标准**:
- 检测患者同一时间段的重复预约
- 检测医生时间段的冲突预约
- 提供友好的冲突提示信息
- 确保检测逻辑准确可靠

#### TASK-005：实现预约记录管理功能
**目标**: 开发预约记录查看和管理功能
**验收标准**:
- 患者可以查看自己的预约记录
- 医生可以查看和管理预约列表
- 支持预约状态的更新和筛选
- 提供预约详情查看功能

#### TASK-006：集成预约功能到主应用
**目标**: 将预约功能集成到现有医疗问诊平台
**验收标准**:
- 在导航菜单添加预约入口
- 确保各页面路由正常
- 保持整体设计风格一致
- 功能集成后不影响现有系统

#### TASK-007：实现预约统计功能
**目标**: 开发基本的预约数据统计
**验收标准**:
- 显示医生预约数量统计
- 提供预约时间分布分析
- 统计预约成功率等指标
- 数据展示清晰直观

#### TASK-008：测试和优化预约功能
**目标**: 对预约功能进行全面测试和优化
**验收标准**:
- 功能测试覆盖所有用户场景
- 性能测试确保响应时间达标
- 修复发现的bug和问题
- 优化用户体验和界面交互

### 7.3 依赖关系
- TASK-001 是其他任务的基础
- TASK-002 和 TASK-003 可以并行开发
- TASK-004 依赖 TASK-001 和基础数据模型
- TASK-006 需要在其他功能开发完成后进行

## 8. Implementation Notes

### 技术栈整合
- 使用现有的Vue 3 + TypeScript技术栈
- 集成Ant Design Vue组件库
- 遵循项目现有的代码规范和结构

### 数据模型扩展
- 在现有Doctor、Patient模型基础上扩展
- 新增预约相关数据接口
- 保持数据一致性

### 用户体验
- 保持与现有系统一致的设计风格
- 提供清晰的用户引导
- 支持移动端适配

## 9. Risks and Mitigations

### Risk 1：数据模型变更风险
- **描述**：预约功能需要扩展现有数据模型
- **影响**：Medium
- **缓解**：设计兼容性数据接口，确保现有功能不受影响

### Risk 2：排班冲突处理复杂度
- **描述**：预约冲突检测逻辑可能复杂
- **影响**：Medium
- **缓解**：采用简单有效的冲突检测算法，逐步优化

### Risk 3：用户接受度风险
- **描述**：用户可能不习惯在线预约
- **影响**：Low
- **缓解**：提供清晰的用户引导和操作说明

## 10. Appendix

### 10.1 References
- 项目上下文文档：`.asdm/contexts/`
- 现有数据模型：`src/data/`
- Vue 3官方文档

### 10.2 Glossary
- **排班**：医生的工作时间安排
- **预约**：患者预定的就诊时间
- **冲突检测**：检查预约时间是否重叠的机制

---

## 任务数量验证

本功能预计需要 **8个任务**，符合任务数量限制要求（≤10个任务），可以继续进行任务分解和执行。