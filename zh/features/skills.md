# Skills 自定义命令

Skills 是 Claude Code 的**可扩展命令系统**，让你可以通过 `/skill-name` 的方式调用预定义的工作流。就像给 Claude Code 安装"插件"一样。

## 什么是 Skills

Skills 是存储在 `.claude/skills/` 目录下的 Markdown 文件，每个 Skill 定义了一套指令，告诉 Claude Code 在特定场景下该怎么做。

```
~/.claude/skills/
├── gstack/           # gstack 技能包（第三方）
│   ├── browse/       # 浏览器测试
│   ├── qa/           # QA 测试
│   ├── ship/         # 发布流程
│   └── ...
└── my-skill/         # 你自己的技能
    └── SKILL.md
```

## 内置 Skills vs 第三方 Skills

| 类型 | 来源 | 示例 |
|------|------|------|
| 内置 | Claude Code 自带 | `/commit`, `/review-pr`, `/init` |
| 第三方 | 社区插件市场 | gstack 系列、superpowers 等 |
| 自定义 | 自己编写 | 项目专属工作流 |

## 如何安装第三方 Skills

以 **gstack** 为例（最流行的 Claude Code 技能包）：

```bash
# 通过 Claude Code 插件市场安装
/plugin
# 选择 gstack，按提示安装
```

安装后会在 `~/.claude/skills/gstack/` 下创建所有技能文件。

---

## gstack 技能包详解

gstack 是目前最全面的 Claude Code 技能包，包含 **28 个技能**，覆盖开发全流程。以下按类别详细介绍：

### 🌐 浏览器测试类

#### `/browse` — 无头浏览器

快速启动一个持久化的无头 Chromium 浏览器，用于 QA 测试和网站验证。

```bash
/browse
# 然后可以使用：
$B goto https://your-site.com     # 打开网页
$B screenshot /tmp/test.png       # 截图
$B click @e3                      # 点击元素
$B text                           # 获取页面文本
$B console                        # 查看控制台日志
$B responsive /tmp/layout         # 响应式测试（手机/平板/桌面）
$B snapshot -D                    # 操作前后对比差异
```

::: tip 使用场景
- 验证页面是否正常加载
- 测试用户交互流程
- 截图作为 bug 报告证据
- 响应式布局测试
:::

#### `/setup-browser-cookies` — 导入浏览器 Cookie

将你真实浏览器的 Cookie 导入无头浏览器，用于测试需要登录的页面。

#### `/benchmark` — 性能基准测试

检测性能回退：建立页面加载时间、Core Web Vitals、资源大小的基准线，每次 PR 对比前后变化。

#### `/canary` — 金丝雀监控

部署后的持续监控：监控线上应用的控制台错误、性能回退和页面故障，发现异常时告警。

### 🧪 QA 测试类

#### `/qa` — 自动 QA + 修复

系统化地 QA 测试 Web 应用，发现 bug 后**自动修复**并重新验证。三个级别：

| 级别 | 说明 | 适用场景 |
|------|------|---------|
| Quick | 快速检查 | 小改动后快速验证 |
| Standard | 标准测试 | 常规开发 |
| Exhaustive | 全面测试 | 发布前 |

```bash
/qa
# Claude 会自动：打开浏览器 → 逐页测试 → 发现 bug → 修复代码 → 重新验证
```

#### `/qa-only` — 仅报告不修复

跟 `/qa` 一样测试，但只生成报告（含健康分数、截图、复现步骤），不修改代码。适合先了解问题全貌。

#### `/design-review` — 设计审查

以设计师视角检查：视觉不一致、间距问题、层级问题、AI 生成痕迹、慢交互，然后自动修复并截图对比。

### 📋 规划类

#### `/office-hours` — 头脑风暴

两种模式：
- **Startup 模式**：6 个灵魂拷问（需求真实性、市场契合度等）
- **Builder 模式**：设计思维头脑风暴，适合个人项目

#### `/autoplan` — 自动化审查流水线

自动依次运行 CEO Review → Design Review → Eng Review，用 6 条决策原则自动做出判断，最终在一个审批门收集需要人工确认的选择。

#### `/plan-ceo-review` — CEO 视角审查

从创始人角度审查计划：重新思考问题、寻找 10 星产品、挑战前提假设、扩展范围。

#### `/plan-eng-review` — 工程经理视角审查

