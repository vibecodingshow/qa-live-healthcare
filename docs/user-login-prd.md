# 患者用户登录功能需求文档 (PRD)

## 1. 文档信息

| 项目 | 内容 |
|------|------|
| 文档版本 | v1.0 |
| 创建日期 | 2026-03-18 |
| 所属项目 | 医疗问答系统 |
| 所属模块 | 用户管理服务 (qa-service-user) |
| 文档状态 | 待评审 |

## 2. 需求概述

### 2.1 背景说明

医疗问答系统需要为患者用户提供独立的用户名密码登录功能，使患者能够访问系统、提问咨询、查看问诊记录等。当前系统已支持医生用户的登录认证（`POST /api/doctors/authenticate`），需要扩展支持患者用户群体。

### 2.2 目标用户

- **主要用户**：需要在平台咨询医生的患者用户
- **用户特征**：年龄跨度大，技术水平参差不齐，对操作简便性要求高

### 2.3 业务目标

1. 为患者用户提供安全便捷的登录方式
2. 统一患者用户身份认证体系
3. 为后续功能（问诊、预约、支付等）奠定用户基础

## 3. 功能需求

### 3.1 登录功能

#### 3.1.1 用户故事

> 作为一名患者用户，我希望通过用户名和密码登录系统，以便访问我的个人账户和相关医疗服务。

#### 3.1.2 功能描述

| 功能项 | 描述 |
|--------|------|
| 输入项 | 用户名、密码 |
| 输出项 | 登录成功返回用户信息，失败返回错误提示 |
| 触发条件 | 用户在登录页面点击"登录"按钮 |
| 前置条件 | 用户已完成注册，账号状态正常 |

#### 3.1.3 业务规则

| 规则编号 | 规则描述 |
|----------|----------|
| BR-001 | 用户名长度限制为 3-20 个字符 |
| BR-002 | 密码长度限制为 6-32 个字符 |
| BR-003 | 用户名不区分大小写 |
| BR-004 | 连续登录失败 5 次，账号锁定 30 分钟 |
| BR-005 | 账号被禁用时禁止登录 |
| BR-006 | 登录成功后记录登录时间和 IP 地址 |

#### 3.1.4 错误处理

| 错误码 | 错误描述 | 处理方式 |
|--------|----------|----------|
| E001 | 用户名不存在 | 提示"用户名或密码错误"（不明确提示用户名不存在） |
| E002 | 密码错误 | 提示"用户名或密码错误" |
| E003 | 账号已禁用 | 提示"账号已被禁用，请联系客服" |
| E004 | 账号已锁定 | 提示"账号已锁定，请 X 分钟后重试" |
| E005 | 参数为空 | 提示"请输入用户名和密码" |

### 3.2 API 接口设计

#### 3.2.1 登录认证接口

**接口信息：**

| 项目 | 内容 |
|------|------|
| 接口路径 | `POST /api/patients/authenticate` |
| 请求方式 | POST |
| Content-Type | application/x-www-form-urlencoded 或 application/json |
| 功能描述 | 验证患者用户登录 |

**请求参数：**

| 参数名 | 类型 | 必填 | 描述 | 示例 |
|--------|------|------|------|------|
| username | String | 是 | 用户名 | patient001 |
| password | String | 是 | 密码 | ****** |

**请求示例（JSON）：**

```json
{
  "username": "patient001",
  "password": "123456"
}
```

**请求示例（查询参数）：**

```
POST /api/patients/authenticate?username=patient001&password=123456
```

**成功响应（200 OK）：**

```json
{
  "id": "pat001",
  "username": "patient001",
  "name": "张三",
  "phone": "138****1234",
  "email": "zhang***@example.com",
  "gender": "男",
  "age": 35,
  "avatar": "https://example.com/avatar.jpg",
  "isActive": true,
  "createdAt": "2026-01-15T10:30:00"
}
```

**失败响应（401 Unauthorized）：**

```json
{
  "timestamp": "2026-03-18T10:15:30.000+00:00",
  "status": 401,
  "error": "Unauthorized",
  "message": "用户名或密码错误",
  "path": "/api/patients/authenticate"
}
```

**账号禁用响应（403 Forbidden）：**

```json
{
  "timestamp": "2026-03-18T10:15:30.000+00:00",
  "status": 403,
  "error": "Forbidden",
  "message": "账号已被禁用，请联系客服",
  "path": "/api/patients/authenticate"
}
```

#### 3.2.2 患者用户管理接口

参考现有医生用户管理接口，设计患者用户管理接口：

| 方法 | 端点 | 描述 | 参数 | 请求体 | 响应 |
|------|------|------|------|--------|------|
| GET | `/api/patients` | 获取所有患者用户 | 无 | 无 | List<PatientUserResponse> |
| GET | `/api/patients/{id}` | 根据ID获取患者用户 | id（路径参数） | 无 | PatientUserResponse |
| GET | `/api/patients/username/{username}` | 根据用户名获取患者用户 | username（路径参数） | 无 | PatientUserResponse |
| POST | `/api/patients` | 创建患者用户（注册） | 无 | PatientUserCreateRequest | PatientUserResponse |
| PUT | `/api/patients/{id}` | 更新患者用户 | id（路径参数） | PatientUserUpdateRequest | PatientUserResponse |
| DELETE | `/api/patients/{id}` | 删除患者用户 | id（路径参数） | 无 | 无内容 |
| POST | `/api/patients/authenticate` | 验证患者用户登录 | username, password | 无 | PatientUserResponse |
| GET | `/api/patients/statistics` | 获取患者统计信息 | 无 | 无 | PatientStatistics |

