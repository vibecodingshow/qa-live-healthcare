# Feature PRD: 预约挂号功能

**Feature ID**: FEAT-001  
**Created Date**: 2026-04-21  
**Status**: PLANNED  
**Language**: zh

---

## 1. 概述

### 1.1 功能摘要

预约挂号功能允许患者在线预约医生的线下门诊时段，患者可以选择医生、日期和时间段，完成挂号预约，并查看预约记录。

### 1.2 功能目标

- **扩展服务范围**: 从单一的在线问诊功能，扩展到线下门诊预约，实现线上线下一体化服务
- **提升用户体验**: 减少患者现场排队等候时间，提供便捷的预约渠道
- **优化资源调配**: 医生可管理自己的门诊排班，合理安排接诊时间
- **满足业务需求**: 支持患者预约医生的线下门诊服务

### 1.3 受益用户

| 用户角色 | 受益说明 |
|---------|---------|
| 患者 | 可随时随地预约医生门诊，无需现场排队 |
| 医生 | 可管理个人排班，查看预约患者列表 |

---

## 2. 用户故事

### 故事 1: 患者预约门诊

**As a** 患者  
**I want to** 选择医生和预约时间进行门诊挂号  
**So that** 我可以提前安排就医计划，避免现场排队等候

**验收标准**:
- [ ] 患者可查看医生的可预约日期
- [ ] 患者可选择具体的时间段进行预约
- [ ] 患者需完成身份验证（姓名+手机号）才能预约
- [ ] 预约成功后显示预约详情（医生、时间、地点等）
- [ ] 同一时间段同一医生只能被预约一次

### 故事 2: 患者查看预约记录

**As a** 患者  
**I want to** 查看我的预约记录  
**So that** 我可以了解自己的预约情况，准时就医

**验收标准**:
- [ ] 患者可查看所有预约记录（待就诊、已取消、已完成）
- [ ] 预约详情显示医生姓名、科室、预约时间、地点
- [ ] 患者可取消尚未就诊的预约

### 故事 3: 医生管理门诊排班

**As a** 医生  
**I want to** 设置我的门诊可预约时段  
**So that** 患者可以根据我的排班进行预约

**验收标准**:
- [ ] 医生可设置每周的出诊日期
- [ ] 医生可设置每日可预约的时段（上午/下午）
- [ ] 医生可设置每个时段的接诊人数上限
- [ ] 医生可临时关闭/开启预约功能

### 故事 4: 医生查看预约患者

**As a** 医生  
**I want to** 查看预约了我门诊的患者列表  
**So that** 我可以了解就诊患者情况，做好接诊准备

**验收标准**:
- [ ] 医生可查看当日预约患者列表
- [ ] 医生可查看预约患者的基本信息
- [ ] 医生可标记患者已到诊

---

## 3. 功能需求

### 需求 1: 预约数据模型

- **ID**: REQ-001
- **描述**: 定义预约（Appointment）数据结构，包含预约ID、患者信息、医生信息、预约时间、状态等字段
- **优先级**: High
- **关联故事**: 故事 1, 故事 2, 故事 3, 故事 4

### 需求 2: 医生排班管理

- **ID**: REQ-002
- **描述**: 扩展医生（Doctor）数据模型，增加门诊排班相关字段（schedule、maxPatientsPerSlot等）
- **优先级**: High
- **关联故事**: 故事 3

### 需求 3: 预约时间选择组件

- **ID**: REQ-003
- **描述**: 提供可视化的日历和时间段选择组件，支持查看医生的可预约日期和时段
- **优先级**: High
- **关联故事**: 故事 1

### 需求 4: 预约流程实现

- **ID**: REQ-004
- **描述**: 实现完整的预约流程：选择医生 → 选择日期 → 选择时段 → 身份验证 → 确认预约
- **优先级**: High
- **关联故事**: 故事 1

### 需求 5: 预约记录管理

- **ID**: REQ-005
- **描述**: 提供预约记录的查看、筛选、取消功能
- **优先级**: Medium
- **关联故事**: 故事 2

### 需求 6: 医生端预约管理

- **ID**: REQ-006
- **描述**: 提供医生端的排班设置和预约患者查看功能
- **优先级**: Medium
- **关联故事**: 故事 3, 故事 4

---

## 4. 非功能需求

### 4.1 性能

- 预约查询响应时间 < 500ms
- 预约提交成功率 > 99.9%
- 支持至少 100 个并发预约请求

### 4.2 安全性

- 预约需进行患者身份验证
- 防止重复预约（同一患者同一时段只能有一个有效预约）
- 防止恶意刷预约（限制单用户预约频率）

### 4.3 可用性

- 预约流程简洁，步骤不超过 5 步
- 异常情况有友好的错误提示
- 支持移动端和桌面端访问

### 4.4 可扩展性

- 数据模型设计支持未来扩展（如：线上支付、预约提醒等）
- 代码模块化，便于后续功能扩展

---

## 5. 技术需求

### 5.1 数据模型扩展

需要新增以下数据模型：

```typescript
// 预约时段
interface AppointmentSlot {
  id: string;
  doctorId: string;
  date: string;           // 日期 YYYY-MM-DD
  timeSlot: 'morning' | 'afternoon';
  startTime: string;       // 开始时间 HH:mm
  endTime: string;         // 结束时间 HH:mm
  maxPatients: number;      // 最大预约人数
  currentCount: number;    // 当前预约人数
  isAvailable: boolean;    // 是否开放预约
}

// 预约记录
interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  department: string;
  slotId: string;
  appointmentDate: string;
  appointmentTime: string;
  status: 'pending' | 'completed' | 'cancelled' | 'no-show';
  createdAt: string;
  cancelledAt?: string;
  completedAt?: string;
  remarks?: string;
}
```

