---
date: "2026-11-16"
scope: [build, website]
status: completed
type: task
---

# 更新 2.4.0 版本与发布日志

## 当前阶段

已完成。

## 目标与范围

### 背景与目标

基于正式 v2.3.0 至当前的全部提交，将已交付通知错误音、设置、About 和倒计时更新整理为 2.4.0 发布说明；第五条使用“修复已知问题，优化使用体验。”。

### 范围与排除项

- 根 package.json version 从 2.3.0 更新为 2.4.0；官网 Changelog 新增 2026-11-16 条目，正文五条归 Extension，API 仅标签。
- 使用现有验证入口执行全量逻辑测试、类型检查、官网构建与本机扩展 ZIP 打包，并审查测试适用性和入口覆盖。
- Windows 无法执行的 Swift/Xcode 原生测试及双端打包记录待 macOS 验证；隔离库未配置时不得使用生产库代替测试。
- 不修改依赖、业务实现、CI 或历史日志，不新增测试框架；测试清理或范围外修复需另行批准。
- 用户已批准本地 Git 提交；不推送、打 Tag、部署、创建或公开 Release。

## Todo

- [x] 写入批准的 2.4.0 版本及五条日志、两个标签。
- [x] 清点现有测试与生产入口，核对 v2.3.0 后变更覆盖、过期和重复测试。
- [x] 串行执行本机可用的全量逻辑测试、类型检查与构建打包。
- [x] 记录结果、警告、失败及未验证部分，停在用户验收。

## 验收标准

- 根版本与扩展 Manifest 为 2.4.0，官网最新日志标题、日期、五条文案和 Extension/API 标签与批准内容一致。
- Release 正文仅提取这五条更新，不重复分类或旧版本内容。
- 检查结果如实记录，测试跳过、macOS 限制及未运行 CI 不称为全量通过或已发布。
- 用户审阅 package.json 与 Changelog，按记录在所需平台补齐原生测试和双端产物验证；本机成功不替代发布验收。

## 唯一下一步

无。

## 交付记录

### 本次检查结论与验收步骤

- 根脚本、Desktop/API 启动、官网三份逻辑及 npm 工具共 72 项通过；Extension 45 文件 182 项通过；稳定工具 10 项、类型及独立 tarball/真实 WXT 生命周期检查通过。
- API 完整入口 65 项，其中 57 项通过、8 项无显式隔离库跳过，不使用生产库代替。
- 官网/扩展类型检查、官网构建和扩展 ZIP 打包通过；根版本与两处扩展 Manifest 均为 2.4.0，Release 正文为批准的五条。
- 本轮按现有锁文件恢复缺失依赖，未升级或改变 pnpm-lock.yaml；原依赖缺失导致的 Manifest 测试失败已在一次修复后通过，不改业务代码迎合工具。
- 保留 theme-init.js 非 module、大 chunk 以及 Starlette/httpx 弃用提示，不在当前范围扩大修复。
- Windows 无法执行 Swift/Xcode，12 份 Desktop Swift 测试、macOS 构建/DMG/同版本双端打包未执行；现有 CI 已配置这些入口，但本轮没有触发或核实远端执行结果。完整发布验证尚未完成。
- 测试适用性结论和完整命令见 Commit 记录；本轮没有增删或改写测试。

用户检查 package.json 的 2.4.0、官网 Changelog 最新五条正文及 Extension/API 两标签；如需加载扩展，解压 dist/release/exts-chrome.zip 并在 Chrome/Edge 扩展管理页加载，检查显示版本与 About 为 2.4.0。官网视觉由用户检查，代理不启动浏览器验收。正式发版前须在 macOS 按现有流程执行完整原生测试和 pnpm release，同提交生成 ZIP/DMG；当前本地 ZIP 不代表双包发布完成。

### 用户验收与提交批准

2026-11-16 用户明确“验收通过 commit”，本工作项验收通过、本地提交已批准。用户批准完结不改变实际验证结果，跳过与平台缺口继续保留，不能称为完整发布验证通过。

### 历史交付记录

#### 对应工作项

- [Issue](2026-11-16-repo-release-v240-issue.md)
- 状态：已完成；用户验收通过，本地提交已批准；完整发布验证缺口保留

#### 实际交付

