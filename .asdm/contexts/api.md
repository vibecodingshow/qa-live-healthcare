# Store API 文档

## Overview
QA Live Healthcare 没有传统意义上的后端 REST API。所有数据操作通过 `src/store/index.ts` 中的 **Store 方法** 完成，这些方法操作内存中的 `reactive()` 状态对象。

> **注意**: 本文档使用 "Store API" 一词指代 Store 模块暴露的所有公开方法。

## Store Module

**Source**: `src/store/index.ts`

### State

```typescript
interface State {
  doctors: Doctor[];            // 全部医生列表（初始来自 JSON）
  patients: Patient[];          // 全部患者列表（初始来自 JSON，可自动新增）
  questions: Question[];        // 全部问题列表（初始来自 JSON，可动态新增/修改）
  currentDoctor: Doctor | null;  // 当前登录的医生
  currentPatient: Patient | null; // 当前验证的患者
}
```

**Access**: `import { store } from '../store';` → `store.state.xxx`

---

## Authentication APIs

### loginDoctor

医生登录认证。

```typescript
loginDoctor(username: string, password: string): Doctor | null
```

**Source**: `src/store/index.ts:59-68`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `username` | string | Yes | 医生登录用户名 |
| `password` | string | Yes | 医生密码（明文比对） |

**Returns**: `Doctor` 对象（成功）或 `null`（失败）

**Behavior**:
1. 在 `state.doctors` 中查找 `username` 和 `password` 同时匹配的记录
2. 匹配成功: 设置 `state.currentDoctor = doctor`，返回 Doctor
3. 匹配失败: 返回 `null`

**Usage**:
```typescript
// Source: src/views/DoctorLogin.vue:81
const doctor = store.loginDoctor(formState.username, formState.password);
if (doctor) {
  message.success('登录成功');
  router.push(`/doctor/room/${doctor.username}`);
} else {
  message.error('用户名或密码错误');
}
```

**Test Account**: `dr-zhang-wei` / `123456`

---

### logoutDoctor

医生退出登录。

```typescript
logoutDoctor(): void
```

**Source**: `src/store/index.ts:70-72`

**Behavior**: 清除 `state.currentDoctor = null`

**Usage**:
```typescript
// Source: src/views/DoctorRoom.vue:167-171
store.logoutDoctor();
message.success('已退出登录');
router.push('/');
```

---

### verifyPatient

患者身份验证 / 自动注册。

```typescript
verifyPatient(name: string, birthday: string): Patient
```

**Source**: `src/store/index.ts:74-92`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | Yes | 患者姓名 |
| `birthday` | string | Yes | 生日，格式 `YYYY-MM-DD` |

**Returns**: `Patient` 对象（已存在或新创建）

**Behavior**:
1. 在 `state.patients` 中查找 `name` + `birthday` 匹配的记录
2. 已存在: 直接返回该 Patient，设置 `state.currentPatient`
3. 不存在: 创建新 Patient（`id: patient${Date.now()}`），push 到 `state.patients`，设置 `state.currentPatient`

**Usage**:
```typescript
// Source: src/views/Consultation.vue:234
store.verifyPatient(authForm.name, birthday);
```

---

### logoutPatient

患者退出。

```typescript
logoutPatient(): void
```

**Source**: `src/store/index.ts:94-96`

**Behavior**: 清除 `state.currentPatient = null`

---

## Query APIs

### getQuestionsByDoctor

按医生 ID 查询问题列表。

```typescript
getQuestionsByDoctor(doctorId: string): Question[]
```

**Source**: `src/store/index.ts:98-100`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `doctorId` | string | Yes | 医生 ID |

**Returns**: 该医生的全部问题数组

---

### getQuestionsByPatient

按患者 ID 查询问题列表。

```typescript
getQuestionsByPatient(patientId: string): Question[]
```

**Source**: `src/store/index.ts:102-104`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `patientId` | string | Yes | 患者 ID |

**Returns**: 该患者的全部问题数组

