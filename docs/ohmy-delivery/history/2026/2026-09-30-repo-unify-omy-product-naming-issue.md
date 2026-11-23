---
date: "2026-09-30"
scope: [repo, extension, desktop, website]
status: completed
type: task
---

# 统一 OmyExts 仓库与产品命名

## 当前阶段

已完成。

## 目标与范围

### 背景

当前仓库使用 `my-extensions`、`@my-extensions/*`、My Tabs、TG Download 等历史名称，应用目录同时包含 `extensions/`、`helpers/` 与 `web/`。这些名称无法形成统一产品体系，`web/` 也没有准确表达该项目仅作为统一官网的职责。

用户已确认采用 Omy 命名体系：仓库与官网品牌为 OmyExts，新标签页产品为 OmyTabs，媒体下载产品为 OmyDL；浏览器扩展保留在 `extensions/`，官网使用 `website/`。现有 X Download 与 X Download Helper 暂时不能同步迁移，本工作项必须在不切断其既有通信和开发流程的前提下完成其余命名改造。

### 目标

将本地仓库品牌统一为 OmyExts，将当前可独立迁移的 My Tabs、TG Download 与官网分别统一为 OmyTabs、OmyDL 与 Website，并同步目录、workspace 包名、根命令、扩展展示名、构建发布配置、自动化测试和现行文档引用；暂缓 X Download Helper 的桌面端迁移。

### 范围

- 将根包名从 `my-extensions` 调整为 `omyexts`，将所有当前 workspace 包的 `@my-extensions/*` scope 统一调整为 `@omyexts/*`。
- 将 `apps/extensions/my-tabs/` 调整为 `apps/extensions/omytabs/`，同步包名、根命令、扩展展示名、Logo 文件名与引用、构建产物路径、测试和现行文档。
- 将 `apps/extensions/tg-download/` 调整为 `apps/extensions/omydl/`，同步包名、根命令、扩展展示名、Logo 文件名与引用、构建产物、运行时内部标识、测试和现行文档。
- 将 `apps/web/` 调整为 `apps/website/`，同步包名、根命令、pnpm workspace、Turbo filter、VitePress 品牌和现行文档。
- 根开发命令统一为 `website:dev`、`omytabs:dev`、`omydl:dev`；暂时保留 `x:dev` 与 `x-helper:dev`。
- 将仓库官网品牌从 My Extensions 统一为 OmyExts；官网项目不使用 OmySite 作为独立产品名。
- 将 TG Download 草稿发布工作流、触发路径、workspace filter、tag 前缀、ZIP 名称、Release 标题与说明调整为 OmyDL。
- 将 TG Download 的持久化下载历史键、文件选择器 ID、运行时消息、页面事件和样式标识直接调整为 OmyDL，不保留旧键、旧 ID 或兼容读取逻辑；旧历史记录和已记住的保存目录不纳入本次保留范围。
- 更新根 README、Monorepo、WXT、迁移指南、共享开发工具 README 与当前协作规则中的现行名称和路径。
- 重新生成并验证 `pnpm-lock.yaml` 的 workspace importer 与内部包引用，不升级依赖版本。
- 更新本 Issue、Commit 记录和工作台状态。

### 排除项

- 不将 `apps/extensions/x-download/` 的功能或代码并入 OmyDL；该合并另建独立 Issue。
- 不移动或重命名 `apps/helpers/x-download-helper/`，不修改其 Xcode 工程、Target、App、Native Host、Bundle Identifier、Socket、脚本或 `x-helper:dev` 命令。
- 不创建 `apps/desktop/omydl/`；X Download Helper 准备完成后再通过独立 Issue 迁移，并在成功后移除空的 `helpers/`。
- 不改变 OmyTabs 与 OmyDL 当前已交付的业务行为、权限、数据模型或界面设计。
- 不新增下载平台、下载能力、网络服务、第三方依赖或发布渠道。
- 不重绘 Logo，不改变图案构图、比例或颜色；只调整与产品更名直接相关的资源文件名和引用。
- 不批量修改历史 Issue、Commit、Spec、Plan、复盘与文章中的旧名称；这些文件保留当时事实。
- 不操作 GitHub 仓库改名、仓库设置、远端地址、商店后台、外部发布状态或远端推送；这些操作由用户执行。
- 不在当前打开的工作区中重命名本地 checkout 根目录；由用户在合适的停止点处理。

