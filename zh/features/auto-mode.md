# Auto Mode 自动模式

不想每次都手动选模型？Auto Mode 让 Claude Code **自动判断任务难度**，选择最合适的模型和 effort 等级，你只管描述需求。

## 什么是 Auto Mode

Auto Mode 是 Claude Code 的智能调度机制。开启后，Claude 会根据每次请求的**复杂度**动态切换：

```
简单问题     → Haiku / Sonnet + low effort    （快、省钱）
日常任务     → Sonnet + medium effort          （平衡）
复杂推理     → Opus 4.7 + high effort          （深度思考）
高难决策     → Opus 4.7 + xhigh/max effort     （最高质量）
```

你不需要记住每个模型的定位，Auto Mode 自动帮你选。

::: tip 为什么需要 Auto Mode
长会话中任务难度常常变化：上一秒在改错别字，下一秒在讨论架构。Auto Mode 让每个子任务都用对工具，既不浪费成本，也不牺牲质量。
:::

## 如何启用

### Max / Enterprise 订阅

从 v2.1.116 起，**Max 订阅默认可直接使用**，无需任何参数：

```bash
claude
> /model auto
✅ Model set to auto
```

### Pro 及其他订阅

需要显式启用：

```bash
claude --enable-auto-mode

# 或在 settings 中配置
```

::: info 旧版本
v2.1.115 之前所有用户都需要 `--enable-auto-mode` 启动参数。升级后 Max 用户已自动去除该要求。
:::

### 查看当前状态

```bash
> /model

Current model: Auto (Opus 4.7 + xhigh)
  ↑ Auto Mode 正在用 Opus 4.7 + xhigh 处理当前会话
```

状态栏会实时显示 Auto Mode 选中的模型和 effort 组合。

## Auto Mode 的判断依据

Auto Mode 是个内部的"路由器"，它会根据以下信号决策：

| 信号 | 对应模型/effort |
|------|---------------|
| 简短问答、格式转换 | Haiku / Sonnet + low |
| 单文件编辑 | Sonnet + medium |
| 跨文件修改、重构 | Sonnet + high 或 Opus + high |
| 架构设计、算法推理 | Opus 4.7 + high/xhigh |
| 涉及复杂 trade-off | Opus 4.7 + xhigh/max |
| 多步长链路推理 | Opus 4.7 + max |

它还会参考**会话历史**——如果你一直在做复杂任务，接下来的请求它会倾向用更强模型。

## 什么时候该用，什么时候该关

### ✅ 适合开 Auto Mode

- 长会话，任务难度混杂
- 新手，不确定该用哪个模型
- 探索性工作，需求在变化
- Max 订阅（配额更宽松，成本不敏感）

### ❌ 建议手动选模型

- 批量任务，每次请求难度一致（比如连续翻译 100 个句子）
- 成本极度敏感（Auto Mode 倾向选更强模型）
- 有严格预算限制（结合 `--max-budget-usd`）
- 需要可复现的结果（固定模型更稳定）

::: warning 成本提示
Auto Mode 为了质量，倾向于选更强的模型。如果你预算紧张，手动固定到 Sonnet + medium 可能更省。
:::

## 与手动 Effort 的配合

Auto Mode **仍然响应** `/effort` 命令：

```bash
> /model auto
> /effort max

# 此时：模型 Auto 选，但 effort 被锁定在 max
> 分析这个架构的瓶颈
```

这种"自动选模型 + 手动锁 effort"的组合，适合：
- 你知道这个任务很难（锁 `max`）
- 但模型让 Auto 决定（简单推理用 Sonnet 也够）

反过来也行：
```bash
> /model claude-opus-4-7
> /effort auto    # 让 effort 自动选
```

## 实战示例

### 场景一：混合开发会话

```bash
> 帮我改下 README 的标题拼写错误
# Auto: Sonnet + low  →  2 秒完成

> 现在帮我重构 auth 模块，改用 JWT
# Auto: Opus 4.7 + high  →  30 秒后给出方案

> 刚才那个改动，帮我补个单测
# Auto: Sonnet + medium  →  10 秒生成测试
```

整个会话无需手动切换，Auto Mode 根据每次请求选最合适的配置。

### 场景二：CI/CD 自动审查

```bash
# 在 GitHub Actions 里
claude --enable-auto-mode \
  --max-budget-usd 2 \
  --max-turns 30 \
  -p "审查这个 PR 的代码质量和潜在问题"
```

- Auto Mode 根据 PR 复杂度选模型
- 同时用 `--max-budget-usd` 控制总成本

### 场景三：新手友好配置

```bash
# 一劳永逸：开 Auto Mode + Opus 4.7 为上限
claude --enable-auto-mode --model-max claude-opus-4-7
```

这样你永远不会因为"模型不够强"卡住，也不会过度消耗（简单任务仍然用 Sonnet）。

## 与其他功能的配合

### Auto Mode × Plan Mode

```bash
> /plan
> /model auto
> 帮我规划从 REST 迁移到 GraphQL 的方案
# Auto 选 Opus 4.7 + high/xhigh  →  深度规划
```

Plan Mode 多数是复杂推理，Auto Mode 会倾向选强模型，这正是你需要的。

### Auto Mode × 长会话

Auto Mode 在长会话中表现更好，因为它能根据对话历史理解你的工作模式。如果你频繁 `/clear`，它就失去了判断依据。

::: tip 配合 /compact
长会话中用 `/compact` 压缩，保留决策要点的同时，Auto Mode 仍然知道任务在做什么。
:::

### Auto Mode × 不同订阅

| 订阅 | 可用模型池 | 推荐 Auto Mode |
|------|----------|---------------|
| Free | 有限 Sonnet 配额 | 不推荐（容易超额） |
| Pro | Sonnet 为主，Opus 有限 | 可用，注意用量 |
| Max | Sonnet + Opus 4.7 全开 | **强烈推荐** |
| Enterprise | 全模型池 | **强烈推荐** |

## 常见问题

**Q: Auto Mode 选模型会提示我吗？**
A: 不会主动提示，会在状态栏显示当前选中的模型和 effort。你可以随时 `/model` 查看。

**Q: 同一句问题，两次 Auto Mode 会选一样的模型吗？**
A: 大概率会，但不保证 100% 一致——它会参考会话历史。严格复现场景请手动固定。

**Q: Auto Mode 会选错吗？**
A: 偶尔会。如果觉得选得不合适，可以手动切：`/model claude-sonnet-4` 或 `/effort high`。

**Q: Auto Mode 和 `--effort auto` 一样吗？**
A: 不一样。`/model auto` 自动选模型，`/effort auto` 自动选 effort 等级。两者可以组合使用。

**Q: 怎么关掉 Auto Mode？**
A: `/model` 选择具体模型（比如 Sonnet）即可切回手动。

## 小结

| 要点 | 记忆点 |
|------|-------|
| 一句话定义 | Claude 自动选模型+effort |
| Max 订阅 | 默认可用，无需参数 |
| 启用命令 | `/model auto` |
| 查看状态 | `/model` 或状态栏 |
| 最佳搭档 | 长会话、混合任务、Max 订阅 |
| 不适合 | 批量任务、严格预算、强复现 |

---

上一篇：[Plan Mode ←](/zh/features/plan-mode) | 下一篇：[会话体验优化 →](/zh/features/session-experience)
