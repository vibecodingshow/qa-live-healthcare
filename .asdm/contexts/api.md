# API 接口文档

## 概述

本文档提供了在线医疗健康咨询平台的 API 接口文档。由于项目当前为纯前端应用（数据存储于本地 JSON），本文档包含两部分：

1. **当前 Store API**：前端状态管理接口（本地数据操作）
2. **未来后端 API 规范**：扩展为真实后端时的接口设计

## 基础信息

### 技术栈

- **前端框架**：Vue 3 + TypeScript
- **状态管理**：Vue 3 Reactive API
- **UI 组件库**：Ant Design Vue 4.x
- **构建工具**：Vite 5.x
- **路由**：Vue Router 4.x

### 数据源

| 数据文件 | 用途 |
|----------|------|
| `src/data/doctor-user-list.json` | 医生用户数据 |
| `src/data/patient-user.json` | 患者用户数据 |
| `src/data/question-list.json` | 咨询问题数据 |

---

## Part 1: 当前 Store API

### 基础说明

Store 模块位于 `src/store/index.ts`，使用 Vue 3 的 `reactive` API 进行状态管理。

**导入方式**：
```typescript
import { store } from '@/store';
```

### 数据模型

#### Doctor（医生）

```typescript
interface Doctor {
  id: string;           // 医生唯一标识
  username: string;     // 登录用户名（唯一）
  password: string;      // 登录密码
  name: string;          // 医生姓名
  title: string;         // 职称（主任医师、副主任医师、主治医师）
  department: string;    // 所属科室
  avatar: string;        // 头像 URL
  experience: string;    // 从业经验
  specialties: string[]; // 专业领域数组
  isActive: boolean;     // 是否在职
}
```

#### Patient（患者）

```typescript
interface Patient {
  id: string;      // 患者唯一标识
  name: string;    // 患者姓名
  birthday: string; // 出生日期（YYYY-MM-DD）
  phone: string;    // 联系电话（脱敏）
  gender: string;   // 性别
}
```

#### Question（咨询问题）

```typescript
interface Question {
  id: string;              // 问题唯一标识
  patientId: string;       // 患者 ID
  patientName: string;      // 患者姓名
  doctorId: string;         // 医生 ID
  doctorName: string;      // 医生姓名
  question: string;         // 咨询问题内容
  submitTime: string;       // 提交时间（ISO 8601）
  status: 'pending' | 'answered';  // 问题状态
  answer: string | null;   // 医生回复
  answerTime: string | null; // 回复时间
}
```

---

### 接口定义

#### 1. 医生登录

**方法签名**：
```typescript
loginDoctor(username: string, password: string): Doctor | null
```

**参数说明**：
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| username | string | 是 | 医生用户名 |
| password | string | 是 | 登录密码 |

**返回值**：
- 成功：返回 `Doctor` 对象
- 失败：返回 `null`

**使用示例**：
```typescript
const doctor = store.loginDoctor('dr-zhang-wei', '123456');
if (doctor) {
  console.log('登录成功:', doctor.name);
} else {
  console.log('用户名或密码错误');
}
```

**示例数据**：
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

---

#### 2. 医生登出

**方法签名**：
```typescript
logoutDoctor(): void
```

**返回值**：无

**使用示例**：
```typescript
store.logoutDoctor();
console.log(store.state.currentDoctor); // null
```

---

#### 3. 患者身份验证

**方法签名**：
```typescript
verifyPatient(name: string, birthday: string): Patient
```

**参数说明**：
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | 是 | 患者姓名 |
| birthday | string | 是 | 出生日期（YYYY-MM-DD） |

**返回值**：
- 匹配成功：返回现有 `Patient` 对象
- 匹配失败：自动创建新患者并返回

**使用示例**：
```typescript
const patient = store.verifyPatient('赵明', '1985-03-15');
console.log('患者 ID:', patient.id);
```

---

#### 4. 患者登出

**方法签名**：
```typescript
logoutPatient(): void
```

**返回值**：无

**使用示例**：
```typescript
store.logoutPatient();
console.log(store.state.currentPatient); // null
```

---

#### 5. 获取医生的所有问题

**方法签名**：
```typescript
getQuestionsByDoctor(doctorId: string): Question[]
```

**参数说明**：
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| doctorId | string | 是 | 医生 ID |

**返回值**：`Question[]` - 该医生的所有咨询问题

**使用示例**：
```typescript
const questions = store.getQuestionsByDoctor('doc001');
const pending = questions.filter(q => q.status === 'pending');
```

---

#### 6. 获取患者的所有问题

**方法签名**：
```typescript
getQuestionsByPatient(patientId: string): Question[]
```

**参数说明**：
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| patientId | string | 是 | 患者 ID |

**返回值**：`Question[]` - 该患者的所有咨询问题

**使用示例**：
```typescript
const questions = store.getQuestionsByPatient('patient001');
```

---

#### 7. 提交新咨询问题

**方法签名**：
```typescript
addQuestion(question: {
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  question: string;
}): Question
```

**参数说明**：
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| patientId | string | 是 | 患者 ID |
| patientName | string | 是 | 患者姓名 |
| doctorId | string | 是 | 医生 ID |
| doctorName | string | 是 | 医生姓名 |
| question | string | 是 | 咨询问题内容 |

