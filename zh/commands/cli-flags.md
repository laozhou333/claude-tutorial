# CLI 参数大全

Claude Code 的命令行界面（CLI）提供了丰富的启动参数和子命令，可以精确控制会话行为、权限、模型选择等方方面面。

:::tip 基本用法
```bash
# 交互式启动
claude

# 直接提问（一次性）
claude "解释这段代码的作用"

# 管道模式（非交互）
cat error.log | claude -p "分析这个错误日志"
```
:::

## 会话参数

控制会话的创建、恢复和命名。

| 参数 | 缩写 | 说明 | 示例 |
|------|------|------|------|
| `claude` | - | 启动交互式会话 | `claude` |
| `claude "query"` | - | 以初始问题启动交互式会话 | `claude "重构 auth 模块"` |
| `-p, --print` | `-p` | 管道模式，处理完毕后退出，不进入交互 | `claude -p "解释这个函数"` |
| `-c, --continue` | `-c` | 恢复最近一次会话 | `claude -c` |
| `-r, --resume` | `-r` | 从列表中选择一个历史会话恢复 | `claude -r` |
| `--name` | - | 为会话指定名称 | `claude --name "auth重构"` |
| `--session-id` | - | 指定会话 ID 以恢复特定会话 | `claude --session-id abc123` |
| `--fork-session` | - | 复制指定会话的上下文，创建新会话 | `claude --fork-session abc123` |

### 常见用法

**快速查询，不进入交互模式：**
```bash
claude -p "这个项目用的什么框架？"
```

**恢复上次会话继续工作：**
```bash
claude -c
```

**从管道输入数据：**
```bash
git diff | claude -p "审查这些改动"
cat package.json | claude -p "分析依赖关系"
```

## 输出参数

控制输出格式和详细程度。

| 参数 | 缩写 | 说明 | 示例 |
|------|------|------|------|
| `--output-format` | - | 设置输出格式：`text`、`json`、`stream-json` | `claude -p --output-format json "query"` |
| `--verbose` | - | 显示详细的调试和处理信息 | `claude --verbose` |
| `--include-partial-messages` | - | 在流式输出中包含不完整的中间消息 | `claude -p --output-format stream-json --include-partial-messages "query"` |

:::tip 自动化集成
在 CI/CD 或脚本中使用 `--output-format json` 可以获得结构化输出，方便后续处理：
```bash
result=$(claude -p --output-format json "检查代码质量")
echo "$result" | jq '.result'
```
:::

### 输出格式详解

| 格式 | 说明 | 适用场景 |
|------|------|----------|
| `text` | 纯文本输出（默认） | 终端直接阅读 |
| `json` | 完整 JSON 响应 | 脚本解析、API 集成 |
| `stream-json` | 流式 JSON，逐条输出 | 实时处理、进度展示 |

## 权限参数

控制 Claude 的工具和文件访问权限。

| 参数 | 缩写 | 说明 | 示例 |
|------|------|------|------|
| `--dangerously-skip-permissions` | - | 跳过所有权限确认（危险） | `claude -p --dangerously-skip-permissions "query"` |
| `--permission-mode` | - | 设置权限模式：`default`、`plan`、`bypassPermissions` | `claude --permission-mode plan` |
| `--allowedTools` | - | 白名单：只允许指定的工具 | `claude --allowedTools "Read,Grep,Glob"` |
| `--disallowedTools` | - | 黑名单：禁用指定的工具 | `claude --disallowedTools "Bash,Write"` |

:::warning 安全警告
`--dangerously-skip-permissions` 会跳过所有权限检查，只应在受信任的自动化环境中使用。在 CI/CD 中使用时，务必确保输入来源可信。

必须与 `-p`（管道模式）配合使用，交互模式下不可用。
:::

### 权限模式说明

| 模式 | 说明 |
|------|------|
| `default` | 默认模式，敏感操作需要用户确认 |
| `plan` | 规划模式，Claude 只生成计划不执行操作 |
| `bypassPermissions` | 绕过所有权限（需配合 `--dangerously-skip-permissions`） |

## 模型参数

选择模型和控制推理行为。

| 参数 | 缩写 | 说明 | 示例 |
|------|------|------|------|
| `--model` | - | 指定使用的模型 | `claude --model claude-sonnet-4-20250514` |
| `--effort` | - | 设置推理努力程度：`low`/`medium`/`high` | `claude --effort high` |
| `--fallback-model` | - | 主模型不可用时的备用模型 | `claude --fallback-model claude-sonnet-4-20250514` |
| `--max-turns` | - | 限制 agentic 循环的最大轮数 | `claude -p --max-turns 10 "重构这个模块"` |
| `--max-budget-usd` | - | 设置单次会话的最大预算（美元） | `claude --max-budget-usd 5.00` |

### 常见用法

**限制自动化任务的费用：**
```bash
claude -p --max-budget-usd 2.00 --max-turns 20 "优化整个项目的类型定义"
```

**使用高性能模型进行复杂推理：**
```bash
claude --model claude-opus-4-20250514 --effort high
```

:::tip 费用控制
在自动化脚本中始终设置 `--max-budget-usd` 和 `--max-turns`，防止任务失控导致高额费用。
:::

## 文件参数

管理工作目录和配置来源。

| 参数 | 缩写 | 说明 | 示例 |
|------|------|------|------|
| `--add-dir` | - | 添加额外的工作目录 | `claude --add-dir ../shared-lib` |
| `--setting-sources` | - | 指定配置文件的搜索路径 | `claude --setting-sources ~/.claude/settings.json` |

