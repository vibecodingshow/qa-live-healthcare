# 代码规范与风格指南

## 概述
本文档定义了 QA Live Healthcare 项目的代码规范和风格指南，确保代码质量和团队协作的一致性。

## 语言和编码标准

### 主要开发语言
- **TypeScript**: 主开发语言，提供类型安全
- **Vue Template**: 模板语法，遵循 Vue 3 规范
- **CSS**: 样式编写，支持现代 CSS 特性

### 文件编码
- 所有文件使用 **UTF-8** 编码
- 使用 **LF** 换行符（Unix 风格）

## TypeScript 编码规范

### 类型定义
```typescript
// 接口定义 - 使用 PascalCase
interface UserInfo {
  id: number;
  name: string;
  avatar?: string;
}

// 类型别名 - 使用 PascalCase
type DoctorStatus = 'online' | 'offline' | 'busy';

// 枚举 - 使用 PascalCase（值使用大写下划线）
enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SCHEDULED = 'SCHEDULED',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED'
}
```

### 变量和函数命名
```typescript
// 变量 - 使用 camelCase
const userName = '张三';
const isActive = true;

// 函数 - 使用 camelCase
function getUserInfo(id: number): UserInfo {
  // 函数实现
}

// 异步函数 - 使用 async/await
async function fetchDoctorList(): Promise<Doctor[]> {
  const response = await api.get('/doctors');
  return response.data;
}

// API 函数命名规范
async function createAppointment(data: AppointmentCreateRequest): Promise<Appointment>
async function cancelAppointment(id: string, reason: AppointmentCancelRequest): Promise<Appointment>
async function confirmAppointment(id: string, note?: string): Promise<Appointment>
```

### 组件 Props 定义
```typescript
// 组件 Props 接口
interface AppointmentItemProps {
  appointment: Appointment;
  showActions?: boolean;
  onCancel?: (id: string) => Promise<void>;
}

// 在组件中使用
defineProps<AppointmentItemProps>();
```

### API 相关类型
```typescript
// API 请求类型
interface AppointmentCreateRequest {
  doctorId: string;
  patientId: string;
  appointmentDate: string;
  timeSlotId: string;
  reason: string;
}

// API 响应类型
interface AppointmentListResponse {
  appointments: Appointment[];
  total: number;
  currentPage: number;
  pageSize: number;
}
```

## Vue 组件规范

### 组件结构
```vue
<template>
  <!-- 模板部分 -->
  <div class="component-name">
    <!-- 组件内容 -->
  </div>
</template>

<script setup lang="ts">
// 脚本部分 - 使用 Composition API
import { ref, computed, onMounted } from 'vue';

// 组件逻辑
</script>

<style scoped>
/* 组件样式 - 使用 scoped */
.component-name {
  /* 样式规则 */
}
</style>
```

### 组件命名规范
- Vue 组件文件：**PascalCase** (如 `AppointmentItem.vue`)
- 组件名称：**PascalCase** (如 `AppointmentItem`)
- 事件命名：**kebab-case** (如 `@cancel-appointment`)

### 预约相关组件事件
```typescript
// emit 定义
const emit = defineEmits<{
  (e: 'cancel', appointment: Appointment, reason: CancelReason, callback: (error?: any) => void): void;
  (e: 'confirm', id: string): void;
  (e: 'view', id: string): void;
}>();

// 调用方式
emit('cancel', props.appointment, reason, (error) => {
  if (error) {
    message.error('取消失败');
  } else {
    message.success('取消成功');
  }
});
```

### 模板语法规范
```vue
<!-- 使用 kebab-case 属性名 -->
<appointment-item
  :appointment="appointment"
  :show-actions="true"
  @cancel="handleCancel"
  @view="handleView"
/>

<!-- 条件渲染 -->
<div v-if="isLoading">加载中...</div>
<div v-else-if="hasError">错误信息</div>
<div v-else>正常内容</div>

<!-- 列表渲染 -->
<div
  v-for="apt in appointments"
  :key="apt.id"
  class="appointment-item"
>
  {{ apt.appointmentNo }}
</div>
```

## CSS 样式规范

### 命名约定
- 类名：**kebab-case** (如 `.appointment-item`)
- ID：**kebab-case** (如 `#appointment-detail`)
- 组件样式：**kebab-case** (如 `.schedule-card`)

### 样式组织
```css
/* 组件样式 */
.appointment-item {
  /* 布局属性 */
  display: flex;
  flex-direction: column;
  
  /* 盒模型属性 */
  padding: 16px;
  margin: 8px 0;
  
  /* 视觉属性 */
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  /* 文字属性 */
  font-size: 14px;
  line-height: 1.5;
}

/* 状态样式 */
.appointment-item--pending {
  border-left: 4px solid orange;
}

.appointment-item--confirmed {
  border-left: 4px solid blue;
}

.appointment-item--completed {
  border-left: 4px solid green;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .appointment-item {
    padding: 12px;
    font-size: 12px;
  }
}
```

