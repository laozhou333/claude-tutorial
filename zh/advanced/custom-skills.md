# 自定义 Skills 开发

Skills 是 Claude Code 的扩展机制——通过编写 `SKILL.md` 文件，你可以创建自定义的斜杠命令，封装常用工作流，让团队共享最佳实践。本篇将带你从零开始开发一个自定义 Skill。

## Skill 是什么

一个 Skill 就是一个目录，包含一个 `SKILL.md` 主文件和可选的支持文件。当用户在 Claude Code 中输入 `/skill-name` 时，Skill 的内容会被注入到当前会话的上下文中，指导 Claude 完成特定任务。

```
.claude/skills/
└── deploy/
    ├── SKILL.md           # 主文件（必需）
    ├── deploy-checklist.md # 支持文件（可选）
    └── templates/
        └── fly.toml       # 模板文件（可选）
```

## SKILL.md 格式

### Frontmatter

SKILL.md 文件以 YAML frontmatter 开头，定义 Skill 的元数据：

```markdown
---
name: deploy
description: Deploy the application to production with safety checks
trigger: /deploy
when: "user wants to deploy, ship to production, or release"
tools:
  - Bash
  - Read
  - Edit
  - WebFetch
---
```

各字段说明：

| 字段 | 必需 | 说明 |
|------|------|------|
| `name` | 是 | Skill 的唯一标识 |
| `description` | 是 | 简短描述，显示在 Skill 列表中 |
| `trigger` | 否 | 触发的斜杠命令，如 `/deploy` |
| `when` | 否 | 自然语言描述何时应触发此 Skill |
| `tools` | 否 | Skill 需要使用的工具列表 |

### 正文内容

Frontmatter 之后是 Skill 的正文，用自然语言描述 Claude 应该做什么：

```markdown
---
name: deploy
description: Deploy the application to production
trigger: /deploy
---

# Deploy Skill

## Steps

1. Run the test suite: `npm test`
2. If tests fail, stop and report the failures
3. Check for uncommitted changes: `git status`
4. If there are uncommitted changes, ask user to commit first
5. Build the project: `npm run build`
6. Deploy to Fly.io: `fly deploy --ha=false`
7. Run health check: `curl -f https://myapp.fly.dev/health`
8. Report deployment status

## Error Handling

- If deploy fails, show the error log and suggest fixes
- If health check fails, trigger rollback: `fly releases rollback`
```

## 支持文件

Skill 目录下的其他文件会作为上下文自动加载，适合放置：

- **检查清单** — 部署前的检查项
- **模板文件** — 配置文件模板
- **参考文档** — API 说明、架构图
- **示例代码** — 期望的代码模式

```
.claude/skills/api-create/
├── SKILL.md
├── example-route.ts      # 示例代码，Claude 参考风格
└── api-conventions.md    # API 设计规范
```

在 SKILL.md 中引用支持文件：

```markdown
## Reference

Follow the patterns in `example-route.ts` for route structure.
See `api-conventions.md` for naming and error handling rules.
```

## 动态上下文注入

Skill 的强大之处在于它可以动态地向 Claude 注入上下文，改变 Claude 的行为模式。

### 条件行为

```markdown
---
name: review
trigger: /review
when: "user asks to review code, check PR, or inspect changes"
---

# Code Review Skill

## Mode Detection

Check if there's a PR context:
1. Run `git log --oneline main..HEAD` to see commits
2. If no commits, review the current working changes instead

## Review Checklist

For each changed file:
- [ ] Logic correctness
- [ ] Error handling
- [ ] Security implications
- [ ] Performance impact
- [ ] Test coverage
```

### 与其他 Skill 组合

```markdown
## Post-Review Actions

