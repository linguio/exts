---
date: "2026-10-30"
scope: [extension]
status: completed
type: feature
---

# 调整书签归属与顺序并接入 Neon

## 当前阶段

已完成。

## 目标与范围

### 背景与目标

按用户指定的分类与顺序整理 Newtab 书签，并接入 Neon 入口。

### 范围与排除项

- npm 移至 PM 末尾；shadcn/ui 移至 UI 第一位，Lucide 第二、shadcn.io 第三、Simple Icons 第四；Bilibili 与 YouTube 交换位置；Neon 使用 https://neon.com/ 和用户提供的 neon.svg，紧随 Vercel。
- 核实 Simple Icons 当前地址 https://simpleicons.org/，正确时保留。
- 不改图标内容、文件夹访问逻辑、样式、依赖、版本或其他书签；不提交或推送 Git。

## Todo

- [x] 核实网址并调整书签配置，保留用户提供的 Neon 图标。
- [x] 同步现有配置行为测试，执行扩展测试、类型检查与生产构建。
- [x] 补充实际结果与 Chrome／Edge 验收步骤，停在用户验收。

## 验收标准

- PM 顺序为 Linear、Notion、npm；UI 前四项依次为 shadcn/ui、Lucide、shadcn.io、Simple Icons。
- Social Media 顺序为 Telegram、YouTube、Bilibili；DevOps 顺序为 Namecheap、Vercel、Neon。
- Simple Icons 链接正确；Neon 名称、链接和图标可用；其他书签及文件夹行为保持。
- 用户在 Chrome／Edge 加载 dist/build/chrome-mv3 后自行检查显示和跳转；自动化通过不等于用户验收。

## 唯一下一步

无。

## 交付记录

### 历史交付记录

#### 对应工作项

- [Issue](2026-10-30-extension-bookmark-order-issue.md)

#### 预期交付边界

调整 npm、shadcn/ui 的文件夹归属，交换视频书签顺序，核实 Simple Icons，并接入用户提供的 Neon 图标与链接。

#### 实际交付

npm 移至 PM 末尾；UI 前四项依次为 shadcn/ui、Lucide、shadcn.io、Simple Icons；YouTube 与 Bilibili 交换位置；Neon 紧随 Vercel，使用 https://neon.com/ 和用户提供的原始 SVG，构建资源清单同步接入。Simple Icons 官网 https://simpleicons.org/ 已访问核实，原配置保留。

#### 验证与限制

- pnpm --filter @exts/extension test：15 个文件、77 项测试通过。
- pnpm --filter @exts/extension typecheck：通过。
- pnpm ext:build：通过；产物为 dist/build/chrome-mv3，包含 Neon SVG，与用户源文件字节一致。
- git diff --check：通过。
- 原有 theme-init.js 非 module 构建警告保留；浏览器显示、明暗主题及跳转未实测，由用户自行验收。
- 验收步骤：Chrome／Edge 加载上述产物，打开新标签页，查看 PM／UI／Social Media／DevOps 的顺序；显示 UI 内容后确认前四项依次为 shadcn/ui、Lucide、shadcn.io、Simple Icons；点击 Simple Icons 与 Neon，分别进入官网；检查 Neon 在明暗主题下可见，UI 原有模糊与滚动行为保持。

#### 用户验收

用户于 2026-10-30 明确要求本地提交，按仓库规则批准当前 Issue 完结；浏览器未实测，不记为实测通过。

#### 提交方案

代码提交边界：bookmarks.ts、bookmarks.test.mjs、wxt.config.ts 和用户提供的 neon.svg。配置调整与现有测试同步，新增图标构建复制登记。

```text
chore(extension): 调整书签分类顺序并接入 Neon

- 将 npm 归入 PM 并调整 UI 与视频书签顺序
- 添加 Neon 入口及用户提供的图标资源
```

文档提交边界：本 Issue、Commit 记录及 docs/ohmy-delivery/readme.md。记录范围、实际验证与待验收状态。

```text
docs(extension): 记录书签整理与 Neon 接入结果

- 记录书签调整范围及实际验证结果
- 同步工作项完成状态与本地提交批准
```

用户于 2026-10-30 批准本地提交；代码先提交，文档随后提交。随文档提交将 Issue 和工作台同步为已完成，验收记录为用户明确要求本地提交完结，最终提交批准为已批准。

#### 最终提交批准

已批准：用户于 2026-10-30 明确要求 commit，批准当前范围的两笔本地提交和上述机械性终态更新；不推送。

## 关联文档

- [工作台](../../readme.md)

## 历史补充

### 元信息

- 当前阶段：用户明确要求本地提交，完结当前工作项；浏览器未实测。
- 批准依据：用户明确要求 npm 放入 PM、shadcn 放入 UI、交换 Bilibili 与 YouTube、检查 Simple Icons 网址并在 Vercel 后添加 Neon，使用已提供图标。
- 任务规模：小型静态配置调整，无需独立 Spec 或 Plan。

### 历史后续事项

本工作项完结，无后续实施；未推送，浏览器实测记录仍为未执行。
