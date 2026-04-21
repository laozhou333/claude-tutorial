# 会话体验优化：Recap / Focus / TUI

Claude Code 不只是一个聊天框——v2.1 系列围绕"如何让长会话更顺手"做了大量优化。本文汇总 **Recap**（自动总结）、**Focus**（专注模式）、**TUI Fullscreen**（全屏模式）三大新能力。

## Recap — 回到会话自动总结

### 痛点

你昨晚和 Claude 一起重构了半天，今天早上 `claude --resume` 回到会话——滚动 2000 行才能找到"我们刚才到哪了？"。

### Recap 怎么工作

从 v2.1.108 起，Claude Code 内置 **Recap 功能**：回到会话时自动生成上下文摘要。

```bash
claude --resume

┌─────────────────────────────────────────────┐
│  📋 Recap — 上次对话重点                     │
├─────────────────────────────────────────────┤
│  • 完成了 auth 模块 JWT 迁移                 │
│  • 修复了 src/api/users.ts 的分页 bug        │
│  • 待办：给 refresh token 补单测             │
│  • 关键决策：使用 HS256 而非 RS256            │
└─────────────────────────────────────────────┘

准备好继续了吗？
```

### 手动触发

```bash
# 随时在会话中获取摘要
/recap

# 关闭后重新生成
/recap --fresh
```

### 在 /config 中开关

```bash
/config

# 找到 "Session Recap"
# On（默认）/ Off
```

或用环境变量：
```bash
# 禁用
export CLAUDE_CODE_ENABLE_AWAY_SUMMARY=0

# 强制启用（即使 telemetry 被关）
export CLAUDE_CODE_ENABLE_AWAY_SUMMARY=1
```

::: tip 和 /compact 的区别
`/compact` 压缩历史对话来省 token；`/recap` 是**只读**的摘要，不改变上下文内容。两者可以一起用。
:::

## Focus — 专注模式

### 痛点

长会话中，你只想看 Claude 最后那条回复，但终端里堆满了工具调用、bash 输出、思考过程——信息密度太低。

### Focus 模式做了什么

```bash
/focus
```

进入 Focus Mode 后：
- 工具调用折叠成一行（只显示 `✓ Read src/auth.ts`）
- Thinking 过程完全隐藏
- 每轮只保留 Claude 的最终消息
- 系统状态行、队列消息仍然可见

对比：

```
普通模式（14 行）               Focus 模式（3 行）
━━━━━━━━━━━━━━━━━━━━━━         ━━━━━━━━━━━━━━━━━━━━━━
Claude: 我来帮你改这个 bug       ✓ Read 3 files
  🤔 Thinking...                  ✓ Edit src/auth.ts
    → 需要先读懂 auth 逻辑        已修复，JWT 验证现在会
    → 定位到 line 42                正确处理过期 token
  Read src/auth.ts
    ...80 行代码...
  Edit src/auth.ts
    - if (token.exp < now)
    + if (token.exp < now - skew)
    ...
Claude: 已修复，JWT 验证...
```

### 何时该用

| 场景 | 是否用 Focus |
|------|-------------|
| 代码 review 式的检查 | ✅ 用 Focus |
| 长会话只看结果 | ✅ 用 Focus |
| 后台跑任务，定时查看 | ✅ 用 Focus |
| 学习 Claude 的推理过程 | ❌ 用普通模式 |
| 调试 Claude 为什么做错 | ❌ 用普通模式 |
| 需要干预每步 | ❌ 用普通模式 |

### 切换

```bash
# 开启
/focus

# 关闭
/focus off

# 临时看详细输出（单次）
Ctrl+O    # 显示详细 transcript
```

::: info Focus + Auto Mode
Focus 模式下 Claude 会**主动写更完整的总结**——它知道你只看最后一条消息。所以搭配 Auto Mode 长会话特别省心。
:::

## TUI Fullscreen — 全屏无闪烁

### 痛点

你的终端在大模型流式输出、选中文本时，会出现：
- 闪烁、撕裂
- 重复的旧内容
- 选中文本时 CPU 占用飙升

### TUI Fullscreen 解决了什么

v2.1.110 引入 **TUI 模式**，使用 alternate screen buffer + synchronized output，消除大部分终端渲染问题。

