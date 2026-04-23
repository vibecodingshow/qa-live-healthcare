# Task PRD: 消息通知

**Feature ID**: FEAT-001
**Feature Name**: 预约挂号功能
**Task ID**: TASK-FEAT-001-007
**Created Date**: 2026-04-21
**Status**: TODO
**Language**: zh

---

## 1. 任务概述

### 1.1 任务摘要

实现消息通知功能，在预约成功、预约取消、就诊提醒等关键节点向患者发送通知提示。

### 1.2 任务目标

- 预约成功时显示成功提示
- 预约取消时显示取消确认
- 就诊前一天发送提醒通知
- 页面内通知展示（非推送）

### 1.3 关联需求

- **Feature 需求**: REQ-004, REQ-005
- **用户故事**: 故事 1, 故事 2

---

## 2. 前置依赖

| 依赖项 | 类型 | 说明 |
|--------|------|------|
| TASK-FEAT-001-004 | 前置 | 预约提交后发送通知 |
| TASK-FEAT-001-005 | 前置 | 取消预约后发送通知 |
| 通知组件 | 前置 | Ant Design Message/Notification |

**依赖任务**: 
- TASK-FEAT-001-004 (预约提交)
- TASK-FEAT-001-005 (订单查询)

---

## 3. 验收标准

### 3.1 功能验收

| # | 验收条件 | 验证方法 |
|---|----------|----------|
| 1 | 预约成功后显示成功通知 | 页面顶部弹出成功提示 |
| 2 | 通知包含预约信息摘要 | 医生、日期、时间、取号码 |
| 3 | 取消预约后显示取消通知 | 弹出确认取消提示 |
| 4 | 取消后通知提示联系医院 | 提示文本包含医院联系方式 |
| 5 | 页面内通知使用 Ant Design | 样式与项目一致 |

### 3.2 通知类型

| 通知类型 | 触发时机 | 内容 |
|----------|----------|------|
| 预约成功 | 提交预约后 | 预约成功提示 + 取号码 |
| 预约取消 | 取消预约后 | 取消确认 + 温馨提示 |
| 就诊提醒 | 就诊前24小时 | 请按时就诊提醒 |

### 3.3 技术验收

| 验收条件 | 验证命令 |
|----------|----------|
| TypeScript 编译通过 | `npm run build` 无错误 |
| 通知正常弹出 | 触发操作后观察 |
| 通知样式正确 | 视觉检查与项目风格一致 |

### 3.4 边界条件

- 通知延迟显示（loading 结束后）
- 通知可关闭
- 多个通知不覆盖

---

## 4. 技术方案

### 4.1 通知组件

```typescript
// 使用 Ant Design Vue 通知组件
import { message, notification } from 'ant-design-vue';

// 预约成功通知
notification.success({
  message: '预约成功',
  description: `预约号：${appointmentId}
               医生：${doctorName}
               时间：${appointmentDate} ${appointmentTime}`,
  duration: 5
});

// 预约取消通知
notification.success({
  message: '预约已取消',
  description: '如需就诊，请重新预约或联系医院',
  duration: 3
});
```

### 4.2 消息服务

```typescript
// 封装通知方法
export const notifyService = {
  appointmentSuccess(appointment: Appointment) {
    notification.success({
      message: '预约成功',
      description: this.buildSuccessContent(appointment)
    });
  },
  
  appointmentCancelled(appointmentId: string) {
    notification.info({
      message: '预约已取消',
      description: '如需就诊，请重新预约'
    });
  },
  
  buildSuccessContent(appointment: Appointment): string {
    return `
      <p><strong>预约号：</strong>${appointment.id}</p>
      <p><strong>医生：</strong>${appointment.doctorName}</p>
      <p><strong>科室：</strong>${appointment.department}</p>
      <p><strong>时间：</strong>${appointment.appointmentDate} ${appointment.appointmentTime}</p>
      <p><strong>取号码：</strong>${appointment.id.slice(-6)}</p>
    `;
  }
};
```

---

## 5. 预估工时

| 项目 | 预估 |
|------|------|
| **人天** | 0.25 人天 (2 小时) |
| 复杂度 | Low |
| 风险 | Low |

**工时分解**:
- 通知服务封装: 0.5 小时
- 集成到预约/取消流程: 0.5 小时
- 测试与调试: 1 小时

---

## 6. 交付物

- [ ] `src/services/notifyService.ts` - 通知服务
- [ ] 预约成功通知集成
- [ ] 取消预约通知集成
- [ ] `npm run build` 编译通过

---

*Task ID: TASK-FEAT-001-007*
