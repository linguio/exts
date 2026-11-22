# 更新官网 Extension 内容并设置 1.4.0 版本：Commit 记录

## 对应 Issue

- [Issue](../issues/2026-10-22-website-extension-1-4-0-issue.md)

## 预期交付边界

更新官网 Extension 产品介绍、新增 Newtab 更新日志并附上 1.4.0 扩展附件链接，修正三条历史日志日期，统一历史附件下载直链及更新日志链接规则，为首次推出的 Skills 补充源码入口，同步首页 Newtab 示意卡的 Dock 入口，并将根产品版本设置为 1.4.0；不执行发布。

## 实际交付

Newtab 产品介绍使用用户最终确认的“以新标签页为工作台，集中访问常用网站与工具。”；新增 2026-10-22 Extension 日志，说明三区布局、内置示例打卡记录日历、Download 空抽屉和 EDU 锁图标，并附上固定的 1.4.0 扩展附件地址。原有快速开始改为 2026-10-20，Telegram Web Download 和开发工作流改为 2026-10-21；历史正文不变，1.0.0 和 1.1.0 的 `exts-chrome.zip` 链接改为对应版本的附件直链。首次推出 Skills 的日志补充 workflow-change、workflow-observer 源码链接，后续工作流完善条目不重复链接，Skills 不标产品版本。官网功能说明增加按具体目标提供附件直链、包版本页、Skill 源码或不加链接的规则。首页 Newtab 示意卡保留布局，仅把 Dock 同步为 X、GitHub、Exts、Gmail、Components、Download、Settings。根产品版本从 1.3.0 改为 1.4.0。

## 验证结果

官网逻辑测试 10/10 通过；直接调用已安装的 TypeScript 执行 `tsc --noEmit` 通过；`node scripts/version.mjs` 输出 1.4.0；Skills 源码链接添加后的 Vite 生产构建通过；`git diff --check` 通过。已核对 GitHub `v1.0.0` 与 `v1.1.0` Release 均有对应 `exts-chrome.zip` 附件，更新日志所有以附件文件名标注的链接均指向 `/releases/download/`；两个 Skill 源码目录存在于仓库。常规 pnpm 类型检查命令因沙箱访问依赖目录失败，改用已安装的 TypeScript 完成相同检查；初次 Vite 构建因沙箱 `spawn EPERM` 未启动，随后在允许子进程的环境中构建通过。

## 未验证事项与限制

代理未执行浏览器视觉或线上验收。2026-10-22 查询 GitHub 时 `v1.4.0` Release 尚不存在，新增扩展附件链接当前返回 404，须在后续正式 Release 上传附件后才能使用；本工作项不执行发布。

## 用户验收

用户明确要求本地提交，按仓库规则视为批准当前 Issue 完结；浏览器展示与真实下载未由代理验证。

## 最终提交批准

已批准本地 Git Commit；不推送或发布。

## 最终 Commit message

feat(website): 更新 Extension 展示并设置产品版本 1.4.0

- 更新 Newtab 介绍、首页 Dock 示意与 Extension 日志
- 统一日志链接规则与 Skills 源码入口，修正历史日期和附件直链
- 设置根产品版本 1.4.0
