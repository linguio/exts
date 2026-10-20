# 添加快速开始与英文产品分类：Commit 记录

## 对应 Issue

- [Issue](../issues/2026-10-20-website-quick-start-issue.md)

## 预期交付边界

产品介绍新增 Quick Start 安装指引与下载入口，分类改为英文；保留现有风格和首页四类，同步必要逻辑测试及规范。用户随后明确要求直接补充 Photos 发布条目的两点 Extension 说明与并排的双端 1.2.0 下载链接。

## 实际交付

- 新增默认 Quick Start 内容和独立 hash，提供扩展 ZIP 解压、Chrome 加载及保留目录提醒；按用户反馈移除 Edge 地址与 manifest.json 文件夹补充说明。
- 提供 DMG 拖入 Applications 与首次打开授权步骤，背景使用用户确认原文“这是我个人开发的应用，未进行应用公证。首次打开时需要手动允许。”；按用户要求移除应用损坏提示与 Apple 官方链接。
- 分类使用 Extension、Desktop、Packages、Skills，首页保留原四类，已有分类 hash 继续有效；下载复用现有首页地址。
- 同步官网规范、导航逻辑测试、Issue 和工作台，沿用现有布局与官方 Button。
- Photos 发布条目保留标题及桌面两点，新增用户指定的两点 Extension 文案；双端 1.2.0 链接在正文下方并排展示，窄屏自然换行。
- 按用户最新批准取消日志正文的平台分组展示，四条内容合为连续列表、间距统一 8px；保留平台标签和下载链接。
- 新增 2026-10-20 Website 日志“新增快速开始”，按用户最新要求正文只保留“新增快速开始，介绍浏览器扩展与 macOS 应用的安装及首次打开授权。”；日期表示本次交付，未部署。
- 新增 Build 标签及 2026-10-19“优化构建与打包流程”，包含 GitHub Actions 双端打包和 macOS 签名、打包校验两点；DMG 拖拽安装窗口归入 Photos 条目的 Desktop 内容。

## 验证结果

- 官网纯逻辑测试 10 项通过，类型检查与生产构建通过；产物位于 `dist/build/exts-web`。
- 沙箱禁止子进程导致首次测试、构建失败；测试改用 `--test-isolation=none`，构建允许子进程后一次重试成功，无依赖或配置变更。
- 已检查 React 组件职责、hash 订阅清理、原生列表与链接语义及现有导航状态；未新增状态管理或依赖。
- 用户验收反馈后的文案精简及外链移除已核对，`git diff --check` 通过；未重复全量验证或构建，既有构建结果对应精简前版本。
- 追加日志后，内容与双包固定 v1.2.0 地址断言核对通过，最终类型检查与生产构建通过；当前产物包含最终 Quick Start 文案与日志调整。未重复无逻辑变化的导航测试。
- 取消正文分组后，类型检查与生产构建通过；数据未变，不重复导航或内容测试，不新增视觉／布局测试。实际连续列表效果待用户验收。
- Website 日志的平台、日期、两点正文、无英文分类内容、日期倒序及 ID 唯一性通过 Node 断言核对；仅文案数据变更，未重复全量验证或构建，当前生产产物尚不包含此新条目。
- 最终 Build、Desktop 和 Website 内容、日期顺序及 ID 唯一性通过断言核对；类型检查与生产构建通过，最新产物已包含所有最终文案，Website 仅保留一条正文。

## 未验证事项与限制

代理未独立执行浏览器视觉、窄屏换行、导航交互、真实下载、安装或 macOS 系统授权验证，不承诺 latest 地址的线上可用性；用户已批准本地提交，未推送或部署。

## 用户验收

已通过：用户查看阶段交付材料、三笔提交范围及完整消息后明确要求“提交到本地”，按仓库规则同时表示当前交付验收通过；代理未独立验收事项保留。

## 最终提交批准

已批准：按已展示三笔边界及完整消息执行本地提交，最后一笔同步本 Issue、Commit 记录和工作台完成状态；不推送或部署。

## 最终 Commit message

用户已批准以下三笔提交边界及完整消息；最后一笔同步本 Issue、Commit 记录和工作台终态，不推送。

### 1. 快速开始与英文分类

范围：`apps/website/src/features/products/categories.ts`、`apps/website/src/pages/features/features-page.tsx`、`apps/website/src/pages/features/quick-start.tsx`、`apps/website/tests/products/categories.test.ts`。

```text
feat(website): 添加快速开始并统一英文产品分类

- 提供浏览器扩展与 macOS 应用安装和首次授权指引
- 统一英文导航并保留原分类入口与地址逻辑覆盖
```

### 2. 更新日志内容与展示

范围：`apps/website/src/features/changelog/changelog-data.ts`、`apps/website/src/features/changelog/changelog-timeline.tsx`。

```text
docs(website): 完善双端发布与构建更新日志

- 补充快速开始、双端更新与构建打包优化记录
- 连续展示更新条目并并排显示双端下载链接
```

### 3. 规范与交付记录

范围：`docs/website/ui.md`、`docs/changes/README.md`、本 Commit 记录和对应 Issue。

```text
docs(website): 同步快速开始与日志调整交付记录

- 同步安装指引、日志标签与连续列表规范
- 记录验证结果和限制并完成当前工作项
```