### 预约状态颜色
```css
/* 预约状态颜色映射 */
.status-pending {
  color: orange;
  background-color: #fff7e6;
}

.status-confirmed {
  color: blue;
  background-color: #e6f7ff;
}

.status-scheduled {
  color: cyan;
  background-color: #e6fffa;
}

.status-completed {
  color: green;
  background-color: #f6ffed;
}

.status-rejected {
  color: red;
  background-color: #fff1f0;
}

.status-cancelled {
  color: gray;
  background-color: #f5f5f5;
}
```

## API 服务规范

### API 函数结构
```typescript
/**
 * 创建预约
 *
 * @param data - 预约创建请求数据
 * @returns 创建的预约记录
 * @throws {ApiError} 当参数校验失败时抛出错误
 *
 * @example
 * ```typescript
 * const appointment = await createAppointment({
 *   doctorId: 'doc001',
 *   patientId: 'patient001',
 *   appointmentDate: '2026-04-22',
 *   timeSlotId: 'slot001',
 *   reason: '头疼'
 * });
 * ```
 */
export async function createAppointment(
  data: AppointmentCreateRequest
): Promise<Appointment> {
  // 参数校验
  if (!data.doctorId || !data.doctorId.trim()) {
    throw new ApiError('医生 ID 不能为空', 'INVALID_PARAMS', 400);
  }

  // 创建预约逻辑
  // ...

  return newAppointment;
}
```

### localStorage 数据同步
```typescript
/**
 * 更新 localStorage 中的预约数据
 *
 * @param appointmentId - 预约ID
 * @param updates - 要更新的字段
 */
export function updateLocalStorageAppointment(
  appointmentId: string,
  updates: Partial<Appointment>
): void {
  const storedAppointments = localStorage.getItem('appointments');
  if (storedAppointments) {
    const appointments = JSON.parse(storedAppointments);
    const index = appointments.findIndex((apt: any) => apt.id === appointmentId);
    if (index !== -1) {
      appointments[index] = {
        ...appointments[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem('appointments', JSON.stringify(appointments));
    }
  }
}
```

### 状态流转验证
```typescript
/**
 * 检查状态转换是否有效
 */
export function isValidStatusTransition(
  currentStatus: AppointmentStatus,
  targetStatus: AppointmentStatus,
  operator: 'patient' | 'doctor'
): boolean {
  const transitions: Record<AppointmentStatus, AppointmentStatus[]> = {
    PENDING: ['CONFIRMED', 'REJECTED'],
    CONFIRMED: ['SCHEDULED', 'CANCELLED'],
    SCHEDULED: ['COMPLETED', 'CANCELLED'],
    COMPLETED: [],
    REJECTED: [],
    CANCELLED: [],
  };

  return transitions[currentStatus]?.includes(targetStatus) || false;
}
```

## 代码质量要求

### 可读性
- 使用有意义的变量名和函数名
- 添加必要的注释说明复杂逻辑
- 保持代码简洁，避免过度嵌套
- 为 API 函数编写 JSDoc 注释

### 可维护性
- 遵循单一职责原则
- 组件功能明确，职责单一
- 避免过大的组件，适当拆分
- 类型定义集中管理（types/）

### 性能考虑
- 使用 `v-if` 和 `v-show` 适当
- 合理使用计算属性和监听器
- 避免不必要的重新渲染
- 预约列表使用虚拟滚动（数据量大时）

### 预约功能特殊要求
- 取消预约前验证时间限制（距离预约时间 >= 2小时）
- 使用回调机制处理异步操作结果
- 确保 localStorage 数据同步一致性
- 预约状态变更后及时更新 UI

## 开发工具配置

### ESLint 配置
项目使用 ESLint 进行代码质量检查，确保代码规范一致。

### Prettier 配置
使用 Prettier 进行代码格式化，保持代码风格统一。

### Git 提交规范
- 提交信息使用中文描述
- 遵循约定式提交格式
- 每次提交只包含一个完整的功能或修复

### 提交类型建议
- `feat: 添加预约统计功能`
- `fix: 修复预约取消回调问题`
- `refactor: 重构预约状态流转逻辑`
- `docs: 更新预约 API 文档`

## 最佳实践

### Vue 开发最佳实践
1. **使用 Composition API**：提高代码可复用性和组织性
2. **类型安全**：充分利用 TypeScript 的类型系统
3. **响应式数据**：合理使用 `ref` 和 `reactive`
4. **组件通信**：优先使用 props/emit，必要时使用 provide/inject 或回调

### 预约功能最佳实践
1. **数据一致性**：API 操作后立即同步 localStorage
2. **错误处理**：使用 try-catch 包装异步操作，提供用户友好的错误提示
3. **状态管理**：预约状态变更使用统一的状态流转函数
4. **用户体验**：长时间操作显示 loading 状态

### 性能优化
1. **组件懒加载**：使用 `defineAsyncComponent`
2. **代码分割**：合理使用路由懒加载
3. **图片优化**：使用合适的图片格式和尺寸
4. **缓存策略**：合理使用浏览器缓存

---

*此文件由 Context Builder 工具集生成，最后更新于 2026-04-23*
