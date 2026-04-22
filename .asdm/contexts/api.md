# API 接口文档

## 概述

本文档为 QA Live Healthcare 在线医疗问诊平台提供 API 接口规范。当前版本为前端演示项目，使用本地 JSON 数据存储，未来将扩展为完整的 RESTful API 后端服务。

**当前状态**：前端演示项目（使用本地数据）
**目标状态**：完整的医疗问诊平台 API

## API 元数据

### 基础 URL

| 环境 | URL | 说明 |
|------|-----|------|
| **开发环境** | `http://localhost:8080/api` | 本地开发服务器 |
| **测试环境** | `https://staging-api.qalive.com/api` | 预生产环境 |
| **生产环境** | `https://api.qalive.com/api` | 正式生产环境 |

### API 版本

- **当前版本**: v1.0.0
- **版本策略**: URL 路径版本控制 (`/api/v1/endpoint`)
- **支持版本**: v1.0.x (最新)

### 认证方式

所有受保护端点需要 JWT 认证：

```http
Authorization: Bearer <jwt_token>
```

### 通用请求头

| 请求头 | 必需 | 说明 | 示例 |
|--------|------|------|------|
| `Content-Type` | 是 | 请求内容类型 | `application/json` |
| `Accept` | 是 | 响应类型 | `application/json` |
| `Authorization` | 条件 | JWT Bearer Token | `Bearer eyJhbGciOiJIUzI1NiIs...` |
| `X-Request-ID` | 可选 | 请求唯一标识 | `req_123456` |

### 通用错误响应格式

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "错误描述信息",
    "details": {}
  },
  "timestamp": "2026-04-21T10:30:00Z",
  "requestId": "req_abc123"
}
```

## 数据模型

### Doctor 医生

```typescript
interface Doctor {
  id: string;              // 医生唯一标识
  username: string;        // 登录用户名
  password: string;        // 登录密码（仅登录时使用）
  name: string;           // 医生姓名
  title: string;          // 职称：主任医师、副主任医师、主治医师
  department: string;      // 科室
  avatar: string;          // 头像 URL
  experience: string;      // 从业经验
  specialties: string[];   // 专长领域
  isActive: boolean;       // 是否在线接诊
}
```

### Patient 患者

```typescript
interface Patient {
  id: string;           // 患者唯一标识
  name: string;         // 患者姓名
  birthday: string;     // 出生日期 (YYYY-MM-DD)
  phone: string;        // 手机号（脱敏）
  gender: string;       // 性别：男/女
}
```

### Question 问诊问题

```typescript
interface Question {
  id: string;              // 问题唯一标识
  patientId: string;        // 患者 ID
  patientName: string;      // 患者姓名
  doctorId: string;         // 医生 ID
  doctorName: string;      // 医生姓名
  question: string;         // 问诊内容
  submitTime: string;      // 提交时间 (ISO 8601)
  status: 'pending' | 'answered';  // 状态
  answer: string | null;    // 医生回复
  answerTime: string | null;  // 回复时间
}
```

---

## 医生接口 (Doctor API)

### 接口列表

| 端点 | 方法 | 描述 | 认证 | 状态码 |
|------|------|------|------|--------|
| `/doctors` | GET | 获取医生列表 | 公开 | 200, 500 |
| `/doctors/active` | GET | 获取在线医生列表 | 公开 | 200, 500 |
| `/doctors/{username}` | GET | 根据用户名获取医生信息 | 公开 | 200, 404, 500 |
| `/doctors/login` | POST | 医生登录 | 公开 | 200, 400, 401, 500 |
| `/doctors/logout` | POST | 医生登出 | JWT | 200, 401, 500 |
| `/doctors/me` | GET | 获取当前登录医生信息 | JWT | 200, 401, 500 |

---

### GET /api/v1/doctors

**描述**: 获取所有医生列表

**请求参数**:
| 参数 | 类型 | 必需 | 说明 | 示例 |
|------|------|------|------|------|
| `department` | string | 否 | 按科室筛选 | `心内科` |
| `title` | string | 否 | 按职称筛选 | `主任医师` |

**成功响应 (200)**:
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": "doc001",
      "username": "dr-zhang-wei",
      "name": "张伟医生",
      "title": "主任医师",
      "department": "心内科",
      "avatar": "https://example.com/avatar.jpg",
      "experience": "15年临床经验",
      "specialties": ["高血压", "冠心病", "心律失常"],
      "isActive": true
    }
  ],
  "total": 5
}
```

