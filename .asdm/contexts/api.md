# API 定义

## 概述

本文档描述在线医疗问诊平台的 API 定义。由于项目当前使用静态 JSON 数据模拟后端，API 定义作为未来扩展的参考。

## API 元数据

### 基础 URL

| 环境 | URL | 说明 |
|------|-----|------|
| **本地开发** | `http://localhost:5173` | Vite 开发服务器 |
| **生产环境** | 根据部署配置 | 待部署后确定 |

### 认证方式

项目当前版本无需认证，未来可扩展 JWT 认证：

```http
Authorization: Bearer <jwt_token>
```

## 当前数据流 API

### Store 方法 API

由于项目使用 Vue Reactive Store 管理状态，以下是 Store 暴露的方法接口：

---

### 医生相关 API

#### 获取所有医生

```typescript
store.state.doctors: Doctor[]
```

**返回**: 医生数组

```typescript
// 示例
const doctors = store.state.doctors;
```

#### 获取在线医生

```typescript
store.getActiveDoctors(): Doctor[]
```

**返回**: 当前在线的医生数组

**示例响应**:
```json
[
  {
    "id": "doc001",
    "username": "dr-zhang-wei",
    "name": "张伟医生",
    "title": "主任医师",
    "department": "心内科",
    "isActive": true
  }
]
```

#### 根据用户名获取医生

```typescript
store.getDoctorByUsername(username: string): Doctor | undefined
```

**参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| username | string | 是 | 医生用户名 |

**示例**:
```typescript
const doctor = store.getDoctorByUsername('dr-zhang-wei');
```

#### 医生登录

```typescript
store.loginDoctor(username: string, password: string): Doctor | null
```

**参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| username | string | 是 | 用户名 |
| password | string | 是 | 密码 |

**返回**: 登录成功返回医生信息，否则返回 `null`

**示例请求**:
```typescript
const doctor = store.loginDoctor('dr-zhang-wei', '123456');
```

**示例响应** (成功):
```json
{
  "id": "doc001",
  "username": "dr-zhang-wei",
  "name": "张伟医生",
  "title": "主任医师",
  "department": "心内科",
  "isActive": true
}
```

**示例响应** (失败):
```json
null
```

#### 医生登出

```typescript
store.logoutDoctor(): void
```

**示例**:
```typescript
store.logoutDoctor();
```

---

### 患者相关 API

#### 验证患者身份

```typescript
store.verifyPatient(name: string, birthday: string): Patient
```

**参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | 是 | 患者姓名 |
| birthday | string | 是 | 出生日期 (YYYY-MM-DD) |

**返回**: 患者信息，如不存在则自动创建

**示例请求**:
```typescript
const patient = store.verifyPatient('赵明', '1985-06-15');
```

**示例响应**:
```json
{
  "id": "patient001",
  "name": "赵明",
  "birthday": "1985-06-15",
  "phone": "",
  "gender": ""
}
```

#### 患者登出

```typescript
store.logoutPatient(): void
```

**示例**:
```typescript
store.logoutPatient();
```

---

### 问诊相关 API

#### 获取医生的问题列表

```typescript
store.getQuestionsByDoctor(doctorId: string): Question[]
```

**参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| doctorId | string | 是 | 医生ID |

**示例请求**:
```typescript
const questions = store.getQuestionsByDoctor('doc001');
```

**示例响应**:
```json
[
  {
    "id": "q001",
    "patientId": "patient001",
    "patientName": "赵明",
    "doctorId": "doc001",
    "doctorName": "张伟医生",
    "question": "最近总是感觉胸闷气短...",
    "submitTime": "2025-11-02T09:30:00",
    "status": "pending",
    "answer": null,
    "answerTime": null
  }
]
```

#### 获取患者的问题列表

```typescript
store.getQuestionsByPatient(patientId: string): Question[]
```

**参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| patientId | string | 是 | 患者ID |

**示例请求**:
```typescript
const questions = store.getQuestionsByPatient('patient001');
```

#### 提交问题

```typescript
store.addQuestion(question: QuestionInput): Question
```

**参数**:

```typescript
interface QuestionInput {
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  question: string;
}
```

**示例请求**:
```typescript
const newQuestion = store.addQuestion({
  patientId: 'patient001',
  patientName: '赵明',
  doctorId: 'doc001',
  doctorName: '张伟医生',
  question: '最近血压有点高怎么办？'
});
```

**示例响应**:
```json
{
  "id": "q008",
  "patientId": "patient001",
  "patientName": "赵明",
  "doctorId": "doc001",
  "doctorName": "张伟医生",
  "question": "最近血压有点高怎么办？",
  "submitTime": "2026-04-21T10:00:00.000Z",
  "status": "pending",
  "answer": null,
  "answerTime": null
}
```

#### 回复问题

```typescript
store.answerQuestion(questionId: string, answer: string): void
```

