---
date: "2026-11-19"
scope: [build, website]
status: completed
type: task
---

# 整理官网更新日志并准备产品版本

## 当前阶段

已完成。

## 目标与范围

### 背景与目标

远端最新版本标签为v2.4.0，根产品版本仍为2.4.0。此后已交付Daily快捷编辑、编辑抽屉加载反馈、Toast复制/层级与Sheet协作，以及exts-ui公共包和按版本自动暂存。整理对使用者可见的变化，审定新产品版本及官网日志后实施。

### 范围与排除项

- 以远端v2.4.0为基线，核对到当前已完成提交的全部变更；官网更新入口为apps/website/src/pages/changelog/data.ts，产品唯一版本源为根package.json。
- 版本2.5.0，标题“新增 Daily 快捷编辑，完善通知体验”，按用户精选五条正文写入Extension三条、Packages两条；日期为北京时间2026-11-19。
- 更新官网最新条目，保留历史日志；核对Release正文提取遵循现有规则。npm包版本和包内中文Changelog独立维护，本次不自动升级或重新发布npm包。
- 审定后执行仓库规定的全量发布验证及测试适用性审查；Windows不能执行的macOS检查、无隔离数据库的检查如实记录待验证，不用生产环境补测。
- 不修改官网布局、样式、产品功能、依赖或CI；不自动清理测试，不提交、推送、打tag、部署或发布Release。发现阻塞范围外问题先说明。

## Todo

- [x] 核对正式标签与区间提交，形成版本和官网日志草稿。
- [x] 用户审定版本号、标题、分类及正文后写入根版本与官网Changelog。
- [x] 审查测试入口与覆盖，串行执行本机可运行的全量发布检查，记录平台限制和阻塞。
- [x] 展示验证结果与可复现验收步骤，停在用户验收。

## 验收标准

### 用户验收步骤

1. 审阅根package.json的2.5.0、官网data.ts顶部标题/2026-11-19日期与精选五条正文；旧条目保持。
2. 使用既有本地官网预览方式打开/changelog/，确认Extension与Packages标签、正文顺序；代理未执行浏览器验收。
3. 解压dist/release/exts-chrome.zip后在Chrome/Edge加载解压目录，或直接加载dist/build/chrome-mv3；扩展管理页应为2.5.0，检查Edit Daily入口、加载反馈和通知复制。
4. 在macOS补齐媒体逻辑XCTest、原生构建及DMG/双端打包，在显式隔离库补齐8项API检查；未满足前保持发布验证未完成，不使用生产库测试。

- 根版本和官网最新条目与用户审定内容一致，历史条目保持；新产品版本由现有构建机制传入扩展及桌面。
- Release正文只提取当前批准的新日志条目，不混入npm包独立版本或旧条目。
- 全量检查结果、失败、跳过与平台待验证清晰可追溯，不把本机局部通过称为已发布或全量发布通过。
- 用户可审阅版本、官网日志与生成说明，并按记录在所需平台完成产物验收。

## 唯一下一步

无。

## 交付记录

### 本轮验证与测试审查

- 根构建/发布、桌面/API启动、官网逻辑及npm发布规则共74项通过；扩展43文件181项通过；exts-ui 7项及stable-output 10项通过。扩展/官网类型、双包verify:npm均通过，后者包含真实tarball与独立消费者/WXT生命周期。
- API完整入口65项，57通过、8项因无显式隔离数据库跳过；显式清空API_TEST_DATABASE_URL，不读取生产连接。首次沙箱阻止uv trampoline，按权限提升运行原环境后通过，不修改API代码。
- 官网web:build通过，扩展ext:release通过，生成dist/release/exts-chrome.zip（713123字节），Manifest与根版本均为2.5.0。Release正文提取仅输出批准五条，Extension三条、Packages两条，日期2026-11-19。
- 审查区间变更及现有入口：保留daily.test.ts的最新记录/空记录/错误和查询契约、login-client.test.ts会话核验、公共包sound/message/copy纯逻辑及真实打包、publish.test.mjs版本判断与凭据校验；既有发布回滚和manifest文件检查属于真实产物边界，不能按读文件测试删除。官网轮换测试是数据轮换逻辑，不是像素/布局测量测试。无需更新、合并、删除或新增测试，未发现本区间新增的视觉/假DOM重复覆盖。
- root suite已包含三份官网逻辑与桌面/API启动及npm工具，不再重复跑这些入口；双包verify已包含各自类型/测试/构建/独立消费者，不重复单跑。macOS媒体纯逻辑XCTest及原生构建、DMG/双端打包只能在macOS执行，本轮未运行；现有Release CI有相应job，但本版本尚未触发，不称为CI兜底已通过。
- 既有theme-init非module及大chunk构建提示保留；未修改业务、依赖、CI、测试或npm包版本。浏览器展示由用户验收，未启动dev/watch。
- 本机可运行检查通过不等于完整发布验证通过：macOS与隔离数据库是明确待验证缺口，未提交、推送、打tag或发布。

### 历史交付记录

#### 对应工作项

- [Issue](2026-11-19-repo-release-next-issue.md)

#### 实际交付

