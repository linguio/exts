# TG 产品介绍与工作流日志交付记录

- Issue：[补充 TG 产品介绍与开发工作流日志](../issues/2026-10-22-website-tg-skills-changelog-issue.md)
- 状态：已完成
- 用户验收：用户明确要求更新为 1.3.0 并提交到本地，按规则完结
- 最终提交批准：已批准，仅本地，不推送或部署

## 预期交付边界
补充官网 TG 一句话产品介绍、Skills 与 Extension 两条更新日志，使用用户最终确认文案；按用户最新要求将根产品版本改为 1.3.0，分两笔本地提交。

## 实际交付
- Extension 产品说明新增 Telegram Web Download，简介严格使用“Telegram Web 图片、视频右键另存为。”。
- 新增 2026-10-22“完善开发工作流”（Skills）和“新增 Telegram Web Download”（Extension）两条日志，保持用户确认的顺序和三点完整文案，不增加完成提示条目。
- 官网内容仅修改 categories.ts、changelog-data.ts；另外将根 package.json 产品版本从 1.2.0 改为 1.3.0。没有修改已有日志、历史链接、样式或布局。

## 验证与限制
- node --test apps/website/tests/products/categories.test.ts apps/website/tests/showcase/card-pool.test.ts：10 项通过。
- pnpm --filter @exts/website typecheck、pnpm web:build：通过。
- 日期、顺序、分组、完整文案、构建产物内容核对及 git diff --check：通过，产物为根 dist/build/exts-web/。
- 未独立执行浏览器视觉与线上验收，未启动 dev/watch，不推送或部署。
- 以上验证对应官网内容修改；根版本更新和提交阶段按用户要求未追加测试或构建，现有构建产物未重新生成。
- 本地提交仅同步本 Issue、交付记录及工作台为已完成，不重复验证。

## 最终 Commit message
已展示并获用户本地提交批准；版本号与官网内容分两笔：

```text
chore(repo): 将产品版本更新为 1.3.0

- 更新根目录唯一产品版本源
```

```text
docs(website): 补充 TG 产品介绍与工作流日志

- 新增 TG 一句话介绍与扩展更新日志
- 补充开发工作流改进日志并保持确认文案与顺序
```