需要扩展的现有数据模型：

```typescript
// 医生 - 扩展字段
interface Doctor {
  // ... 现有字段 ...
  schedule: {
    morningStart: string;  // 上午开始时间
    morningEnd: string;    // 上午结束时间
    afternoonStart: string;
    afternoonEnd: string;
    availableDays: number[];  // 0-6, 周日到周六
  };
  maxPatientsPerSlot: number; // 每时段最大接诊人数
  appointmentEnabled: boolean; // 是否开启预约功能
}
```

### 5.2 页面路由

| 路径 | 页面 | 说明 |
|------|------|------|
| `/appointment` | Appointment.vue | 预约首页/搜索医生 |
| `/appointment/book/:doctorId` | AppointmentBook.vue | 预约医生 |
| `/appointment/my` | MyAppointments.vue | 我的预约记录 |
| `/doctor/schedule` | DoctorSchedule.vue | 医生排班设置 |
| `/doctor/appointments` | DoctorAppointments.vue | 医生预约管理 |

### 5.3 目录结构

```
src/
├── views/
│   ├── appointment/           # 新增预约模块
│   │   ├── Appointment.vue    # 预约首页
│   │   ├── AppointmentBook.vue # 预约页面
│   │   └── MyAppointments.vue # 我的预约
│   └── doctor/
│       ├── DoctorSchedule.vue   # 排班设置
│       └── DoctorAppointments.vue # 预约患者管理
├── components/
│   └── appointment/           # 预约相关组件
│       ├── DoctorSlotPicker.vue  # 时间段选择器
│       ├── AppointmentCard.vue   # 预约卡片
│       └── AppointmentList.vue   # 预约列表
├── store/
│   └── index.ts              # 扩展Store
└── data/
    ├── appointment-list.json  # 预约记录数据
    └── doctor-schedule.json  # 医生排班数据
```

### 5.4 Store API 扩展

```typescript
// 预约相关
addAppointment(slotId: string, patientInfo: PatientInfo): Appointment
cancelAppointment(appointmentId: string): void
getAppointmentById(id: string): Appointment | undefined
getAppointmentsByPatient(patientId: string): Appointment[]
getAppointmentsByDoctor(doctorId: string): Appointment[]
markAppointmentCompleted(appointmentId: string): void

// 排班相关
getDoctorSchedule(doctorId: string): AppointmentSlot[]
getAvailableSlots(doctorId: string, date: string): AppointmentSlot[]
updateDoctorSchedule(doctorId: string, schedule: Schedule): void
setAppointmentEnabled(doctorId: string, enabled: boolean): void
```

### 5.5 依赖项

- 内部依赖：现有的 Doctor、Patient 数据模型
- 外部依赖：Ant Design Vue DatePicker 组件（已使用）

### 5.6 约束

- 使用现有 Vue 3 + TypeScript 技术栈
- 复用现有的 Patient 身份验证流程
- 预约数据暂时使用 localStorage 持久化

---

## 6. 成功标准

| 成功标准 | 衡量指标 |
|---------|---------|
| 预约流程完整 | 用户可在 5 步内完成预约 |
| 功能可用性 | 所有验收标准通过测试 |
| 预约防冲突 | 同时段同医生不可重复预约 |
| 页面适配 | 移动端和桌面端均可正常使用 |
| 代码规范 | 符合项目编码规范 |

---

## 7. 任务拆分原则

### 7.1 粒度

- 每个任务控制在 1-2 小时工作量
- 任务之间保持独立，可并行开发

### 7.2 独立性

- 最小化任务间依赖
- 支持并行执行

### 7.3 可测试性

- 每个任务有明确的验收标准
- 可独立验证

### 7.4 任务分类

- 数据模型设计与定义
- Store API 扩展
- 页面组件开发
- 组件测试

### 7.5 任务数量

预计拆分 **8 个任务**：

1. 数据模型设计与定义
2. 预约数据 Store API 实现
3. 排班数据 Store API 实现
4. 预约首页（搜索医生）
5. 预约页面（时段选择 + 预约流程）
6. 我的预约页面
7. 医生排班设置页面
8. 医生预约管理页面

---

## 8. 实施注意事项

- 复用现有的 Patient 验证逻辑（verifyPatient）
- 复用现有的 Doctor 数据结构和组件
- 使用 Ant Design Vue 的 DatePicker 组件
- 预约冲突检测在提交前进行
- 使用 dayjs 处理日期时间

---

## 9. 风险与缓解

### 风险 1: 并发预约冲突

- **描述**: 多个用户同时预约同一时段，导致超卖
- **影响**: High
- **缓解措施**: 提交前再次验证时段可用性；使用乐观锁机制

### 风险 2: 数据持久化

- **描述**: 当前使用 localStorage，数据量增大会影响性能
- **影响**: Medium
- **缓解措施**: 当前版本使用 localStorage，后期迁移到后端 API

### 风险 3: 与现有问诊功能的数据隔离

- **描述**: 预约功能与问诊功能使用独立的患者身份验证
- **影响**: Low
- **缓解措施**: 统一患者身份验证流程，共用 Patient 数据模型

---

## 10. 附录

### 10.1 参考资料

- 项目上下文: `.asdm/contexts/`
- 数据模型: `.asdm/contexts/data-models.md`
- 项目结构规范: `.asdm/contexts/standard-project-structure.md`
- 编码规范: `.asdm/contexts/standard-coding-style.md`

### 10.2 术语表

| 术语 | 定义 |
|------|------|
| 预约挂号 | 患者在线预约医生的线下门诊时段 |
| 时段 | 上午/下午的固定时间段 |
| 排班 | 医生设置的可预约日期和时间 |
| 诊室 | 医生出诊的地点（可扩展字段） |

---

*最后更新: 2026-04-21*
