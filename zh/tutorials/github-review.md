# GitHub PR 自动 Review

Claude Code 可以集成到 GitHub Actions 中，实现 PR 的自动化 Review。每次提交 PR 或更新代码时，Claude 会自动分析变更并给出专业的代码审查意见。本文基于实际项目配置经验，手把手教你搭建这套自动化流程。

## 什么是 Claude Code Review

Claude Code Review 是通过 GitHub Actions 触发的自动化代码审查工作流。它支持两种交互模式：

- **自动 Review**：PR 创建或更新时，Claude 自动审查代码变更
- **交互式对话**：在 PR 评论中 @claude 提问，Claude 会回复

```mermaid
flowchart LR
    A[开发者提交 PR] --> B{GitHub Actions 触发}
    B -->|PR opened/sync| C[claude-review Job]
    B -->|@claude 评论| D[claude-interact Job]
    C --> E[Claude 分析 diff]
    D --> F[Claude 回复评论]
    E --> G[PR 上留下 Review 意见]
    F --> G
```

## 前置条件

在开始之前，确认你具备以下条件：

| 条件 | 说明 |
|------|------|
| GitHub 仓库 | 需要有 Admin 或 Maintainer 权限 |
| API Key | Anthropic API Key 或兼容的代理服务 |
| Runner | GitHub 托管 runner 或自建 runner |

::: tip 关于 API 代理
如果你使用的是 API 代理服务（如 OpenRouter、自建网关等），需要配置 `ANTHROPIC_BASE_URL` 环境变量指向代理地址。某些代理服务需要固定 IP 白名单，这时就需要自建 runner。
:::

## Step 1: 创建 Workflow 文件

在仓库中创建 `.github/workflows/claude.yml`：

```yaml
name: Claude Code Review

on:
  pull_request:
    types: [opened, synchronize, reopened]
  issue_comment:
    types: [created]

jobs:
  claude-review:
    # 仅在 PR 事件时触发
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest  # 或你的自建 runner 标签
    permissions:
      contents: read
      pull-requests: write
      issues: write
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Install Claude Code
        run: npm install -g @anthropic-ai/claude-code

      - name: Run Claude Review
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
          # 如果使用代理，取消下面的注释
          # ANTHROPIC_BASE_URL: ${{ secrets.ANTHROPIC_BASE_URL }}
        run: |
          # 获取 PR 的 diff
          git diff origin/${{ github.base_ref }}...HEAD > /tmp/pr_diff.txt

          # 调用 Claude 进行 Review
          claude -p "你是一位资深代码审查员。请审查以下 PR diff，关注：
          1. 潜在的 bug 和逻辑错误
          2. 安全隐患
          3. 性能问题
          4. 代码风格和最佳实践

          请用中文回复，对每个问题给出具体的文件和行号。

          $(cat /tmp/pr_diff.txt)" \
          --max-turns 50 \
          --output-format text > /tmp/review.txt

      - name: Post Review Comment
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const review = fs.readFileSync('/tmp/review.txt', 'utf8');
            await github.rest.issues.createComment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: context.issue.number,
              body: `## 🤖 Claude Code Review\n\n${review}`
            });

  claude-interact:
    # 仅在评论中 @claude 时触发
    if: >
      github.event_name == 'issue_comment' &&
      github.event.issue.pull_request &&
      contains(github.event.comment.body, '@claude')
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write
      issues: write
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Install Claude Code
        run: npm install -g @anthropic-ai/claude-code

      - name: Reply to Comment
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          COMMENT="${{ github.event.comment.body }}"
          # 移除 @claude 前缀
          QUESTION=$(echo "$COMMENT" | sed 's/@claude//g')

          claude -p "基于这个仓库的代码，回答以下问题：
          $QUESTION" \
          --max-turns 30 \
          --output-format text > /tmp/reply.txt

      - name: Post Reply
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const reply = fs.readFileSync('/tmp/reply.txt', 'utf8');
            await github.rest.issues.createComment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: context.issue.number,
              body: `## 🤖 Claude Reply\n\n${reply}`
            });
