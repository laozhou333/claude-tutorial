# 斜杠命令大全

Claude Code 提供了丰富的斜杠命令（Slash Commands），在交互式会话中输入 `/` 即可触发自动补全。本文按功能分类列出所有可用命令。

:::tip 快速查找
在 Claude Code 中输入 `/` 后，会自动弹出命令列表，支持模糊搜索。你也可以按 `Tab` 键补全命令。
:::

## 会话管理

管理当前会话的生命周期、分支和导出。

| 命令 | 别名 | 说明 | 用法示例 |
|------|------|------|----------|
| `/clear` | - | 清空当前会话的所有上下文，重新开始对话 | `/clear` |
| `/resume` | - | 恢复之前的会话，可从列表中选择或指定会话 ID | `/resume` |
| `/branch` | - | 从当前对话创建一个分支，保留上下文但独立发展 | `/branch` |
| `/rename` | - | 重命名当前会话，方便后续查找 | `/rename 重构登录模块` |
| `/compact` | - | 压缩当前会话上下文，在保留关键信息的同时减少 token 消耗 | `/compact` |
| `/recap` | - | 自动生成上次对话的上下文摘要，帮你快速回忆进度 | `/recap` |
| `/focus` | - | 进入专注模式，只显示每轮最终消息，隐藏推理过程 | `/focus` |
| `/tui` | - | 切换终端渲染模式（内联 / 全屏无闪烁） | `/tui fullscreen` |
| `/rewind` | `/undo` | 回退到会话中的某个历史节点，撤销后续的对话 | `/rewind` |
| `/export` | - | 将当前会话导出为 Markdown 或 JSON 格式 | `/export` |

:::warning 注意
`/clear` 会彻底清除所有上下文，无法恢复。如果只是想减少 token 用量，建议使用 `/compact`。
:::

### 常见场景

**会话过长时压缩上下文：**
```
/compact
```
当会话 token 接近上限时，`/compact` 会智能总结之前的对话内容，释放 token 空间。你也可以附加自定义提示来引导压缩方向：
```
/compact 重点保留数据库相关的讨论
```

**恢复昨天的工作：**
```
/resume
```
系统会列出最近的会话记录，选择后即可从上次中断的地方继续。

## 代码与输出

操作代码片段和输出内容。

| 命令 | 别名 | 说明 | 用法示例 |
|------|------|------|----------|
| `/copy` | - | 将上一条 Claude 回复的内容复制到系统剪贴板 | `/copy` |
| `/diff` | - | 显示当前会话中所有文件变更的 diff 视图 | `/diff` |

:::tip 实用技巧
`/diff` 在你让 Claude 修改了多个文件后特别有用，可以一次性查看所有改动，确认无误后再提交。
:::

## 分析调试

获取会话状态、费用、性能等诊断信息。

| 命令 | 别名 | 说明 | 用法示例 |
|------|------|------|----------|
| `/context` | - | 查看当前会话的上下文窗口使用情况 | `/context` |
| `/cost` | - | 显示当前会话的 token 消耗和费用统计 | `/cost` |
| `/stats` | - | 查看会话统计信息，包括消息数、工具调用次数等 | `/stats` |
| `/insights` | - | 获取 Claude 对当前项目的洞察和建议 | `/insights` |
| `/doctor` | - | 运行诊断检查，排查配置和环境问题 | `/doctor` |

### 常见场景

**监控费用：**
```
/cost
```
实时查看当前会话已消耗的 token 数量和预估费用，帮助你控制使用成本。

**排查问题：**
```
/doctor
```
当 Claude Code 表现异常时，`/doctor` 会检查 API 连接、配置文件、权限设置等常见问题。

## 模型控制

切换模型、调整推理强度。

| 命令 | 别名 | 说明 | 用法示例 |
|------|------|------|----------|
| `/model` | - | 切换当前使用的模型，或进入 Auto Mode | `/model auto` |
| `/effort` | - | 设置模型的推理努力程度（low/medium/high/xhigh/max），不带参数打开交互选择器 | `/effort xhigh` |
| `/fast` | - | 快速切换到 Haiku 等轻量模型，适合简单任务 | `/fast` |
| `/btw` | - | 发送一条不影响主要任务上下文的附带消息 | `/btw 顺便帮我检查下拼写` |