**参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| questionId | string | 是 | 问题ID |
| answer | string | 是 | 回复内容 |

**示例请求**:
```typescript
store.answerQuestion('q001', '建议您做心电图检查...');
```

#### 标记问题已回答

```typescript
store.markQuestionAsAnswered(questionId: string): void
```

**参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| questionId | string | 是 | 问题ID |

---

### 统计 API

#### 获取统计数据

```typescript
store.getStatistics(): Statistics
```

**返回**:

```typescript
interface Statistics {
  totalDoctors: number;    // 医生总数
  totalQuestions: number;  // 问题总数
  activeSessions: number;  // 待响应问题数
  totalSessions: number;   // 在线医生数
}
```

**示例响应**:
```json
{
  "totalDoctors": 5,
  "totalQuestions": 7,
  "activeSessions": 4,
  "totalSessions": 4
}
```

---

## 未来 API 扩展

### RESTful API 设计 (计划中)

当项目扩展为真实后端时，可参考以下 API 设计：

#### 认证 API

| 端点 | 方法 | 描述 | 安全 |
|------|------|------|------|
| `/api/auth/doctor/login` | POST | 医生登录 | 公开 |
| `/api/auth/doctor/logout` | POST | 医生登出 | 需要 Token |
| `/api/auth/patient/verify` | POST | 患者身份验证 | 公开 |

#### 医生 API

| 端点 | 方法 | 描述 | 安全 |
|------|------|------|------|
| `/api/doctors` | GET | 获取医生列表 | 公开 |
| `/api/doctors/:id` | GET | 获取医生详情 | 公开 |
| `/api/doctors/active` | GET | 获取在线医生 | 公开 |

#### 问诊 API

| 端点 | 方法 | 描述 | 安全 |
|------|------|------|------|
| `/api/questions` | GET | 获取问题列表 | 条件 |
| `/api/questions` | POST | 提交问题 | 公开 |
| `/api/questions/:id` | GET | 获取问题详情 | 条件 |
| `/api/questions/:id/answer` | PUT | 回复问题 | 需要 Token |

#### 请求/响应示例

**POST /api/questions** (提交问题)

```http
POST /api/questions
Content-Type: application/json

{
  "patientName": "赵明",
  "birthday": "1985-06-15",
  "doctorId": "doc001",
  "question": "最近总是感觉胸闷气短..."
}
```

**响应** (201 Created):
```json
{
  "id": "q008",
  "patientId": "patient001",
  "patientName": "赵明",
  "doctorId": "doc001",
  "doctorName": "张伟医生",
  "question": "最近总是感觉胸闷气短...",
  "submitTime": "2026-04-21T10:00:00Z",
  "status": "pending"
}
```

**PUT /api/questions/:id/answer** (回复问题)

```http
PUT /api/questions/q001/answer
Authorization: Bearer <token>
Content-Type: application/json

{
  "answer": "根据您的描述,可能是心脏功能问题..."
}
```

**响应** (200 OK):
```json
{
  "id": "q001",
  "status": "answered",
  "answer": "根据您的描述,可能是心脏功能问题...",
  "answerTime": "2026-04-21T10:15:00Z"
}
```

---

## 错误码

### 客户端错误码

| 错误码 | HTTP 状态 | 说明 |
|--------|----------|------|
| `VALIDATION_ERROR` | 400 | 输入验证失败 |
| `UNAUTHORIZED` | 401 | 未授权访问 |
| `FORBIDDEN` | 403 | 权限不足 |
| `NOT_FOUND` | 404 | 资源不存在 |
| `CONFLICT` | 409 | 资源冲突 |
| `RATE_LIMIT` | 429 | 请求过于频繁 |

### 业务错误码

| 错误码 | 说明 |
|--------|------|
| `DOCTOR_NOT_FOUND` | 医生不存在 |
| `DOCTOR_NOT_ACTIVE` | 医生不在线 |
| `PATIENT_NOT_FOUND` | 患者不存在 |
| `QUESTION_NOT_FOUND` | 问题不存在 |
| `INVALID_CREDENTIALS` | 登录凭据错误 |
| `QUESTION_ALREADY_ANSWERED` | 问题已回答 |

---

## API 测试 (当前版本)

由于使用静态数据，API 测试通过 Store 方法调用进行：

```typescript
// 测试医生登录
const doctor = store.loginDoctor('dr-zhang-wei', '123456');
console.assert(doctor !== null, '医生登录失败');

// 测试患者验证
const patient = store.verifyPatient('赵明', '1985-06-15');
console.assert(patient.name === '赵明', '患者验证失败');

// 测试问题提交
const question = store.addQuestion({
  patientId: patient.id,
  patientName: patient.name,
  doctorId: doctor!.id,
  doctorName: doctor!.name,
  question: '测试问题'
});
console.assert(question.status === 'pending', '问题状态错误');
```

---

*最后更新: 2026-04-21*
