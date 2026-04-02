# 第一次对话

安装完成后，是时候开始你与 Claude Code 的第一次交互了。本篇将带你了解基本操作，让你快速上手。

## 启动 Claude Code

### 交互式会话

在终端中，进入你的项目目录，然后启动 Claude Code：

```bash
cd ~/my-project
claude
```

你会看到类似这样的界面：

```
╭──────────────────────────────────────────╮
│  Claude Code v1.0.24                      │
│  Model: claude-sonnet-4-20250514         │
│  Context: ~/my-project                    │
│                                          │
│  Type your message or /help for commands  │
╰──────────────────────────────────────────╯

>
```

### 单次执行

如果你只需要快速获取一个答案，不想进入交互式会话：

```bash
# -p 参数表示单次执行（print mode）
claude -p "这个项目用了什么框架？"

# 结合管道使用
cat package.json | claude -p "分析这个项目的依赖"
```

### 继续上一次对话

```bash
# 恢复最近一次对话
claude --continue

# 简写形式
claude -c
```

## 基本对话

### 提问与回答

直接用自然语言与 Claude 对话：

```bash
> 这个项目是做什么的？

Claude: 根据项目结构和 package.json 分析，这是一个...
  - 前端使用 React + TypeScript
  - 后端使用 Express
  - 数据库使用 PostgreSQL
  ...
```

### 关于代码的对话

```bash
# 解释代码
> src/auth/middleware.ts 这个文件是做什么的？

# 查找问题
> 帮我检查 src/api/routes.ts 中有没有安全隐患

# 提出改进
> 如何优化 src/utils/parser.ts 的性能？
```

## 文件操作

### 使用 @ 引用文件

`@` 符号可以将文件内容直接引入上下文：

```bash
# 引用单个文件
> 看一下 @src/config.ts 有什么问题

# 引用多个文件
> 对比 @src/old-api.ts 和 @src/new-api.ts 的差异

# 引用目录（Claude 会浏览目录结构）
> @src/components/ 这些组件的命名规范一致吗？
```

::: tip @ 引用的好处
使用 `@` 引用文件可以精确地将文件内容加入上下文窗口，比让 Claude 自己去搜索更高效、更准确。当你知道要讨论哪些文件时，始终使用 `@` 引用。
:::

### 创建文件

```bash
> 在 src/utils/ 下创建一个 date-formatter.ts 文件，
  包含常用的日期格式化函数

Claude:
  我来创建这个文件。

  ✏️ Creating src/utils/date-formatter.ts
  ┌─────────────────────────────────────┐
  │ export function formatDate(...) {   │
  │   ...                               │
  │ }                                   │
  └─────────────────────────────────────┘

  Allow this edit? [y/n/e]
```

### 编辑文件

```bash
> 在 @src/types/user.ts 中添加一个 email 字段，类型为 string

Claude:
  ✏️ Editing src/types/user.ts
  ┌─────────────────────────────────────┐
  │  interface User {                   │
  │    id: string;                      │
  │    name: string;                    │
  │+   email: string;                   │
  │  }                                  │
  └─────────────────────────────────────┘

  Allow this edit? [y/n/e]
```

::: info 编辑确认
默认情况下，Claude 的每一次文件编辑都需要你确认。你可以按：
- `y` —— 接受编辑
- `n` —— 拒绝编辑
- `e` —— 在编辑器中手动调整
:::

## 执行命令

### 使用 ! 前缀

在对话中用 `!` 前缀直接运行 bash 命令：

```bash
# 运行命令
> !npm test

# 查看文件
> !ls -la src/

# 检查 Git 状态
> !git status
```

### 让 Claude 执行命令

你也可以用自然语言让 Claude 来执行命令：

```bash
> 运行测试看看有没有失败的

Claude:
  🔧 Running: npm test

  Tests: 23 passed, 2 failed

  失败的测试:
  1. UserService.create - 邮箱验证未通过
  2. AuthMiddleware.verify - token 过期处理错误

  要我修复这两个测试吗？

> 好的，修复它们
```

::: warning 命令执行安全
Claude 在执行可能有副作用的命令（如 `rm`、`git push` 等）时会先征求你的同意。在你确认之前，命令不会被执行。
:::

## 常用命令

Claude Code 内置了一些以 `/` 开头的斜杠命令：

### 基本命令

```bash
/help          # 显示帮助信息
/exit          # 退出当前会话
/clear         # 清除对话历史
/compact       # 压缩上下文（保留要点，释放空间）
/model         # 切换 AI 模型
/status        # 查看当前状态
```

### 高级命令

```bash
/init          # 初始化项目的 CLAUDE.md
/cost          # 查看本次会话的 Token 消耗
/memory        # 管理项目记忆
/config        # 打开配置
```

### 快捷键

| 快捷键 | 功能 |
|--------|------|
| `Enter` | 发送消息 |
| `Shift + Enter` | 换行（多行输入） |
| `Shift + Tab` | 切换权限模式 |
| `Ctrl + C` | 中断当前操作 |
| `Ctrl + D` | 退出会话 |
| `Esc` | 取消当前输入 |

::: tip 多行输入
当你需要输入较长的提示词时，使用 `Shift + Enter` 来换行，这样可以组织更清晰的多行指令。
:::

## 理解工具调用

当 Claude 需要执行操作时，它会使用**工具调用**（Tool Use）。你会看到类似这样的输出：

```bash
> 帮我分析这个项目的目录结构

Claude:
  🔍 Reading directory: ./
  🔍 Reading file: package.json
  🔍 Reading file: tsconfig.json
  🔍 Running: find src -name "*.ts" | head -20

  根据分析，这个项目的结构如下：
  ...
```

常见的工具调用类型：

| 图标 | 工具 | 说明 |
|------|------|------|
| 🔍 | Read | 读取文件内容 |
| ✏️ | Write/Edit | 创建或编辑文件 |
| 🔧 | Bash | 执行终端命令 |
| 🔎 | Grep/Glob | 搜索文件内容或文件名 |
| 📋 | List | 列出目录内容 |

## 高效使用技巧

### 1. 提供足够的上下文

```bash
# 不好
> 帮我修 bug

# 好
> 用户反馈注册时如果邮箱包含加号(+)就报错，
  相关文件在 @src/validators/email.ts，
  帮我修复并添加测试用例
```

### 2. 善用 @ 引用

```bash
# 让 Claude 参考现有代码风格
> 参考 @src/api/users.ts 的风格，创建一个 @src/api/products.ts
```

### 3. 分步骤完成复杂任务

```bash
> 先帮我分析 @src/database/ 目录下的数据模型
> 基于分析结果，帮我添加一个 orders 表
> 为 orders 表创建 CRUD API
```

### 4. 利用 /compact 管理长对话

```bash
# 当对话变长时，压缩上下文释放空间
> /compact
```

## 小结

本篇你学会了：
- 启动和退出 Claude Code 会话
- 基本对话和文件操作
- 使用 `@` 引用文件、`!` 执行命令
- 斜杠命令和快捷键
- 理解工具调用
- 高效使用的技巧

Claude Code 的核心体验就是**自然语言驱动的编程**——你只需要描述需求，剩下的交给 Claude。

---

> 上一篇：[安装与配置](./installation.md)
>
> 下一篇：[权限系统](./permission-system.md)