用户提供五条最终正文后，沿用已拟定2.5.0与“新增 Daily 快捷编辑，完善通知体验”。根package.json为2.5.0；官网data.ts新增2026-11-19条目，Extension三条、Packages两条。旧条目保持，包名按官网既有纯文本展示，Release提取五条且顺序一致。

不修改官网布局、业务、依赖、测试、CI或独立npm版本，不重新发布npm包。v2.4.0为远端基线，区间全部提交已核对。

#### 验证与限制

本轮串行新执行，不借用其他工作项局部结果：

- node --test --test-concurrency=1：tests/build-release.test.mjs、extension-release.test.mjs、release-notes.test.mjs、桌面desk/API dev启动、官网auth/categories/card-pool、npm发布工具，共74通过。
- pnpm --filter @exts/extension test --maxWorkers 1：43文件181通过；扩展及官网typecheck通过。
- pnpm --filter @linguio/exts-ui verify:npm：7项逻辑、类型、ESM/CSS、真实tarball及独立消费者通过；产物目录dist/.cache/exts-ui-verify/b2eec492-97c9-42f5-ae59-bca8a4e3d808。
- pnpm --filter @linguio/wxt-stable-output verify:npm：10项、类型、真实tarball及WXT首次/增量/失败保留/恢复/重启通过；目录dist/.cache/npm-verify/wxt-stable-output-oEBbHl。
- API原虚拟环境unittest discover：65项，57通过、8无隔离库跳过；显式API_TEST_DATABASE_URL为空。首次uv trampoline权限拒绝后提升权限重试成功，不访问生产库。
- pnpm web:build、pnpm ext:release通过；dist/build/exts-web官网、dist/build/chrome-mv3扩展与dist/release/exts-chrome.zip生成。ZIP 713123字节，Manifest及根版本2.5.0。node scripts/release-notes.mjs输出精选五条。
- 测试适用性及入口审查见Issue：保留最新Daily/登录会话、声音/复制/消息、发布产物回滚与凭据、官网轮换纯逻辑；无须新增、更新、合并或删除。未自动运行视觉/交互测试，未引入假DOM。
- 现有theme-init非module与大chunk提示保留。Windows不能执行macOS XCTest、原生构建和DMG/双端打包；8项隔离库验证缺环境。本轮未运行远端CI，现有Release job不等于当前版本已验证。

结论：本机可运行检查通过，完整发布验证未完成。未提交、推送、打tag、部署或发布。

#### 用户验收

用户明确“前面的验收通过了，先提交到本地”，批准2.5.0与官网五条日志交付及两笔本地提交。复用已有结果，不追加验证；macOS与隔离库缺口仍须另补，不把未执行写为通过。API解释器查找问题不纳入本次提交。

#### 提交方案

代码提交已成功，文档随本记录提交。代码范围：package.json、apps/website/src/pages/changelog/data.ts。

```text
chore(repo): 更新产品版本至2.5.0并整理官网日志

- 写入 Daily 快捷编辑、通知与公共包五条发布说明
- 保持历史日志与独立 npm 包版本不变
```

文档范围：本Issue、本记录、docs/ohmy-delivery/readme.md。

```text
docs(repo): 记录2.5.0版本准备与发布验证结果

- 记录审定的五条日志和本机验证结果
- 保留 macOS 与隔离数据库待验证事项
```

最终提交前展示实际文件范围、消息、验证及限制；明确批准本地提交时仅同步Issue/本记录/工作台的完成、验收与提交批准状态，并保留发布验证未完成，不追加检查。不自动推送或发布。

#### 最终提交批准

已批准：2026-11-19用户明确验收通过并要求先提交到本地。按已展示文件与消息分别提交代码和文档，同步Issue、工作台及批准状态为已完成；完整发布验证未完成的限制保留，不推送、打tag、部署或发布。

## 关联文档

- [验证规范](../../../verification.md)
- [构建发布规范](../../../build-release.md)
- [上一产品版本](2026-11-16-repo-release-v240-issue.md)

## 历史补充

### 元信息

- 当前阶段：用户验收通过并批准代码与文档两笔本地提交；完整发布验证仍缺macOS与隔离库检查，未推送或发布
- 批准依据：用户要求“再写一个issue，你整理下官网，我需要更新版本和changelog”。
- 规模：产品版本与发布说明准备，按仓库规范执行发布验证；不包含官网重设计。

### 审定内容

版本：2.5.0。

标题：新增 Daily 快捷编辑，完善通知体验。

Extension：

- 首页 Actions 新增 Edit Daily，可直接编辑最新一条 Daily 记录，无需进入 Studio。
- 快捷编辑先打开抽屉并显示加载状态，减少首次查询时等待无反馈的问题。
- 统一通知展示，支持复制完整提示内容。

Packages：

- 新增 `@linguio/exts-ui` 公共组件包，统一基础组件与通知增强能力。
- 公开 npm 包支持按版本变化自动验证并上传暂存区，由维护者手动批准正式发布。

取舍：pnpm固定版本、内部迁移与README维护不逐笔作为产品功能，相关事实保留在本区间提交和原工作项；不把未改动的Website/Desktop/API列为新增功能。

### 历史后续事项

按用户批准完成两笔本地提交并完结工作项；完整发布前仍需补齐macOS与隔离库验证，不自动推送或发布。
