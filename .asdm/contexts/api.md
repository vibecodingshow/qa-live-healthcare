# API 接口文档

## 概述
本文档定义了 QA Live Healthcare 项目的 API 接口规范。项目目前使用前端状态管理模拟 API 调用，接口设计为后续后端开发提供参考。

## 接口设计原则

### RESTful 设计
- 使用标准的 HTTP 方法（GET、POST、PUT、DELETE）
- 资源导向的 URL 设计
- 统一的错误响应格式
- 支持内容协商

### 认证机制
- 医生使用用户名密码认证
- 患者使用姓名和生日验证
- 支持会话管理和状态保持

## 接口总览

### 基础信息
- **API 版本**: v1
- **基础路径**: `/api/v1`
- **内容类型**: `application/json`
- **字符编码**: UTF-8

### 接口列表

| 功能模块 | 接口路径 | 方法 | 描述 |
|---------|---------|------|------|
| 医生管理 | `/doctors` | GET | 获取医生列表 |
| 医生管理 | `/doctors/:id` | GET | 获取医生详情 |
| 医生管理 | `/doctors/login` | POST | 医生登录 |
| 医生管理 | `/doctors/logout` | POST | 医生登出 |
| 患者管理 | `/patients` | POST | 患者身份验证 |
| 患者管理 | `/patients/logout` | POST | 患者登出 |
| 问诊管理 | `/questions` | GET | 获取问题列表 |
| 问诊管理 | `/questions` | POST | 提交问题 |
| 问诊管理 | `/questions/:id/answer` | POST | 回答问题 |
| 统计信息 | `/statistics` | GET | 获取平台统计 |

## 详细接口说明

### 1. 医生管理接口

#### 1.1 获取医生列表
**接口路径**: `GET /api/v1/doctors`

**请求参数**:
```javascript
{
  "department": "心内科",       // 可选，科室筛选
  "isActive": true,            // 可选，在线状态筛选
  "page": 1,                   // 可选，页码
  "pageSize": 10               // 可选，每页数量
}
```

**响应示例**:
```javascript
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 15,
    "doctors": [
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
    ]
  }
}
```

#### 1.2 医生登录
**接口路径**: `POST /api/v1/doctors/login`

**请求体**:
```javascript
{
  "username": "dr-zhang-wei",
  "password": "123456"
}
```

**响应示例**:
```javascript
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "doctor": {
      "id": "doc001",
      "name": "张伟医生",
      "title": "主任医师",
      "department": "心内科"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  }
}
```

### 2. 患者管理接口

#### 2.1 患者身份验证
**接口路径**: `POST /api/v1/patients`

**请求体**:
```javascript
{
  "name": "赵明",
  "birthday": "1985-03-15"
}
```

**响应示例**:
```javascript
{
  "code": 200,
  "message": "验证成功",
  "data": {
    "patient": {
      "id": "patient001",
      "name": "赵明",
      "birthday": "1985-03-15",
      "phone": "138****1234",
      "gender": "男"
    },
    "isNew": false
  }
}
```

### 3. 问诊管理接口

#### 3.1 提交问题
**接口路径**: `POST /api/v1/questions`

**请求体**:
```javascript
{
  "patientId": "patient001",
  "doctorId": "doc001",
  "question": "最近总是感觉胸闷气短,特别是爬楼梯的时候,这是什么原因?"
}
```

**响应示例**:
```javascript
{
  "code": 200,
  "message": "问题提交成功",
  "data": {
    "question": {
      "id": "q008",
      "patientId": "patient001",
      "patientName": "赵明",
      "doctorId": "doc001",
      "doctorName": "张伟医生",
      "question": "最近总是感觉胸闷气短...",
      "submitTime": "2025-11-02T18:30:00Z",
      "status": "pending"
    }
  }
}
```

#### 3.2 回答问题
**接口路径**: `POST /api/v1/questions/:id/answer`

**请求体**:
```javascript
{
  "doctorId": "doc001",
  "answer": "根据您的描述,可能是心脏功能问题。建议您做个心电图检查..."
}
```

**响应示例**:
```javascript
{
  "code": 200,
  "message": "回答成功",
  "data": {
    "question": {
      "id": "q008",
      "status": "answered",
      "answer": "根据您的描述,可能是心脏功能问题...",
      "answerTime": "2025-11-02T18:45:00Z"
    }
  }
}
```

### 4. 统计信息接口

#### 4.1 获取平台统计
**接口路径**: `GET /api/v1/statistics`

**响应示例**:
```javascript
{
  "code": 200,
  "message": "success",
  "data": {
    "totalDoctors": 15,
    "totalQuestions": 287,
    "activeSessions": 23,
    "totalSessions": 45,
    "todayQuestions": 12
  }
}
```

## 错误处理

### 统一错误响应格式
```javascript
{
  "code": 400,
  "message": "错误描述",
  "details": {
    "field": "具体的错误信息"
  }
}
```

### 常见错误码
| 错误码 | 描述 | 解决方案 |
|--------|------|----------|
| 400 | 请求参数错误 | 检查请求参数格式 |
| 401 | 未授权访问 | 检查认证信息 |
| 403 | 权限不足 | 检查用户权限 |
| 404 | 资源不存在 | 检查资源ID |
| 500 | 服务器内部错误 | 联系管理员 |

## 前端状态管理模拟

### 当前实现
项目使用前端状态管理模拟 API 调用：

```typescript
// 状态管理接口
export const store = {
  // 医生登录
  loginDoctor(username: string, password: string): Doctor | null
  
  // 患者验证
  verifyPatient(name: string, birthday: string): Patient
  
  // 问题管理
  addQuestion(question: Partial<Question>): Question
  answerQuestion(questionId: string, answer: string): void
  
  // 数据查询
  getQuestionsByDoctor(doctorId: string): Question[]
  getQuestionsByPatient(patientId: string): Question[]
  getStatistics(): Statistics
}
```

### 数据存储
- 使用 JSON 文件存储静态数据
- 运行时状态保存在内存中
- 支持数据的增删改查操作

## 接口安全

### 认证机制
- 医生登录使用用户名密码
- 患者验证使用姓名和生日
- 支持会话管理和自动登出

### 数据验证
- 所有输入参数进行格式验证
- 防止 SQL 注入和 XSS 攻击
- 敏感信息进行脱敏处理

## 扩展规划

### 未来 API 扩展
1. **实时通信**
   - WebSocket 实时问诊
   - 语音/视频通话接口

2. **文件上传**
   - 图片上传接口
   - 检查报告上传

3. **支付接口**
   - 问诊费用支付
   - 退款处理

4. **第三方集成**
   - 医保接口
   - 药品库接口

---
*此文件由 Context Builder 工具集生成，最后更新于 2026-04-21*