# Effort 等级与 Opus 4.7

Claude Code 不只是选"哪个模型"，还能选"模型想多深"。**Effort 等级**让你在速度和智力之间精确调整，搭配最新的 **Opus 4.7** 模型，你可以根据任务复杂度切换到最合适的思考深度。

## 什么是 Effort

Effort 控制 Claude **扩展思考（Extended Thinking）** 的深度。更高的 effort 意味着：
- 模型会进行更长的内部推理链
- 消耗更多 thinking token（计费更高）
- 响应速度更慢
- 但质量显著提升

```
Effort = 思考深度 × 时间投入 × 成本
```

::: tip 直觉理解
如果把模型比作工程师：`low` = 扫一眼就回答的直觉判断；`max` = 关门一小时认真推演的深度分析。
:::

## 五级 Effort 速查

Claude Code v2.1.116 支持五个等级：

| Effort | 适用模型 | 速度 | 质量 | 推荐场景 |
|--------|---------|------|------|---------|
| `low` | 全部 | ⚡️⚡️⚡️⚡️⚡️ | ★★ | 代码解释、简单问答、格式转换 |
| `medium` | 全部 | ⚡️⚡️⚡️⚡️ | ★★★ | 日常开发、文件编辑（默认值） |
| `high` | 全部 | ⚡️⚡️⚡️ | ★★★★ | 复杂推理、架构设计、疑难 bug |
| `xhigh` | **仅 Opus 4.7** | ⚡️⚡️ | ★★★★★ | 多文件大规模重构、深度 debug |
| `max` | **仅 Opus 4.7** | ⚡️ | ★★★★★+ | 极限难题、关键决策（成本高） |

::: warning xhigh 与 max 的限制
`xhigh` 和 `max` 只在 **Opus 4.7** 模型上生效。Sonnet、Haiku 或其他模型会自动回退到 `high`。
:::

## Opus 4.7 简介

Opus 4.7 是 Anthropic 2026 年推出的旗舰模型，也是目前 Claude Code 中推理能力最强的选择。

### 与 Sonnet / Haiku 的定位

| 模型 | 定位 | 适合 | effort 支持 |
|------|------|------|------------|
| **Haiku** | 最快 | 简单查询、批量轻任务 | low / medium / high |
| **Sonnet** | 均衡 | 日常编码（推荐默认） | low / medium / high |
| **Opus 4.7** | 最强 | 复杂推理、大规模变更 | **low ~ max** 全支持 |

### 1M Context 版本

部分订阅计划提供 **"Opus 4.7 with 1M context"** 选项——一次可以阅读百万 token 的代码。适合：
- 超大单仓库的全局重构
- 需要同时理解 30+ 文件的架构决策
- 长时间的深度会话（无需频繁 `/compact`）

::: info 如何确认版本
在 `/model` 中选择时，带 "1M" 字样的即是百万上下文版。普通版本约 20 万 token。
:::

## 三种使用方式

### 1. 交互式选择（推荐）

在会话中输入 `/effort`：

```bash
> /effort

┌──────────────────────────────────────┐
│ Effort Level                         │
├──────────────────────────────────────┤
│   low     — Fast, low cost           │
│   medium  — Balanced (default)       │
│ ▶ high    — Deep reasoning           │
│   xhigh   — Opus 4.7 only            │
│   max     — Maximum thinking         │
└──────────────────────────────────────┘
← / → 或 ↑ / ↓ 切换 · Enter 确认
```

使用方向键选择，`Enter` 确认。相比旧版单纯输入参数，交互式更直观。

### 2. 会话中直接指令

```bash
> /effort high
✅ Effort set to high

> /effort max
✅ Effort level set to max
```

### 3. 启动时通过 CLI flag

```bash
# 启动时指定高 effort
claude --effort high

# 一次性任务用最高 effort
claude --effort max -p "分析 src/core 的所有循环依赖并给出重构方案"

# 切 Opus 4.7 + xhigh（最强组合）
claude --model claude-opus-4-7 --effort xhigh
```

