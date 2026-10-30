# 调整书签归属与顺序并接入 Neon

## 元信息

- 工作项：2026-10-30-extension-bookmark-order
- 状态：已完成
- 当前阶段：用户明确要求本地提交，完结当前工作项；浏览器未实测。
- 批准依据：用户明确要求 npm 放入 PM、shadcn 放入 UI、交换 Bilibili 与 YouTube、检查 Simple Icons 网址并在 Vercel 后添加 Neon，使用已提供图标。
- 任务规模：小型静态配置调整，无需独立 Spec 或 Plan。

## 背景与目标

按用户指定的分类与顺序整理 Newtab 书签，并接入 Neon 入口。

## 范围与排除项

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

## 关联文档

- [Commit 记录](../commits/2026-10-30-extension-bookmark-order-commit.md)
- [工作台](../README.md)

## 唯一下一步

本工作项完结，无后续实施；未推送，浏览器实测记录仍为未执行。
