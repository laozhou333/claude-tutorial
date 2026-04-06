# 如何使用 DESIGN.md

DESIGN.md 是一种新兴的设计规范文件，让 AI 编码工具能够理解并复刻顶级网站的视觉风格。

## 快速开始

### 第 1 步：选择设计系统

从 [设计资源库](./index) 中选一个你喜欢的风格。比如想要 Stripe 那种精致金融风：

```bash
# 在你的项目根目录
curl -o DESIGN.md https://raw.githubusercontent.com/VoltAgent/awesome-design-md/main/design-md/stripe/DESIGN.md
```

### 第 2 步：放到项目根目录

```
your-project/
├── DESIGN.md      ← 放在这里
├── CLAUDE.md
├── src/
└── ...
```

### 第 3 步：让 Claude Code 按风格开发

```bash
claude
> 按照 DESIGN.md 的设计规范，帮我创建一个定价页面
```

Claude Code 会自动读取 DESIGN.md，按照里面定义的：
- 色彩系统
- 字体排版
- 组件样式
- 间距规则
- 动效系统

来生成匹配该风格的代码。

## 搭配 /design-consultation 使用

如果你不想直接用现成的，可以用 gstack 的设计咨询技能：

```bash
/design-consultation
# Claude 会：
# 1. 了解你的产品定位
# 2. 研究竞品设计
# 3. 为你定制完整设计系统
# 4. 生成 DESIGN.md
```

## 混搭技巧

你可以把多个设计系统的特点组合：

```markdown
<!-- DESIGN.md -->
# 我的项目设计系统

## 整体风格
参考 Linear 的极简暗黑风，但使用 Stripe 的阴影系统。

## 色彩
主色：Supabase 的绿色荧光 (#3ECF8E)
背景：Linear 的深色 (#0A0A0A)
强调色：Stripe 的紫色 (#533AFD)

## 字体
标题：Inter（参考 Vercel）
正文：参考 Notion 的排版系统
```

## 配合 Figma 使用

```bash
# 1. 先用 DESIGN.md 定义风格
# 2. 让 Claude Code 生成代码
# 3. 用 Figma MCP 推送到 Figma 进行微调
```

::: tip 最佳实践
- DESIGN.md 放在项目根目录，Claude Code 每次对话都会自动读取
- 修改 DESIGN.md 后不需要重启，下次提问会自动使用新规范
- 结合 CLAUDE.md 使用效果更好：CLAUDE.md 管代码规范，DESIGN.md 管视觉规范
:::

::: warning 注意
DESIGN.md 里的色值、字体等可能引用了付费字体或品牌专属资源。用于学习和个人项目没问题，商业项目请确认版权。
:::