## Todo

- [x] 编写并批准迁移 Spec，记录完整旧名到新名映射、数据重置边界、发布版本和停止点。
- [x] 编写并批准实施 Plan，列出串行移动顺序、受影响配置、验证方式和用户验收步骤。
- [x] 迁移 OmyExts 仓库品牌、workspace scope 与官网项目。
- [x] 迁移 OmyTabs 的目录、包名、命令、展示标识、资源和现行引用。
- [x] 迁移 OmyDL 浏览器扩展的目录、包名、命令、展示标识、内部标识、发布工作流和现行引用。
- [x] 执行配置、逻辑、测试、类型检查与构建验证，整理 Chrome/Edge 用户验收和 GitHub 侧切换清单。
- [x] 用户验收通过并批准本地 Git Commit。

## 验收标准

- 根包名为 `omyexts`；所有当前 workspace 包和内部依赖统一使用 `@omyexts/*`。
- 当前应用目录为 `apps/extensions/omytabs/`、`apps/extensions/omydl/`、`apps/extensions/x-download/`、`apps/helpers/x-download-helper/` 与 `apps/website/`。
- OmyTabs 的目录、包名、根命令、扩展展示名、资源路径和现行文档一致使用 `omytabs` / `OmyTabs`。
- OmyDL 的目录、包名、根命令、扩展展示名、构建产物、发布工作流和现行文档一致使用 `omydl` / `OmyDL`。
- 官网目录、包名和根命令使用 `website`，页面品牌使用 OmyExts，不出现 OmySite 产品名。
- 根命令包含 `website:dev`、`omytabs:dev`、`omydl:dev`、`x:dev` 与 `x-helper:dev`，不再保留 `vitepress:dev`、`tabs:dev` 或 `tg:dev`。
- OmyDL 更名后统一使用新的存储键、文件选择器 ID、运行时消息和资源标识；旧下载历史与旧文件选择器目录记忆不属于本次交付。
- 现有 X Download 与 X Download Helper 的目录、Native Messaging 标识、Bundle Identifier 和通信行为保持不变。
- Node 配置、WXT 配置、VitePress 配置、发布工作流与锁文件可解析；Issue 与 Plan 约定的测试、类型检查和构建按实际结果记录。
- 用户能按验收步骤加载 OmyTabs、OmyDL 和官网构建产物，确认核心既有流程可用。
- 提供 GitHub 仓库改名、远端地址和外部平台更新清单，但不代替用户执行。

## 唯一下一步

无。

## 交付记录

### 历史交付记录

#### 元信息

- 工作项：`2026-09-30-repo-unify-omy-product-naming`
- 对应 Issue：[统一 OmyExts 仓库与产品命名](2026-09-30-repo-unify-omy-product-naming-issue.md)
- 状态：已完成
- 用户验收：已通过
- 最终提交批准：已批准
- 创建日期：2026-09-30
- 最近更新：2026-09-30

#### 预期交付边界

- 将本地仓库品牌、根包名与 workspace scope 统一为 OmyExts、`omyexts` 与 `@omyexts/*`。
- 将 My Tabs 完整迁移为 OmyTabs，将 TG Download 浏览器扩展完整迁移为 OmyDL。
- 将唯一官网从 `apps/web` 迁移到 `apps/website`，使用 OmyExts 展示品牌。
- 同步根命令、资源路径、测试、构建产物、发布工作流、锁文件和现行文档引用。
- OmyDL 直接切换到新的存储键、文件选择器 ID、运行时消息和资源标识，不保留旧历史或旧文件选择器目录记忆。
- 保持 X Download 与 X Download Helper 的目录、标识、命令和通信行为不变；不实施桌面端迁移或 X 功能合并。
- 只提供 GitHub 侧切换清单，不执行仓库改名、远端配置或推送。

