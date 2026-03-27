# 代码安全评审报告

**评审时间**: 2026-03-27
**评审范围**: 最近 10 个提交 (527de9d ~ 0ecd0da)
**评审重点**: 安全问题

---

## 提交概览

| 序号 | 提交哈希 | 提交信息 | 风险等级 |
|------|----------|----------|----------|
| 1 | 0ecd0da | refactor: 重构 CodeBuddy 命令文件结构 | 🟢 低 |
| 2 | 3e2a8e2 | feat: 新增端到端测试报告和验证脚本 | 🟢 低 |
| 3 | 9d6a649 | feat: 添加所有页面响应式测试框架 | 🟢 低 |
| 4 | 58fd450 | docs: 更新Git提交相关命令脚本 | 🟢 低 |
| 5 | 5877138 | feat: 添加医生列表页面端到端测试框架和测试报告 | 🟢 低 |
| 6 | 65d6c14 | feat: 添加Playwright测试依赖和完善用户服务文档 | 🔴 高 |
| 7 | 49cb42d | 新增调试循环文档：详细描述软件开发调试流程 | 🟢 低 |
| 8 | e412c5f | 更新医生页面布局和交互逻辑，优化卡片样式和响应式设计 | 🔴 高 |
| 9 | 40ebd18 | feat: 添加医生API代理和前端集成 | 🟡 中 |
| 10 | 527de9d | feat: 添加应用管理脚本及对应的npm命令 | 🟡 中 |

---

## 严重安全问题

### 🔴 1. 硬编码数据库凭证 (提交: 65d6c14, e412c5f)

**位置**: `server/qa-service-user/src/main/resources/application.properties:5-7`

```properties
spring.datasource.username=root
spring.datasource.password=root
```

**位置**: `server/qa-service-user/import_doctor_data.sh:8-9`

```bash
DB_USER="root"
DB_PASSWORD="root"
```

**问题**:
- 数据库密码以明文形式硬编码在代码中
- 使用弱密码 `root`
- 凭证可能被提交到版本控制系统

**风险**: 攻击者可直接访问数据库，获取或篡改所有数据

**修复建议**:
```properties
# 使用环境变量
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
```

```bash
# 脚本中使用环境变量
DB_USER="${DB_USERNAME:-root}"
DB_PASSWORD="${DB_PASSWORD:-}"
```

---

### 🔴 2. 弱密码和明文存储 (提交: e412c5f)

**位置**: `server/qa-service-user/src/main/resources/db/data/doctor_user_data.sql:9-12`

```sql
INSERT INTO doctor_user (id, username, password, ...) VALUES
('doc001', 'dr-zhang-wei', '123456', ...),
('doc002', 'dr-li-na', '123456', ...),
...
```

**问题**:
- 所有医生账户使用相同密码 `123456`
- 密码以明文存储，未进行哈希处理
- 使用极其脆弱的密码

**风险**:
- 攻击者可轻易登录任意医生账户
- 数据库泄露将直接暴露所有密码

**修复建议**:
```java
// 使用 BCrypt 加密存储
@Autowired
private PasswordEncoder passwordEncoder;

String encodedPassword = passwordEncoder.encode("用户设置的强密码");
```

```sql
-- 存储哈希后的密码
INSERT INTO doctor_user (..., password, ...) VALUES
(..., '$2a$10$hashedPassword...', ...);
```

---

### 🔴 3. 认证接口通过 URL 参数传递密码 (提交: 40ebd18)

**位置**: `web/qa-web/src/api/modules/doctor.ts:60-63`

```typescript
export const authenticateDoctor = (username: string, password: string): Promise<DoctorUserResponse> => {
  return request.post('/doctors/authenticate', null, {
    params: { username, password }
  });
};
```

**位置**: `server/qa-service-user/src/main/java/.../DoctorUserController.java:156-161`

```java
@PostMapping("/authenticate")
public ResponseEntity<DoctorUserResponse> authenticateDoctor(@RequestParam String username,
                                                             @RequestParam String password) {
```

**问题**:
- 密码通过 URL 查询参数传递，会出现在：
  - 服务器访问日志
  - 浏览器历史记录
  - 网络代理日志
- 违反安全最佳实践

**修复建议**:

前端:
```typescript
export const authenticateDoctor = (credentials: LoginRequest): Promise<DoctorUserResponse> => {
  return request.post('/doctors/authenticate', credentials);
};
```