**多目录项目示例：**
```bash
claude --add-dir ../api --add-dir ../common "在 api 和 common 中查找类型不匹配的问题"
```

## System Prompt 参数

自定义系统提示词，控制 Claude 的行为准则。

| 参数 | 缩写 | 说明 | 示例 |
|------|------|------|------|
| `--system-prompt` | - | 替换默认的系统提示词 | `claude -p --system-prompt "你是一个代码审查专家" "审查这个PR"` |
| `--append-system-prompt` | - | 在默认系统提示词后追加内容 | `claude -p --append-system-prompt "始终使用中文回复" "query"` |
| `--system-prompt-file` | - | 从文件加载系统提示词 | `claude -p --system-prompt-file ./prompts/reviewer.md "query"` |

:::warning 注意
`--system-prompt` 会完全替换默认提示词，这意味着 Claude Code 的内置能力描述也会被移除。大多数情况下，建议使用 `--append-system-prompt` 进行追加。
:::

### 常见用法

**创建专用的代码审查流程：**
```bash
claude -p \
  --append-system-prompt "重点检查安全漏洞和性能问题，使用中文输出报告" \
  "审查 src/api/ 目录下的所有改动"
```

## MCP 参数

配置 Model Context Protocol 服务器和通道。

| 参数 | 缩写 | 说明 | 示例 |
|------|------|------|------|
| `--mcp-config` | - | 指定 MCP 配置文件路径 | `claude --mcp-config ./mcp.json` |
| `--channels` | - | 启用通信通道（如 Telegram） | `claude --channels telegram` |

**MCP 配置文件示例（mcp.json）：**
```json
{
  "mcpServers": {
    "my-server": {
      "command": "node",
      "args": ["./mcp-server/index.js"],
      "env": {
        "API_KEY": "xxx"
      }
    }
  }
}
```

启动时加载：
```bash
claude --mcp-config ./mcp.json
```

## Git 参数

Git worktree 和 tmux 集成。

| 参数 | 缩写 | 说明 | 示例 |
|------|------|------|------|
| `--worktree` | - | 在 Git worktree 中启动，隔离工作环境 | `claude --worktree` |
| `--tmux` | - | 在 tmux 会话中运行（支持后台执行） | `claude --tmux` |

:::tip Worktree 工作流
`--worktree` 会自动创建一个 Git worktree，在独立的分支上工作，不影响主分支。非常适合并行处理多个任务。
:::

## 调试参数

排查问题时使用的调试选项。

| 参数 | 缩写 | 说明 | 示例 |
|------|------|------|------|
| `--debug` | - | 启用调试模式，输出详细日志 | `claude --debug` |
| `--debug-file` | - | 将调试日志写入指定文件 | `claude --debug-file ./debug.log` |

**排查 MCP 连接问题：**
```bash
claude --debug --mcp-config ./mcp.json
```

## 子命令

Claude Code 还提供了一系列独立的子命令。

### claude auth

管理认证和 API 密钥。

| 子命令 | 说明 | 示例 |
|--------|------|------|
| `claude auth login` | 登录账户 | `claude auth login` |
| `claude auth logout` | 登出账户 | `claude auth logout` |
| `claude auth status` | 查看认证状态 | `claude auth status` |
| `claude auth switch` | 切换账户 | `claude auth switch` |

### claude mcp

管理 MCP 服务器配置。

| 子命令 | 说明 | 示例 |
|--------|------|------|
| `claude mcp list` | 列出已配置的 MCP 服务器 | `claude mcp list` |
| `claude mcp add` | 添加 MCP 服务器 | `claude mcp add my-server -c "node server.js"` |
| `claude mcp remove` | 移除 MCP 服务器 | `claude mcp remove my-server` |
| `claude mcp serve` | 将 Claude Code 作为 MCP 服务器运行 | `claude mcp serve` |

### claude plugin

管理插件。

| 子命令 | 说明 | 示例 |
|--------|------|------|
| `claude plugin list` | 列出已安装插件 | `claude plugin list` |
| `claude plugin install` | 安装插件 | `claude plugin install context7` |
| `claude plugin remove` | 卸载插件 | `claude plugin remove context7` |

### claude update

更新 Claude Code 到最新版本。

```bash
claude update
```

## 组合使用示例

**CI/CD 中的自动代码审查：**
```bash
claude -p \
  --dangerously-skip-permissions \
  --output-format json \
  --max-turns 30 \
  --max-budget-usd 3.00 \
  --append-system-prompt "只关注安全和性能问题" \
  "审查最近一次提交的改动"
```

**多目录项目的交互式开发：**
```bash
claude \
  --add-dir ../frontend \
  --add-dir ../backend \
  --add-dir ../shared \
  --model claude-sonnet-4-20250514 \
  --name "全栈开发"
```

**使用自定义 MCP 和 Telegram 通道：**
```bash
claude \
  --mcp-config ./mcp.json \
  --channels telegram
```

## 快速参考

| 场景 | 推荐参数 |
|------|----------|
| 脚本/CI 中使用 | `-p --output-format json` |
| 恢复上次会话 | `-c` |
| 控制费用 | `--max-budget-usd --max-turns` |
| 复杂推理任务 | `--model opus --effort high` |
| 多目录项目 | `--add-dir` |
| 排查问题 | `--debug` |
| 自动化无人值守 | `-p --dangerously-skip-permissions` |