- 以正式标签 v2.3.0 为基线核对到本轮前 HEAD 的 11 笔提交，合并同一用户结果；Desktop 分页修复在 v2.3.0 标签内，不重复作为本次更新。
- 根 package.json 唯一产品版本更新为 2.4.0。
- 官网 Changelog 新增 2026-11-16“新增通知错误音，完善设置与 Studio 体验”；五条正文完全按用户审定，末条为“修复已知问题，优化使用体验。”。Extension 承载五条正文，API 仅保留标签，不新增未经批准文案。
- 官网产物位于 dist/build/exts-web，扩展产物位于 dist/build/chrome-mv3，ZIP 为 dist/release/exts-chrome.zip。未生成本版本 DMG，不使用已有旧包冒充 2.4.0 双包。
- 未修改业务实现、依赖版本或 CI，本地提交已获批准；未推送、打 Tag、部署或发布。

#### 本轮实际验证

| 命令/入口 | 实际结果 |
| --- | --- |
| node --test --test-concurrency=1 tests/build-release.test.mjs tests/extension-release.test.mjs tests/release-notes.test.mjs apps/desktop/tests/scripts/desk.test.mjs apps/api/tests/dev.test.mjs apps/website/tests/auth-requests.test.mjs apps/website/tests/shared/products/categories.test.ts apps/website/tests/pages/home/showcase/card-pool.test.ts packages/npm-release-tools/tests/publish.test.mjs | 72 项通过，含官网三份纯逻辑 |
| pnpm --filter @exts/extension test --maxWorkers 1 | 45 文件、182 项通过 |
| dist/.cache/api/venv/Scripts/python.exe -B -m unittest discover -s apps/api/tests | 65 项：57 通过、8 跳过 |
| pnpm --filter @linguio/wxt-stable-output test | 10 项通过 |
| pnpm --filter @linguio/wxt-stable-output typecheck | 通过 |
| pnpm --filter @linguio/wxt-stable-output verify:integration | 真实 tarball 独立安装、公开类型、WXT 首次/增量/静态资源/失败保留/恢复/重启通过并退出；预期注入的 missing-dependency 错误不是实际产品构建失败 |
| pnpm --filter @exts/extension typecheck | 通过 |
| pnpm --filter @exts/website typecheck | 通过 |
| pnpm web:build | 通过 |
| pnpm ext:release | 构建、资源及真实 ZIP 校验通过，版本 2.4.0 |
| node scripts/version.mjs；node scripts/release-notes.mjs | 根版本 2.4.0；正文只输出批准五条，无旧日志、分类或标题 |
| JSON/ZIP 核对 | Extension/API 两标签，五条正文，API 内容为空；构建与 ZIP 内 Manifest 均为 2.4.0 |
| git diff --check | 通过 |

##### 环境失败及一次恢复

首次 pnpm 测试入口尝试修复依赖目录时被沙箱权限阻止；直接运行已有 Vitest 后 179 项通过，Manifest 套件因缺少锁定的 @aklinker1/rollup-plugin-visualizer 无法加载。核对 pnpm 为 12.4.2、依赖在锁文件已固定为 5.12.0；执行一次获准的 pnpm install --frozen-lockfile，复用缓存恢复 6 个包、无下载、未升级，pnpm-lock.yaml 无差异。随后完整 Extension 182 项通过。没有删测试或改正常业务代码。

#### 测试适用性与入口覆盖审阅

清点现有 Extension 45 份、Website 3 份、API 11 份 Python、Desktop 12 份 Swift 测试；根脚本、内部包及启动脚本由当前 CI 所列入口分别执行。结合 v2.3.0 后实际生产调用核对以下范围：