```

::: warning 重要：Workflow 必须存在于默认分支
GitHub Actions 的 `issue_comment` 和 `pull_request` 触发器要求 workflow 文件存在于仓库的默认分支（通常是 `main` 或 `master`）。如果你在 feature 分支上创建 workflow 文件，它不会被触发。

**解决方案**：先将 workflow 文件合并到默认分支，再测试 PR Review 功能。
:::

## Step 2: 配置 Secrets

### 基础配置

进入仓库 **Settings > Secrets and variables > Actions**，添加：

| Secret 名称 | 值 |
|-------------|---|
| `ANTHROPIC_API_KEY` | 你的 Anthropic API Key |

### 使用 API 代理

如果你使用自建代理或第三方代理服务：

```bash
# 额外添加以下 Secret
ANTHROPIC_BASE_URL=https://your-proxy.example.com/v1
```

在 workflow 中引用：

```yaml
env:
  ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
  ANTHROPIC_BASE_URL: ${{ secrets.ANTHROPIC_BASE_URL }}
```

::: tip API 代理的优势
- 统一管理多个项目的 API 调用
- 设置用量限制和告警
- 通过固定 IP 出口简化白名单配置
- 可以添加日志和监控
:::

## Step 3: 自建 Runner（可选）

如果你的 API 代理需要 IP 白名单，GitHub 托管的 runner IP 范围很大且经常变化，建议使用自建 runner。

### 为什么需要自建 Runner

- **固定 IP**：代理服务可以只放行你 runner 的 IP
- **网络控制**：可以部署在特定的网络环境中
- **成本优化**：长期使用可能比 GitHub 托管 runner 便宜
- **自定义环境**：预装工具，减少每次安装时间

### 注册 Runner

```bash
# 在你的服务器上执行
mkdir actions-runner && cd actions-runner

# 下载 runner（以 Linux x64 为例）
curl -o actions-runner-linux-x64.tar.gz -L \
  https://github.com/actions/runner/releases/download/v2.321.0/actions-runner-linux-x64-2.321.0.tar.gz

tar xzf actions-runner-linux-x64.tar.gz

# 配置 runner（token 从仓库 Settings > Actions > Runners 获取）
./config.sh --url https://github.com/YOUR_ORG/YOUR_REPO \
  --token YOUR_RUNNER_TOKEN \
  --labels claude-runner \
  --name my-claude-runner

# 安装并启动服务
sudo ./svc.sh install
sudo ./svc.sh start
```

### 在 Workflow 中使用自建 Runner

将 `runs-on` 改为你的 runner 标签：

```yaml
jobs:
  claude-review:
    runs-on: claude-runner  # 替换为你注册时设置的标签
```

::: warning Runner 标签必须完全匹配
`runs-on` 中的标签必须与注册 runner 时 `--labels` 指定的标签**完全一致**（区分大小写）。

常见错误：
- 注册时用 `Claude-Runner`，workflow 中写 `claude-runner` -- 不会匹配
- 标签中间有空格 -- 不会匹配
- 使用了逗号分隔多标签但 workflow 只写了其中一个 -- 可以匹配
:::

### Runner 权限配置

确保 runner 的系统用户有以下权限：

```bash
# runner 用户需要能执行 npm 全局安装
sudo chmod -R 755 /usr/local/lib/node_modules

# 如果使用 Docker runner，确保 node 已安装
node --version  # 需要 v18+
npm --version
```

## Step 4: 组织级 Secrets（推荐）

如果你有多个仓库都需要 Claude Review，逐个配置 Secrets 很麻烦。可以在 GitHub Organization 级别设置：

1. 进入 **Organization Settings > Secrets and variables > Actions**
2. 添加 `ANTHROPIC_API_KEY`（和可选的 `ANTHROPIC_BASE_URL`）
3. 设置访问策略：**All repositories** 或 **Selected repositories**

这样组织下的所有仓库（或选定的仓库）都可以直接使用这些 Secrets，无需逐个配置。

```yaml
# 组织级 Secret 的引用方式和仓库级完全相同
env:
  ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
