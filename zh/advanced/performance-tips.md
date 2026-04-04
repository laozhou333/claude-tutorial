# 性能优化

随着使用深入，你会发现 Claude Code 的性能和成本与使用方式密切相关。本篇分享上下文管理、模型选择、速度优化和成本控制的实用技巧。

## 上下文管理

Context window 是 Claude Code 最宝贵的资源。管理好上下文，就是管理好效率。

### /compact — 压缩上下文

当对话变长时，context window 被历史消息填满，Claude 的回答质量会下降，响应也会变慢。

```bash
# 基础压缩
/compact

# 带提示的压缩——告诉 Claude 保留什么
/compact 保留关于数据库迁移的所有决策和 API 设计方案
```

**何时使用 /compact：**
- 对话超过 15-20 轮
- Claude 开始"忘记"之前的约定
- 切换到不同的功能模块
- 响应速度明显变慢

### /context — 查看上下文

```bash
# 查看当前上下文使用情况
/context
```

这会显示当前已使用的 token 数量和剩余空间，帮助你判断是否需要压缩。

### 何时开始新会话

有些情况下，新会话比压缩更好：

| 场景 | 建议 |
|------|------|
| 切换到完全不同的任务 | 新会话 |
| 上下文已满或接近满 | 新会话 |
| 同一功能的持续迭代 | /compact |
| 需要之前的决策上下文 | /compact |

```bash
# 结束当前会话
/exit

# 开始新会话
claude

# 或继续上一次的会话
claude --continue
```

::: tip 善用 CLAUDE.md
把重要的决策和约定写入 CLAUDE.md，这样即使开始新会话，Claude 也能自动获取这些上下文，无需重复说明。
:::

## 模型选择

不同的任务适合不同的模型。合理选择可以兼顾质量和速度。

### 可用模型

| 模型 | 特点 | 适合场景 |
|------|------|---------|
| Sonnet | 均衡，默认选择 | 日常编码、文件编辑、一般问答 |
| Opus | 最强推理 | 复杂架构设计、疑难 bug、深度分析 |
| Haiku | 最快速度 | 简单问答、格式转换、批量小修改 |

### /model — 切换模型

```bash
# 在会话中切换
/model

# Claude 会显示可用模型列表
# 选择你需要的模型
```

### --effort 标志

控制 Claude 的推理深度：

```bash
# 低 effort——快速回答
claude --effort low -p "这个文件做什么的？"

# 高 effort——深度分析
claude --effort high -p "分析这个系统的安全隐患"
```

| Effort | 速度 | 质量 | 适合 |
|--------|------|------|------|
| `low` | 快 | 一般 | 简单查询、代码解释 |
| `medium` | 中等 | 好 | 默认，日常开发 |
| `high` | 慢 | 最佳 | 复杂推理、架构设计 |

## 速度优化

### /fast 模式

在会话中快速切换到更快的响应模式：

```bash
# 开启快速模式（自动切换到 Haiku 或降低 effort）
> 用 /model 切换到 Haiku 处理批量任务
```

### --max-turns 控制

限制 Claude 的最大交互轮数，避免陷入无限循环：

```bash
# 限制为 5 轮交互
claude --max-turns 5 -p "修复 src/api/auth.ts 中的 bug"
```

::: tip 非交互式任务
对于 CI/CD 或脚本调用，始终设置 `--max-turns` 防止意外的长时间运行。大型 PR 审查可能需要 50-100 轮。
:::

### 提示词优化

精准的提示词可以减少来回交互，加快完成速度：

```bash
# ❌ 慢：需要多轮对话才能明确需求
> 帮我改一下那个接口

# ✅ 快：一轮就能开始工作
> 修改 @src/api/users.ts 的 GET /users 接口：
> 添加分页参数 page 和 limit，默认 page=1, limit=20，
> 返回值增加 total 和 hasMore 字段
```

### 使用 @ 引用减少搜索

直接用 `@` 引用文件，避免 Claude 花时间搜索：

```bash
# ❌ Claude 需要先搜索文件
> 帮我看看用户认证的代码有没有问题

# ✅ 直接定位
> 检查 @src/middleware/auth.ts 和 @src/lib/jwt.ts 的安全性
```

## 成本控制

### --max-budget-usd

设置会话的最大预算，防止意外超支：

```bash
# 限制本次会话最多花费 5 美元
claude --max-budget-usd 5

# 用于 CI/CD 场景
claude --max-budget-usd 2 --max-turns 20 -p "审查这个 PR"
```

### Token 高效提示

减少不必要的 token 消耗：

```bash
# 查看当前花费
/cost
```

**省 token 的技巧：**

1. **用 @ 引用代替描述** — 让 Claude 直接读文件，而非你粘贴代码
2. **及时 /compact** — 释放被旧对话占用的空间
3. **精准的提示词** — 减少来回澄清
4. **适时开新会话** — 避免拖着巨大的上下文做简单任务
5. **选对模型** — 简单任务用 Haiku，复杂任务才用 Opus

### 成本估算参考

| 操作 | 大约消耗 |
|------|---------|
| 简单问答 | < $0.01 |
| 修改单个文件 | $0.01 - $0.05 |
| 多文件功能开发 | $0.05 - $0.30 |
| 完整 PR 审查 | $0.10 - $0.50 |
| 大型重构 | $0.50 - $2.00 |

::: tip 观察 /cost
养成定期检查 `/cost` 的习惯，了解不同类型任务的实际消耗，有助于优化使用策略。
:::

## 使用 Agent 并行工作

对于可以并行的独立任务，使用多个 agent 同时工作：

```bash
# 在不同的终端窗口启动多个 Claude Code 会话
# 终端 1：处理前端
claude -p "重构 src/components/ 下的表格组件"

# 终端 2：处理后端
claude -p "优化 src/api/ 下的数据库查询"

# 终端 3：处理测试
claude -p "给 src/services/ 补充单元测试"
```

也可以使用 Git Worktrees 实现隔离的并行开发：

```bash
# 创建 worktree 进行隔离开发
# 在 Claude Code 中
> 创建一个 worktree 来处理用户模块重构
```

::: warning 注意资源消耗
每个 Claude Code 会话都独立消耗 API 额度。并行运行多个会话时注意监控总成本。
:::

## 小结

| 优化方向 | 关键操作 |
|---------|---------|
| 上下文 | `/compact`、适时新会话、CLAUDE.md 沉淀 |
| 模型 | 按任务选模型、调整 effort |
| 速度 | @ 引用、精准提示、`--max-turns` |
| 成本 | `--max-budget-usd`、`/cost` 监控、省 token 技巧 |
| 并行 | 多终端、Git Worktrees |

---

上一篇：[自定义 Skills 开发 ←](/zh/advanced/custom-skills) | 下一篇：[常见问题 →](/zh/advanced/troubleshooting)
