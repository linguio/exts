---
date: "2026-10-11"
scope: build
status: completed
type: feature
---

# 固定发布包名并接入官网最新下载

## 当前阶段

已完成。

## 目标与范围

### 背景

当前分发包名包含版本，官网用根版本拼接对应 Tag 的下载地址，扩展发布新版本后需要重新部署官网才能更新链接。用户希望简化为固定包名，每个 Release 只上传一份包，官网使用 GitHub latest 附件直链，不查询 API、不做附件存在或下载结果判断。

### 目标

每个正式 Release 使用固定附件名 exts-chrome.zip、exts-mac.dmg；产品内部版本与 Release Tag 保留版本号。官网链接随 GitHub Latest Release 自动转向新附件，无需因产品版本变化重新部署网站。

### 范围

- Chrome ZIP 固定命名 exts-chrome.zip，macOS DMG 固定命名 exts-mac.dmg；不再额外上传带版本号副本。
- 根 package.json 的 version 仍为唯一产品版本源；构建写入 Manifest、应用内部版本，Release Tag 使用 v<版本>，Release 标题保留版本。开发、构建和发布不自动增加或改写根版本。
- 本地直接输出 dist/release/exts-chrome.zip、exts-mac.dmg，不增加版本目录；新包在同目录 .exts-staging-<随机值> 中生成和校验，成功后替换旧包，失败保留旧包。本地允许重复构建替换，远程同版本发布仍拒绝重复；dev/build 名称与路径不改。
- 官网 Chrome 使用 https://github.com/linguio/exts/releases/latest/download/exts-chrome.zip，macOS 使用 https://github.com/linguio/exts/releases/latest/download/exts-mac.dmg。
- 两个平台按钮保持直接链接，不添加 API、预检、重试、下载状态提示或自动识别版本。
- 用户于 2026-10-11 明确追加扩展 newtab 的 tab title 与网站 title 一致：Exts — 将想法与能力延伸为实用工具；仅调整标题，不改变新标签页功能或布局。
- 用户同日明确追加扩展 Manifest description 为“将想法与能力延伸为实用工具”，替换原“我的标签页，保存和组织我喜爱的网站。”。
- 正式 Release 发布前确认其固定附件完整，并确保该 Release 为 Latest；新 Release 缺少附件时不自动回退旧版本。macOS 暂无发布包是用户明确接受的状态，不以此扩展桌面交付范围。
- 同步构建分发规范、发布说明、必要测试与网站说明；除用户本次明确批准删除并重建的 v1.0.0 Tag/Release/附件外，其他历史 Release、Tag 和附件保留，不自动重命名或覆盖。

### 排除项

- 不部署 GitHub Pages、修改 DNS 或启用 HTTPS；域名 exts.linguio.dev 上线仍是后续独立工作项。
- 除已明确批准的新标签页标题与扩展描述同步外，不修改产品功能、页面布局、品牌资源、依赖版本或其他应用模块。
- 不实现客户端自动更新、自动升版本、前端 GitHub API 或下载结果检测。
- 仅允许重建 v1.0.0，保留其他历史 Release/Tag 与用户已下载的文件；不创建测试 Release，不 force push 主分支，不以本次授权修改无关远程资源。
- 不为了让 macOS 链接当前可用而构建或发布尚未验收的桌面安装包。

## Todo

- [x] 固定路径与替换规则、书面设计与精简实施 Plan 已确认。
- [x] 调整打包流程，生成固定包名并保持内部版本、根版本与 Tag 一致。
- [x] 调整现有发布 workflow，上传固定附件名，不上传版本名副本，保留草稿审核与发布保护。
- [x] 官网切换两个固定 latest 直链，移除下载链接对网站构建版本的依赖。
- [x] 调整必要打包与失败保护测试，同步文档，执行受影响的安装、类型检查、测试与构建验证。
- [x] 展示交付与可复现验收步骤；用户明确确认前述事项全部验证完成并要求结项。

## 验收标准

- 新发布附件名称固定，同一平台仅上传一份包；包内部版本正确，Release Tag 与根版本一致。
- 修改或发布新版本不自动改写根 package.json，不改写旧 Release，也不会使已安装客户端自行更新。
- 本地重复打包在新包校验成功后替换固定目标，生成/校验失败旧包不变；替换异常能恢复旧文件或保留可诊断备份，不报告成功。远程同版本拒绝重复发布，本次 v1.0.0 重建是已明确批准的例外。
- 官网按钮直接访问两个固定 latest 链接，不访问 API，不猜测最新版本、不检测附件或下载结果。
- 新正式 Release 被设为 Latest 且包含同名附件时，固定链接转向新包；历史包仍可从对应版本页面下载。官网无需为这一切换重新部署。
- macOS 无附件时允许链接不存在，符合用户明确接受的范围，不声称已验证成功下载。
- 扩展 newtab 标签标题与网站 title 同为 Exts — 将想法与能力延伸为实用工具，最终构建产物中保持一致。
- 正式扩展 Manifest description 为“将想法与能力延伸为实用工具”。
- 必要自动化验证通过；真实附件上传、Latest 切换和用户下载与自动化验证分别记录，不把尚未执行的远程验收写成完成。

