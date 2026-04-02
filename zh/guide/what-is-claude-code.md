# 什么是 Claude Code

Claude Code 是 Anthropic 推出的 **AI 编程 Agent**，它直接运行在你的终端中，能够理解你的整个代码库，并通过自然语言帮你完成编程任务。

## 核心定位

Claude Code 不是一个简单的代码补全工具，而是一个**终端中的 AI 编程伙伴**。

```
传统代码补全:  你写代码 → AI 补全下一行
Claude Code:   你描述目标 → AI 理解、规划、执行、验证
```

它的核心理念是：**你说做什么，它来做怎么做。**

### 与其他工具的区别

| 特性 | GitHub Copilot | Cursor | Claude Code |
|------|---------------|--------|-------------|
| 运行环境 | IDE 插件 | 独立 IDE | 终端 / CLI |
| 交互方式 | 行内补全 | 对话 + 补全 | 纯自然语言对话 |
| 操作能力 | 代码补全 | 代码编辑 | 读写文件、执行命令、Git 操作 |
| 自主性 | 低（逐行建议） | 中（编辑文件） | 高（自主规划和执行） |
| 上下文范围 | 当前文件 | 项目文件 | 整个代码库 + 终端环境 |
| 工具集成 | IDE 内 | IDE 内 | MCP 协议扩展 |

::: tip 关键区别
Copilot 是"补全助手"，Cursor 是"AI 编辑器"，而 Claude Code 是"AI 工程师"。Claude Code 能独立完成从理解需求到编写代码、运行测试、提交 Git 的整个流程。
:::

## 核心能力

### 1. 代码理解与生成

Claude Code 可以理解你的整个项目结构，而不仅仅是当前文件：

```bash
# 让 Claude 分析整个项目
> 分析这个项目的架构，画出模块依赖关系

# 基于项目上下文生成代码
> 参考现有的 API 路由风格，新增一个用户管理模块
```

### 2. 文件系统操作

直接读写你的文件，无需手动复制粘贴：

```bash
# 读取文件
> 看一下 src/config/database.ts 的内容

# 创建新文件
> 在 src/utils/ 下创建一个日期处理工具函数

# 批量修改
> 把所有 .js 文件的 var 替换成 const 或 let
```

### 3. 终端命令执行

Claude Code 可以直接在你的终端运行命令：

```bash
# 安装依赖
> 安装 zod 和 drizzle-orm

# 运行测试
> 运行测试并修复失败的用例

# 构建项目
> 构建项目并检查是否有错误
```

### 4. Git 版本控制

从代码修改到 PR 创建，一站式完成：

```bash
# 查看改动
> 看看我今天改了哪些文件

# 提交代码
> 把当前改动提交，写一个合适的 commit message

# 创建 PR
> 为这个功能创建一个 PR，描述清楚改动内容
```

### 5. 智能调试

不只是找到错误，还能分析原因并修复：

```bash
# 分析错误
> 运行 npm test，如果有失败的用例就修复它们

# 排查问题
> 应用启动时报 ECONNREFUSED 错误，帮我排查原因

# 性能优化
> 这个 API 接口响应很慢，帮我分析并优化
```

### 6. MCP 工具扩展

通过 Model Context Protocol（MCP），Claude Code 可以连接外部工具：

```json
// .claude/settings.json
{
  "mcpServers": {
    "github": {
      "command": "gh-mcp-server",
      "args": ["--token", "ghp_xxx"]
    },
    "database": {
      "command": "mcp-server-postgres",
      "args": ["postgresql://localhost:5432/mydb"]
    }
  }
}
```

::: info MCP 是什么？
MCP（Model Context Protocol）是 Anthropic 提出的开放协议，让 AI 模型可以安全地连接外部数据源和工具。你可以把它想象成 AI 世界的"USB 接口"。
:::

## 使用场景

### 日常开发

```bash
# 快速实现功能
> 给用户表添加一个 email 验证字段，更新 schema、API 和前端表单

# 代码重构
> 把这个 500 行的函数拆分成更小的、可测试的模块

# 写测试
> 为 src/services/auth.ts 写单元测试，覆盖所有边界情况
```

### 学习与探索

```bash
# 理解陌生代码库
> 我刚接手这个项目，帮我梳理整体架构和核心模块

# 学习新技术
> 用 Hono 框架重写这个 Express API，解释关键差异
```

### 运维与 DevOps

```bash
# CI/CD 配置
> 创建一个 GitHub Actions workflow，包含测试、构建和部署

# 环境调试
> Docker 容器启动失败，帮我看看日志找出原因
```

## 运行平台

Claude Code 支持多种使用方式：

### 命令行（CLI）

最核心的使用方式，直接在终端中运行：

```bash
# 启动交互式会话
claude

# 单次执行
claude -p "解释这个项目的目录结构"

# 管道模式
cat error.log | claude -p "分析这些错误日志"
```

### IDE 集成

- **VS Code** —— 通过扩展在编辑器中使用
- **JetBrains** —— 支持 IntelliJ、WebStorm 等

### GitHub 集成

```bash
# 作为 PR Review 助手
claude pr review

# 在 GitHub Actions 中使用
# 自动审查代码、修复 lint 问题等
```

### SDK 集成

```typescript
// 在你的应用中集成 Claude Code
import { ClaudeCode } from "@anthropic-ai/claude-code";

const cc = new ClaudeCode();
const result = await cc.run("分析这个项目的安全漏洞");
```

## 工作原理

Claude Code 的工作流程可以简化为一个循环：

```
      ┌─────────────────────────┐
      │     你输入一个请求       │
      └───────────┬─────────────┘
                  ↓
      ┌─────────────────────────┐
      │   Claude 分析并制定计划   │
      └───────────┬─────────────┘
                  ↓
      ┌─────────────────────────┐
      │    调用工具执行操作       │
      │  (读文件/写文件/运行命令)  │
      └───────────┬─────────────┘
                  ↓
      ┌─────────────────────────┐
      │    观察结果，决定下一步    │←─┐
      └───────────┬─────────────┘  │
                  ↓                │
           完成了？ ──── 否 ───────┘
                  │
                 是
                  ↓
      ┌─────────────────────────┐
      │      返回最终结果        │
      └─────────────────────────┘
```

这就是 Agent 模式——Claude 不只是给你建议，它会**实际动手**，在你的环境中执行操作，直到任务完成。

## 安全模型

Claude Code 运行在你的本地环境中，这意味着：

- **你的代码不会被存储** —— 代码只在对话期间被处理
- **操作需要授权** —— 危险操作会先征求你的同意
- **你有完全控制权** —— 可以随时拒绝任何操作

::: warning 安全提醒
虽然 Claude Code 有权限控制机制，但你应该始终检查它的操作，特别是涉及文件删除、Git push、数据库修改等不可逆操作。
:::

## 小结

Claude Code 是：
- 一个运行在终端中的 **AI Agent**
- 能理解整个代码库，不仅是当前文件
- 可以读写文件、执行命令、管理 Git
- 通过 MCP 协议扩展连接更多工具
- 安全可控，所有操作需要你的授权

它代表了一种新的编程范式：**你负责思考"做什么"，AI 负责实现"怎么做"。**

---

> 上一篇：[AI 基础概念](./ai-concepts.md)
>
> 下一篇：[安装与配置](./installation.md)
