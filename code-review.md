# 代码安全评审报告

## 评审概述

- **评审范围**: 最近10个提交 (527de9d ~ 0ecd0da)
- **评审日期**: 2026-03-25
- **评审重点**: 安全问题
- **评审结果**: 发现 8 个安全问题（4个高危，2个中危，2个低危）

---

## 评审的提交列表

| 提交哈希 | 提交信息 | 主要变更 |
|----------|----------|----------|
| 0ecd0da | refactor: 重构 CodeBuddy 命令文件结构 | 命令文件重构 |
| 3e2a8e2 | feat: 新增端到端测试报告和验证脚本 | 测试报告和脚本 |
| 9d6a649 | feat: 添加所有页面响应式测试框架 | Playwright测试框架 |
| 58fd450 | docs: 更新Git提交相关命令脚本 | 文档更新 |
| 5877138 | feat: 添加医生列表页面端到端测试框架 | E2E测试框架 |
| 65d6c14 | feat: 添加Playwright测试依赖和完善用户服务文档 | 依赖和文档 |
| 49cb42d | 新增调试循环文档 | 文档新增 |
| e412c5f | 更新医生页面布局和交互逻辑 | 前端页面更新 |
| 40ebd18 | feat: 添加医生API代理和前端集成 | API代理和集成 |
| 527de9d | feat: 添加应用管理脚本及对应的npm命令 | 应用管理脚本 |

---

## 安全问题详情

### 高危问题

#### 1. 敏感信息硬编码 - 数据库密码明文存储

**严重程度**: 高危

**位置**: `server/qa-service-user/src/main/resources/application.properties:7`

**问题描述**:
数据库密码 `root` 直接硬编码在配置文件中，这是一个常见的安全隐患。如果此文件被提交到版本控制系统，攻击者可以直接获取数据库访问凭证。

```properties
spring.datasource.password=root
```

**影响范围**: 所有使用该配置文件的环境

**修复建议**:
- 使用环境变量替换硬编码密码:
  ```properties
  spring.datasource.password=${DB_PASSWORD}
  ```
- 使用 Spring Cloud Config 或 Vault 管理敏感配置
- 将 `application.properties` 中包含敏感信息的配置移至不提交到版本控制的配置文件

---

#### 2. 敏感信息硬编码 - Shell脚本中明文存储数据库凭证

**严重程度**: 高危

**位置**: `server/qa-service-user/import_doctor_data.sh:6-9`

**问题描述**:
数据导入脚本中硬编码了数据库连接信息，包括用户名和密码。脚本权限为可执行，增加了泄露风险。

```bash
CONTAINER_NAME="healthcare_mysql"
DB_NAME="healthcare"
DB_USER="root"
DB_PASSWORD="root"
```

**影响范围**: 数据库安全

**修复建议**:
- 使用环境变量或配置文件读取敏感信息:
  ```bash
  DB_PASSWORD="${DB_PASSWORD:-$(cat ~/.db_password)}"
  ```
- 限制脚本文件权限，仅允许授权用户执行

---

#### 3. 密码明文存储 - 用户密码未加密

**严重程度**: 高危

**位置**:
- `server/qa-service-user/src/main/java/com/leansofx/qaserviceuser/entity/DoctorUser.java:17-18`
- `server/qa-service-user/src/main/java/com/leansofx/qaserviceuser/service/impl/DoctorUserServiceImpl.java:115-118`

**问题描述**:
系统直接存储和比较明文密码，没有使用任何加密算法。在 `authenticateDoctor` 方法中，直接使用明文密码与数据库中的密码进行比较。

```java
// 实体类中密码字段无加密处理
@Column(name = "password", length = 100, nullable = false)
private String password;

// 服务层直接比较明文密码
public Optional<DoctorUserResponse> authenticateDoctor(String username, String password) {
    return doctorUserRepository.findByUsernameAndPassword(username, password)
            .map(doctorUserConverter::toResponse);
}
```

**影响范围**: 用户账户安全、数据泄露风险

**修复建议**:
- 使用 BCrypt 或 Argon2 等安全哈希算法加密存储密码:
  ```java
  @Bean
  public PasswordEncoder passwordEncoder() {
      return new BCryptPasswordEncoder();
  }
  ```
- 认证时使用 `passwordEncoder.matches(rawPassword, encodedPassword)`
- 永远不要存储或传输明文密码

---

#### 4. 敏感信息泄露 - 密码在日志中可能暴露

**严重程度**: 高危

**位置**: `server/qa-service-user/src/main/java/com/leansofx/qaserviceuser/entity/DoctorUser.java:147`

**问题描述**:
实体类的 `toString()` 方法包含密码字段，如果日志输出该对象，密码将被记录到日志文件中。

```java
@Override
public String toString() {
    return "DoctorUser{" +
            ...
            ", password='" + password + '\'' +
            ...
            '}';
}
```

**影响范围**: 日志文件安全

**修复建议**:
- 从 `toString()` 方法中移除密码字段:
  ```java
  @Override
  public String toString() {
      return "DoctorUser{" +
              "id='" + id + '\'' +
              ", username='" + username + '\'' +
              ", name='" + name + '\'' +
              ...
              // 移除 password 字段
              '}';
  }
  ```

---

### 中危问题

#### 5. CORS 配置过于宽松

