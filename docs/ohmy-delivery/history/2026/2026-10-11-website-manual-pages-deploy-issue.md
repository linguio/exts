---
date: "2026-10-11"
scope: website
status: completed
type: task
---

# 配置官网手动部署并统一 Actions 名称

## 当前阶段

已完成。

## 目标与范围

### 背景

官网已完成页面交付，当前未配置 GitHub Pages 部署。现有发布 Action 名称为 Exts Chrome Release。用户希望统一 Actions 名称，并由本人分别决定官网部署与产品发布的时机。

### 目标

用户可以在 Actions 中从 main 手动部署官网，最终通过 https://exts.linguio.dev/ 访问；产品发布流程独立保留手动打包与 Release 草稿审核。

### 范围

- 新增 Exts Website Deploy，仅使用 workflow_dispatch，仅允许 main 运行，不配置 push、pull_request、定时触发或路径监听。
- 使用仓库精确固定的 Node.js、pnpm 与 Actions 版本，冻结安装、网站类型检查、执行 web:build，并上传根 dist/build/exts-web 的静态产物到 GitHub Pages。
- 检查和构建成功后才执行部署；构建失败保留上一版网站。同一时间只执行一条官网部署流水线。
- 现有产品发布流程显示名称改为 Exts Release Deploy，保留现有手动触发、main 限制、扩展打包和 Release 草稿行为。
- 记录 Pages 发布源、自定义域名、DNS 与 HTTPS 的首次上线操作，以及两个流程的独立手动使用方式。
- 用户本人触发远程部署与发布；代理准备配置并执行必要的本地检查，实际上线结果由用户操作后确认。

### 排除项

- 不修改官网设计、文案、下载行为、产品版本或品牌资源，不升级业务依赖。
- 不新增自动部署、自动公开 Release、macOS 发布包、预览环境或其他部署平台。
- 不代替用户点击运行 workflow，不自动推送、提交代码或修改远程 Pages/DNS 设置；需要代理操作外部设置时另行明确授权。

## Todo

- [x] 确认用户可操作仓库 Pages 设置与 linguio.dev DNS，整理首次上线步骤。
- [x] 新增独立的官网手动部署 workflow，限制 main 并配置必要权限和并发控制。
- [x] 将现有发布 Action 显示名称改为 Exts Release Deploy，保持产品发布行为。
- [x] 同步网站说明，执行配置检查、网站类型检查与一次生产构建，核对部署产物。
- [x] 展示实际交付、限制和可复现验收步骤；用户确认实际部署与最终验收完成。

## 验收标准

- Actions 显示 Exts Website Deploy 与 Exts Release Deploy，两个流程独立手动触发；提交 main 不自动部署。
- 两个流程仅允许 main；产品发布仍生成草稿，不自动公开。
- 官网使用固定工具版本和根产物目录，安装、类型检查或构建失败时不进入部署步骤。
- 用户手动运行官网 workflow 成功，域名通过 HTTPS 可访问，静态资源可加载，原有下载链接保持正确；macOS 暂无附件的已接受限制保留。
- 用户在 Chrome 或 Edge 验收实际页面；代理不执行视觉或交互验收，不把本地构建通过写成远程上线成功。

## 唯一下一步

无。

## 交付记录

### 本地阶段结果

- 用户确认已完成 Pages/DNS 前置设置；代理未独立核验远程设置。
- 两份 workflow YAML 解析与配置检查通过：仅手动触发、main 限制、完整固定 Actions 版本、部署依赖构建成功、最小部署权限与不取消运行中的并发控制。产品发布流程对比 HEAD 仅显示名称改变。
- 网站类型检查、一次 web:build 通过；现有 tests/build-release.test.mjs 为 17/17 通过。产物 HTML 引用资源存在，无符号链接，两个固定 latest 下载链接正确。
- 未运行远程 Actions、未验证 Linux runner 冻结安装、Pages 环境策略、实际域名或 HTTPS；未执行视觉和交互验收。

### 最终验收结果

- 用户于 2026-10-11 明确确认“已经完成了”，最终验收通过。
- 代理只读访问 HTTPS 官网成功，线上 JavaScript 与本地构建产物 SHA-256 相同，两个按钮使用固定 latest 下载链接。
- macOS latest 链接实际 302 跳转到 v1.0.0 的同名 DMG 地址并返回 404，符合已接受的无 DMG 附件限制。
- 代理未独立核验 Actions 运行日志、环境规则或浏览器视觉与交互；这些验收以用户最终确认作为依据。前述本地阶段未上线记录为当时状态。

### 历史交付记录

#### 对应 Issue

