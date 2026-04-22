# Features List

**Project:** 医疗问诊平台  
**Version:** 1.0  
**Last Updated:** 2026-04-22

---

## Overview

| Metric | Value |
|--------|-------|
| Total Features | 1 |
| Planning | 1 |
| In Development | 0 |
| Completed | 0 |

---

## Features

| ID | Feature | Priority | Status | Progress | Tasks | Owner |
|----|---------|----------|--------|----------|-------|-------|
| FEAT-001 | 预约挂号功能 | P0 | Planning | 0% | 21/21 | - |

---

## Feature Details

### FEAT-001: 预约挂号功能

**Priority:** P0  
**Status:** Planning  
**Progress:** 0% (0/21 tasks)  
**Story Points:** 13  
**T-Shirt Size:** L  
**Estimated Days:** 15

**Description:**
为医疗问诊平台添加预约挂号功能，让患者可以预约医生的线下门诊，告别传统排队挂号的烦恼。

**User Stories:**
- US-001: 查看医生排班安排
- US-002: 选择日期和时间进行预约
- US-003: 取消或修改预约
- US-004: 收到预约成功和提醒通知
- US-005: 设置和调整排班安排
- US-006: 查看当天的预约列表

**Sub-Features:**

| ID | Sub-Feature | Tasks | Status |
|----|-------------|-------|--------|
| SUB-001 | 医生排班展示 | 3 | Pending |
| SUB-002 | 号源查询与选择 | 4 | Pending |
| SUB-003 | 预约流程 | 5 | Pending |
| SUB-004 | 预约记录管理 | 3 | Pending |
| SUB-005 | 医生排班管理 | 4 | Pending |
| SUB-006 | 预约提醒通知 | 2 | Pending |

**Tasks Breakdown:**

| ID | Task | Priority | Status |
|----|------|----------|--------|
| TASK-001 | 医生排班列表页面开发 | P0 | Pending |
| TASK-002 | 医生详情页排班展示 | P0 | Pending |
| TASK-003 | 排班日历视图组件 | P0 | Pending |
| TASK-004 | 号源实时查询API | P0 | Pending |
| TASK-005 | 号源状态颜色标识UI | P0 | Pending |
| TASK-006 | 时段选择组件 | P0 | Pending |
| TASK-007 | 号源余量更新机制 | P0 | Pending |
| TASK-008 | 预约表单页面 | P0 | Pending |
| TASK-009 | 预约人选择/新增 | P0 | Pending |
| TASK-010 | 预约信息确认页 | P0 | Pending |
| TASK-011 | 预约提交与号源锁定 | P0 | Pending |
| TASK-012 | 预约成功页与凭证展示 | P0 | Pending |
| TASK-013 | 预约记录列表页 | P0 | Pending |
| TASK-014 | 预约详情页 | P0 | Pending |
| TASK-015 | 取消预约功能 | P0 | Pending |
| TASK-016 | 医生排班管理页面 | P1 | Pending |
| TASK-017 | 常规排班模板设置 | P1 | Pending |
| TASK-018 | 临时排班调整 | P1 | Pending |
| TASK-019 | 停诊通知功能 | P1 | Pending |
| TASK-020 | 预约成功通知 | P2 | Pending |
| TASK-021 | 就诊前提醒通知 | P2 | Pending |

**PRD Document:** [feature-prd.md](./feat-001-预约挂号功能/feature-prd.md)

---

## Dependencies

```
FEAT-001 (预约挂号功能)
├── Depends on: 用户认证系统
├── Depends on: 医生信息管理
├── Depends on: 通知系统
└── Blocks: None
```

---

## Risks

| Feature | Risk | Impact | Mitigation |
|---------|------|--------|------------|
| FEAT-001 | 号源超卖 | High | 分布式锁机制 |
| FEAT-001 | 并发预约性能 | High | 乐观锁 + 缓存 |
| FEAT-001 | 数据一致性 | Medium | 事务处理 |

---

## Notes

- 所有 P0 任务必须在 v1.0 版本中完成
- P1 任务优先级仅次于 P0
- P2 任务可在后续迭代中实现

---

**Last Updated:** 2026-04-22 by AI Assistant
