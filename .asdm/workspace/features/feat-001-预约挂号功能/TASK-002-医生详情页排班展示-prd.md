# Task PRD: 医生详情页排班展示

**Feature ID**: FEAT-001  
**Feature Name**: 预约挂号功能  
**Sub-Feature**: SUB-001 医生排班展示  
**Task ID**: TASK-002  
**Created Date**: 2026-04-22  
**Status**: TODO  
**Language**: zh

---

## 1. Task Overview

### 1.1 Task Summary

在医生详情页中展示该医生的排班信息，包括出诊日期、时间段、剩余号源等，帮助患者选择合适的预约时间。

### 1.2 Task Objectives

- 展示医生详细信息（姓名、职称、科室、简介）
- 展示医生的排班日历视图
- 显示每个时段的剩余号源数量
- 提供快速预约入口

### 1.3 Related Feature Requirements

- Feature PRD: `feature-prd.md`
- User Story: US-001 (查看医生排班安排)
- Functional Requirement: FR-001 (患者端：医生排班信息展示)
- **Blocked by**: TASK-001 (医生排班列表页面开发)

---

## 2. Detailed Requirements

### 2.1 Functional Requirements

| ID | 需求描述 | 优先级 |
|----|---------|--------|
| FR-002-01 | 显示医生完整信息（姓名、头像、职称、科室、简介） | Must |
| FR-002-02 | 展示医生的排班日历（月视图） | Must |
| FR-002-03 | 显示每个可预约日期的剩余号源 | Must |
| FR-002-04 | 不可预约日期显示禁用状态 | Must |
| FR-002-05 | 点击可预约日期显示时段选择 | Must |
| FR-002-06 | 点击时段进入预约确认页 | Must |
| FR-002-07 | 停诊日期特殊标识（红色） | Should |

### 2.2 Technical Requirements

| ID | 技术要求 |
|----|---------|
| TR-002-01 | 日历组件支持月切换 |
| TR-002-02 | 排班数据按日期懒加载 |
| TR-002-03 | 时段选择支持点击和滑动操作 |
| TR-002-04 | 页面切换动画流畅 |

### 2.3 Constraints and Limitations

- 依赖 TASK-001 完成后提供的数据结构
- 需要医生详情API支持
- 日历组件需考虑移动端交互

---

## 3. Implementation Approach

### 3.1 Recommended Methodology

1. **组件拆分**：
   - `DoctorDetail.vue` - 医生详情页主组件
   - `DoctorInfoCard.vue` - 医生信息卡片
   - `ScheduleCalendar.vue` - 排班日历组件
   - `TimeSlotPicker.vue` - 时段选择组件

2. **页面路由**：
   - 路由：`/doctor/:id/schedule`

3. **API调用**：
   - `/api/doctor/:id` - 获取医生详情
   - `/api/doctor/:id/schedule` - 获取排班数据

### 3.2 Implementation Steps

1. **Step 1: 创建医生详情API服务**
   - 定义医生详情接口
   - 定义排班详情接口

2. **Step 2: 开发医生信息卡片组件**
   - 医生头像和信息展示
   - 简介展开/收起

3. **Step 3: 开发排班日历组件**
   - 月份切换
   - 日期状态标识（可约/已满/停诊）
   - 点击日期加载时段

4. **Step 4: 开发时段选择组件**
   - 时段列表展示
   - 剩余号源显示
   - 选择后跳转预约页

5. **Step 5: 组装医生详情页面**
   - 页面布局和交互流程

6. **Step 6: 验证实现**
   - **Validation Step**: 运行 `npm run build` 确保编译通过
   - 运行 `npm run lint` 确保代码风格符合规范

### 3.3 Technical Considerations

- 使用现成的日历组件库（如 v-calendar）
- 考虑使用 Vue Transition 处理页面切换动画
- 时段选择考虑触摸友好的交互设计

### 3.4 Reference to Project Context

- `.asdm/contexts/standard-coding-style.md`: Vue组件编码规范
- `.asdm/contexts/api.md`: API接口规范

---

## 4. Acceptance Criteria

### 4.1 Primary Criteria

