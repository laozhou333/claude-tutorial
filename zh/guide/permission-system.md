# 权限系统

Claude Code 的权限系统是它安全模型的核心。理解权限系统能帮助你在**安全性**和**便捷性**之间找到最佳平衡。

## 为什么需要权限系统

Claude Code 作为一个 Agent，具备读写文件、执行命令等强大能力。权限系统确保这些能力在你的控制之下：

```
没有权限系统:
  你: "修复这个 bug"
  Claude: *悄悄删除了整个 node_modules*
  Claude: *执行了 git push --force*
  你: 😱

有权限系统:
  你: "修复这个 bug"
  Claude: 我需要编辑 src/utils.ts，允许吗？ [y/n]
  Claude: 我需要运行 npm test，允许吗？ [y/n]
  你: 完全掌控 ✅
```

## 五种权限模式

Claude Code 提供五种权限模式，从最严格到最宽松：

### 1. Plan 模式

**最安全的模式**——Claude 只能分析和规划，不能执行任何操作。

```bash
# 启动时指定
claude --permission-mode plan
```

适用场景：
- 代码审查和分析
- 让 Claude 制定方案，你手动执行
- 不确定 Claude 会做什么时先看看计划

```bash
> 帮我重构 src/api/ 目录

Claude:
  📋 重构方案：
  1. 将路由拆分为独立模块
  2. 提取公共中间件到 middleware/
  3. 统一错误处理
  4. 添加请求验证层

  需要我执行这个方案吗？（当前为 Plan 模式，需切换权限）
```

### 2. Default 模式（默认）

**推荐的日常模式**——读取操作自动允许，写入和命令执行需要确认。

```bash
# 默认就是这个模式
claude
```

权限矩阵：

| 操作 | 是否需要确认 |
|------|-------------|
| 读取文件 | 自动允许 |
| 搜索代码 | 自动允许 |
| 编辑文件 | 需要确认 |
| 创建文件 | 需要确认 |
| 执行命令 | 需要确认 |
| Git 操作 | 需要确认 |

```bash
> 帮我修复 src/utils.ts 中的 bug

Claude:
  🔍 Reading src/utils.ts          ← 自动执行
  🔍 Reading src/utils.test.ts     ← 自动执行

  找到问题了。需要修改 src/utils.ts：

  ✏️ Editing src/utils.ts           ← 等待你确认
  ┌────────────────────────────────┐
  │ - const result = a + b;        │
  │ + const result = a * b;        │
  └────────────────────────────────┘
  Allow? [y/n]
```

### 3. AcceptEdits 模式

**中等信任模式**——文件编辑自动允许，但命令执行仍需确认。

```bash
claude --permission-mode acceptEdits
```

权限矩阵：

| 操作 | 是否需要确认 |
|------|-------------|
| 读取文件 | 自动允许 |
| 编辑/创建文件 | 自动允许 |
| 安全命令（如 `ls`、`cat`） | 自动允许 |
| 其他命令 | 需要确认 |
| Git push | 需要确认 |

适用场景：
- 你信任 Claude 的编辑但想控制命令执行
- 快速迭代开发，减少确认次数

### 4. Auto 模式

**高信任模式**——大部分操作自动允许，只有高风险操作需要确认。

```bash
claude --permission-mode auto
```

::: warning 谨慎使用
Auto 模式下 Claude 可以自主执行大部分操作。建议仅在以下情况使用：
- 你对项目结构非常熟悉
- 项目有完善的 Git 版本控制
- 你可以随时回退改动
:::

### 5. BypassPermissions 模式

**完全信任模式**——所有操作自动执行，不需要任何确认。

```bash
claude --dangerously-skip-permissions
```

::: danger 危险警告
这个模式会跳过所有权限检查。仅在以下情况使用：
- CI/CD 自动化流水线中
- 完全隔离的沙箱环境
- 你完全理解并接受所有风险

**绝对不要**在生产环境或包含重要数据的项目中使用此模式。
:::

## 切换权限模式

### 运行时切换

在对话过程中，使用 `Shift + Tab` 快捷键切换权限模式：

```bash
# 按下 Shift + Tab 后显示
? Select permission mode:
> Default         # 默认模式
  AcceptEdits     # 自动接受编辑
  Plan            # 仅规划
  Auto            # 自动执行
```

### 启动时指定

