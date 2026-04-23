# 安装指南

## 环境要求

### 系统要求
- Node.js 16.0 或更高版本
- npm 7.0 或更高版本
- 支持现代浏览器的操作系统

### 开发工具（可选）
- Visual Studio Code 或类似代码编辑器
- Git 版本控制工具

## 安装步骤

### 1. 检查Node.js环境

```bash
# 检查Node.js版本
node --version

# 检查npm版本
npm --version
```

如果未安装Node.js，请从 [Node.js官网](https://nodejs.org/) 下载并安装。

### 2. 安装工具集

工具集已集成到ASDM系统中，无需单独安装。

### 3. 验证安装

```bash
# 验证工具集是否可用
/asdm-build-demo --version
```

## 快速测试

### 创建测试Markdown文件

创建一个简单的Markdown文件进行测试：

```markdown
# 演示页面1

欢迎使用演示站点搭建工具！

## 功能介绍

- 自动从Markdown生成演示站点
- 支持全屏播放模式
- 键盘导航支持

### 技术栈

- Vue 3
- TypeScript
- Tailwind CSS

# 演示页面2

## 使用方法

1. 准备Markdown文件
2. 运行构建命令
3. 启动开发服务器

### 命令示例

```bash
/asdm-build-demo ./README.md
```
```

### 运行构建命令

```bash
# 构建演示站点
/asdm-build-demo ./test.md
```

### 启动开发服务器

```bash
# 进入生成的演示站点目录
cd demo-site

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000 查看演示站点。

## 故障排除

### 常见问题

#### 1. Node.js版本过低

**症状**: 构建过程中出现兼容性错误

**解决方案**: 升级到Node.js 16.0或更高版本

```bash
# 使用nvm升级Node.js
nvm install 16.0.0
nvm use 16.0.0
```

#### 2. 权限问题

**症状**: 无法创建文件或目录

**解决方案**: 使用管理员权限运行命令

```bash
# Windows
以管理员身份运行命令提示符

# macOS/Linux
sudo /asdm-build-demo ./README.md
```

#### 3. 网络问题

**症状**: npm install 失败

**解决方案**: 配置npm镜像源

```bash
# 使用淘宝npm镜像
npm config set registry https://registry.npmmirror.com/

# 或使用cnpm
npm install -g cnpm --registry=https://registry.npmmirror.com
cnpm install
```

#### 4. 端口占用

**症状**: 开发服务器启动失败

**解决方案**: 使用其他端口

```bash
# 指定端口启动
npm run dev -- --port 3001
```

## 更新工具集

工具集会随着ASDM系统自动更新，无需手动更新。

## 卸载

由于工具集集成在ASDM系统中，无需单独卸载。如果需要禁用工具集，请联系系统管理员。

## 获取帮助

如果遇到问题，可以通过以下方式获取帮助：

1. 查看详细文档
2. 联系技术支持
3. 查看错误日志文件

## 版本历史

### v1.0.0 (2025-04-22)
- 初始版本发布
- 支持基本的Markdown到演示站点转换
- 实现全屏播放和键盘导航功能