:::tip 省钱技巧
对于简单的代码格式化、拼写检查等任务，使用 `/fast` 切换到轻量模型可以大幅降低费用。完成后再切回高性能模型继续复杂任务。
:::

### 推理努力程度

`/effort` 控制模型思考的深度：

- **low** — 快速回答，适合简单问题
- **medium** — 默认平衡模式
- **high** — 深度思考，适合复杂推理和架构设计
- **xhigh** — 仅 Opus 4.7，适合大型重构和多文件改动
- **max** — 仅 Opus 4.7，最大化思考深度（成本显著更高）

v2.1.111 起，输入 `/effort` 不带参数会打开**交互式滑块**，方向键选择后 Enter 确认。详见 [Effort 等级与 Opus 4.7](/zh/guide/effort-levels)。

```
/effort high
```

## 配置

调整 Claude Code 的行为、外观和权限。

| 命令 | 别名 | 说明 | 用法示例 |
|------|------|------|----------|
| `/config` | - | 打开或修改 Claude Code 配置 | `/config` |
| `/theme` | - | 切换界面主题（亮色/暗色/自定义） | `/theme` |
| `/vim` | - | 切换 Vim 编辑模式 | `/vim` |
| `/keybindings` | - | 查看或修改快捷键绑定 | `/keybindings` |
| `/permissions` | - | 管理工具和文件访问权限 | `/permissions` |
| `/memory` | - | 查看或编辑 CLAUDE.md 记忆文件 | `/memory` |
| `/init` | - | 在当前项目中初始化 CLAUDE.md 文件 | `/init` |
| `/add-dir` | - | 添加额外的工作目录到当前会话 | `/add-dir ../shared-lib` |

### 常见场景

**初始化项目配置：**
```
/init
```
在新项目中运行 `/init`，Claude 会分析项目结构并生成一份 `CLAUDE.md` 文件，包含项目约定、技术栈、编码规范等信息。

**添加关联目录：**
```
/add-dir ../common-utils
```
当你的项目依赖其他目录中的代码时，使用 `/add-dir` 让 Claude 也能访问这些文件。

:::warning 权限管理
使用 `/permissions` 可以精细控制 Claude 对文件系统和工具的访问权限。建议在团队项目中合理配置权限，避免误操作。
:::

## 集成

管理 MCP 服务器、插件和外部集成。

| 命令 | 别名 | 说明 | 用法示例 |
|------|------|------|----------|
| `/mcp` | - | 管理 MCP（Model Context Protocol）服务器连接 | `/mcp` |
| `/plugin` | - | 管理已安装的插件 | `/plugin` |
| `/install-github-app` | - | 安装 Claude Code GitHub App 以启用 PR 审查等功能 | `/install-github-app` |
| `/pr-comments` | - | 查看和回复当前 PR 上的评论 | `/pr-comments` |
| `/hooks` | - | 管理生命周期钩子（如 pre-commit、post-edit 等） | `/hooks` |
| `/skills` | - | 查看和管理已加载的技能（Skills） | `/skills` |

### 常见场景

**配置 MCP 服务器：**
```
/mcp
```
MCP 服务器为 Claude 提供额外的工具和数据源。例如连接数据库、API 文档服务等。

**查看 PR 评论：**
```
/pr-comments
```
在 code review 场景中，直接在 Claude Code 里查看和回复 GitHub PR 评论。

## 账户

管理认证和订阅状态。

| 命令 | 别名 | 说明 | 用法示例 |
|------|------|------|----------|
| `/login` | - | 登录 Claude Code 账户 | `/login` |
| `/logout` | - | 登出当前账户 | `/logout` |
| `/status` | - | 查看当前登录状态和账户信息 | `/status` |
| `/usage` | - | 查看当前计费周期的用量统计 | `/usage` |
| `/upgrade` | - | 升级到 Max 计划以获得更高用量上限 | `/upgrade` |

:::tip 用量监控
定期使用 `/usage` 检查用量，避免超出额度。对于高频使用者，建议考虑 `/upgrade` 到 Max 计划。
:::

## 其他

辅助功能和杂项命令。

