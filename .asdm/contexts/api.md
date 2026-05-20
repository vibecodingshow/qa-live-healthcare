# API 定义

## 概述

本文档提供在线医疗问诊平台的 API 定义文档。本项目使用前端 Vue 3 + 模拟数据，API 调用通过 Store 层模拟实现。

## API 元数据

### 基础信息

| 项目 | 值 |
|------|-----|
| **当前版本** | v1.0.0 |
| **API 类型** | 前端模拟 API |
| **数据存储** | JSON 文件 + 响应式状态 |
| **路由管理** | Vue Router history 模式 |

### API 端点映射

本项目无后端服务器，API 通过 Store 层模拟：

| 业务功能 | Store 方法 | 说明 |
|---------|-----------|------|
| 获取医生列表 | `state.doctors` | 读取 JSON 数据 |
| 获取在线医生 | `getActiveDoctors()` | 过滤 isActive=true |
| 医生登录 | `loginDoctor()` | 验证用户名密码 |
| 患者验证 | `verifyPatient()` | 验证姓名和生日 |
| 提交问题 | `addQuestion()` | 创建新问诊 |
| 回复问题 | `answerQuestion()` | 医生回复 |
| 获取统计 | `getStatistics()` | 平台统计数据 |

## Store API 详细定义

### 医生相关

#### 获取所有医生

```typescript
/**
 * 获取所有医生列表
 * @returns Doctor[] 医生数组
 */
function getAllDoctors(): Doctor[]
```

**示例**:
```typescript
const doctors = store.state.doctors;
```

#### 获取在线医生

```typescript
/**
 * 获取当前在线接诊的医生列表
 * @returns Doctor[] 在线医生数组
 */
function getActiveDoctors(): Doctor[]
```

**示例**:
```typescript
const activeDoctors = store.getActiveDoctors();
```

#### 获取医生（按用户名）

```typescript
/**
 * 根据用户名获取医生信息
 * @param username 医生用户名
 * @returns Doctor | undefined
 */
function getDoctorByUsername(username: string): Doctor | undefined
```

**示例**:
```typescript
const doctor = store.getDoctorByUsername('dr-zhang-wei');
```

#### 医生登录

```typescript
/**
 * 医生身份验证
 * @param username 用户名
 * @param password 密码
 * @returns Doctor | null 登录成功返回医生对象，失败返回 null
 */
function loginDoctor(username: string, password: string): Doctor | null
```

**请求参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| username | string | 是 | 医生用户名 |
| password | string | 是 | 登录密码 |

**示例**:
```typescript
const doctor = store.loginDoctor('dr-zhang-wei', '123456');
if (doctor) {
  console.log('登录成功:', doctor.name);
} else {
  console.log('用户名或密码错误');
}
```

#### 医生登出

```typescript
/**
 * 退出当前医生登录状态
 */
function logoutDoctor(): void
```

**示例**:
```typescript
store.logoutDoctor();
```

---

### 患者相关

#### 患者验证

```typescript
/**
 * 患者身份验证（如不存在则自动创建）
 * @param name 患者姓名
 * @param birthday 出生日期
 * @returns Patient 验证成功返回患者对象
 */
function verifyPatient(name: string, birthday: string): Patient
```

**请求参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | 是 | 患者姓名 |
| birthday | string | 是 | 出生日期，格式 YYYY-MM-DD |

**示例**:
```typescript
const patient = store.verifyPatient('王小明', '1990-05-15');
```

#### 患者登出

```typescript
/**
 * 退出当前患者登录状态
 */
function logoutPatient(): void
```

---

### 问诊相关

#### 提交问诊

```typescript
/**
 * 提交新的问诊问题
 * @param data 问题数据（不含自动生成的字段）
 * @returns Question 创建成功的问题对象
 */
function addQuestion(data: {
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  question: string;
}): Question
```

**请求参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| patientId | string | 是 | 患者ID |
| patientName | string | 是 | 患者姓名 |
| doctorId | string | 是 | 医生ID |
| doctorName | string | 是 | 医生姓名 |
| question | string | 是 | 问题内容（10-2000字符） |

**响应**:
```typescript
{
  id: string;           // 自动生成的问题ID
  patientId: string;   // 患者ID
  patientName: string;  // 患者姓名
  doctorId: string;    // 医生ID
  doctorName: string;   // 医生姓名
  question: string;     // 问题内容
  submitTime: string;   // 提交时间（ISO格式）
  status: 'pending';    // 状态为待回复
  answer: null;         // 暂无回复
  answerTime: null;     // 暂无回复时间
}
```