后端:
```java
@PostMapping("/authenticate")
public ResponseEntity<DoctorUserResponse> authenticateDoctor(@RequestBody LoginRequest request) {
    // 使用 request body 接收凭证
}
```

---

## 中等安全问题

### 🟡 4. Actuator 端点过度暴露 (提交: 65d6c14)

**位置**: `server/qa-service-user/src/main/resources/application.properties:25-35`

```properties
management.endpoints.web.exposure.include=health,info,metrics,env,beans,loggers
management.endpoint.health.show-details=always
management.endpoint.health.show-components=always
```

**问题**:
- `env` 端点可能泄露环境变量和敏感配置
- `beans` 和 `loggers` 暴露应用内部结构
- 健康检查显示详细系统信息

**风险**: 攻击者可获取应用架构、依赖版本等情报

**修复建议**:
```properties
# 生产环境限制端点
management.endpoints.web.exposure.include=health,info
management.endpoint.health.show-details=when_authorized
management.endpoint.health.show-components=when_authorized
```

---

### 🟡 5. CORS 配置过于宽松 (提交: 65d6c14)

**位置**: `server/qa-service-user/src/main/java/.../CorsConfig.java:16-21`

```java
registry.addMapping("/**")
        .allowedOriginPatterns("*")
        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
        .allowedHeaders("*")
        .allowCredentials(true)
        .maxAge(3600);
```

**问题**:
- 允许任何源访问 (`*`)
- 同时允许携带凭证 (`allowCredentials(true)`)
- 这种组合虽然技术上可行（使用 `allowedOriginPatterns`），但存在 CSRF 风险

**修复建议**:
```java
// 生产环境指定允许的域名
.allowedOriginPatterns("https://yourdomain.com", "https://app.yourdomain.com")
```

---

### 🟡 6. Vite 代理禁用安全验证 (提交: 40ebd18)

**位置**: `web/qa-web/vite.config.ts:8-14`

```typescript
proxy: {
  '/api': {
    target: 'http://localhost:8080',
    changeOrigin: true,
    secure: false,  // 禁用安全验证
  }
}
```

**问题**: `secure: false` 在生产构建中可能被误用

**修复建议**:
- 仅在开发环境使用此配置
- 添加注释说明

---

### 🟡 7. Shell 脚本使用 `kill -9` 强制终止进程 (提交: 527de9d)

**位置**: `web/qa-web/app-management.sh:58`

```bash
lsof -ti:$PORT | xargs kill -9 2>/dev/null
```

**问题**:
- 强制终止可能导致数据丢失
- 可能被恶意利用终止其他进程

**风险**: 在多用户环境中可能影响其他用户的服务

---

## 低风险问题

### 🟢 8. 路径信息泄露 (提交: 65d6c14)

**位置**: `server/qa-service-user/README.md`

```markdown
cd /home/azureuser/source/tkt01/qa-live-healthcare-bolt-vue-c1joxy7j
```

**问题**: 文档中包含具体的文件系统路径

**修复建议**: 使用相对路径或占位符

---

### 🟢 9. 敏感信息记录到日志 (提交: 40ebd18)

**位置**: `web/qa-web/src/views/Doctors.vue:70`

```typescript
console.log('从API获取的医生数据:', doctors);
```

**问题**: 生产环境中可能泄露敏感数据

**修复建议**:
```typescript
if (import.meta.env.DEV) {
  console.log('从API获取的医生数据:', doctors);
}
```

---

## 安全问题汇总

| 级别 | 数量 | 问题 |
|------|------|------|
| 🔴 高 | 3 | 硬编码凭证、弱密码、URL传密码 |
| 🟡 中 | 4 | Actuator暴露、CORS宽松、代理配置、强制kill |
| 🟢 低 | 2 | 路径泄露、日志敏感信息 |

---

## 修复优先级建议

### 立即修复 (P0)
1. 移除所有硬编码的数据库凭证，使用环境变量
2. 对密码进行 BCrypt 哈希存储
3. 修改认证接口使用 POST body 传递凭证

### 短期修复 (P1)
1. 限制 Actuator 端点暴露
2. 收紧 CORS 配置
3. 添加安全相关的配置说明

### 长期改进 (P2)
1. 移除文档中的敏感路径信息
2. 清理生产环境的调试日志
3. 建立安全代码审查流程

---

## 结论

本次评审发现 **3 个高危安全问题**，主要集中在敏感信息管理和认证机制方面。建议在代码合并到主分支前优先修复高危问题，并考虑引入静态代码安全扫描工具（如 SonarQube、Snyk）作为 CI/CD 流程的一部分。