```bash
# 切到全屏模式
/tui fullscreen

# 切回内联模式
/tui inline

# 查看当前状态
/tui
```

### 两种模式对比

| 特性 | Inline（默认） | Fullscreen |
|------|---------------|------------|
| 渲染方式 | 嵌入终端滚动历史 | 接管整个终端画面 |
| 闪烁/撕裂 | 常见 | 几乎消除 |
| 退出后保留历史 | 是 | 否（画面会恢复） |
| 终端 scrollback | 可滚动查看 | 需 `[` 键 dump 到 scrollback |
| 推荐人群 | 临时任务 | 长会话重度用户 |

### 配合快捷键

Fullscreen 模式下新增：

| 快捷键 | 作用 |
|--------|------|
| `[` | 把当前 transcript dump 到终端 scrollback |
| `v` | 在外部编辑器打开当前 transcript |
| `Shift+↑/↓` | 滚动查看历史 |
| `Ctrl+O` | 切换详细 / 简洁视图 |
| `Esc` 长按 | 退出 Fullscreen 回到 Inline |

### NO_FLICKER 环境变量

如果你想**永久**启用无闪烁渲染：

```bash
# 在 ~/.zshrc 或 ~/.bashrc 中
export CLAUDE_CODE_NO_FLICKER=1
```

这会让 Claude Code 启动时默认进入无闪烁模式（不需要每次 `/tui fullscreen`）。

::: tip 推荐组合
长会话用户推荐：`CLAUDE_CODE_NO_FLICKER=1` + `/focus` + `/model auto`——三件套打完体验丝滑。
:::

### 适配的终端

| 终端 | Fullscreen 兼容性 |
|------|-----------------|
| iTerm2 | ✅ 完美 |
| Ghostty | ✅ 完美 |
| Kitty | ✅ 完美 |
| Warp | ✅ 完美 |
| WezTerm | ✅ 完美 |
| VS Code 终端 | ✅ 已修复 v2.1.116 |
| Cursor 终端 | ✅ 已修复 v2.1.116 |
| macOS Terminal.app | ⚠️ 可用，偶有渲染问题 |
| Windows Terminal | ✅ 基本兼容 |

## 三者如何配合

### 推荐配置：深度工作模式

```bash
# 1. 全屏 + 无闪烁
/tui fullscreen

# 2. 专注看结果
/focus

# 3. 让 Claude 自己选模型
/model auto

# 4. 开始工作
> 帮我重构 src/payment 整个目录
```

效果：
- 终端不闪烁
- 每轮只看最后的摘要
- 复杂任务 Claude 自动用 Opus 4.7
- 离开回来 `/recap` 秒回状态

### 推荐配置：学习调试模式

```bash
/tui inline      # 保留滚动历史
/focus off       # 展示完整推理过程
Ctrl+O           # 必要时切详细 transcript
```

想看 Claude 怎么思考时用这套。

## 其他相关改进

### 队列消息可见性

v2.1.110 起，在 Claude 工作时输入的消息会在队列中**可见**，不会被 Focus 模式隐藏。你随时看得到"我接下来会问什么"。

### Ctrl+L 强制重绘

终端出现渲染异常时：

```
Ctrl+L    # 强制重绘整个屏幕
```

不会清除会话内容，只是刷新显示。

### Ctrl+U / Ctrl+Y

v2.1.111 起行为变化：

| 快捷键 | 新行为 |
|--------|-------|
| `Ctrl+U` | 清空整个输入缓冲区 |
| `Ctrl+Y` | 撤销上一次 Ctrl+U（恢复被清空的内容） |

之前 `Ctrl+U` 只删除光标到行首的部分，现在行为更接近 shell 标准。

## 小结

| 功能 | 命令 | 解决什么 |
|------|------|---------|
| Recap | `/recap` | 回到会话不记得上次做了啥 |
| Focus | `/focus` | 长会话终端信息过载 |
| TUI Fullscreen | `/tui fullscreen` | 终端闪烁/撕裂 |
| NO_FLICKER | 环境变量 | 永久无闪烁 |

**推荐三件套：** `NO_FLICKER=1` + `/focus` + `/model auto`。开一次，用一年。

---

上一篇：[Auto Mode ←](/zh/features/auto-mode) | 下一篇：[MCP Servers →](/zh/features/mcp-servers)