| 验收标准 | 测试方法 | 验证工具 |
|---------|---------|----------|
| 页面正确显示医生完整信息 | 验证各字段渲染 | 浏览器开发者工具 |
| 日历正确展示可预约日期 | 对比数据库数据 | 功能测试 |
| 时段选择交互正常 | 点击时段验证响应 | 功能测试 |
| 预约跳转参数正确 | 检查URL和参数传递 | 功能测试 |
| **代码编译无错误** | 运行构建命令 | `npm run build` |
| **代码风格符合规范** | 运行lint检查 | `npm run lint` |

### 4.2 Edge Cases

| 边界情况 | 预期行为 |
|---------|---------|
| 医生ID不存在 | 显示"医生不存在"提示 |
| 医生无排班 | 日历无任何可预约日期 |
| 时段号源为0 | 显示"已约满"禁用状态 |
| 网络加载失败 | 显示重试按钮 |

### 4.3 Negative Tests

| 负向测试用例 | 预期行为 |
|------------|---------|
| 直接访问无效医生ID | 404页面或错误提示 |
| 并发选择同一时段 | 后端冲突检测，只一人成功 |

---

## 5. Dependencies

### 5.1 Task Dependencies

| 类型 | 依赖任务 | 说明 |
|------|---------|------|
| Blocked by | TASK-001 | 依赖排班列表的基础数据 |

### 5.2 External Dependencies

| 依赖类型 | 依赖内容 | 说明 |
|---------|---------|------|
| API | `/api/doctor/:id` | 医生详情接口 |
| API | `/api/doctor/:id/schedule` | 医生排班接口 |
| 组件库 | v-calendar 或类似 | 日历组件 |

### 5.3 Prerequisites

- TASK-001 已完成
- 医生详情API接口可用

---

## 6. Estimated Effort

### 6.1 Effort Estimate

| 指标 | 值 |
|------|---|
| 预估工时 | 6小时 |
| Story Points | 3 |
| 复杂度 | Medium |
| 风险 | Medium |

### 6.2 Effort Factors

| 影响因素 | 影响说明 |
|---------|---------|
| 日历组件复杂度 | 使用成熟组件库降低风险 |
| 移动端适配 | 需要多设备测试 |

---

## 7. Testing Strategy

### 7.1 Automated Validation (Required)

| 验证类型 | 命令 | 成功标准 |
|---------|------|---------|
| 构建验证 | `npm run build` | Exit code 0，无编译错误 |
| 代码质量 | `npm run lint` | Exit code 0，无lint错误 |
| 类型检查 | `npm run type-check` | Exit code 0 |

### 7.2 Unit Testing

- 医生信息渲染测试
- 日历切换逻辑测试
- 时段选择逻辑测试
- **Validation command**: `npm run test:unit`
- **Success criteria**: 所有测试通过

### 7.3 Integration Testing

- API数据绑定测试
- 路由传参测试
- **Validation command**: `npm run test:e2e`
- **Success criteria**: E2E测试通过

### 7.4 Manual Testing

- 页面布局和样式验证
- 日历交互验证
- 时段选择交互验证
- 多设备响应式测试

---

## 8. Implementation Notes

- 医生详情页应包含返回按钮，方便用户返回列表
- 日历组件需支持触摸滑动切换月份
- 时段选择应高亮显示剩余较少的号源

---

## 9. Risks and Mitigations

### Risk 1: 日历组件兼容性问题

- **Impact**: Medium
- **Mitigation**: 选择成熟稳定的日历组件，进行充分测试

### Risk 2: 移动端日历交互

- **Impact**: Medium
- **Mitigation**: 参考现有项目的移动端交互设计

---

## 10. Deliverables

| 交付物 | 说明 |
|-------|------|
| API服务文件 | `src/services/doctor.ts` |
| 医生信息卡片组件 | `src/components/DoctorInfoCard.vue` |
| 排班日历组件 | `src/components/ScheduleCalendar.vue` |
| 时段选择组件 | `src/components/TimeSlotPicker.vue` |
| 医生详情页面 | `src/views/DoctorDetail.vue` |
| 单元测试 | `src/views/__tests__/DoctorDetail.test.ts` |

### Mandatory Deliverable: Validation Results

- **Build output**: 编译成功日志，exit code 0
- **Test results**: 单元测试通过率 100%
- **Quality checks**: ESLint 检查通过

---

**Document Owner:** AI Assistant  
**Last Updated:** 2026-04-22