---

### getDoctorByUsername

按用户名查找医生。

```typescript
getDoctorByUsername(username: string): Doctor | undefined
```

**Source**: `src/store/index.ts:137-139`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `username` | string | Yes | 医生登录用户名 |

**Returns**: 医生对象或 `undefined`

---

### getActiveDoctors

获取在线医生列表。

```typescript
getActiveDoctors(): Doctor[]
```

**Source**: `src/store/index.ts:141-143`

**Returns**: `isActive === true` 的医生数组

---

### getStatistics

获取平台统计数据。

```typescript
getStatistics(): {
  totalDoctors: number;     // 医生总数
  totalQuestions: number;   // 问题总数
  activeSessions: number;   // 待响应问题数
  totalSessions: number;    // 在线诊室数（在线医生数）
}
```

**Source**: `src/store/index.ts:145-157`

---

## Mutation APIs

### addQuestion

患者提交新问题。

```typescript
addQuestion(question: Omit<Question, 'id' | 'submitTime' | 'status' | 'answer' | 'answerTime'>): Question
```

**Source**: `src/store/index.ts:106-117`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `patientId` | string | Yes | 患者 ID |
| `patientName` | string | Yes | 患者姓名 |
| `doctorId` | string | Yes | 医生 ID |
| `doctorName` | string | Yes | 医生姓名 |
| `question` | string | Yes | 问题描述 |

**Returns**: 完整的 Question 对象（含自动生成的字段）

**Auto-generated Fields**:
- `id`: `q${Date.now()}`
- `submitTime`: `new Date().toISOString()`
- `status`: `'pending'`
- `answer`: `null`
- `answerTime`: `null`

**Usage**:
```typescript
// Source: src/views/Consultation.vue:285-291
store.addQuestion({
  patientId: currentPatient.value.id,
  patientName: currentPatient.value.name,
  doctorId: doctor.id,
  doctorName: doctor.name,
  question: questionForm.question,
});
```

---

### answerQuestion

医生文字回复问题。

```typescript
answerQuestion(questionId: string, answer: string): void
```

**Source**: `src/store/index.ts:119-126`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `questionId` | string | Yes | 问题 ID |
| `answer` | string | Yes | 回复内容 |

**Behavior**:
1. 查找指定问题
2. 设置 `status = 'answered'`
3. 设置 `answer` 为回复内容
4. 设置 `answerTime` 为当前时间

---

### markQuestionAsAnswered

标记问题为已口述解答。

```typescript
markQuestionAsAnswered(questionId: string): void
```

**Source**: `src/store/index.ts:128-135`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `questionId` | string | Yes | 问题 ID |

**Behavior**: 与 `answerQuestion` 类似，但 `answer` 固定为 `"已口述解答"`

---

## API Usage Summary

| Store Method | Called By | Trigger |
|---|---|---|
| `loginDoctor` | DoctorLogin.vue | 登录表单提交 |
| `logoutDoctor` | DoctorRoom.vue | 点击"退出登录" |
| `verifyPatient` | Consultation.vue | 患者验证表单提交 |
| `logoutPatient` | Consultation.vue | 点击"切换用户" |
| `getQuestionsByDoctor` | DoctorRoom.vue | 页面加载（computed） |
| `getQuestionsByPatient` | Consultation.vue | 页面加载（computed） |
| `getDoctorByUsername` | Consultation.vue | onMounted 检查路由参数 |
| `getActiveDoctors` | Home.vue, Consultation.vue | 页面加载（computed） |
| `getStatistics` | Home.vue | 页面加载（computed） |
| `addQuestion` | Consultation.vue | Modal 确认提交 |
| `answerQuestion` | DoctorRoom.vue | Modal 确认回复 |
| `markQuestionAsAnswered` | DoctorRoom.vue | 点击"标记已解答" |

---

*此 API 文档应在 Store 接口变更时更新。使用 `/asdm-context-update api` 保持文档最新。*