## 唯一下一步

无。

## 交付记录

### 本地阶段验证

- 打包与替换测试 19/19、稳定发布工具 8/8、扩展 15/15 通过；扩展和网站类型检查、构建、体积门禁与冻结安装通过。
- 实际固定名 Chrome ZIP 为 228263 字节，包内版本 1.0.0、description 与 newtab title 符合要求；网站产物含两个固定 latest 直链，根版本与依赖未修改。
- 未执行用户 Chrome 视觉或交互验收，未真实构建 DMG；CI、Latest 与公开附件状态尚待最终代码提交后核验。

### 用户最终验收

2026-10-11 用户明确表示“前面的那些我都验证完了”，并要求完结当前 Issue、开始下一项。此前记载的远程未执行状态为当时的历史记录，现以本次用户验收确认收口；代理本轮因 GitHub 域名解析失败未独立复核远程状态，不新增远程运行编号或附件检测数据。未实际构建 DMG 的原范围限制保留。

### 历史交付记录

#### 对应 Issue

- [Issue](2026-10-11-exts-fixed-release-assets-issue.md)

#### 预期交付边界

统一 ZIP、DMG 固定附件名，保持根版本、包内部版本与 Release Tag 规则；更新发布流程和官网 latest 直链，不上传版本名副本，不包含域名部署、无关历史发布修改或自动升版本；用户已明确批准单独删除旧 v1.0.0 Tag/Release/附件并以固定包名重发该版本。

#### 实际交付

- 本地 ZIP/DMG 固定为根 dist/release/exts-chrome.zip、exts-mac.dmg，新包暂存生成与校验后安全替换；生成/校验失败保留旧包，部分替换失败回滚，恢复也失败时保留可诊断备份。
- Chrome 发布 workflow 上传固定文件名；官网使用固定 latest/download 直链，移除客户端下载版本注入，仍在构建时校验根产品版本。
- 扩展 newtab title 为 Exts — 将想法与能力延伸为实用工具，Manifest description 为“将想法与能力延伸为实用工具”，已进入实际新 ZIP。
- 更新相关构建规范、应用 README 与必要打包保护测试；dev/build 名称、根版本和第三方依赖不变。
- 已按用户批准删除旧 v1.0.0 本地/远程 Tag、Release 与附件并核对；新发布尚未创建，不把本地完成写成远程成功。

#### 验证结果

- 先观察固定包名与恢复行为的预期失败，再完成实现；Node 打包/替换测试 19/19 通过，包括真实 ZIP 重打包替换、DMG 校验失败保留旧包、两包替换中断回滚和恢复失败保留备份。
- 稳定发布工具测试 8/8、扩展测试 15/15 通过；Vitest 使用单 worker 串行，未启动 watch、dev server 或浏览器验收。
- 固定 pnpm 12.4.2 冻结安装通过，扩展与网站类型检查通过；pnpm ext:release 一次完成实际 Chrome 构建和 ZIP 校验，pnpm web:build 通过。
- 实际 ZIP 大小 228263 字节，根 Manifest version 为 1.0.0、description 正确，newtab title 与网站一致；暂存目录已清理，未改根 version 或依赖。
- 扩展体积门禁通过：JS gzip 112364 字节、CSS gzip 4796 字节、字体 69652 字节，无 source map。
- 网站生产产物包含 Chrome/macOS 固定 latest 直链，不包含旧客户端版本注入或 API 请求；git diff --check 通过。

#### 未验证事项与限制

本地已通过验证，用户实际 Chrome 加载与页面交互仍待阶段验收。未真实构建或发布 DMG，macOS 固定链接当前无附件为用户明确接受的范围；DMG 调度和两包替换保护采用文件系统测试与系统命令替代实现验证，不等于 macOS 工具实测。

新 v1.0.0 Tag/Release/固定附件尚未创建，因此 latest 链接的真实公开状态未验收。旧同版本发布已按用户批准删除；其重建需要最终代码提交、推送与 CI 完成。其他历史发布保留，没有测试 Release 或主分支 force push。

#### 可复现验收