- [Issue](2026-10-11-website-manual-pages-deploy-issue.md)

#### 预期交付边界

新增官网独立手动 GitHub Pages 部署，统一两个 Actions 显示名称，保持 main 限制与产品发布草稿行为；记录 exts.linguio.dev 首次上线步骤。远程部署由用户本人触发，不增加自动部署或修改页面功能。

#### 实际交付

- 新增 Exts Website Deploy，拆分构建与部署 job，仅 main 手动运行，构建成功后才部署根网站产物，同一时间仅运行一条官网部署流水线。
- 产品发布 Action 改名为 Exts Release Deploy，经对比确认其他内容不变。
- 官网说明补充 Pages、DNS、HTTPS 和两个流程的独立手动使用方式。

#### 验证结果

- 两份 YAML 解析通过；配置检查确认手动触发、main 限制、精确版本、构建依赖、部署权限与并发控制。
- 网站类型检查、web:build 通过，现有构建边界测试 17/17 通过。
- HTML 引用资源存在、产物无符号链接、两个 latest 下载链接正确。

#### 未验证事项与限制

用户已确认最终验收完成；代理只读确认 HTTPS 官网可访问、线上 JavaScript 与本地产物哈希一致，两个 latest 链接正确。代理未独立核验 Actions 日志、Linux runner 冻结安装或 Pages 环境规则，未执行浏览器视觉与交互验收。无 actionlint 工具，仅执行 YAML 解析与配置检查。DMG 附件仍不存在，实际请求返回 404，沿用已接受的范围限制。

#### 用户验收

本地阶段已验收：用户在看到交付范围、验证结果和完整 message 后明确要求“提交到本地”。用户于 2026-10-11 进一步明确确认“已经完成了”，最终验收已通过。

#### 最终提交批准

本地代码交付提交已批准：用户明确要求“提交到本地”；不包含推送或远程部署。此前本地代码提交已完成；最终验收现已通过，结项文档状态为已完成；用户明确要求完结之前工作项并提交到本地，结项提交已批准。

#### 最终 Commit message

```text
ci(website): 添加官网手动部署并统一发布流程名称

- 配置仅 main 手动触发的 GitHub Pages 部署
- 将产品发布流程命名为 Exts Release Deploy
- 补充域名配置与手动部署验收步骤
```

#### 可复现验收

1. 检查 .github/workflows/exts-website-deploy.yml：只有 workflow_dispatch，build 和 deploy 均限制 main；deploy 依赖 build，产物目录为 dist/build/exts-web。现有发布 workflow 除显示名称外不变。
2. 本地检查：pnpm --filter @exts/website typecheck；pnpm web:build；node --test tests/build-release.test.mjs。
3. 提交并推送批准范围后，在 Actions 确认两个名称；提交本身不应触发部署。运行 Exts Website Deploy，选择 main，确认构建与部署成功。其他分支运行应跳过两个 job。
4. 在 Chrome 或 Edge 打开 https://exts.linguio.dev/，确认 HTTPS、品牌资源与页面内容正常；Chrome/macOS 按钮保持对应固定 latest 链接，macOS 无附件的已接受限制保留。
5. 确认官网部署没有启动产品发布；不要为验收改名而运行 Exts Release Deploy，已有版本的冲突保护仍保留。

#### 结项提交审批材料

范围仅为本 Issue、对应 Commit 记录和工作台三份文档；记录用户最终验收与线上只读核验结果。已批准的机械性终态更新：Issue 状态改为已完成、唯一下一步改为无；本记录结项状态改为已完成、结项提交批准改为已批准；工作台清空当前 Issue 并将本项移入已完成。

```text
docs(website): 记录官网上线验收并完结部署工作项

- 记录用户最终验收与线上链接核验结果
- 同步 Issue、Commit 记录和工作台完成状态
```

## 关联文档

- [工作台](../../readme.md)
- [官网说明](../../../../apps/website/README.md)
- [构建与分发规范](../../../build-release.md)
- [前置发布 Issue](2026-10-11-exts-fixed-release-assets-issue.md)

## 历史补充

### 元信息

- 类型：部署配置任务；涉及构建与分发配置，交付边界明确，使用本 Issue 的 Todo 组织实施
- 当前阶段：用户已确认最终验收完成，并批准本地结项提交
- 用户批准：官网部署到 GitHub Pages 并接入 exts.linguio.dev；两个流程分别命名为 Exts Website Deploy、Exts Release Deploy，独立运行，仅允许 main 手动触发。用户明确要求部署均由本人手动操作，提交代码不自动部署；用户已确认前置设置完成并要求代理继续配置

### 历史后续事项

无；本工作项已验收完成并获批准提交。