锁定执行计划：架构、数据流、边界条件、测试覆盖、性能优化，给出强观点建议。

#### `/plan-design-review` — 设计师视角审查

对每个设计维度打分（0-10），解释如何达到 10 分，然后修正计划。

#### `/design-consultation` — 设计咨询

了解你的产品 → 研究竞品 → 提出完整设计系统（美学、字体、配色、布局、动效）→ 生成预览页 → 输出 `DESIGN.md`。

### 🚀 开发流程类

#### `/ship` — 发布

完整发布流程：检测合并基线 → 运行测试 → Review 差异 → 更新版本号 → 更新 CHANGELOG → 提交推送 → 创建 PR。

```bash
/ship
# 一键完成从代码到 PR 的全部流程
```

#### `/review` — 代码审查

PR 预审：分析 diff，检查 SQL 安全、LLM 信任边界、条件副作用等结构性问题。

#### `/land-and-deploy` — 合并部署

接管 `/ship` 创建的 PR：合并 → 等待 CI → 等待部署 → 验证生产环境健康。

#### `/document-release` — 文档更新

发布后自动更新所有文档：README / ARCHITECTURE / CONTRIBUTING / CLAUDE.md，保持文档与代码同步。

#### `/retro` — 周回顾

每周工程回顾：分析提交历史、工作模式、代码质量，支持团队按人分析，包含表扬和改进建议。

### 🛡️ 安全类

#### `/careful` — 危险命令警告

在执行 `rm -rf`、`DROP TABLE`、`git push --force`、`kubectl delete` 等危险命令前弹出警告。

#### `/freeze` — 冻结编辑范围

限制文件编辑只能在指定目录，防止调试时误改其他代码。

```bash
/freeze src/components/
# 之后只能编辑 src/components/ 下的文件
```

#### `/unfreeze` — 解除冻结

清除 `/freeze` 设置的限制。

#### `/guard` — 完全安全模式

同时启用 `/careful` + `/freeze`，最大安全等级。适合操作生产环境。

#### `/cso` — 安全审计

首席安全官模式：Secrets 考古、依赖供应链扫描、CI/CD 管道安全、LLM/AI 安全、OWASP Top 10、STRIDE 威胁建模。

::: warning 注意
`/cso` 审计非常深入，可能需要较长时间（15-30 分钟），建议在重要发布前运行。
:::

### 🔧 调试类

#### `/investigate` — 系统化调试

四阶段调试法：调查 → 分析 → 假设 → 实施。铁律：**不找到根本原因不动手修**。

```bash
/investigate
# Claude 会系统地追踪问题根因，而不是头痛医头
```

### 📊 其他

#### `/codex` — OpenAI Codex 集成

三种模式：
- **Code Review**：独立代码审查，通过/不通过
- **Challenge**：对抗模式，尝试破坏你的代码
- **Consult**：问答模式

#### `/setup-deploy` — 配置部署

自动检测你的部署平台（Fly.io / Vercel / Netlify / GitHub Actions 等），配置生产 URL、健康检查等。

#### `/gstack-upgrade` — 升级 gstack

检测并升级 gstack 到最新版本。

---

## 如何创建自定义 Skill

在 `.claude/skills/` 下创建目录和 `SKILL.md`：

```bash
mkdir -p .claude/skills/my-skill
```

```markdown
<!-- .claude/skills/my-skill/SKILL.md -->
---
name: my-skill
description: 我的自定义技能
---

# 我的技能

当用户调用 /my-skill 时，请执行以下步骤：

1. 检查当前项目的 package.json
2. 运行所有测试
3. 生成测试报告
```

::: tip Skill 文件结构
- **frontmatter**：`name` 和 `description` 字段
- **正文**：Markdown 格式的指令，Claude Code 会按照这些指令执行
- **支持文件**：可以在同目录放辅助文件
:::

## 查看已安装的 Skills

```bash
/skills
# 列出所有可用的 skills
```

## 最佳实践

1. **具体明确** — Skill 指令越具体，执行越准确
2. **分步骤** — 用编号列表写清每一步
3. **加护栏** — 明确写出"不要做什么"同样重要
4. **测试优先** — 在 Skill 中加入验证步骤
5. **组合使用** — `/guard` + 你的 skill = 安全执行

---

上一篇：[Hooks 自动化 ←](/zh/features/hooks) | 下一篇：[MCP Servers →](/zh/features/mcp-servers)
