# PRD: 医生数据MySQL数据库存储

## 1. 文档信息

| 项目 | 内容 |
|------|------|
| 文档名称 | 医生数据MySQL数据库存储产品需求文档 |
| 版本 | v1.0 |
| 创建日期 | 2025-03-18 |
| 作者 | QA Healthcare Team |
| 状态 | 已实现 |

## 2. 需求背景

### 2.1 现状分析

在项目初期，医生数据同时存在于两个位置：

1. **前端静态数据**: `web/qa-web/src/data/doctor-user-list.json`
   - 纯前端存储，无法进行动态管理
   - 数据更新需要重新部署前端应用

2. **数据库存储**: 后端已配置MySQL数据库
   - Entity: `DoctorUser.java` - JPA实体类已定义
   - Repository: `DoctorUserRepository.java` - 数据访问层已实现
   - Service: `DoctorUserServiceImpl.java` - 业务逻辑层已实现
   - Controller: `DoctorUserController.java` - API接口已实现
   - SQL初始化脚本: `doctor_user_data.sql` - 数据初始化脚本已准备

### 2.2 问题痛点

- 数据维护困难，前后端数据分离管理
- 无法实时更新医生信息
- 缺乏数据一致性和完整性保障
- 无法支持多用户并发操作

### 2.3 改进目标

将医生数据统一存储在MySQL数据库中，通过后端API提供数据的增删改查服务，实现数据的集中管理和动态维护。

## 3. 功能需求

### 3.1 数据库设计

#### 3.1.1 医生用户表 (doctor_user)

| 字段名 | 类型 | 长度 | 约束 | 说明 |
|--------|------|------|------|------|
| id | VARCHAR | 50 | PRIMARY KEY | 医生ID |
| username | VARCHAR | 100 | UNIQUE, NOT NULL | 登录用户名 |
| password | VARCHAR | 100 | NOT NULL | 登录密码 |
| name | VARCHAR | 100 | NOT NULL | 医生姓名 |
| title | VARCHAR | 100 | NULLABLE | 职称 |
| department | VARCHAR | 100 | NULLABLE | 所属科室 |
| avatar | VARCHAR | 500 | NULLABLE | 头像URL |
| experience | VARCHAR | 200 | NULLABLE | 临床经验描述 |
| is_active | BOOLEAN | - | NOT NULL | 是否活跃 |

#### 3.1.2 医生专业领域关联表 (doctor_specialties)

| 字段名 | 类型 | 长度 | 约束 | 说明 |
|--------|------|------|------|------|
| doctor_id | VARCHAR | 50 | FOREIGN KEY | 关联医生ID |
| specialty | VARCHAR | 100 | NOT NULL | 专业领域 |

### 3.2 API设计

#### 3.2.1 已实现的API端点

| 方法 | 端点 | 功能描述 |
|------|------|----------|
| GET | `/api/doctors` | 获取所有医生用户 |
| GET | `/api/doctors/{id}` | 根据ID获取医生用户 |
| GET | `/api/doctors/username/{username}` | 根据用户名获取医生用户 |
| POST | `/api/doctors` | 创建医生用户 |
| PUT | `/api/doctors/{id}` | 更新医生用户 |
| DELETE | `/api/doctors/{id}` | 删除医生用户 |
| GET | `/api/doctors/active` | 获取所有活跃医生 |
| GET | `/api/doctors/department/{department}` | 根据科室查询医生 |
| GET | `/api/doctors/department/{department}/active` | 根据科室查询活跃医生 |
| GET | `/api/doctors/title/{title}` | 根据职称查询医生 |
| GET | `/api/doctors/specialty/{specialty}` | 根据专业领域查询医生 |
| POST | `/api/doctors/authenticate` | 医生登录认证 |
| GET | `/api/doctors/statistics` | 获取医生统计信息 |

#### 3.2.2 数据结构

**请求体 (DoctorUserCreateRequest)**
```json
{
  "username": "dr-new-doctor",
  "password": "123456",
  "name": "新医生",
  "title": "主治医师",
  "department": "内科",
  "avatar": "https://example.com/avatar.jpg",
  "experience": "5年临床经验",
  "specialties": ["感冒", "发烧"],
  "isActive": true
}
```

**响应体 (DoctorUserResponse)**
```json
{
  "id": "doc001",
  "username": "dr-zhang-wei",
  "name": "张伟医生",
  "title": "主任医师",
  "department": "心内科",
  "avatar": "https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg",
  "experience": "15年临床经验",
  "specialties": ["高血压", "冠心病", "心律失常"],
  "isActive": true
}
```

### 3.3 技术架构

#### 3.3.1 技术栈

| 层级 | 技术 | 版本 |
|------|------|------|
| 后端框架 | Spring Boot | 3.5.7 |
| 数据库 | MySQL | 8.0+ |
| ORM框架 | Spring Data JPA | - |
| 数据库驱动 | MySQL Connector | 8.0.33 |
| 参数校验 | Spring Validation | - |

#### 3.3.2 项目结构

