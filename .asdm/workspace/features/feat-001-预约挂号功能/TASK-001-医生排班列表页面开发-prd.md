# Task PRD: 医生排班列表页面开发

**Feature ID**: FEAT-001  
**Feature Name**: 预约挂号功能  
**Sub-Feature**: SUB-001 医生排班展示  
**Task ID**: TASK-001  
**Created Date**: 2026-04-22  
**Status**: TODO  
**Language**: zh

---

## 1. Task Overview

### 1.1 Task Summary

开发医生排班列表页面，为患者提供可预约医生的排班信息展示，包括医生姓名、科室、职称、出诊时间等关键信息。

### 1.2 Task Objectives

- 展示医院/科室的医生排班列表
- 支持按科室、日期筛选排班
- 显示医生的基本信息和可预约状态
- 提供进入预约流程的入口

### 1.3 Related Feature Requirements

- Feature PRD: `feature-prd.md`
- User Story: US-001 (作为患者，我希望能够查看医生的排班安排)
- Functional Requirement: FR-001 (患者端：医生排班信息展示)

---

## 2. Detailed Requirements

### 2.1 Functional Requirements

| ID | 需求描述 | 优先级 |
|----|---------|--------|
| FR-001-01 | 显示医生姓名、头像、职称、科室 | Must |
| FR-001-02 | 显示医生的出诊日期和时间段 | Must |
| FR-001-03 | 显示号源剩余数量或状态标识 | Must |
| FR-001-04 | 支持按科室筛选排班列表 | Must |
| FR-001-05 | 支持按日期筛选排班列表 | Should |
| FR-001-06 | 点击医生卡片进入预约流程 | Must |
| FR-001-07 | 无排班时显示友好提示 | Should |

### 2.2 Technical Requirements

| ID | 技术要求 |
|----|---------|
| TR-001-01 | 响应时间 < 500ms |
| TR-001-02 | 支持分页加载（每页20条） |
| TR-001-03 | 移动端适配（响应式布局） |
| TR-001-04 | 数据缓存策略（避免频繁请求） |

### 2.3 Constraints and Limitations

- 需要调用后端排班API获取数据
- 前端需兼容主流浏览器（Chrome、Safari、Firefox、Edge）
- 需要考虑数据加载loading状态和错误处理

---

## 3. Implementation Approach

### 3.1 Recommended Methodology

采用组件化开发方式，使用Vue 3 + TypeScript实现：

1. **组件拆分**：
   - `DoctorScheduleList.vue` - 排班列表主组件
   - `DoctorCard.vue` - 医生卡片组件
   - `ScheduleFilter.vue` - 筛选组件

2. **API调用**：
   - 调用 `/api/schedule/list` 获取排班数据
   - 使用 Pinia 进行状态管理

### 3.2 Implementation Steps

1. **Step 1: 创建排班列表API服务**
   - 定义API接口和请求参数
   - 创建TypeScript类型定义

2. **Step 2: 开发医生卡片组件**
   - 实现医生信息展示
   - 实现可预约状态标识

3. **Step 3: 开发筛选组件**
   - 科室筛选下拉框
   - 日期选择器

4. **Step 4: 组装排班列表页面**
   - 列表布局和分页
   - Loading和Error状态处理

5. **Step 5: 验证实现**
   - **Validation Step**: 运行 `npm run build` 确保编译通过
   - 运行 `npm run lint` 确保代码风格符合规范

### 3.3 Technical Considerations

- 考虑使用虚拟列表优化大量数据的渲染性能
- 图片懒加载优化首屏加载速度
-Skeleton加载骨架屏提升用户体验

### 3.4 Reference to Project Context

- `.asdm/contexts/standard-coding-style.md`: Vue组件编码规范
- `.asdm/contexts/api.md`: API接口规范

---

## 4. Acceptance Criteria

### 4.1 Primary Criteria

