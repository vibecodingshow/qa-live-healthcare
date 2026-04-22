# 预约挂号功能实现PRD

**Feature ID**: FEAT-001-appointment-booking  
**创建日期**: 2026-04-21  
**状态**: READY_FOR_IMPLEMENTATION  

## 1. 项目概述

### 1.1 功能目标
为医疗问诊平台添加完整的预约挂号功能，包括：
- 患者端：医生排班浏览、预约创建、预约管理
- 医生端：排班管理、预约查看、状态管理
- 系统端：冲突检测、数据统计

### 1.2 技术栈
- **前端框架**: Vue 3 + TypeScript
- **状态管理**: Pinia (基于现有store扩展)
- **UI组件**: Ant Design Vue
- **路由管理**: Vue Router
- **数据存储**: JSON文件 (与现有系统一致)

## 2. 数据模型设计

### 2.1 扩展现有模型

#### Doctor模型扩展
```typescript
// 在现有Doctor模型基础上扩展
interface Doctor {
  // 现有字段...
  id: string;
  username: string;
  name: string;
  department: string;
  // 新增预约相关字段
  appointmentSettings?: {
    maxAppointmentsPerDay: number;    // 每日最大预约数
    appointmentDuration: number;      // 每个预约时长（分钟）
    workingDays: string[];            // 工作日设置
    workingHours: {                   // 工作时间段
      start: string;                  // HH:mm
      end: string;                    // HH:mm
    };
  };
  schedules?: Schedule[];              // 排班信息
}
```

#### Patient模型扩展
```typescript
interface Patient {
  // 现有字段...
  id: string;
  name: string;
  phone: string;
  // 新增预约相关字段
  appointments?: Appointment[];        // 预约记录
}
```

### 2.2 新增数据接口

#### Schedule排班模型
```typescript
interface Schedule {
  id: string;
  doctorId: string;
  date: string;                        // YYYY-MM-DD
  timeSlots: TimeSlot[];               // 时间段列表
  isAvailable: boolean;                // 是否可预约
  createdAt: string;
  updatedAt: string;
}

interface TimeSlot {
  id: string;
  startTime: string;                   // HH:mm
  endTime: string;                     // HH:mm
  isBooked: boolean;                   // 是否已被预约
  appointmentId?: string;              // 关联的预约ID
}
```

#### Appointment预约模型
```typescript
interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  scheduleId: string;
  appointmentTime: string;             // ISO 8601格式
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  symptoms: string;                    // 症状描述
  notes?: string;                      // 医生备注
  cancelReason?: string;               // 取消原因
  createdAt: string;
  updatedAt: string;
}
```

## 3. 数据存储设计

### 3.1 新增数据文件

#### `src/data/appointments.json`
```json
[]
```

#### `src/data/schedules.json`
```json
[]
```

### 3.2 数据初始化
在应用启动时自动创建初始排班数据：
- 为每个活跃医生创建未来7天的排班
- 每个排日包含标准工作时间段

## 4. Store状态管理设计

### 4.1 扩展现有store

在 `src/store/index.ts` 中扩展预约相关功能：

```typescript
// 扩展State接口
interface State {
  // 现有状态...
  doctors: Doctor[];
  patients: Patient[];
  questions: Question[];
  currentDoctor: Doctor | null;
  currentPatient: Patient | null;
  
  // 新增预约相关状态
  appointments: Appointment[];
  schedules: Schedule[];
  currentAppointment: Appointment | null;
}

// 初始化状态
const state = reactive<State>({
  // 现有状态初始化...
  appointments: [],
  schedules: [],
  currentAppointment: null,
});
```

### 4.2 新增预约相关方法