After review is complete, suggest:
- If issues found: fix them inline
- If all good: suggest running `/ship` to create a PR
```

## 使用 /skill-creator 创建 Skill

Claude Code 内置了 `/skill-creator` skill，可以帮你快速创建和测试自定义 Skill：

```bash
# 启动 Skill 创建器
/skill-creator
```

Skill Creator 会引导你完成：

1. **定义目标** — 描述你想创建什么 Skill
2. **生成 SKILL.md** — 自动生成初始的 Skill 文件
3. **添加支持文件** — 根据需要创建辅助文件
4. **测试 Skill** — 在当前会话中测试 Skill 效果
5. **迭代优化** — 根据测试结果调整

::: tip 推荐方式
对于第一次创建 Skill，强烈推荐使用 `/skill-creator`，它会帮你遵循最佳实践并避免常见错误。
:::

## 实战：创建一个部署 Skill

让我们从零创建一个完整的部署 Skill。

### 第一步：创建目录结构

```bash
mkdir -p .claude/skills/deploy
```

### 第二步：编写 SKILL.md

```markdown
---
name: deploy
description: Safe deployment to Fly.io with pre-flight checks
trigger: /deploy
when: "user wants to deploy, release, or ship to production"
tools:
  - Bash
  - Read
---

# Deploy to Production

## Pre-flight Checks

Run ALL checks before deploying. Stop immediately if any fail.

1. **Tests**: Run `npm test`. All must pass.
2. **Build**: Run `npm run build`. Must complete without errors.
3. **Git status**: Run `git status`. Working tree must be clean.
4. **Branch**: Must be on `main` branch.

## Deployment

1. Run: `fly deploy --ha=false`
2. Wait for deployment to complete
3. Run health check: `curl -sf https://myapp.fly.dev/api/health`

## Post-deploy

1. If health check passes: report success with deployment URL
2. If health check fails:
   - Show recent logs: `fly logs --count 50`
   - Ask user if they want to rollback
   - If yes: `fly releases rollback`

## Safety Rules

- NEVER deploy with failing tests
- NEVER deploy with uncommitted changes
- NEVER skip the health check
- Always offer rollback option on failure
```

### 第三步：添加检查清单

```markdown
<!-- .claude/skills/deploy/checklist.md -->

# Deployment Checklist

- [ ] All tests passing
- [ ] Build succeeds
- [ ] No uncommitted changes
- [ ] On main branch
- [ ] Version bumped (if needed)
- [ ] CHANGELOG updated (if needed)
- [ ] Database migrations reviewed
```

### 第四步：测试

在 Claude Code 中输入 `/deploy`，验证 Skill 是否按预期运行：

```bash
> /deploy

Claude:
  开始部署预检...

  ✅ 测试通过 (23/23)
  ✅ 构建成功
  ✅ 工作目录干净
  ✅ 当前分支: main

  所有检查通过，开始部署...
```

## 技巧与最佳实践

### 1. 写明确的步骤

```markdown
# ❌ 模糊的指令
Deploy the app and make sure it works.

# ✅ 明确的步骤
1. Run `npm test` — all tests must pass
2. Run `npm run build` — must exit with code 0
3. Run `fly deploy` — wait for completion
4. Run `curl -f https://myapp.fly.dev/health` — must return 200
```

### 2. 定义失败处理

```markdown
## Error Handling

If step 3 (deploy) fails:
- Read the error output
- Check if it's a known issue (out of memory, timeout)
- Suggest a fix based on the error type
- Do NOT retry automatically
```

### 3. 提供上下文而非代码

```markdown
# ❌ 把代码写在 Skill 里
Here's the deploy script:
\`\`\`bash
#!/bin/bash
npm test && npm run build && fly deploy
\`\`\`

# ✅ 提供上下文和规则
Run tests, then build, then deploy to Fly.io.
Follow the project's existing deploy conventions in `scripts/deploy.sh`.
```

### 4. 限制 Skill 的范围

每个 Skill 专注一件事。如果一个 Skill 超过 200 行，考虑拆分。

::: warning 注意
Skill 的内容会被注入到 Claude 的 context window 中，过长的 Skill 会消耗宝贵的上下文空间。保持简洁有效。
:::

## Skill 的存放位置

| 位置 | 适用场景 |
|------|---------|
| `.claude/skills/` | 项目级 Skill，团队共享 |
| `~/.claude/skills/` | 个人全局 Skill，所有项目可用 |

项目级 Skill 会跟随 Git 提交，团队成员都能使用。全局 Skill 只在你的本地机器上生效。

---

上一篇：[Settings 深度配置 ←](/zh/advanced/settings-deep-dive) | 下一篇：[性能优化 →](/zh/advanced/performance-tips)
