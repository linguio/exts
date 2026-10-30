# 调整书签归属与顺序并接入 Neon：交付记录

## 对应工作项

- [Issue](../issues/2026-10-30-extension-bookmark-order-issue.md)

## 预期交付边界

调整 npm、shadcn/ui 的文件夹归属，交换视频书签顺序，核实 Simple Icons，并接入用户提供的 Neon 图标与链接。

## 实际交付

npm 移至 PM 末尾；UI 前四项依次为 shadcn/ui、Lucide、shadcn.io、Simple Icons；YouTube 与 Bilibili 交换位置；Neon 紧随 Vercel，使用 https://neon.com/ 和用户提供的原始 SVG，构建资源清单同步接入。Simple Icons 官网 https://simpleicons.org/ 已访问核实，原配置保留。

## 验证与限制

- pnpm --filter @exts/extension test：15 个文件、77 项测试通过。
- pnpm --filter @exts/extension typecheck：通过。
- pnpm ext:build：通过；产物为 dist/build/chrome-mv3，包含 Neon SVG，与用户源文件字节一致。
- git diff --check：通过。
- 原有 theme-init.js 非 module 构建警告保留；浏览器显示、明暗主题及跳转未实测，由用户自行验收。
- 验收步骤：Chrome／Edge 加载上述产物，打开新标签页，查看 PM／UI／Social Media／DevOps 的顺序；显示 UI 内容后确认前四项依次为 shadcn/ui、Lucide、shadcn.io、Simple Icons；点击 Simple Icons 与 Neon，分别进入官网；检查 Neon 在明暗主题下可见，UI 原有模糊与滚动行为保持。

## 用户验收

用户于 2026-10-30 明确要求本地提交，按仓库规则批准当前 Issue 完结；浏览器未实测，不记为实测通过。

## 提交方案

代码提交边界：bookmarks.ts、bookmarks.test.mjs、wxt.config.ts 和用户提供的 neon.svg。配置调整与现有测试同步，新增图标构建复制登记。

```text
chore(extension): 调整书签分类顺序并接入 Neon

- 将 npm 归入 PM 并调整 UI 与视频书签顺序
- 添加 Neon 入口及用户提供的图标资源
```

文档提交边界：本 Issue、Commit 记录及 docs/changes/README.md。记录范围、实际验证与待验收状态。

```text
docs(extension): 记录书签整理与 Neon 接入结果

- 记录书签调整范围及实际验证结果
- 同步工作项完成状态与本地提交批准
```

用户于 2026-10-30 批准本地提交；代码先提交，文档随后提交。随文档提交将 Issue 和工作台同步为已完成，验收记录为用户明确要求本地提交完结，最终提交批准为已批准。

## 最终提交批准

已批准：用户于 2026-10-30 明确要求 commit，批准当前范围的两笔本地提交和上述机械性终态更新；不推送。
