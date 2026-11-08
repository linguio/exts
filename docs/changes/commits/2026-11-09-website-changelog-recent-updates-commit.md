# 官网近期更新日志与版本交付记录

- [唯一 Issue](../issues/2026-11-09-website-changelog-recent-updates-issue.md)
- 状态：已完成
- 用户验收：2026-11-09 用户明确验收通过
- 最终提交批准：2026-11-09 已批准代码与文档两笔本地提交；不推送、不创建标签或 Release

## 实际交付
- 官网新增 2026-11-09“新增 Daily 活动记录查询”和 2026-11-08“完善设置同步与 Studio 体验”，按日期倒序置顶，各三点，使用用户已确认原文。
- 原历史记录完整保留，时间线组件、样式和平台类型未改。
- 用户追加要求：9 日在 Extension 旁增加 API 标签，使用现有 group 渲染；API changes 为空，仅增加标签，不拆分或改写三点，Release 正文不变。
- 8 日也按用户进一步要求增加同样的 API 标签，保留 Extension、三点原文和页面结构。
- 根 package.json 唯一产品版本从 2.0.0 改为 2.1.0，未改变依赖、锁文件或其他版本配置。
- 发布脚本未改，Release 正文仍只取首条，即 9 日三点；8 日不会自动合并。

## 实际验证
- node scripts/version.mjs：输出 2.1.0。
- node scripts/release-notes.mjs：输出 9 日三点，无 8 日、日期、标题或平台信息。
- Node 直接导入 Changelog：两条日期与各三点、ID 唯一、原历史文本保持不变、Release 三点提取通过；package.json 除 version 外与 HEAD 完全一致。
- git diff --check：通过。

## 验证限制与失败事实
- pnpm --filter @exts/website typecheck 未进入 tsc，包管理器自动进入依赖安装，npm registry DNS 失败并重试，已终止进程，未继续安装循环。
- 直接调用现有本地 tsc 启动器仍找不到 TypeScript 包，确认现有依赖不完整；官网类型检查未通过，官网生产构建未执行。
- 采用上述 Node 实际数据/版本/Release 提取检查作为当前可用的替代验证，不将其表述为官网完整构建通过。未修改锁文件或依赖声明。
- 未执行浏览器视觉验收，未启动 dev server；旧线上网站、标签和版本均未改动。

## 用户可复现验收
1. 查看 apps/website/src/pages/changelog/data.ts，核对顶部 9 日与 8 日标题和六点原文，原历史条目仍在。
2. 根目录运行 node scripts/version.mjs，应输出 2.1.0；运行 node scripts/release-notes.mjs，应只输出 9 日三点。
3. 恢复可用本地依赖后执行官网 typecheck/build，再通过官网本地预览查看时间线；本轮未完成此页面验证。

## 提交方案（已批准）
代码/资源侧文件：package.json、apps/website/src/pages/changelog/data.ts。

```text
chore(repo): 准备 2.1.0 版本并补充近期更新日志

- 更新根产品版本为 2.1.0
- 补充十一月八日与九日两条各三点更新日志
- 为两条日志保留 Extension 并增加 API 标签
```

计划类文档：docs/changes/README.md、本工作项 Issue 和本 Commit 记录。

```text
docs(website): 记录近期日志与版本准备结果

- 记录已确认文案和根版本变更范围
- 如实记录验证结果及本地依赖不完整的限制
```

## 后续边界
用户已验收并批准本地提交，代码已成功提交，文档与终态纳入第二笔；不推送、创建标签、运行 Release 或部署。以后推送版本变更仍需用户明确批准，不将此前远端标签讨论当作本地全部提交的推送授权。

用户已验收并明确要求本地 commit，批准按上述两笔提交并随文档更新 Issue、工作台和本记录为已完成；验证限制保留。若后续提交失败，保留已成功提交，未完成部分恢复待提交/待批准，不撤销成功提交。

## 完整文件边界
第一笔：package.json、apps/website/src/pages/changelog/data.ts。
第二笔：docs/changes/README.md、docs/changes/issues/2026-11-09-website-changelog-recent-updates-issue.md、docs/changes/commits/2026-11-09-website-changelog-recent-updates-commit.md。
