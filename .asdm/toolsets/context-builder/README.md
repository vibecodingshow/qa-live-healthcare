# ASDM Toolset - Context Builder

toolset-id: context-builder
toolset-name: Context Builder
version: 0.0.2
updated-date: 2026-1-19
toolset-description: A toolset for building context for a workspace.

## Overview

Context Builder (toolset-id `context-builder`) 是一个用于构建工作空间上下文的工具集。上下文对于任何AI模型都至关重要，它为模型提供了生成所需输出所需的信息。

本工具集通过使用预定义的模板和提示，帮助用户自动为工作空间构建上下文，从而降低构建上下文的复杂性，使AI模型更易于使用。用户可以将此工具集安装到工作空间中，并使用AI指导安装来初始化工具集。

## Features

### 主要功能特性

**自动化上下文构建**
- 提供用户友好的快捷命令，通过提供商的入口点简化工作空间上下文构建过程
- 提供标准化的上下文构建规范，允许用户管理员自定义模板
- 支持多种AI模型提供商（Claude Code、GitHub Copilot、Tencent CodeBuddy等）

**上下文注入支持**
- 作为其他工具集的提供者，为AI模型提供上下文，实现上下文注入过程
- 支持上下文更新和同步，保持与项目代码的一致性

**模板化架构**
- 预定义多种上下文模板，涵盖项目结构、编码风格、数据模型等
- 支持Mermaid图表可视化，增强AI模型的理解能力
- 提供标准化的文档结构，便于团队协作和维护

### 功能阶段

**第一阶段：基础上下文构建**
- 项目索引和文件系统分析
- 技术栈和依赖关系识别
- 业务领域和流程理解

**第二阶段：架构和设计文档**
- 系统架构和组件关系
- 数据模型和API接口定义
- 部署配置和流程说明

**第三阶段：维护和更新**
- 上下文文档的智能更新
- 变更检测和同步机制
- 版本控制和历史记录

## Directory Structure

### 工具集目录结构

```
.asdm/toolsets/context-builder/
├── INSTALL.md                     # 工具集安装说明，包含AI指导安装的提示
├── README.md                      # 当前文档（工具集说明和指南）
├── actions                        # Context Builder的操作指令目录
│   ├── asdm-context-build.md     # 构建/初始化工作空间上下文的指令
│   └── asdm-context-update.md    # 更新工作空间上下文的指令
└── spec                          # Context Builder的模板目录
    ├── index.md                   # 构建当前工作空间上下文内容索引的模板
    ├── standard-project-structure.md  # 构建标准项目结构的模板
    ├── standard-coding-style.md   # 构建标准编码风格的模板
    ├── data-models.md             # 构建数据模型相关上下文的模板
    ├── deployment.md              # 构建部署相关上下文的模板
    ├── api.md                     # 构建API相关上下文的模板
    └── architecture.md            # 构建架构相关上下文的模板
```

### 工作空间上下文目录结构

```
.asdm/contexts/
├── index.md                      # 当前工作空间上下文内容的索引和指南
├── standard-project-structure.md # 当前工作空间的标准项目结构规范
├── standard-coding-style.md      # 当前工作空间的标准编码风格指南
├── data-models.md                # 当前工作空间的数据模型相关上下文
├── deployment.md                 # 当前工作空间的部署相关上下文
├── api.md                        # 当前工作空间的API相关上下文
└── architecture.md               # 当前工作空间的架构相关上下文
```

## Actions

### asdm-context-build - 构建上下文

**输入参数**
- 当前工作空间的代码和配置文件
- 项目依赖和包管理文件
- 构建配置和脚本文件

**输出结果**
- 完整的上下文文档集（包含7个核心文档）
- 项目索引和指南
- 标准化的项目结构和编码规范
- 数据模型和API接口定义
- 系统架构和部署配置

**主要用途**
- 为AI模型提供全面的项目理解能力
- 建立团队统一的文档标准
- 支持后续开发工作的上下文注入
- 提高AI辅助开发的准确性和效率

**使用方式**
```shell
Follow the instructions in .asdm/toolsets/context-builder/actions/asdm-context-build.md
```

### asdm-context-update - 更新上下文

**输入参数**
- 现有的上下文文档集
- 更新的代码和配置文件
- 变更检测结果

**输出结果**
- 更新后的上下文文档集
- 变更日志和版本记录
- 同步的状态报告

**主要用途**
- 保持上下文文档与项目代码的同步
- 智能检测和更新变更内容
- 维护文档的时效性和准确性
- 支持增量更新，提高效率

**使用方式**
```shell
Follow the instructions in .asdm/toolsets/context-builder/actions/asdm-context-update.md
```

## 上下文文档模板说明

### index.md - 工作空间索引
- 提供当前工作空间文件系统的树状视图和分析
- 包含技术栈、框架、库、工具等详细技术细节
- 包含业务领域、业务流程、业务规则等业务信息
- 提供编译、构建、调试和测试的完整说明
- 包含到其他上下文文件的导航链接

### standard-project-structure.md - 标准项目结构
- 针对特定技术栈（Java、Python、TypeScript等）的项目结构建议
- 针对特定框架（Spring Boot、Flask、Express等）的项目组织规范
- 目录结构的最佳实践和命名约定
- 模块化设计和组件分离的指导原则

### standard-coding-style.md - 标准编码风格
- 针对特定技术栈的编码规范和要求
- 代码格式化、命名约定、注释标准的详细说明
- 代码审查和质量控制的标准
- 团队协作和代码维护的最佳实践

### data-models.md - 数据模型
- 数据模型定义（表结构、类定义、对象定义等）
- 数据模型关系（表关系、类关系、对象关系等）
- 数据模型约束（表约束、类约束、对象约束等）
- 使用Mermaid绘制数据模型图（ER图、类图、序列图等）

### deployment.md - 部署配置
- 部署流程（部署流水线、部署策略等）的详细说明
- 部署环境（开发、预生产、生产环境等）的配置要求
- 部署配置（配置变量、环境设置等）的标准化
- 使用Mermaid绘制部署图和流程示意图

### api.md - API文档
- API元数据（端点URL、方法、参数等）的完整定义
- API定义表格格式，便于AI模型理解和使用
- API测试策略和示例数据的详细说明
- 源代码文件链接，支持深入的代码分析

### architecture.md - 系统架构
- 架构图（组件图、容器图、部署图等）的可视化展示
- 架构组件（服务、数据库、消息代理等）的详细说明
- 架构关系（服务关系、数据库关系等）的分析和描述
- 系统扩展性和性能考虑的架构指导

## 安装和使用流程

### 安装步骤
1. 将工具集安装到工作空间中
2. 运行AI指导安装来初始化工具集
3. 创建`.asdm/contexts`目录作为上下文工作空间
4. 在AI模型提供商的入口点创建快捷命令

### 使用流程
1. 使用`/asdm-context-build`命令构建初始上下文
2. 使用生成的上下文文档指导AI模型工作
3. 项目变更后使用`/asdm-context-update`更新上下文
4. 维护上下文文档的时效性和准确性

### 集成支持
- 支持多种AI模型提供商的集成
- 提供标准化的上下文注入接口
- 支持自定义模板和扩展功能

## 版权与许可

Copyright (c) 2026 LeansoftX.com & iSoftStone. All rights reserved.

Licensed under the PROPRIETARY SOFTWARE LICENSE. See [LICENSE](LICENSE) in the project root for license information.