**返回值**：新创建的 `Question` 对象（包含自动生成的 id、submitTime、status）

**使用示例**：
```typescript
const newQuestion = store.addQuestion({
  patientId: 'patient001',
  patientName: '赵明',
  doctorId: 'doc001',
  doctorName: '张伟医生',
  question: '最近总是胸闷气短是什么原因？',
});
console.log('问题已提交:', newQuestion.id);
```

---

#### 8. 回复咨询问题

**方法签名**：
```typescript
answerQuestion(questionId: string, answer: string): void
```

**参数说明**：
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| questionId | string | 是 | 问题 ID |
| answer | string | 是 | 回复内容 |

**返回值**：无

**使用示例**：
```typescript
store.answerQuestion('q001', '根据您的描述，建议做心电图检查。');
```

---

#### 9. 标记为口述解答

**方法签名**：
```typescript
markQuestionAsAnswered(questionId: string): void
```

**参数说明**：
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| questionId | string | 是 | 问题 ID |

**返回值**：无

**使用说明**：将问题状态更新为 `answered`，回复内容设为"已口述解答"

**使用示例**：
```typescript
store.markQuestionAsAnswered('q001');
```

---

#### 10. 根据用户名获取医生

**方法签名**：
```typescript
getDoctorByUsername(username: string): Doctor | undefined
```

**参数说明**：
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| username | string | 是 | 医生用户名 |

**返回值**：
- 找到：返回 `Doctor` 对象
- 未找到：返回 `undefined`

**使用示例**：
```typescript
const doctor = store.getDoctorByUsername('dr-zhang-wei');
```

---

#### 11. 获取所有在职医生

**方法签名**：
```typescript
getActiveDoctors(): Doctor[]
```

**返回值**：`Doctor[]` - 所有 `isActive: true` 的医生

**使用示例**：
```typescript
const activeDoctors = store.getActiveDoctors();
```

---

#### 12. 获取统计数据

**方法签名**：
```typescript
getStatistics(): {
  totalDoctors: number;
  totalQuestions: number;
  activeSessions: number;
  totalSessions: number;
}
```

**返回值**：平台统计数据对象

**返回值说明**：
| 字段 | 类型 | 说明 |
|------|------|------|
| totalDoctors | number | 医生总数 |
| totalQuestions | number | 问题总数 |
| activeSessions | number | 待响应问题数 |
| totalSessions | number | 在线诊室数（在职医生数） |

**使用示例**：
```typescript
const stats = store.getStatistics();
console.log(`平台统计：${stats.totalDoctors} 位医生，${stats.totalQuestions} 个问题`);
```

---

## Part 2: 未来后端 API 规范

> 当项目扩展为真实后端时，以下接口规范可作为参考实现。

### 基础 URL

| 环境 | URL |
|------|------|
| 开发环境 | `http://localhost:8080/api/v1` |
| 测试环境 | `https://api-staging.example.com/api/v1` |
| 生产环境 | `https://api.example.com/api/v1` |

### 通用响应格式

**成功响应**：
```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

**错误响应**：
```json
{
  "code": 1001,
  "message": "错误信息",
  "data": null
}
```

### 接口列表

#### 医生接口

| 接口 | 方法 | 说明 | 认证 |
|------|------|------|------|
| `/doctors` | GET | 获取医生列表 | 否 |
| `/doctors/{id}` | GET | 获取医生详情 | 否 |
| `/doctors/{username}/login` | POST | 医生登录 | 否 |
| `/doctors/me/questions` | GET | 获取当前医生的咨询问题 | JWT |

#### 患者接口

| 接口 | 方法 | 说明 | 认证 |
|------|------|------|------|
| `/patients/verify` | POST | 患者身份验证 | 否 |
| `/patients/me/questions` | GET | 获取当前患者的问题 | JWT |

#### 咨询问题接口

| 接口 | 方法 | 说明 | 认证 |
|------|------|------|------|
| `/questions` | POST | 提交新问题 | JWT |
| `/questions/{id}/answer` | PUT | 回复问题 | JWT |

### cURL 测试示例

```bash
# 获取医生列表
curl -X GET http://localhost:8080/api/v1/doctors

# 医生登录
curl -X POST http://localhost:8080/api/v1/doctors/dr-zhang-wei/login \
  -H "Content-Type: application/json" \
  -d '{"password":"123456"}'

# 提交问题
curl -X POST http://localhost:8080/api/v1/questions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"doctorId":"doc001","question":"最近总是胸闷..."}'

# 回复问题
curl -X PUT http://localhost:8080/api/v1/questions/q001/answer \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"answer":"建议做心电图检查"}'
```

---

## 错误码参考

| 错误码 | 说明 |
|--------|------|
| 0 | 成功 |
| 1001 | 参数错误 |
| 1002 | 用户不存在 |
| 1003 | 密码错误 |
| 1004 | 问题不存在 |
| 1005 | 权限不足 |
| 5000 | 服务器内部错误 |

---

*本 API 文档会随着接口变更而更新。更新时使用 `/asdm-context-update` 指令。*