```typescript
export const store = {
  // 现有方法...
  
  // === 排班管理方法 ===
  getDoctorSchedules(doctorId: string): Schedule[] {
    return state.schedules.filter(s => s.doctorId === doctorId);
  },
  
  createSchedule(schedule: Omit<Schedule, 'id' | 'createdAt' | 'updatedAt'>): Schedule {
    const newSchedule: Schedule = {
      ...schedule,
      id: `schedule_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    state.schedules.push(newSchedule);
    return newSchedule;
  },
  
  // === 预约管理方法 ===
  createAppointment(appointmentData: Omit<Appointment, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Appointment {
    const newAppointment: Appointment = {
      ...appointmentData,
      id: `appointment_${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    state.appointments.push(newAppointment);
    return newAppointment;
  },
  
  updateAppointmentStatus(appointmentId: string, status: Appointment['status'], notes?: string): boolean {
    const appointment = state.appointments.find(a => a.id === appointmentId);
    if (appointment) {
      appointment.status = status;
      appointment.notes = notes;
      appointment.updatedAt = new Date().toISOString();
      return true;
    }
    return false;
  },
  
  // === 冲突检测方法 ===
  checkAppointmentConflict(doctorId: string, appointmentTime: string): boolean {
    const targetTime = new Date(appointmentTime);
    const existingAppointments = state.appointments.filter(
      a => a.doctorId === doctorId && a.status !== 'cancelled'
    );
    
    return existingAppointments.some(appointment => {
      const existingTime = new Date(appointment.appointmentTime);
      return Math.abs(existingTime.getTime() - targetTime.getTime()) < 30 * 60 * 1000; // 30分钟冲突检测
    });
  }
};
```

## 5. 前端组件架构

### 5.1 患者端组件结构

```
src/components/Appointment/
├── DoctorSchedule.vue          # 医生排班显示组件
├── TimeSlotPicker.vue          # 时间选择器组件
├── AppointmentForm.vue          # 预约表单组件
├── AppointmentList.vue          # 预约列表组件
└── AppointmentDetail.vue        # 预约详情组件

src/views/
├── AppointmentBooking.vue       # 预约挂号主页面
└── MyAppointments.vue          # 我的预约页面
```

### 5.2 医生端组件结构

```
src/components/Doctor/
├── ScheduleEditor.vue           # 排班编辑器组件
├── AppointmentDashboard.vue     # 预约看板组件
├── AppointmentQueue.vue         # 预约队列组件
└── AppointmentDetailModal.vue   # 预约详情弹窗

src/views/
├── DoctorSchedule.vue           # 医生排班管理页面
└── DoctorAppointments.vue       # 医生预约管理页面
```

### 5.3 共享组件

```
src/components/Shared/
├── StatusBadge.vue              # 状态标签组件
├── TimeDisplay.vue              # 时间显示组件
├── DoctorCard.vue               # 医生卡片组件
└── ScheduleCalendar.vue         # 排班日历组件
```

## 6. 路由配置扩展

### 6.1 新增路由配置

在 `src/router/index.ts` 中添加：

```typescript
import AppointmentBooking from '../views/AppointmentBooking.vue';
import MyAppointments from '../views/MyAppointments.vue';
import DoctorSchedule from '../views/DoctorSchedule.vue';
import DoctorAppointments from '../views/DoctorAppointments.vue';

const routes: RouteRecordRaw[] = [
  // 现有路由...
  
  // 新增预约相关路由
  {
    path: '/appointments',
    name: 'AppointmentBooking',
    component: AppointmentBooking,
    meta: { title: '预约挂号' }
  },
  {
    path: '/my-appointments',
    name: 'MyAppointments',
    component: MyAppointments,
    meta: { title: '我的预约' }
  },
  {
    path: '/doctor/schedule',
    name: 'DoctorSchedule',
    component: DoctorSchedule,
    meta: { title: '排班管理', requiresDoctor: true }
  },
  {
    path: '/doctor/appointments',
    name: 'DoctorAppointments',
    component: DoctorAppointments,
    meta: { title: '预约管理', requiresDoctor: true }
  }
];
```

## 7. 任务分解实施计划

### TASK-001: 设计预约数据模型 (2小时)

**目标**: 创建预约相关的数据模型和接口

**具体实施步骤**:
1. 扩展Doctor和Patient接口定义
2. 创建Appointment和Schedule数据接口
3. 创建数据存储文件结构
4. 实现数据初始化逻辑

**验收标准**:
- [ ] Doctor接口扩展了appointmentSettings和schedules字段
- [ ] Patient接口扩展了appointments字段
- [ ] 定义了完整的Appointment和Schedule接口
- [ ] 创建了appointments.json和schedules.json数据文件

### TASK-002: 扩展Store状态管理 (2小时)

**目标**: 在现有store基础上扩展预约相关状态管理

**具体实施步骤**:
1. 扩展State接口添加预约相关状态
2. 实现预约CRUD操作方法
3. 实现冲突检测逻辑
4. 集成到现有store中

**验收标准**:
- [ ] State接口包含appointments和schedules状态
- [ ] 实现了完整的预约管理方法
- [ ] 冲突检测逻辑准确可靠
- [ ] 与现有store方法兼容

### TASK-003: 实现医生排班管理界面 (3小时)

**目标**: 开发医生排班设置和管理功能

**具体实施步骤**:
1. 创建ScheduleEditor组件
2. 创建DoctorSchedule页面
3. 实现排班日历和时段管理
4. 集成冲突检测提示

**验收标准**:
- [ ] 医生可以设置每周工作排班
- [ ] 支持排班时间段的增删改查
- [ ] 提供排班冲突检测提示
- [ ] 界面美观易用，符合设计规范

### TASK-004: 实现患者预约界面 (3小时)

**目标**: 开发患者预约功能界面

**具体实施步骤**:
1. 创建DoctorSchedule组件（医生列表和排班显示）
2. 创建TimeSlotPicker组件（时间选择器）
3. 创建AppointmentForm组件（预约表单）
4. 创建AppointmentBooking页面

**验收标准**:
- [ ] 患者可以查看医生排班信息
- [ ] 支持按日期、科室筛选医生
- [ ] 提供预约时间选择功能
- [ ] 显示预约确认信息

### TASK-005: 实现预约记录管理功能 (2小时)

**目标**: 开发预约记录查看和管理功能

**具体实施步骤**:
1. 创建AppointmentList组件（预约列表）
2. 创建AppointmentDetail组件（预约详情）
3. 创建MyAppointments页面（患者端）
4. 创建DoctorAppointments页面（医生端）

**验收标准**:
- [ ] 患者可以查看自己的预约记录
- [ ] 医生可以查看和管理预约列表
- [ ] 支持预约状态的更新和筛选
- [ ] 提供预约详情查看功能

### TASK-006: 集成预约功能到主应用 (2小时)

**目标**: 将预约功能集成到现有医疗问诊平台

**具体实施步骤**:
1. 更新主导航菜单添加预约入口
2. 配置路由守卫和权限控制
3. 集成用户认证和状态管理
4. 确保整体设计风格一致

**验收标准**:
- [ ] 在导航菜单添加预约入口
- [ ] 确保各页面路由正常
- [ ] 保持整体设计风格一致
- [ ] 功能集成后不影响现有系统

### TASK-007: 实现预约统计功能 (2小时)

**目标**: 开发基本的预约数据统计

**具体实施步骤**:
1. 扩展store统计方法
2. 创建预约统计组件
3. 集成到医生管理页面
4. 实现数据可视化展示

**验收标准**:
- [ ] 显示医生预约数量统计
- [ ] 提供预约时间分布分析
- [ ] 统计预约成功率等指标
- [ ] 数据展示清晰直观

### TASK-008: 测试和优化预约功能 (1小时)

**目标**: 对预约功能进行全面测试和优化

**具体实施步骤**:
1. 功能测试覆盖所有用户场景
2. 性能测试确保响应时间达标
3. 修复发现的bug和问题
4. 优化用户体验和界面交互

**验收标准**:
- [ ] 功能测试覆盖所有用户场景
- [ ] 性能测试确保响应时间达标
- [ ] 修复发现的bug和问题
- [ ] 优化用户体验和界面交互

## 8. 实施优先级和依赖关系

### 实施顺序
1. **第一阶段**: TASK-001 → TASK-002 (数据层基础)
2. **第二阶段**: TASK-003 → TASK-004 (核心功能开发)
3. **第三阶段**: TASK-005 → TASK-006 (功能集成)
4. **第四阶段**: TASK-007 → TASK-008 (完善优化)

### 依赖关系
- TASK-001是其他所有任务的基础
- TASK-002依赖TASK-001完成的数据模型
- TASK-003和TASK-004可以并行开发
- TASK-005依赖TASK-003和TASK-004的完成
- TASK-006需要在其他功能开发完成后进行

## 9. 风险控制和缓解措施

### 技术风险
- **数据模型变更影响现有功能**: 通过兼容性设计和渐进式扩展缓解
- **冲突检测逻辑复杂度**: 采用简单有效的算法，逐步优化

### 用户接受度风险
- **用户不熟悉在线预约流程**: 提供清晰的操作引导和说明
- **医生使用意愿低**: 设计简洁易用的管理界面

## 10. 成功指标

### 定量指标
- 预约成功率 > 95%
- 页面加载时间 < 3秒
- 预约操作响应时间 < 2秒
- 用户满意度评分 > 4.5/5

### 定性指标
- 患者反馈预约流程简单易用
- 医生认为排班管理功能实用
- 系统运行稳定，无明显bug

---

## 下一步行动

现在可以开始按照任务分解计划逐步实施预约挂号功能。建议按照以下顺序执行：

1. **立即开始**: TASK-001 (数据模型设计)
2. **并行开发**: TASK-002和TASK-003 (状态管理和排班界面)
3. **集成测试**: 每完成一个阶段进行集成测试
4. **用户验收**: 功能完成后进行用户验收测试

所有任务预计总工时: 16小时，可以在2-3个工作日内完成。