---

### GET /api/v1/doctors/active

**描述**: 获取当前在线接诊的医生列表

**请求参数**: 无

**成功响应 (200)**:
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": "doc001",
      "username": "dr-zhang-wei",
      "name": "张伟医生",
      "title": "主任医师",
      "department": "心内科",
      "avatar": "https://example.com/avatar1.jpg",
      "specialties": ["高血压", "冠心病"],
      "isActive": true
    }
  ]
}
```

---

### GET /api/v1/doctors/{username}

**描述**: 根据用户名获取医生详细信息

**路径参数**:
| 参数 | 类型 | 说明 |
|------|------|------|
| `username` | string | 医生用户名 |

**成功响应 (200)**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "doc001",
    "username": "dr-zhang-wei",
    "name": "张伟医生",
    "title": "主任医师",
    "department": "心内科",
    "avatar": "https://example.com/avatar1.jpg",
    "experience": "15年临床经验",
    "specialties": ["高血压", "冠心病", "心律失常"],
    "isActive": true
  }
}
```

**错误响应 (404)**:
```json
{
  "error": {
    "code": "DOCTOR_NOT_FOUND",
    "message": "医生不存在",
    "details": { "username": "dr-unknown" }
  }
}
```

---

### POST /api/v1/doctors/login

**描述**: 医生登录验证

**请求体**:
```json
{
  "username": "dr-zhang-wei",
  "password": "123456"
}
```

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `username` | string | 是 | 医生用户名 |
| `password` | string | 是 | 登录密码 |

**成功响应 (200)**:
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "doctor": {
      "id": "doc001",
      "username": "dr-zhang-wei",
      "name": "张伟医生",
      "title": "主任医师",
      "department": "心内科"
    },
    "expiresIn": 86400
  }
}
```

**错误响应 (401)**:
```json
{
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "用户名或密码错误"
  }
}
```

---

## 患者接口 (Patient API)

### 接口列表

| 端点 | 方法 | 描述 | 认证 | 状态码 |
|------|------|------|------|--------|
| `/patients/verify` | POST | 患者身份验证 | 公开 | 200, 400, 404, 500 |
| `/patients/{id}` | GET | 获取患者信息 | JWT | 200, 401, 404, 500 |

---

### POST /api/v1/patients/verify

**描述**: 通过姓名和生日验证患者身份

**请求体**:
```json
{
  "name": "赵明",
  "birthday": "1985-03-15"
}
```

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `name` | string | 是 | 患者姓名 |
| `birthday` | string | 是 | 出生日期 (YYYY-MM-DD) |

**成功响应 (200)**:
```json
{
  "code": 200,
  "message": "验证成功",
  "data": {
    "id": "patient001",
    "name": "赵明",
    "birthday": "1985-03-15",
    "phone": "138****1234",
    "gender": "男"
  }
}
```

---

## 问诊接口 (Question API)

### 接口列表

| 端点 | 方法 | 描述 | 认证 | 状态码 |
|------|------|------|------|--------|
| `/questions` | GET | 获取问诊列表 | JWT | 200, 401, 500 |
| `/questions` | POST | 提交新问诊 | JWT | 201, 400, 401, 500 |
| `/questions/{id}` | GET | 获取问诊详情 | JWT | 200, 401, 404, 500 |
| `/questions/{id}/answer` | PUT | 回复问诊 | JWT (医生) | 200, 400, 401, 403, 500 |
| `/questions/doctor/{doctorId}` | GET | 获取医生的问诊 | JWT | 200, 401, 500 |
| `/questions/patient/{patientId}` | GET | 获取患者的问题 | JWT | 200, 401, 500 |

---

### GET /api/v1/questions

**描述**: 获取问诊列表（需认证）

**查询参数**:
| 参数 | 类型 | 必需 | 说明 | 示例 |
|------|------|------|------|------|
| `status` | string | 否 | 按状态筛选 | `pending`, `answered` |
| `page` | number | 否 | 页码（默认 1） | `1` |
| `pageSize` | number | 否 | 每页数量（默认 10） | `10` |

**成功响应 (200)**:
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": "q001",
      "patientId": "patient001",
      "patientName": "赵明",
      "doctorId": "doc001",
      "doctorName": "张伟医生",
      "question": "最近总是感觉胸闷气短...",
      "submitTime": "2025-11-02T09:30:00Z",
      "status": "answered",
      "answer": "根据您的描述,可能是心脏功能问题...",
      "answerTime": "2025-11-02T09:45:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "total": 7,
    "totalPages": 1
  }
}
```

