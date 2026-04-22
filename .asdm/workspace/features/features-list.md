# Features List

**Last Updated**: 2026-04-22
**Language**: zh (简体中文)

## Summary

| Total | Planned | In Progress | Completed | Cancelled |
|-------|---------|------------|-----------|-----------|
| 1     | 1       | 0          | 0         | 0         |

## Feature Registry

| Feature ID | Feature Name      | Status   | Description                                           | Priority | Tasks | Progress | Created     | Updated     |
|------------|-------------------|----------|-------------------------------------------------------|----------|-------|----------|-------------|-------------|
| FEAT-001   | 预约挂号功能       | PLANNED  | 为患者和医生提供线下门诊预约服务，支持双向预约管理     | High     | 0     | 0%       | 2026-04-22  | 2026-04-22  |

## Features Details

### FEAT-001: 预约挂号功能

**Feature ID**: FEAT-001  
**Feature Name**: 预约挂号功能  
**Status**: PLANNED  
**Created Date**: 2026-04-22  
**Last Updated**: 2026-04-22  

**Description**:
为患者和医生提供便捷的线下门诊预约服务。包括患者端的医生搜索、预约创建、预约管理功能，以及医生端的预约处理、排班设置功能。支持预约状态流转（待确认、已确认、待就诊、已完成、已取消）和预约提醒通知。

**Location**: `.asdm/workspace/features/FEAT-001-appointment-registration/`

**Scope**:
- **In Scope**: 患者端预约功能、医生端预约管理、排班设置
- **Out of Scope**: 在线支付、HIS系统集成、签到功能

**User Stories**: 6个
- Story 1: 患者查找医生并预约
- Story 2: 患者选择预约时段并确认预约
- Story 3: 患者管理自己的预约记录
- Story 4: 患者接收预约提醒
- Story 5: 医生查看和管理预约
- Story 6: 医生设置出诊时间和可预约人数

**Functional Requirements**: 8个
- REQ-001 ~ REQ-005: 患者端功能
- REQ-006 ~ REQ-008: 医生端功能

**Key Highlights**:
- 支持按科室和医生姓名搜索医生
- 提供未来7天的可预约时段
- 支持预约记录的查询和管理
- 支持医生确认/拒绝预约申请
- 自动发送预约提醒通知
- 完整的预约状态流转管理

**Next Steps**:
- 使用 `/asdm-prd-breakdown FEAT-001` 命令将功能分解为具体任务
- 执行任务实现预约挂号功能

---

**Notes**:
- 本列表由 PRD Builder 工具集自动管理
- Feature 状态: PLANNED | IN PROGRESS | COMPLETED | CANCELLED
- 定期更新 Feature 状态和进度信息