```bash
# 各种模式的启动方式
claude                              # Default 模式
claude --permission-mode plan       # Plan 模式
claude --permission-mode acceptEdits  # AcceptEdits 模式
claude --permission-mode auto       # Auto 模式
claude --dangerously-skip-permissions # 跳过所有权限
```

## 精细化权限控制

除了全局权限模式，你还可以在配置中精细控制哪些工具被允许或禁止。

### allowedTools —— 白名单

在 `.claude/settings.json` 中配置允许自动执行的工具：

```json
{
  "permissions": {
    "allowedTools": [
      "Read",
      "Grep",
      "Glob",
      "bash(npm test)",
      "bash(npm run lint)",
      "bash(npx tsc --noEmit)"
    ]
  }
}
```

上面的配置意味着：
- `Read`、`Grep`、`Glob` 工具可以自动执行
- 只有 `npm test`、`npm run lint`、`npx tsc --noEmit` 这三个 bash 命令可以自动执行
- 其他命令仍需确认

### disallowedTools —— 黑名单

禁止 Claude 使用某些工具：

```json
{
  "permissions": {
    "disallowedTools": [
      "bash(rm *)",
      "bash(git push --force)",
      "bash(DROP TABLE)"
    ]
  }
}
```

### 配置层级

权限配置支持多层级，优先级从高到低：

```
项目级   .claude/settings.json    ← 最高优先级
用户级   ~/.claude/settings.json  ← 中等优先级
默认      内置默认值              ← 最低优先级
```

::: tip 团队协作建议
在团队项目中，推荐将 `.claude/settings.json` 纳入版本控制，这样所有团队成员的权限配置保持一致：

```json
// .claude/settings.json（提交到 Git）
{
  "permissions": {
    "allowedTools": [
      "Read",
      "Grep",
      "Glob",
      "bash(npm test)",
      "bash(npm run build)"
    ],
    "disallowedTools": [
      "bash(rm -rf *)",
      "bash(git push --force)"
    ]
  }
}
```
:::

## 权限模式选择指南

根据你的使用场景选择合适的权限模式：

```
代码审查/分析  ────→  Plan 模式
  "我只想看看，不想改"

日常开发      ────→  Default 模式
  "我想控制每一步操作"

快速迭代      ────→  AcceptEdits 模式
  "编辑没问题，命令我想确认"

熟悉的项目    ────→  Auto 模式
  "我信任 Claude，但保留最后防线"

CI/CD 流水线  ────→  BypassPermissions
  "完全自动化，在沙箱中运行"
```

### 推荐的渐进式策略

新用户建议从 Default 开始，熟悉后逐步切换到 AcceptEdits，最终根据项目需要在 Default + 自定义 `allowedTools` 白名单模式下长期使用。

## 安全最佳实践

### 1. 始终使用 Git

```bash
# 在让 Claude 做大改动之前，确保代码已提交
git add -A && git commit -m "checkpoint before refactoring"

# 如果 Claude 的改动不满意，随时回退
git checkout .
```

### 2. 审查危险操作

即使在 Auto 模式下，以下操作也应该格外注意：

```bash
# 危险操作清单
git push --force        # 可能覆盖远程历史
rm -rf                  # 不可逆删除
DROP TABLE / DELETE FROM # 数据库破坏性操作
curl | bash             # 执行远程脚本
chmod 777               # 过度开放权限
```

### 3. 利用 allowedTools 精细控制

用 `allowedTools` 白名单让常用安全命令自动执行，其余仍需确认。

### 4. 敏感项目先用 Plan 模式

先用 `claude --permission-mode plan` 看方案，确认后再切换到 Default 执行。

### 5. CI/CD 中使用 BypassPermissions

仅在 CI 沙箱环境中配合 `--dangerously-skip-permissions` 使用，并确保 `ANTHROPIC_API_KEY` 通过 secrets 注入。

## 小结

| 模式 | 安全级别 | 适用场景 |
|------|---------|---------|
| Plan | 最高 | 代码审查、方案规划 |
| Default | 高 | 日常开发（推荐） |
| AcceptEdits | 中 | 快速迭代 |
| Auto | 低 | 熟悉的项目 |
| BypassPermissions | 无 | 仅用于 CI/CD |

核心原则：
- **从严到松** —— 新手从 Default 开始，逐步放宽
- **善用白名单** —— 用 `allowedTools` 精确控制
- **保持 Git 干净** —— 大改动前先提交
- **审查高危操作** —— 不管什么模式，危险操作都要看一眼

---

> 上一篇：[第一次对话](./first-session.md)
