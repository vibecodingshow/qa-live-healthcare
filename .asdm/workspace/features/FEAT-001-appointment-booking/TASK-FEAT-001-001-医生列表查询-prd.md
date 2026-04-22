# Task PRD: 医生列表查询

**Feature ID**: FEAT-001
**Feature Name**: 预约挂号功能
**Task ID**: TASK-FEAT-001-001
**Created Date**: 2026-04-21
**Status**: TODO
**Language**: zh

---

## 1. 任务概述

### 1.1 任务摘要

实现预约首页的医生列表查询功能，患者可以浏览可预约的医生列表，支持按科室筛选和关键字搜索。

### 1.2 任务目标

- 提供可预约医生的列表展示
- 支持按科室筛选医生
- 支持按医生姓名搜索
- 显示医生的基本信息（姓名、职称、科室、头像）

### 1.3 关联需求

- **Feature 需求**: REQ-001, REQ-004
- **用户故事**: 故事 1
- **页面路由**: `/appointment` → Appointment.vue

---

## 2. 前置依赖

| 依赖项 | 类型 | 说明 |
|--------|------|------|
| 数据模型定义 | 前置 | AppointmentSlot、Appointment 接口需先定义 |
| Store API | 前置 | getActiveDoctors() 方法需存在 |
| 路由配置 | 前置 | `/appointment` 路由需注册 |

**依赖任务**: 无（首个任务）

---

## 3. 验收标准

### 3.1 功能验收

| # | 验收条件 | 验证方法 |
|---|----------|----------|
| 1 | 页面加载时自动获取医生列表 | 刷新页面后列表展示 |
| 2 | 医生卡片显示姓名、职称、科室、头像 | 视觉检查 |
| 3 | 科室筛选下拉框可正常选择 | 选择不同科室列表更新 |
| 4 | 搜索框输入可过滤医生列表 | 输入关键字后列表实时更新 |
| 5 | 点击"立即预约"按钮跳转预约页 | 点击后路由跳转到预约页 |

### 3.2 技术验收

| 验收条件 | 验证命令 |
|----------|----------|
| TypeScript 编译通过 | `npm run build` 无错误 |
| ESLint 检查通过 | `npm run lint` 无警告 |
| 页面可正常访问 | `npm run dev` 启动后访问 /appointment |

### 3.3 边界条件

- 医生列表为空时显示空状态提示
- 搜索无结果时显示"未找到相关医生"
- 网络错误时显示错误提示并提供重试按钮

---

## 4. 技术方案

### 4.1 页面结构

```
src/views/appointment/
└── Appointment.vue    # 预约首页
```

### 4.2 组件设计

| 组件 | 类型 | 说明 |
|------|------|------|
| DoctorCard | 展示组件 | 医生信息卡片 |
| DepartmentFilter | 筛选组件 | 科室下拉选择器 |
| DoctorSearch | 搜索组件 | 医生姓名搜索框 |

### 4.3 数据流

```
页面加载 → 调用 getActiveDoctors() → Store 返回医生列表 → 渲染医生卡片
用户筛选 → 本地过滤医生列表 → 更新展示
用户搜索 → 本地搜索匹配 → 更新展示
```

### 4.4 代码规范

- 组件命名: PascalCase (如 `DoctorCard.vue`)
- 方法命名: camelCase (如 `handleSearch`)
- CSS 类名: kebab-case (如 `doctor-card`)
- 使用 `<script setup lang="ts">` 语法

### 4.5 引用文件

- `.asdm/contexts/standard-coding-style.md` - 编码规范
- `.asdm/contexts/standard-project-structure.md` - 项目结构
- `src/store/index.ts` - 状态管理
- `src/views/Doctors.vue` - 参考现有医生列表实现

---

## 5. 预估工时

| 项目 | 预估 |
|------|------|
| **人天** | 0.5 人天 (4 小时) |
| 复杂度 | Low |
| 风险 | Low |

**工时分解**:
- 页面布局与样式: 1 小时
- 医生卡片组件: 1 小时
- 筛选与搜索功能: 1 小时
- 测试与修复: 1 小时

---

## 6. 交付物

- [ ] `src/views/appointment/Appointment.vue`
- [ ] `src/components/appointment/DoctorCard.vue`
- [ ] `npm run build` 编译通过
- [ ] 页面功能验证完成

---

*Task ID: TASK-FEAT-001-001*