#### 实际完成内容

- 根包名、workspace scope、官网目录与 OmyExts 现行文档已统一；当前 workspace 包为 `@omyexts/*`。
- OmyTabs 已迁移到 `apps/extensions/omytabs`，同步更新 Logo、Manifest、入口标题、包名、根命令、测试与稳定构建引用。
- OmyDL 已迁移到 `apps/extensions/omydl`，同步更新内部存储键、文件选择器 ID、运行时消息、页面事件、主题消息、样式前缀、Logo、发布 ZIP 与 GitHub Draft Release 工作流。
- X Download 仅同步 workspace scope 与稳定包引用；X Download Helper 的路径、Native Host、Bundle Identifier、命令和通信契约未修改。

#### 验证结果

- 官网：`apps/website/node_modules/.bin/vitepress build apps/website` 通过。
- OmyTabs：Vitest 8 个文件/33 项通过；`tsc --noEmit` 通过；`wxt build` 通过，产物总大小 506.79 kB。
- OmyDL：Vitest 15 个文件/77 项通过；`tsc --noEmit` 通过；`wxt build` 与 `wxt zip` 通过，生成 `dist/omydl-1.0.0-chromium.zip`。
- 共享包：Vitest 1 个文件/7 项通过；Turbo workspace 列出 5 个 `@omyexts/*` 包；X Download `tsc --noEmit` 与 `wxt build` 通过。
- `git diff --check` 通过；当前引用扫描未发现活动的旧 scope、旧目录、旧根命令或旧产品展示名。

#### 未验证事项与限制

- pnpm CLI 在当前本地环境中无输出挂起，因此锁文件按未升级依赖的 importer/path/internal-name 机械变化同步；验证使用各 workspace 已安装的本地可执行文件。
- 浏览器加载、扩展交互与官网视觉结果由用户验收。
- 本次不保留旧下载历史和旧文件选择器目录记忆。
- GitHub 仓库改名、远端地址、商店后台和外部平台更新由用户执行。

#### 用户验收

- 结果：已通过
- 说明：用户明确要求拆分并创建本地 Git commit，视为验收通过和提交批准。

#### 拆分后的 Commit message

1. `refactor(repo): 统一 workspace 与官网命名`
2. `refactor(omytabs): 迁移新标签页扩展命名`
3. `refactor(omydl): 迁移下载扩展命名与发布流程`
4. `docs(repo): 完成命名迁移交付记录`

- 前三个 commit 按仓库/官网、OmyTabs、OmyDL 功能边界拆分
- 最后一个 commit 收敛 Issue、Commit 记录和工作台的最终状态
- 保持 X Download Helper 的 Native Messaging 边界不变

#### 最终提交批准

- 状态：已批准
- 说明：已按拆分后的功能边界创建本地 Git commit，未执行远端推送或 GitHub 操作。

## 关联文档

- [Spec：统一 OmyExts 仓库与产品命名设计](../../../superpowers/specs/2026-09-30-repo-unify-omy-product-naming-design.md)
- [Plan：统一 OmyExts 仓库与产品命名实施计划](../../../superpowers/plans/2026-09-30-repo-unify-omy-product-naming.md)

## 历史补充

### 元信息

- 类型：架构任务
- 当前阶段：最终交付 Commit 已完成
- 最近更新：2026-09-30

### 最终命名

```text
仓库名：omyexts
展示品牌：OmyExts
npm scope：@omyexts

apps/
├─ extensions/
│  ├─ omytabs/
│  ├─ omydl/
│  └─ x-download/        # 暂时保留，后续并入 OmyDL
├─ helpers/
│  └─ x-download-helper/  # 暂时保留，后续迁入 desktop/omydl
└─ website/
```

未来桌面端迁移完成后的目标分类为 `extensions/`、`desktop/`、`website/`；`desktop` 表示桌面平台分类，即使包含多个应用也不使用 `desktops`。

### 历史后续事项

无；GitHub 仓库改名、远端地址和外部平台切换由用户执行。