---

### POST /api/v1/questions

**描述**: 提交新的问诊

**请求体**:
```json
{
  "patientId": "patient001",
  "patientName": "赵明",
  "doctorId": "doc001",
  "doctorName": "张伟医生",
  "question": "最近总是感觉胸闷气短,特别是爬楼梯的时候,这是什么原因?"
}
```

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `patientId` | string | 是 | 患者 ID |
| `patientName` | string | 是 | 患者姓名 |
| `doctorId` | string | 是 | 医生 ID |
| `doctorName` | string | 是 | 医生姓名 |
| `question` | string | 是 | 问诊内容（5-1000字符） |

**成功响应 (201)**:
```json
{
  "code": 201,
  "message": "问诊提交成功",
  "data": {
    "id": "q007",
    "patientId": "patient001",
    "patientName": "赵明",
    "doctorId": "doc001",
    "doctorName": "张伟医生",
    "question": "最近总是感觉胸闷气短...",
    "submitTime": "2026-04-21T17:30:00Z",
    "status": "pending",
    "answer": null,
    "answerTime": null
  }
}
```

---

### PUT /api/v1/questions/{id}/answer

**描述**: 医生回复问诊

**路径参数**:
| 参数 | 类型 | 说明 |
|------|------|------|
| `id` | string | 问题 ID |

**请求体**:
```json
{
  "answer": "根据您的描述,可能是心脏功能问题。建议您做个心电图和心脏彩超检查,同时注意休息,避免剧烈运动。"
}
```

**成功响应 (200)**:
```json
{
  "code": 200,
  "message": "回复成功",
  "data": {
    "id": "q001",
    "status": "answered",
    "answer": "根据您的描述,可能是心脏功能问题...",
    "answerTime": "2026-04-21T17:45:00Z"
  }
}
```

---

## 统计数据接口 (Statistics API)

### 接口列表

| 端点 | 方法 | 描述 | 认证 | 状态码 |
|------|------|------|------|--------|
| `/statistics` | GET | 获取平台统计数据 | 公开 | 200, 500 |

---

### GET /api/v1/statistics

**描述**: 获取平台统计数据

**成功响应 (200)**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "totalDoctors": 5,
    "totalQuestions": 7,
    "activeSessions": 4,
    "totalSessions": 4
  }
}
```

---

## 错误码参考

| 错误码 | HTTP 状态 | 说明 |
|--------|-----------|------|
| `VALIDATION_ERROR` | 400 | 请求参数验证失败 |
| `UNAUTHORIZED` | 401 | 需要登录认证 |
| `INVALID_CREDENTIALS` | 401 | 用户名或密码错误 |
| `FORBIDDEN` | 403 | 无权限访问 |
| `NOT_FOUND` | 404 | 资源不存在 |
| `DOCTOR_NOT_FOUND` | 404 | 医生不存在 |
| `PATIENT_NOT_FOUND` | 404 | 患者不存在 |
| `QUESTION_NOT_FOUND` | 404 | 问诊不存在 |
| `RATE_LIMIT_EXCEEDED` | 429 | 请求频率超限 |
| `INTERNAL_ERROR` | 500 | 服务器内部错误 |

---

## API 测试示例

### cURL 测试命令

```bash
# 获取在线医生列表
curl -X GET "http://localhost:8080/api/v1/doctors/active" \
  -H "Content-Type: application/json"

# 医生登录
curl -X POST "http://localhost:8080/api/v1/doctors/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"dr-zhang-wei","password":"123456"}'

# 提交问诊（需要 Token）
TOKEN="your-jwt-token-here"
curl -X POST "http://localhost:8080/api/v1/questions" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"patientId":"patient001","patientName":"赵明","doctorId":"doc001","doctorName":"张伟医生","question":"最近总是感觉胸闷气短..."}'

# 回复问诊（医生）
curl -X PUT "http://localhost:8080/api/v1/questions/q001/answer" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"answer":"根据您的描述,可能是心脏功能问题..."}'
```

---

## 接口变更记录

| 版本 | 日期 | 变更内容 |
|------|------|----------|
| v1.0.0 | 2026-04-21 | 初始 API 规范定义 |

---

*本文档由 ASDM Context Builder 自动生成。API 接口变更时请更新本文档并使用 `/asdm-context-update` 同步更新。*