```

## 常见问题排查

### Workflow 没有触发

**症状**：提交 PR 后没有看到 Actions 运行

**原因与解决**：

1. **Workflow 不在默认分支上**：确认 `.github/workflows/claude.yml` 已合并到 `main`/`master`
2. **触发条件不匹配**：检查 `on` 字段中的事件类型是否正确
3. **权限不足**：确认 Actions 在仓库设置中已启用

### Runner 无法匹配

**症状**：Job 一直显示 "Queued"，不开始执行

```
Requested labels: claude-runner
Job defined at: .github/workflows/claude.yml
Waiting for a runner to pick up this job...
```

**解决**：

```bash
# 检查 runner 状态
./svc.sh status

# 确认标签
cat .runner | jq '.agentName, .labels'

# 重启 runner
sudo ./svc.sh stop
sudo ./svc.sh start
```

### max-turns 不够用

**症状**：Claude 的回复被截断，或者分析不完整

对于大型 PR（几十个文件的变更），默认的 `max-turns` 可能不够。建议根据 PR 规模动态调整：

```yaml
- name: Run Claude Review
  run: |
    # 统计变更文件数
    FILE_COUNT=$(git diff --name-only origin/${{ github.base_ref }}...HEAD | wc -l)

    # 根据文件数动态设置 max-turns
    if [ "$FILE_COUNT" -gt 30 ]; then
      MAX_TURNS=100
    elif [ "$FILE_COUNT" -gt 10 ]; then
      MAX_TURNS=50
    else
      MAX_TURNS=20
    fi

    claude -p "Review this PR diff..." --max-turns $MAX_TURNS
```

::: tip 大型 PR 的建议
对于超过 50 个文件变更的 PR，建议 `max-turns` 设置为 50-100。虽然会消耗更多 token，但能确保 Review 的完整性。
:::

### 权限错误

**症状**：`Resource not accessible by integration` 或 `403 Forbidden`

确认 workflow 中的 `permissions` 配置正确：

```yaml
permissions:
  contents: read        # 读取代码
  pull-requests: write  # 在 PR 上发表评论
  issues: write         # 回复 issue 评论
```

如果使用 Organization runner，还需要确认：
- Runner group 的访问策略包含当前仓库
- Organization 的 Actions 权限设置允许当前 workflow

## 进阶：自定义 Review 规则

你可以通过修改 prompt 来定制 Review 的侧重点：

```yaml
# 安全导向的 Review
claude -p "作为安全审计专家，重点关注：
1. SQL 注入和 XSS 漏洞
2. 硬编码的密钥和凭证
3. 不安全的反序列化
4. 权限校验遗漏
..."

# 性能导向的 Review
claude -p "作为性能优化专家，重点关注：
1. N+1 查询问题
2. 不必要的重渲染
3. 内存泄漏风险
4. 大量数据的处理方式
..."
```

也可以在仓库根目录放置 `.claude/review-prompt.md`，让 workflow 读取自定义 prompt：

```yaml
- name: Run Claude Review
  run: |
    if [ -f .claude/review-prompt.md ]; then
      PROMPT=$(cat .claude/review-prompt.md)
    else
      PROMPT="请审查以下代码变更..."
    fi
    claude -p "$PROMPT $(cat /tmp/pr_diff.txt)" --max-turns 50
```

## 小结

| 步骤 | 内容 | 注意事项 |
|------|------|---------|
| 创建 Workflow | 配置两个 Job：auto review + 交互 | 必须合并到默认分支 |
| 配置 Secrets | API Key + 可选的 Base URL | 推荐用组织级 Secrets |
| 自建 Runner | 固定 IP，适配代理白名单 | 标签必须完全匹配 |
| 调优参数 | max-turns 根据 PR 规模调整 | 大 PR 用 50-100 |

配置完成后，每次 PR 都会自动获得 Claude 的代码审查意见，大幅提升团队的代码质量和 Review 效率。