| 验收标准 | 测试方法 | 验证工具 |
|---------|---------|----------|
| 页面正确显示医生排班列表 | 页面加载后检查数据渲染 | 浏览器开发者工具 |
| 科室筛选功能正常工作 | 选择不同科室验证列表刷新 | 功能测试 |
| 日期筛选功能正常工作 | 选择不同日期验证列表刷新 | 功能测试 |
| 点击医生卡片跳转正确 | 点击卡片验证路由跳转 | 端到端测试 |
| 无数据时显示友好提示 | 测试无排班场景 | 功能测试 |
| **代码编译无错误** | 运行构建命令 | `npm run build` |
| **代码风格符合规范** | 运行lint检查 | `npm run lint` |

### 4.2 Edge Cases

| 边界情况 | 预期行为 |
|---------|---------|
| 网络请求超时 | 显示"网络异常，请重试"提示 |
| API返回空数据 | 显示"暂无排班信息"提示 |
| 医生头像加载失败 | 显示默认头像占位图 |
| 分页数据加载失败 | 显示重试按钮 |

### 4.3 Negative Tests

| 负向测试用例 | 预期行为 |
|------------|---------|
| 无权限访问API | 返回401，跳转登录页 |
| 数据格式异常 | 友好错误提示，不崩溃 |
| 快速连续点击筛选 | 防抖处理，只执行最后一次 |

---

## 5. Dependencies

### 5.1 Task Dependencies

| 类型 | 依赖任务 | 说明 |
|------|---------|------|
| 无前置依赖 | - | 可独立开发 |

### 5.2 External Dependencies

| 依赖类型 | 依赖内容 | 说明 |
|---------|---------|------|
| API | `/api/schedule/list` | 排班列表接口 |
| 组件库 | Element Plus / Vant | UI组件库（待确认） |

### 5.3 Prerequisites

- 后端排班API接口已开发完成
- 医生基础信息接口可用

---

## 6. Estimated Effort

### 6.1 Effort Estimate

| 指标 | 值 |
|------|---|
| 预估工时 | 4小时 |
| Story Points | 2 |
| 复杂度 | Medium |
| 风险 | Low |

### 6.2 Effort Factors

| 影响因素 | 影响说明 |
|---------|---------|
| API接口稳定性 | 接口未完成可能影响联调进度 |
| UI组件复用 | 已有组件可复用降低工作量 |

---

## 7. Testing Strategy

### 7.1 Automated Validation (Required)

| 验证类型 | 命令 | 成功标准 |
|---------|------|---------|
| 构建验证 | `npm run build` | Exit code 0，无编译错误 |
| 代码质量 | `npm run lint` | Exit code 0，无lint错误 |
| 类型检查 | `npm run type-check` | Exit code 0 |

### 7.2 Unit Testing

- 组件渲染测试
- 筛选逻辑测试
- **Validation command**: `npm run test:unit`
- **Success criteria**: 所有测试通过

### 7.3 Integration Testing

- API数据绑定测试
- 路由跳转测试
- **Validation command**: `npm run test:e2e`
- **Success criteria**: E2E测试通过

### 7.4 Manual Testing

- 页面布局和样式验证
- 不同屏幕尺寸适配验证
- 用户体验流畅性验证

---

## 8. Implementation Notes

- 组件命名遵循 PascalCase 规范
- 使用 Composition API 开发
- Props 和 Emit 使用 TypeScript 类型定义
- 样式使用 Scoped CSS 或 Tailwind CSS

---

## 9. Risks and Mitigations

### Risk 1: API接口延迟完成

- **Impact**: Medium
- **Mitigation**: 使用Mock数据进行开发，后续替换为真实接口

### Risk 2: 跨域问题

- **Impact**: Low
- **Mitigation**: 配置开发代理或后端CORS配置

---

## 10. Deliverables

| 交付物 | 说明 |
|-------|------|
| API服务文件 | `src/services/schedule.ts` |
| 医生卡片组件 | `src/components/DoctorCard.vue` |
| 筛选组件 | `src/components/ScheduleFilter.vue` |
| 排班列表页面 | `src/views/ScheduleList.vue` |
| 单元测试 | `src/views/__tests__/ScheduleList.test.ts` |

### Mandatory Deliverable: Validation Results

- **Build output**: 编译成功日志，exit code 0
- **Test results**: 单元测试通过率 100%
- **Quality checks**: ESLint 检查通过

---

**Document Owner:** AI Assistant  
**Last Updated:** 2026-04-22