## 什么时候该用哪个

### `low` — 尽量少用，除非很赶

```bash
claude --effort low -p "这个文件做什么的？"
```

适合已经明确知道答案的扫描类问题。**不建议写代码时使用**，容易漏掉细节。

### `medium` — 日常默认

```bash
# 大部分时间都用这个
claude
```

日常编辑、bug 修复、功能开发。成本可控，质量够用。

### `high` — 复杂任务起步

```bash
> /effort high
> 帮我梳理这个订单状态机，找出可能的并发竞态
```

当你开始纠结"这个方案行不行"时，就该切到 `high`。

### `xhigh` — 大型改动前

```bash
claude --model claude-opus-4-7 --effort xhigh
> 重构整个认证模块，从 JWT 迁移到 session-based，
  涉及 12 个文件，需要保留兼容层
```

跨多文件的改动、没有明显答案的决策、容易踩坑的迁移。

### `max` — 关键决策场景

```bash
> /effort max
> 分析这个生产环境事故的根因，从日志、代码、配置三个维度交叉验证
```

值得花大 token 认真推演的事情。**不要滥用**——成本会显著增加。

::: tip 省钱原则
大部分任务 `medium` 就够。只在遇到真正卡住的问题时切 `high` 及以上，做完立刻切回来。
:::

## 与 Auto Mode 的关系

Claude Code 的 **Auto Mode** 会根据问题复杂度自动选择 effort，你不需要手动切。

```bash
# 启用 Auto Mode（Max 订阅免 flag）
claude
> /model auto
```

Auto Mode 的判断逻辑：
- 简单问题 → `low` / `medium`
- 多步推理 → `high`
- 识别为复杂任务 → `xhigh` / `max`（需 Opus 4.7）

::: info 手动 vs 自动
手动 effort 适合你清楚任务难度；Auto Mode 适合任务难度不确定或变化较大的长会话。两者不冲突，可以随时切换。
:::

## 成本与性能对比

下表给出同一个中等规模任务（修复一个跨 3 文件的 bug）的参考数据：

| Effort | 时间 | Thinking Token | 总成本（约） |
|--------|------|----------------|-------------|
| `low` | 8s | ~500 | $0.02 |
| `medium` | 15s | ~2,000 | $0.05 |
| `high` | 35s | ~8,000 | $0.15 |
| `xhigh`（Opus 4.7） | 70s | ~20,000 | $0.40 |
| `max`（Opus 4.7） | 120s+ | ~50,000+ | $1.00+ |

::: warning 实际数据会变
具体成本取决于代码量、对话长度、API 定价。上表仅作数量级参考。用 `/cost` 查看当前会话实际花费。
:::

## 常见问题

**Q: `xhigh` 和 `max` 的区别？**
A: 两者都只在 Opus 4.7 上生效，`max` 思考深度更极致，耗时更长。如果 `xhigh` 解决不了，才值得上 `max`。

**Q: Sonnet 上设置 `xhigh` 会怎样？**
A: 自动回退到 `high`，不会报错，但也不会真的 `xhigh`。

**Q: 中途改 effort 会不会影响之前的对话？**
A: 不会。只影响切换后的下一次响应。

**Q: 怎么知道 Claude 现在用的是哪个 effort？**
A: 输入 `/effort` 不带参数，当前等级会高亮显示。

## 小结

| 要点 | 记忆点 |
|------|-------|
| Effort 等级 | low / medium / high / xhigh / max |
| Opus 4.7 独占 | xhigh、max 等级 |
| 常用命令 | `/effort` 交互 · `--effort` CLI |
| 日常推荐 | medium（默认）+ 偶尔切 high |
| 不要滥用 | max 成本显著高，只在关键决策时用 |
| Auto Mode | 让 Claude 自动选 effort |

---

上一篇：[权限系统 ←](/zh/guide/permission-system) | 下一篇：[斜杠命令 →](/zh/commands/slash-commands)