| 命令 | 别名 | 说明 | 用法示例 |
|------|------|------|----------|
| `/help` | - | 显示帮助信息和可用命令列表 | `/help` |
| `/exit` | - | 退出 Claude Code | `/exit` |
| `/plan` | - | 创建或查看执行计划，不立即执行 | `/plan 重构用户认证模块` |
| `/loop` | `/proactive` | 按周期或让模型自定节奏重复执行某个提示 | `/loop 5m /check-ci` |
| `/schedule` | - | 创建定时任务，按 cron 表达式运行 | `/schedule` |
| `/tasks` | - | 查看后台任务和定时任务的状态 | `/tasks` |
| `/less-permission-prompts` | - | 扫描会话历史，自动生成只读命令允许清单 | `/less-permission-prompts` |
| `/team-onboarding` | - | 根据你的使用习惯生成团队新成员 ramp-up 指南 | `/team-onboarding` |
| `/mobile` | - | 生成移动端连接二维码 | `/mobile` |
| `/ide` | - | 切换到 IDE 集成模式 | `/ide` |
| `/desktop` | - | 切换到桌面应用模式 | `/desktop` |
| `/feedback` | - | 向 Anthropic 发送反馈 | `/feedback` |

### 常见场景

**先规划再执行：**
```
/plan 将整个项目从 JavaScript 迁移到 TypeScript
```
`/plan` 会让 Claude 先制定详细的执行方案，你确认后再逐步实施，适合大型重构任务。

**创建定时任务：**
```
/schedule
```
设置定时运行的自动化任务，例如每天早上自动检查依赖更新。

## v2.1 新增命令速览

Claude Code 在 v2.1.100 之后密集新增了一批命令，下面整理成一张速查表。

| 新命令 | 引入版本 | 用途 |
|--------|---------|------|
| `/recap` | 2.1.108 | 自动摘要上次对话进度 |
| `/focus` | 2.1.110 | 专注模式，只看最终消息 |
| `/tui` | 2.1.110 | 切换内联 / 全屏渲染模式 |
| `/undo` | 2.1.108 | `/rewind` 的别名 |
| `/proactive` | 2.1.105 | `/loop` 的别名 |
| `/team-onboarding` | 2.1.101 | 从你的使用习惯生成新人上手指南 |
| `/less-permission-prompts` | 2.1.111 | 扫描历史并自动提议允许清单 |
| `/effort`（交互模式） | 2.1.111 | 不带参数打开方向键选择器 |

### 推荐配置

想体验所有新功能，推荐的 session 启动三件套：

```bash
# 1. 启用无闪烁渲染（永久生效）
export CLAUDE_CODE_NO_FLICKER=1

# 2. 启动后，立刻切专注模式
/focus

# 3. 让 Claude 自动选模型
/model auto
```

详见 [会话体验优化](/zh/features/session-experience)。

## 自定义斜杠命令

除了内置命令，你还可以创建自定义斜杠命令。在项目的 `.claude/commands/` 目录下创建 Markdown 文件即可：

```
.claude/commands/
  review.md        -> /project:review
  test-all.md      -> /project:test-all
  deploy.md        -> /project:deploy
```

文件内容就是发送给 Claude 的提示词模板，支持 `$ARGUMENTS` 占位符：

```markdown
<!-- .claude/commands/review.md -->
请审查以下代码的安全性和性能：

$ARGUMENTS

重点关注：
1. SQL 注入风险
2. XSS 漏洞
3. 性能瓶颈
```

使用方式：
```
/project:review src/api/auth.ts
```

:::tip 团队共享
将 `.claude/commands/` 目录提交到 Git 仓库，团队成员都能使用相同的自定义命令，确保工作流一致性。
:::

## 快速参考

| 场景 | 推荐命令 |
|------|----------|
| 会话太长，token 不够用 | `/compact` |
| 想从昨天的工作继续 | `/resume` + `/recap` |
| 查看修改了哪些文件 | `/diff` |
| 简单任务省钱 | `/fast` |
| 复杂架构设计 | `/effort xhigh` 或 `max`（Opus 4.7） |
| 排查 Claude Code 问题 | `/doctor` |
| 长会话终端信息太杂 | `/focus` |
| 终端闪烁 / 撕裂 | `/tui fullscreen` |
| 不知道用哪个模型 | `/model auto` |
| 想减少权限弹窗 | `/less-permission-prompts` |
| 新项目初始化 | `/init` |
| 大型重构前先规划 | `/plan` |
