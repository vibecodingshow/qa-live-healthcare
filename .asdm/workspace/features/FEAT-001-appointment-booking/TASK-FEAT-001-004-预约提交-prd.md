# Task PRD: 预约提交

**Feature ID**: FEAT-001
**Feature Name**: 预约挂号功能
**Task ID**: TASK-FEAT-001-004
**Created Date**: 2026-04-21
**Status**: TODO
**Language**: zh

---

## 1. 任务概述

### 1.1 任务摘要

实现预约提交功能，患者确认预约信息后完成预约提交，系统创建预约记录并返回预约成功结果。

### 1.2 任务目标

- 预约信息确认页展示完整预约详情
- 提交前再次验证时段可用性（防冲突）
- 创建预约记录
- 更新号源剩余数量
- 显示预约成功结果和取号码

### 1.3 关联需求

- **Feature 需求**: REQ-001, REQ-004
- **用户故事**: 故事 1
- **关联页面**: AppointmentBook.vue 确认提交

---

## 2. 前置依赖

| 依赖项 | 类型 | 说明 |
|--------|------|------|
| TASK-FEAT-001-002 | 前置 | 已选择号源 |
| TASK-FEAT-001-003 | 前置 | 已填写患者信息 |
| 预约 Store API | 前置 | addAppointment() 方法需存在 |
| 预约数据持久化 | 前置 | localStorage 操作逻辑 |

**依赖任务**: 
- TASK-FEAT-001-002 (号源选择)
- TASK-FEAT-001-003 (患者信息填写)

---

## 3. 验收标准

### 3.1 功能验收

| # | 验收条件 | 验证方法 |
|---|----------|----------|
| 1 | 确认页展示完整预约信息 | 医生、日期、时段、患者信息 |
| 2 | 提交前再次检查时段可用 | 时段已满时提示"该时段已约满，请重新选择" |
| 3 | 预约成功后生成唯一预约号 | 显示预约号如"AP202604210001" |
| 4 | 预约成功后更新号源数量 | 同时段剩余号源 -1 |
| 5 | 预约成功后跳转结果页 | 显示预约成功信息 |
| 6 | 预约记录保存到 localStorage | 刷新后可查询到预约记录 |

### 3.2 技术验收

| 验收条件 | 验证命令 |
|----------|----------|
| TypeScript 编译通过 | `npm run build` 无错误 |
| 预约号唯一性 | 多次预约检查预约号不重复 |
| 并发冲突检测 | 模拟同时预约同一时段 |

### 3.3 边界条件

- 提交过程中时段被抢完 → 提示并返回选择
- localStorage 写入失败 → 提示错误并保留表单数据
- 重复提交 → 防抖处理，按钮 loading 状态
- 预约号格式: AP + 日期(8位) + 序号(4位)

---

## 4. 技术方案

### 4.1 预约数据结构

```typescript
interface Appointment {
  id: string;              // 预约号
  patientId: string;        // 患者ID
  patientName: string;      // 患者姓名
  patientPhone: string;     // 患者手机号
  doctorId: string;         // 医生ID
  doctorName: string;       // 医生姓名
  department: string;       // 科室
  slotId: string;           // 时段ID
  appointmentDate: string;  // 预约日期
  appointmentTime: string;  // 预约时段
  status: 'pending';        // 状态
  createdAt: string;        // 创建时间
}
```

### 4.2 冲突检测逻辑

```typescript
async function submitAppointment(slotId: string): Promise<Appointment> {
  // 1. 再次获取时段信息
  const slot = getSlotById(slotId);
  
  // 2. 检查是否还有剩余号源
  if (slot.currentCount >= slot.maxPatients) {
    throw new Error('该时段已约满，请重新选择');
  }
  
  // 3. 检查患者是否已有该时段预约
  const existing = getAppointmentsByPatientAndSlot(patientId, slotId);
  if (existing) {
    throw new Error('您已预约该时段');
  }
  
  // 4. 创建预约
  const appointment = createAppointment(slotId, patientInfo);
  
  // 5. 更新号源数量
  updateSlotCount(slotId, slot.currentCount + 1);
  
  return appointment;
}
```

### 4.3 Store API

```typescript
// 新增方法
addAppointment(
  slotId: string, 
  patientInfo: { name: string; phone: string }
): Appointment

// 需修改方法
getAvailableSlots(doctorId: string, date: string): AppointmentSlot[]
```

---

## 5. 预估工时

| 项目 | 预估 |
|------|------|
| **人天** | 1 人天 (8 小时) |
| 复杂度 | High |
| 风险 | High (并发冲突) |

**工时分解**:
- 预约确认页设计: 1 小时
- 冲突检测逻辑: 2 小时
- 预约创建与存储: 2 小时
- 号源更新逻辑: 1.5 小时
- 测试与修复: 1.5 小时

---

## 6. 交付物

- [ ] 预约确认页组件
- [ ] addAppointment() Store 方法
- [ ] 冲突检测逻辑
- [ ] 预约成功结果页
- [ ] `npm run build` 编译通过
- [ ] 预约提交功能验证

---

*Task ID: TASK-FEAT-001-004*