### 3.3 数据结构设计

#### 3.3.1 PatientUser 实体

```java
public class PatientUser {
    private String id;              // 患者ID，如 "pat001"
    private String username;        // 用户名，唯一
    private String password;        // 密码（加密存储）
    private String name;            // 真实姓名
    private String phone;           // 手机号
    private String email;           // 邮箱
    private String gender;          // 性别
    private Integer age;            // 年龄
    private String avatar;          // 头像URL
    private Boolean isActive;       // 是否活跃
    private Integer loginFailCount; // 登录失败次数
    private LocalDateTime lockedUntil; // 账号锁定截止时间
    private LocalDateTime lastLoginTime; // 最后登录时间
    private String lastLoginIp;     // 最后登录IP
    private LocalDateTime createdAt; // 创建时间
    private LocalDateTime updatedAt; // 更新时间
}
```

#### 3.3.2 DTO 数据结构

**PatientUserResponse（患者用户响应）**

```json
{
  "id": "pat001",
  "username": "patient001",
  "name": "张三",
  "phone": "138****1234",
  "email": "zhang***@example.com",
  "gender": "男",
  "age": 35,
  "avatar": "https://example.com/avatar.jpg",
  "isActive": true,
  "lastLoginTime": "2026-03-18T10:30:00",
  "createdAt": "2026-01-15T10:30:00"
}
```

**PatientUserCreateRequest（创建患者用户请求）**

```json
{
  "username": "patient001",
  "password": "123456",
  "name": "张三",
  "phone": "13812341234",
  "email": "zhangsan@example.com",
  "gender": "男",
  "age": 35,
  "avatar": "https://example.com/avatar.jpg"
}
```

**PatientStatistics（患者统计信息）**

```json
{
  "totalPatients": 1000,
  "activePatients": 850,
  "newPatientsToday": 15
}
```

## 4. 非功能需求

### 4.1 安全需求

| 编号 | 需求描述 |
|------|----------|
| SEC-001 | 密码必须加密存储，使用 BCrypt 算法 |
| SEC-002 | 登录失败不明确提示是用户名错误还是密码错误 |
| SEC-003 | 敏感信息（手机号、邮箱）在响应中脱敏显示 |
| SEC-004 | 支持 HTTPS 传输 |
| SEC-005 | 记录登录日志，包括时间、IP、设备信息 |

### 4.2 性能需求

| 编号 | 需求描述 |
|------|----------|
| PERF-001 | 登录接口响应时间 < 500ms |
| PERF-002 | 支持 1000 QPS 并发登录请求 |

### 4.3 可用性需求

| 编号 | 需求描述 |
|------|----------|
| USAB-001 | 错误提示信息清晰、友好 |
| USAB-002 | 支持移动端和 PC 端登录 |

## 5. 技术实现建议

### 5.1 后端实现

基于现有 DoctorUserController 的实现模式，创建 PatientUserController：

```
server/qa-service-user/src/main/java/com/leansofx/qaserviceuser/
├── controller/
│   └── PatientUserController.java    # 新增
├── entity/
│   └── PatientUser.java              # 新增
├── repository/
│   └── PatientUserRepository.java    # 新增
├── service/
│   └── PatientUserService.java       # 新增
└── dto/
    ├── PatientUserResponse.java      # 新增
    ├── PatientUserCreateRequest.java # 新增
    └── PatientStatistics.java        # 新增
```

### 5.2 前端实现

在 Vue.js 前端应用中创建登录页面：

```
web/qa-web/src/
├── views/
│   └── Login.vue                     # 登录页面
├── api/
│   └── patient.js                    # 患者用户 API 调用
└── store/
    └── user.js                       # 用户状态管理
```

## 6. 验收标准

| 编号 | 验收标准 |
|------|----------|
| AC-001 | 使用正确的用户名密码能够成功登录 |
| AC-002 | 使用错误的密码登录，返回"用户名或密码错误" |
| AC-003 | 使用不存在的用户名登录，返回"用户名或密码错误" |
| AC-004 | 账号被禁用时，返回"账号已被禁用"提示 |
| AC-005 | 连续失败 5 次后账号锁定 30 分钟 |
| AC-006 | 密码在数据库中加密存储 |
| AC-007 | 响应中手机号、邮箱脱敏显示 |
| AC-008 | API 文档更新完整 |

## 7. 里程碑计划

| 阶段 | 内容 | 交付物 |
|------|------|--------|
| 阶段一 | 需求评审 | 需求文档定稿 |
| 阶段二 | 后端开发 | API 接口实现 |
| 阶段三 | 前端开发 | 登录页面实现 |
| 阶段四 | 联调测试 | 测试报告 |
| 阶段五 | 上线发布 | 功能上线 |

## 8. 参考资料

- [医生用户 API 文档](server/qa-service-user/docs/api.md)
- [Spring Security 文档](https://docs.spring.io/spring-security/reference/)
- [BCrypt 加密算法](https://en.wikipedia.org/wiki/Bcrypt)

## 9. 附录

### 9.1 术语表

| 术语 | 解释 |
|------|------|
| PRD | Product Requirement Document，产品需求文档 |
| DTO | Data Transfer Object，数据传输对象 |
| QPS | Queries Per Second，每秒查询率 |
| CORS | Cross-Origin Resource Sharing，跨域资源共享 |

### 9.2 修订历史

| 版本 | 日期 | 修订人 | 修订内容 |
|------|------|--------|----------|
| v1.0 | 2026-03-18 | - | 初始版本 |
