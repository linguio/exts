# 统一官网品牌资源目录：交付记录

## 对应工作项

- [Issue](../issues/2026-10-29-website-brand-assets-issue.md)

## 实际交付

- 11 份官网品牌 SVG 统一归入 src/assets/brand；Header、平台下载和首页展示卡片改用统一资源路径。
- 两份内容相同的 GitHub SVG 合并为一份，删除无源码引用的 ChatGPT SVG，清理旧 showcase/assets 目录。
- README 同步资源职责，将失效的“当前 Issue”标注改为项目工作台入口。
- 三处组件仅改导入；页面文案、样式、交互、轮播、正式 public 品牌资源、下载地址和依赖均未修改。

## 验证与限制

- node --test apps/website/tests/showcase/card-pool.test.ts apps/website/tests/products/categories.test.ts：10 项通过。
- pnpm --filter @exts/website typecheck：通过。
- pnpm web:build：通过；产物为根 dist/build/exts-web。
- 11 份保留 SVG 与迁移前逐字节一致；三处组件除预期导入路径外内容一致；所有 src/assets 导入目标均存在。
- git diff --check：通过。
- 用户于 2026-10-29 明确确认验证通过；代理未独立执行浏览器视觉、交互或真实下载验收，未部署线上。

## 用户验收

状态：用户于 2026-10-29 确认验证通过并批准本地提交；以下步骤保留供复现。

1. 在根目录运行 pnpm web:dev，使用终端显示的地址在 Chrome／Edge 打开首页。
2. 检查 Header 的 GitHub 图标、macOS／Chrome 下载入口图标和 Newtab 示意中的品牌图标均正常显示，卡片轮播与原样一致。
3. 打开产品介绍和更新日志，检查共用 Header 图标仍正常；下载入口保持原链接，无新增加载或提示行为。
4. 检查 apps/website/README.md 中的资源目录说明及“项目工作台”链接。

## 文件边界与完整 Commit message

代码：apps/website/src/assets/brand 下的迁移资源、旧资源删除，以及 src/components/layout/site-header.tsx、src/features/download/platform-downloads.tsx、src/features/showcase/showcase-cards.tsx 的导入调整。

```text
refactor(website): 统一品牌资源目录并清理重复图标

- 将平台与展示卡片品牌 SVG 归入统一资源目录
- 合并 GitHub 图标并清理未引用资源
```

文档：apps/website/README.md、本 Issue、Commit 记录及 docs/changes/README.md。

```text
docs(website): 同步品牌资源职责与整理记录

- 修正资源目录说明与工作台入口
- 记录迁移验证结果和用户验收步骤
```

## 最终提交批准

已批准；用户于 2026-10-29 明确要求本地提交，代码与文档按已展示范围分开提交。Issue、Commit 记录与工作台同步为已完成；沿用已有验证，提交不追加测试、类型检查或构建，不推送或部署。
