# 安装与配置

本篇将指导你在不同操作系统上安装 Claude Code，完成身份验证，并确认环境配置正确。

## 环境要求

在安装 Claude Code 之前，请确保你的系统满足以下要求：

| 依赖 | 最低版本 | 检查命令 |
|------|---------|---------|
| Node.js | 18.0+ | `node --version` |
| Git | 2.0+ | `git --version` |
| 操作系统 | macOS / Linux / Windows | - |

::: warning 重要前提
Claude Code 需要 **Node.js 18 或更高版本**。如果你还没安装 Node.js，推荐使用 [nvm](https://github.com/nvm-sh/nvm) 来管理版本：

```bash
# 安装 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash

# 安装最新 LTS 版本的 Node.js
nvm install --lts

# 验证
node --version  # 应该 >= 18.0.0
```
:::

## 安装 Claude Code

### macOS

**方式一：官方安装脚本（推荐）**

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

**方式二：Homebrew**

```bash
brew install claude-code
```

**方式三：npm 全局安装**

```bash
npm install -g @anthropic-ai/claude-code
```

### Linux

**方式一：官方安装脚本（推荐）**

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

**方式二：npm 全局安装**

```bash
npm install -g @anthropic-ai/claude-code
```

::: tip Linux 用户注意
如果遇到权限问题，不要使用 `sudo npm install -g`。推荐配置 npm 的全局安装路径：

```bash
mkdir -p ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```
:::

### Windows

**方式一：PowerShell 安装脚本（推荐）**

以管理员身份打开 PowerShell，运行：

```powershell
irm https://claude.ai/install.ps1 | iex
```

**方式二：npm 全局安装**

```powershell
npm install -g @anthropic-ai/claude-code
```

::: info Windows 用户须知
Claude Code 在 Windows 上推荐使用 **WSL 2**（Windows Subsystem for Linux）来获得最佳体验。原生 Windows 终端也支持，但某些功能可能受限。

```powershell
# 安装 WSL 2
wsl --install

# 在 WSL 中安装 Claude Code
curl -fsSL https://claude.ai/install.sh | bash
```
:::

## 验证安装

安装完成后，验证 Claude Code 是否正确安装：

```bash
# 检查版本
claude --version

# 运行诊断工具
claude doctor
```

`claude doctor` 会检查以下内容：

```
✅ Node.js version: 22.0.0
✅ Git version: 2.45.0
✅ Claude Code version: 1.0.24
✅ Authentication: configured
✅ Network connectivity: ok
✅ MCP servers: 0 configured
```

如果有任何项目显示 ❌，按照提示修复即可。

## 身份验证

Claude Code 需要登录你的 Anthropic 账号才能使用。

### 交互式登录（推荐）

```bash
claude auth login
```

这会打开浏览器，引导你完成 OAuth 登录流程：

```
? Select authentication method:
> Anthropic (claude.ai account)
  API Key

Opening browser for authentication...
✅ Successfully authenticated as user@example.com
```

### 使用 API Key

如果你偏好使用 API Key：

```bash
# 方式一：交互式输入
claude auth login
# 选择 "API Key"，然后输入你的 key

# 方式二：环境变量
export ANTHROPIC_API_KEY="sk-ant-xxxxx"
```

::: warning 安全提示
- 不要将 API Key 硬编码在代码中
- 不要将包含 API Key 的 `.env` 文件提交到 Git
- 推荐将 API Key 存放在环境变量或密钥管理工具中
:::

### 验证登录状态

```bash
# 检查当前登录状态
claude auth status

# 输出示例
# Authenticated as: user@example.com
# Plan: Pro
# Token usage this month: 12,345 / 500,000
```

## 首次配置

### 选择默认模型

Claude Code 支持多种模型，你可以根据需求选择：

```bash
# 在交互式会话中切换模型
> /model

# 或在启动时指定
claude --model claude-sonnet-4-20250514
```

| 模型 | 特点 | 适用场景 |
|------|------|---------|
| Claude Sonnet | 快速、经济 | 日常编码、简单任务 |
| Claude Opus | 深度思考、高质量 | 复杂架构、调试 |

### 配置 CLAUDE.md

`CLAUDE.md` 是 Claude Code 的项目配置文件，用于告诉 Claude 你的项目约定：

```bash
# 在项目根目录创建
touch CLAUDE.md
```

写入你的项目规范：

```markdown
# 项目约定

## 技术栈
- 前端：React + TypeScript + Tailwind CSS
- 后端：Node.js + Hono + Drizzle ORM
- 数据库：PostgreSQL

## 代码风格
- 使用 ESLint + Prettier
- 组件使用函数式组件
- 文件命名使用 kebab-case

## Git 规范
- commit message 使用 conventional commits
- PR 需要包含测试
```

::: tip 关于 CLAUDE.md
CLAUDE.md 支持多层级配置：
- `~/.claude/CLAUDE.md` —— 全局配置，所有项目生效
- `项目根目录/CLAUDE.md` —— 项目级配置
- `子目录/CLAUDE.md` —— 目录级配置，覆盖上级

Claude 会自动加载并合并这些配置。
:::

### 配置文件路径

Claude Code 的配置文件位于 `~/.claude/` 目录下：

```
~/.claude/
├── CLAUDE.md          # 全局提示词
├── settings.json      # 全局设置
├── credentials.json   # 认证信息（自动管理）
└── projects/          # 项目级配置
    └── <project-hash>/
        ├── CLAUDE.md  # 项目记忆
        └── settings.json
```

## 常见安装问题

### 问题：`command not found: claude`

```bash
# 检查 npm 全局路径
npm config get prefix

# 确认路径在 PATH 中
echo $PATH

# 手动添加（以 macOS/Linux 为例）
echo 'export PATH="$(npm config get prefix)/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### 问题：Node.js 版本过低

```bash
# 使用 nvm 升级
nvm install --lts
nvm use --lts

# 确认版本
node --version
```

### 问题：网络连接失败

```bash
# 检查是否能访问 Anthropic API
curl -I https://api.anthropic.com

# 如果需要代理
export HTTPS_PROXY="http://your-proxy:port"
```

### 问题：权限不足（Linux/macOS）

```bash
# 不要用 sudo，改用以下方式
mkdir -p ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
```

## 快速验证清单

安装完成后，确认以下所有项目都通过：

```bash
# 1. Claude Code 已安装
claude --version  ✓

# 2. 已登录
claude auth status  ✓

# 3. 诊断通过
claude doctor  ✓

# 4. 能启动会话
claude  ✓
# 输入 "hello" 测试，看到回复即表示一切正常
# 输入 /exit 退出
```

全部通过后，你就可以开始使用 Claude Code 了！

---

> 上一篇：[什么是 Claude Code](./what-is-claude-code.md)
>
> 下一篇：[第一次对话](./first-session.md)