**严重程度**: 中危

**位置**: `server/qa-service-user/src/main/java/com/leansofx/qaserviceuser/config/CorsConfig.java:16-21`

**问题描述**:
CORS 配置允许所有来源 (`*`) 和所有请求方法，这在生产环境中存在安全风险。同时 `application.properties` 中配置了 `allow-credentials=false`，但 Java 代码中配置了 `allowCredentials(true)`，存在配置冲突。

```java
registry.addMapping("/**")
        .allowedOriginPatterns("*")
        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
        .allowedHeaders("*")
        .allowCredentials(true)  // 与配置文件冲突
        .maxAge(3600);
```

**影响范围**: API 安全、跨域访问控制

**修复建议**:
- 生产环境应限制允许的来源:
  ```java
  registry.addMapping("/**")
          .allowedOriginPatterns("https://yourdomain.com")
          .allowedMethods("GET", "POST")
          .allowCredentials(false);
  ```
- 统一配置文件和代码中的 CORS 设置
- 根据环境区分开发/生产配置

---

#### 6. 认证接口使用 GET 参数传输密码

**严重程度**: 中危

**位置**: `server/qa-service-user/src/main/java/com/leansofx/qaserviceuser/controller/DoctorUserController.java:156-162`

**问题描述**:
认证接口使用查询参数 (`@RequestParam`) 传输用户名和密码，密码会出现在 URL 中，可能被服务器日志、浏览器历史记录、代理服务器日志等记录。

```java
@PostMapping("/authenticate")
public ResponseEntity<DoctorUserResponse> authenticateDoctor(@RequestParam String username,
                                                             @RequestParam String password) {
```

**影响范围**: 密码泄露风险

**修复建议**:
- 使用请求体传输敏感信息:
  ```java
  @PostMapping("/authenticate")
  public ResponseEntity<DoctorUserResponse> authenticateDoctor(
          @RequestBody AuthRequest request) {
      // AuthRequest 包含 username 和 password
  }
  ```
- 或者使用 Spring Security 的标准认证机制

---

### 低危问题

#### 7. Actuator 端点暴露过多信息

**严重程度**: 低危

**位置**: `server/qa-service-user/src/main/resources/application.properties:23-29`

**问题描述**:
Actuator 配置暴露了多个敏感端点 (`env`, `beans`, `loggers`)，可能泄露环境变量和系统内部信息。

```properties
management.endpoints.web.exposure.include=health,info,metrics,env,beans,loggers
management.endpoint.health.show-details=always
```

**影响范围**: 系统信息泄露

**修复建议**:
- 生产环境限制暴露的端点:
  ```properties
  management.endpoints.web.exposure.include=health,info
  management.endpoint.health.show-details=when_authorized
  ```
- 使用 Spring Security 保护 Actuator 端点

---

#### 8. 前端代理配置不安全

**严重程度**: 低危

**位置**: `web/qa-web/vite.config.ts:6-12`

**问题描述**:
Vite 开发服务器代理配置中 `secure: false` 禁用了 SSL 验证，这在开发环境中可能被忽视，但不应在生产构建中存在。

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      secure: false,  // 禁用SSL验证
    }
  }
}
```

**影响范围**: 仅影响开发环境

**修复建议**:
- 确保 `secure: false` 仅用于开发环境
- 生产环境应使用 HTTPS 并启用安全验证

---

## 其他建议

### 输入验证

虽然 `DoctorUserCreateRequest` 使用了 `@NotBlank` 和 `@Size` 注解进行基本验证，但建议增加：

1. **密码强度验证**: 添加密码复杂度要求
   ```java
   @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$",
            message = "密码必须至少8位，包含大小写字母和数字")
   private String password;
   ```

2. **SQL 注入防护**: 确保所有查询参数使用参数化查询（当前代码已使用 JPA，风险较低）

### 会话管理

当前系统没有实现完整的会话管理机制，建议：

1. 实现 JWT 或 Session 认证机制
2. 添加登录失败次数限制
3. 实现密码重置功能

### 日志安全

建议审查所有日志输出，确保不记录敏感信息：

- 移除实体类 `toString()` 中的敏感字段
- 配置日志框架过滤敏感数据
- 定期审计日志内容

---

## 问题统计

| 严重程度 | 数量 | 问题编号 |
|----------|------|----------|
| 高危 | 4 | #1, #2, #3, #4 |
| 中危 | 2 | #5, #6 |
| 低危 | 2 | #7, #8 |
| **总计** | **8** | |

---

## 修复优先级建议

1. **立即修复**: #3 密码明文存储、#4 密码日志泄露
2. **高优先级**: #1 数据库密码硬编码、#2 脚本中密码硬编码
3. **中优先级**: #5 CORS配置、#6 认证接口密码传输
4. **低优先级**: #7 Actuator配置、#8 前端代理配置

---

## 总结

本次代码评审发现的主要安全问题集中在**敏感信息管理**和**认证安全**方面。最严重的问题是密码明文存储，这在医疗系统中是不可接受的安全风险。建议在项目上线前优先修复所有高危和中危问题，特别是：

1. 实现密码加密存储和验证
2. 使用环境变量管理敏感配置
3. 完善认证和授权机制
4. 统一 CORS 安全策略

这些问题应在开发早期解决，以避免后续的技术债务和安全风险。
