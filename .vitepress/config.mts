import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Learn Claude Code',
  description: 'From Zero to Hero — Master AI Development with Claude Code',
  appearance: 'dark',

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
  ],

  locales: {
    zh: {
      label: '中文',
      lang: 'zh-CN',
      link: '/zh/',
      themeConfig: {
        nav: [
          { text: '入门指南', link: '/zh/guide/ai-concepts' },
          { text: '命令大全', link: '/zh/commands/slash-commands' },
          { text: '核心功能', link: '/zh/features/claude-md' },
          { text: '实战教程', link: '/zh/tutorials/github-review' },
          { text: '进阶', link: '/zh/advanced/settings-deep-dive' },
        ],
        sidebar: {
          '/zh/guide/': [
            {
              text: '第一章：入门指南',
              items: [
                { text: 'AI 基础概念', link: '/zh/guide/ai-concepts' },
                { text: '什么是 Claude Code', link: '/zh/guide/what-is-claude-code' },
                { text: '安装与配置', link: '/zh/guide/installation' },
                { text: '第一次对话', link: '/zh/guide/first-session' },
                { text: '权限系统', link: '/zh/guide/permission-system' },
              ]
            }
          ],
          '/zh/commands/': [
            {
              text: '第二章：命令大全',
              items: [
                { text: '斜杠命令', link: '/zh/commands/slash-commands' },
                { text: 'CLI 参数', link: '/zh/commands/cli-flags' },
                { text: '快捷键', link: '/zh/commands/keyboard-shortcuts' },
              ]
            }
          ],
          '/zh/features/': [
            {
              text: '第三章：核心功能',
              items: [
                { text: 'CLAUDE.md', link: '/zh/features/claude-md' },
                { text: 'Hooks 自动化', link: '/zh/features/hooks' },
                { text: 'Skills 自定义命令', link: '/zh/features/skills' },
                { text: 'MCP Servers', link: '/zh/features/mcp-servers' },
                { text: 'Agent Teams', link: '/zh/features/agent-teams' },
                { text: 'Git Worktrees', link: '/zh/features/git-worktrees' },
                { text: 'Plan Mode', link: '/zh/features/plan-mode' },
              ]
            }
          ],
          '/zh/tutorials/': [
            {
              text: '第四章：实战教程',
              items: [
                { text: 'GitHub PR Review', link: '/zh/tutorials/github-review' },
                { text: '搭建个人网站', link: '/zh/tutorials/build-website' },
                { text: 'Debug 工作流', link: '/zh/tutorials/debug-workflow' },
                { text: 'Telegram Bot', link: '/zh/tutorials/telegram-bot' },
                { text: 'Vibe Coding', link: '/zh/tutorials/vibe-coding' },
              ]
            }
          ],
          '/zh/advanced/': [
            {
              text: '第五章：进阶',
              items: [
                { text: 'Settings 深度配置', link: '/zh/advanced/settings-deep-dive' },
                { text: '自定义 Skills', link: '/zh/advanced/custom-skills' },
                { text: '性能优化', link: '/zh/advanced/performance-tips' },
                { text: '常见问题', link: '/zh/advanced/troubleshooting' },
              ]
            }
          ],
        },
        outline: { label: '目录' },
        docFooter: { prev: '上一篇', next: '下一篇' },
        lastUpdated: { text: '最后更新' },
        editLink: {
          pattern: 'https://github.com/laozhou333/claude-tutorial/edit/main/:path',
          text: '在 GitHub 上编辑此页'
        },
      }
    },
    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
      themeConfig: {
        nav: [
          { text: 'Guide', link: '/en/guide/ai-concepts' },
          { text: 'Commands', link: '/en/commands/slash-commands' },
          { text: 'Features', link: '/en/features/claude-md' },
          { text: 'Tutorials', link: '/en/tutorials/github-review' },
          { text: 'Advanced', link: '/en/advanced/settings-deep-dive' },
        ],
        sidebar: {
          '/en/guide/': [
            {
              text: 'Chapter 1: Getting Started',
              items: [
                { text: 'AI Fundamentals', link: '/en/guide/ai-concepts' },
                { text: 'What is Claude Code', link: '/en/guide/what-is-claude-code' },
                { text: 'Installation', link: '/en/guide/installation' },
                { text: 'First Session', link: '/en/guide/first-session' },
                { text: 'Permission System', link: '/en/guide/permission-system' },
              ]
            }
          ],
          '/en/commands/': [
            {
              text: 'Chapter 2: Command Reference',
              items: [
                { text: 'Slash Commands', link: '/en/commands/slash-commands' },
                { text: 'CLI Flags', link: '/en/commands/cli-flags' },
                { text: 'Keyboard Shortcuts', link: '/en/commands/keyboard-shortcuts' },
              ]
            }
          ],
          '/en/features/': [
            {
              text: 'Chapter 3: Core Features',
              items: [
                { text: 'CLAUDE.md', link: '/en/features/claude-md' },
                { text: 'Hooks', link: '/en/features/hooks' },
                { text: 'Skills', link: '/en/features/skills' },
                { text: 'MCP Servers', link: '/en/features/mcp-servers' },
                { text: 'Agent Teams', link: '/en/features/agent-teams' },
                { text: 'Git Worktrees', link: '/en/features/git-worktrees' },
                { text: 'Plan Mode', link: '/en/features/plan-mode' },
              ]
            }
          ],
          '/en/tutorials/': [
            {
              text: 'Chapter 4: Tutorials',
              items: [
                { text: 'GitHub PR Review', link: '/en/tutorials/github-review' },
                { text: 'Build a Website', link: '/en/tutorials/build-website' },
                { text: 'Debug Workflow', link: '/en/tutorials/debug-workflow' },
                { text: 'Telegram Bot', link: '/en/tutorials/telegram-bot' },
                { text: 'Vibe Coding', link: '/en/tutorials/vibe-coding' },
              ]
            }
          ],
          '/en/advanced/': [
            {
              text: 'Chapter 5: Advanced',
              items: [
                { text: 'Settings Deep Dive', link: '/en/advanced/settings-deep-dive' },
                { text: 'Custom Skills', link: '/en/advanced/custom-skills' },
                { text: 'Performance Tips', link: '/en/advanced/performance-tips' },
                { text: 'Troubleshooting', link: '/en/advanced/troubleshooting' },
              ]
            }
          ],
        },
        editLink: {
          pattern: 'https://github.com/laozhou333/claude-tutorial/edit/main/:path',
          text: 'Edit this page on GitHub'
        },
      }
    }
  },

  themeConfig: {
    search: { provider: 'local' },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/laozhou333/claude-tutorial' },
    ],
    footer: {
      message: 'Made with Claude Code by Asher',
      copyright: '© 2026 Asher Zhou'
    }
  }
})