| 具体范围 | 结论与依据 |
| --- | --- |
| Extension tests/lib/audio/notification-sounds.test.ts 与 src/features/settings/notification-audio.ts | 保留：默认关闭、仅 Error 发声、1秒首条节流、同 Toast 去重、失败不补播与关闭后试听是当前生产语义；App 和 Telegram 均有实际接入。此单元覆盖不声称验证了真实音频播放或浏览器解锁。 |
| Extension tests/lib/audio/synthesis.test.ts | 保留：原 ambient 测试已随噪声合成迁移，验证能量/峰值及循环信号，不是界面像素断言，没有失去旧行为覆盖。 |
| Extension tests/features/settings/schema.test.ts、api.test.ts、store.test.ts；API test_settings.py、test_postgres.py | 保留：本机与账号存储归属、单字段更新、旧数据缺字段默认关闭和严格布尔校验对应当前契约；API 与扩展覆盖不同实际边界。实库未配置，8 项缺口单列，不因 mock 测试通过就称数据库集成通过。 |
| Extension tests/features/activity/timer/sound-preference.test.ts | 保留独立静音、存储隔离及已移除音色回退。可选合并建议：旧 Rain 回退和已移除音色回退可将输入并入非法偏好数据表，减少部分重复；当前无契约冲突，本轮不改测试。 |
| Extension tests/pages/studio/account/state.test.ts | 保留：迁移后仍导入实际 account/state 和 routes，身份/会话/缺省路由断言与现行生产入口一致，无旧 login 目录失效引用。 |
| Extension tests/components/data-table.test.ts 与 query-data-table.test.ts | 保留：10条分页改变回首页、远端顺序及查询草稿/生效分离覆盖不同逻辑行为；没有增加固定表头像素、菜单或焦点测试。 |
| Extension tests/config/manifest.test.mjs、根 build/release 测试及稳定工具测试 | 保留：导入真实配置、Manifest/文件存在性、产物失败保留是构建边界，不是源码字符串或导入形式守卫。 |
| About、焦点外观、设置标签/1px分隔线、Tooltip/菜单及音色听感 | 不新增样式/交互测试；本轮变更为版本与日志，原交付已获用户验收，按仓库规则继续由用户浏览器检查。不能把类型/构建通过记作本轮视觉验收。 |
| Website 三份纯逻辑及 Release notes | 保留：分类解析、卡片池、认证请求仍有生产调用；Release notes 另核对最新真实五条输出。无额外重复的源码结构测试。 |
| Desktop 12 份 Swift 与现有 CI | 保留现有完整 extsTests（含压力用例），不缩减白名单；本次 Windows 未运行。CI 配置使用完整 xcodebuild test、禁用并行，再 pnpm release，不代表远端本轮已运行。 |

本轮未发现需要立即删除或更新的过期契约、视觉/指针模拟测试或失效入口；可选合并仅如上，不自动实施。需要补齐的验证是隔离 PostgreSQL 实库、macOS 原生与双端打包；不为这些环境缺口新增模拟测试或第二套框架。

#### 未验证与发布限制

- API_TEST_DATABASE_URL 未配置，8 项隔离 PostgreSQL 测试跳过，不借用已有生产库。虽然上一工作项已成功添加通知声音字段，不能代替本轮隔离库测试。
- Windows 无法执行 Swift/Xcode 12 份原生测试及 macOS 构建、DMG、双端同提交打包；未运行根 pnpm release 冒充可用。现有 GitHub CI 配置了原生检查和双包，但本轮未触发/未核实远端结果。
- 保留 Extension theme-init.js 非 module 和大 chunk 构建警告、Python Starlette/httpx 弃用提示；本轮未升级依赖或扩大优化。
- 官网和扩展界面未做浏览器验收。整体完整发布验证尚未完成，不声明已可公开发布。

#### 用户验收

2026-11-16 用户明确“验收通过 commit”，本次版本与日志交付验收通过，批准本地提交完结。正式发布前仍需补齐已列出的原生、双端打包和隔离库验证；未执行项不改记通过。

#### 提交方案

代码仅包含 package.json 与 apps/website/src/pages/changelog/data.ts，版本和日志五条更新；文档包含本 Issue、Commit 记录与工作台，终态同步为已完成、验收通过、提交已批准，工作台移入已完成索引。默认先代码后文档，用户已批准本地提交。

代码完整消息：

```text
chore(repo): 更新 2.4.0 版本与发布日志

- 将产品版本更新为 2.4.0
- 写入已审定的五条更新及 Extension、API 标签
```

文档完整消息：

```text
docs(repo): 记录 2.4.0 发布准备与验收结果

- 记录本轮验证结果与发布限制
- 同步验收通过及工作项完成状态
```

#### 最终提交批准

已批准。2026-11-16 用户明确“验收通过 commit”，按已展示两笔范围、完整消息与终态更新执行本地提交；不包含推送、Tag、部署、Release 创建或公开。

## 关联文档

- [验证规范](../../../verification.md)
- [构建发布规范](../../../build-release.md)

## 历史补充

### 元信息

- 当前阶段：用户验收通过，批准代码与文档两笔本地提交；macOS/隔离库发布验证缺口保留
- 批准依据：用户审定 2.4.0、标题“新增通知错误音，完善设置与 Studio 体验”、五条正文及 Extension/API 标签，并回复“可以”。

### 历史后续事项

按已批准范围完成两笔本地提交并完结；正式发布前仍须补齐已记录的 macOS 与隔离数据库检查，不自动推进发布。