**示例**:
```typescript
const newQuestion = store.addQuestion({
  patientId: 'patient001',
  patientName: '王小明',
  doctorId: 'doc001',
  doctorName: '张伟医生',
  question: '医生您好，我最近经常感到胸闷...'
});
```

#### 回复问诊

```typescript
/**
 * 医生回复问诊问题
 * @param questionId 问题ID
 * @param answer 回复内容
 */
function answerQuestion(questionId: string, answer: string): void
```

**请求参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| questionId | string | 是 | 问题ID |
| answer | string | 是 | 回复内容 |

**示例**:
```typescript
store.answerQuestion('q001', '您好，根据您的描述...');
```

#### 获取医生的问题列表

```typescript
/**
 * 获取指定医生的所有问诊问题
 * @param doctorId 医生ID
 * @returns Question[] 问题数组
 */
function getQuestionsByDoctor(doctorId: string): Question[]
```

**示例**:
```typescript
const questions = store.getQuestionsByDoctor('doc001');
```

#### 获取患者的问题列表

```typescript
/**
 * 获取指定患者的所有问诊问题
 * @param patientId 患者ID
 * @returns Question[] 问题数组
 */
function getQuestionsByPatient(patientId: string): Question[]
```

**示例**:
```typescript
const questions = store.getQuestionsByPatient('patient001');
```

---

### 统计相关

#### 获取统计数据

```typescript
/**
 * 获取平台统计数据
 * @returns Statistics 统计数据对象
 */
function getStatistics(): Statistics
```

**响应**:
```typescript
interface Statistics {
  totalDoctors: number;    // 医生总数
  totalQuestions: number;  // 问题总数
  activeSessions: number;   // 待回复问题数
  totalSessions: number;    // 在线诊室数
}
```

**示例**:
```typescript
const stats = store.getStatistics();
console.log(`医生总数: ${stats.totalDoctors}`);
console.log(`待回复: ${stats.activeSessions}`);
```

## 数据结构

### Doctor（医生）

```typescript
interface Doctor {
  id: string;
  username: string;
  password: string;
  name: string;
  title: string;
  department: string;
  avatar: string;
  experience: string;
  specialties: string[];
  isActive: boolean;
}
```

### Patient（患者）

```typescript
interface Patient {
  id: string;
  name: string;
  birthday: string;
  phone: string;
  gender: string;
}
```

### Question（问诊问题）

```typescript
interface Question {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  question: string;
  submitTime: string;
  status: 'pending' | 'answered';
  answer: string | null;
  answerTime: string | null;
}
```

## 路由定义

| 路由 | 组件 | 说明 |
|------|------|------|
| `/` | Home.vue | 首页 |
| `/doctors` | Doctors.vue | 医生列表 |
| `/consultation` | Consultation.vue | 问诊页面 |
| `/consultation/:doctorUsername` | Consultation.vue | 指定医生问诊 |
| `/doctor/login` | DoctorLogin.vue | 医生登录 |
| `/doctor/room/:username` | DoctorRoom.vue | 医生诊室 |
| `/about` | About.vue | 关于我们 |

## 错误处理

```typescript
// 常见错误处理
try {
  const doctor = store.loginDoctor(username, password);
  if (!doctor) {
    throw new Error('用户名或密码错误');
  }
} catch (error) {
  console.error('登录失败:', error);
}

// 验证错误
if (!username || !password) {
  throw new Error('用户名和密码不能为空');
}

if (question.length < 10) {
  throw new Error('问题内容至少10个字符');
}
```

## 测试命令

### Store 测试

```typescript
// 测试医生登录
const doctor = store.loginDoctor('dr-zhang-wei', '123456');
console.assert(doctor !== null, '医生登录应成功');

// 测试提交问题
const question = store.addQuestion({
  patientId: 'patient001',
  patientName: '测试患者',
  doctorId: 'doc001',
  doctorName: '张伟医生',
  question: '这是一个测试问题，内容足够长以满足验证要求。'
});
console.assert(question.id !== undefined, '问题ID应自动生成');

// 测试回复问题
store.answerQuestion(question.id, '这是医生的回复');
const updatedQuestion = store.state.questions.find(q => q.id === question.id);
console.assert(updatedQuestion?.status === 'answered', '问题状态应更新为已回复');
```

## 相关文档

- [数据模型](./data-models.md)
- [项目结构](./standard-project-structure.md)
- [架构设计](./architecture.md)

---

*本 API 文档基于当前 Store 实现，后续如有后端服务，可据此定义 REST API 接口。*