```
server/qa-service-user/
├── src/main/java/com/leansofx/qaserviceuser/
│   ├── controller/
│   │   └── DoctorUserController.java    # API控制器
│   ├── service/
│   │   ├── DoctorUserService.java       # 服务接口
│   │   └── impl/DoctorUserServiceImpl.java  # 服务实现
│   ├── repository/
│   │   └── DoctorUserRepository.java    # 数据访问层
│   ├── entity/
│   │   └── DoctorUser.java              # JPA实体
│   └── dto/
│       ├── request/DoctorUserCreateRequest.java
│       ├── response/DoctorUserResponse.java
│       └── converter/DoctorUserConverter.java
├── src/main/resources/
│   ├── application.properties           # 应用配置
│   └── db/data/doctor_user_data.sql     # 初始化数据
└── pom.xml                              # Maven依赖配置
```

## 4. 数据迁移计划

### 4.1 迁移步骤

| 步骤 | 描述 | 状态 |
|------|------|------|
| 1 | 创建数据库表结构（JPA自动创建） | 已完成 |
| 2 | 准备数据初始化SQL脚本 | 已完成 |
| 3 | 实现后端CRUD API | 已完成 |
| 4 | 前端对接后端API | 待完成 |
| 5 | 移除前端静态JSON数据文件 | 待完成 |

### 4.2 数据库配置

```properties
# 数据库连接配置
spring.datasource.url=jdbc:mysql://localhost:3306/healthcare?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=root
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA配置
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
```

### 4.3 数据初始化

使用SQL脚本 `doctor_user_data.sql` 初始化基础数据：

- 5条医生用户数据
- 15条专业领域关联数据

## 5. 测试用例

### 5.1 API测试用例

| 用例ID | 测试场景 | 请求方法 | 端点 | 预期结果 |
|--------|----------|----------|------|----------|
| TC001 | 获取所有医生 | GET | `/api/doctors` | 返回5条医生数据 |
| TC002 | 根据ID获取医生 | GET | `/api/doctors/doc001` | 返回张伟医生信息 |
| TC003 | 创建新医生 | POST | `/api/doctors` | 返回201状态码 |
| TC004 | 更新医生信息 | PUT | `/api/doctors/doc001` | 返回更新后的数据 |
| TC005 | 删除医生 | DELETE | `/api/doctors/doc001` | 返回204状态码 |
| TC006 | 获取活跃医生 | GET | `/api/doctors/active` | 返回4条活跃医生 |
| TC007 | 按科室查询 | GET | `/api/doctors/department/心内科` | 返回心内科医生 |
| TC008 | 按专业领域查询 | GET | `/api/doctors/specialty/高血压` | 返回相关医生 |
| TC009 | 登录认证成功 | POST | `/api/doctors/authenticate` | 返回医生信息 |
| TC010 | 登录认证失败 | POST | `/api/doctors/authenticate` | 返回401状态码 |

## 6. 安全考虑

### 6.1 当前安全状态

- 密码以明文存储（生产环境需改进）
- CORS配置允许所有源访问（开发环境）

### 6.2 安全改进建议

| 优先级 | 改进项 | 描述 |
|--------|--------|------|
| 高 | 密码加密 | 使用BCrypt加密存储密码 |
| 高 | JWT认证 | 实现JWT令牌认证机制 |
| 中 | CORS限制 | 生产环境限制允许的域名 |
| 中 | API权限 | 添加角色权限控制 |
| 低 | 审计日志 | 记录数据变更操作日志 |

## 7. 性能指标

### 7.1 预期性能

| 指标 | 目标值 |
|------|--------|
| API响应时间 | < 200ms |
| 并发支持 | 100 QPS |
| 数据库连接池 | HikariCP默认配置 |

### 7.2 监控端点

通过Spring Boot Actuator提供监控：

- `/actuator/health` - 健康检查
- `/actuator/metrics` - 性能指标
- `/actuator/info` - 应用信息

## 8. 发布计划

### 8.1 发布阶段

| 阶段 | 内容 | 状态 |
|------|------|------|
| 开发环境 | 后端服务部署，数据库初始化 | 已完成 |
| 测试环境 | API测试，前端对接测试 | 进行中 |
| 生产环境 | 全量发布，监控验证 | 待定 |

### 8.2 回滚方案

如遇问题，可快速回滚：

1. 保留前端静态JSON文件作为备用数据源
2. 数据库备份机制
3. 配置快速切换开关

## 9. 附录

### 9.1 相关文件

| 文件路径 | 描述 |
|----------|------|
| `server/qa-service-user/src/main/java/com/leansofx/qaserviceuser/entity/DoctorUser.java` | 医生实体类 |
| `server/qa-service-user/src/main/java/com/leansofx/qaserviceuser/controller/DoctorUserController.java` | API控制器 |
| `server/qa-service-user/src/main/resources/db/data/doctor_user_data.sql` | 数据初始化脚本 |
| `server/qa-service-user/src/main/resources/application.properties` | 应用配置 |
| `server/qa-service-user/docs/api.md` | API文档 |

### 9.2 版本历史

| 版本 | 日期 | 变更内容 |
|------|------|----------|
| v1.0 | 2025-03-18 | 初始版本，完成需求文档编写 |

### 9.3 待办事项

- [ ] 前端API对接（将静态JSON数据替换为后端API调用）
- [ ] 密码加密实现（BCrypt）
- [ ] JWT认证集成
- [ ] 生产环境CORS配置
- [ ] API单元测试覆盖率 > 80%
- [ ] 数据库索引优化