1. 检查根 dist/release/exts-chrome.zip，解压到独立目录；Chrome 打开 chrome://extensions，开启开发者模式并加载解压目录。也可重新加载根 dist/build/chrome-mv3；生产目录此阶段不写入稳定 dev 目录。
2. 确认新标签页标题为 Exts — 将想法与能力延伸为实用工具；扩展管理页描述为“将想法与能力延伸为实用工具”，Manifest 内部版本仍为 1.0.0。
3. 运行 pnpm web:dev，确认按钮顺序、黑色样式不变；检查 macOS/Chrome 链接分别为 releases/latest/download/exts-mac.dmg、exts-chrome.zip，不包含构建版本。
4. 此时新 Release 未发布，链接可暂时不可用；最终代码提交并重发后再核对 Chrome latest 链接直接下载固定名 ZIP，Release 为 Latest、Tag 对应实际构建 Commit，附件只有固定名 Chrome 包。
5. 本地安全替换及失败保留可复现：node --test tests/build-release.test.mjs tests/extension-release.test.mjs；该测试不代表真实 Windows 文件占用或实际 DMG 发布验收。

#### 用户验收

本地阶段已通过：用户于 2026-10-11 在看到交付、验证与拆分范围后明确要求“可以 提交到本地”；此请求同时表示本地阶段验收通过。远程 Latest 与公开附件状态仍待重发后验证。

#### 本地阶段交付状态

随第三笔本地提交完成代码交付；Issue 保持实施中，v1.0.0 重发与远程验收尚未完成，不写为整体已完成。

#### 最终提交批准

已批准三笔本地提交：用户明确指定三个 Commit 并要求提交到本地；执行前已展示每笔完整 message。第三笔包括本地阶段完成与远程待重发状态更新，不提前将 Issue 写为已完成。远程授权仅覆盖重建 v1.0.0，其他历史发布保留。

#### 最终 Commit message

本记录对应第三笔代码交付 Commit；前两笔为用户明确批准的文档与构建提交，不保存 Commit SHA。当前 Issue 整体尚未完成，远程结果后续准确记录：

```text
feat(exts): 同步官网最新下载与扩展品牌文案

- 将官网按钮改为固定 latest 下载直链
- 统一扩展新标签页标题与产品描述
- 移除下载版本注入并同步阶段验收记录
```

#### 最终验收与结项补充

- 用户于 2026-10-11 明确确认前述事项全部验证完成，并要求完结当前 Issue。前文远程待验收描述保留为本地交付时的历史状态。
- 最终用户验收：已通过；本轮代理未独立复核远程发布，GitHub 域名解析失败。DMG 未实际构建的原范围限制保留。
- 结项记录状态：已完成；结项记录本地提交批准：已批准，用户明确要求提交一个 Commit 完结之前工作项。
- 已批准的机械性终态更新：Issue 改为已完成、唯一下一步改为无；本记录结项状态改为已完成、提交批准改为已批准；工作台将本 Issue 移入已完成并清空当前 Issue。

结项记录提交 message（此前三笔交付 message 保留为历史记录）：

```text
docs(exts): 记录发布验收并完结固定包名工作项

- 记录用户最终验收确认与远程复核限制
- 同步 Issue、Commit 记录和工作台完成状态
```

## 关联文档

- [前置官网 Issue](2026-10-11-website-product-homepage-issue.md)
- [构建与分发规范](../../../build-release.md)
- [GitHub 官方 latest 附件链接说明](https://docs.github.com/en/repositories/releasing-projects-on-github/linking-to-releases)
- [Spec](../../../superpowers/specs/2026-10-11-exts-fixed-release-assets-design.md)
- [Plan](../../../superpowers/plans/2026-10-11-exts-fixed-release-assets.md)

## 历史补充

### 元信息

- 类型：架构任务；调整构建分发约定，一个独立交付 Issue
- 当前阶段：用户已确认全部验证完成，并明确批准本地结项提交；远程验收以用户确认作为事实依据，本轮代理未独立复核
- 用户批准：固定包名与 latest 直链需求已确认；2026-10-11 用户明确要求启动本 Issue、删除并重建 v1.0.0 Tag，并在询问后批准删除旧 v1.0.0 Release 及附件。授权仅涉及该版本，其他历史 Tag/Release 保留。用户已明确确认产物直接放根 release、新包暂存校验成功后替换旧包、失败保留旧包；最终代码提交前需展示范围与完整 message，GitHub 现有认证可安全复用，重发需等待本地验证与最终代码提交

### 已执行远程操作

- 2026-10-11 按用户明确批准删除远程与本地 v1.0.0 Tag，核对均不存在；tg-download-v1.0.0 等其他 Tag 保留。
- 复用 Git 现有认证读取并删除对应 v1.0.0 Release 及 exts-chrome-1.0.0.zip 附件，核对 Release 不存在；凭据未显示、未写入文件。
- 新发布脚本与官网 latest 链接已在本地实现并验证；根版本不变，尚未提交或创建新 Tag/Release。

### 历史后续事项

无；本工作项已完成，后续官网部署作为独立 Issue 讨论。
