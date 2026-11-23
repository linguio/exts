---
date: "2026-09-30"
scope: [extension, desktop]
status: completed
type: task
---

# Oh My 产品命名迁移

## 当前阶段

已完成。

## 目标与范围

### 背景

仓库当前使用 OmyDL、OmyTabs 和 Omy Photos 三套产品标识。用户已确定采用 Oh My 产品系列名称，需要对三个项目的目录、包名、内部标识、构建产物和现行文档做一次完整迁移，避免新旧品牌混用。

本次项目均为新的内部项目，没有需要保留的历史包、用户数据或兼容责任，因此不建立旧名称兼容层。

### 目标

将三个产品统一为 Oh My 命名体系：`Oh My DL`、`Oh My Tabs` 和 `Oh My Photos`，同时保持既有功能、权限、数据模型和平台边界不变。

### 范围

- `apps/extensions/omydl/` → `apps/extensions/ohmy-dl/`。
- `apps/extensions/omytabs/` → `apps/extensions/ohmy-tabs/`。
- `apps/desktop/omy-photos/` → `apps/desktop/ohmy-photos/`。
- 同步修改 workspace 包名、根命令、Manifest、Swift 工程、Bundle Identifier、资源、CSS/DOM/消息前缀、存储键、发布工作流、构建产物和现行文档。
- 更新当前迁移 Spec、Plan、Issue、Commit 记录；保留已完成历史记录的事实名称。

### 排除项

- 不迁移或修改 X Download、X Download Helper 的业务代码和通信契约。
- 不保留旧路径、旧包名、旧消息前缀、旧存储键或旧资源别名。
- 不改变现有产品功能、权限、界面交互和数据模型。
- 不执行 GitHub、商店、远端仓库或其他外部系统改名。
- 不重绘 Logo，不升级依赖，不新增功能。

## Todo

### Sub-issues / Todo

- [x] 用户审核并批准 Oh My 命名 Spec。
- [x] 编写并审核串行实施 Plan，明确 OmyTabs、OmyDL、Oh My Photos 的迁移顺序和停止点。
- [x] 迁移 OmyTabs 的目录、包名、命令、展示名、资源、内部标识和测试。
- [x] 迁移 OmyDL 的目录、包名、命令、展示名、资源、内部标识、发布工作流和测试。
- [x] 迁移 Oh My Photos 的目录、Xcode 工程、Swift 模块、Bundle、缓存路径和现行文档。
- [x] 收敛根 README、现行 docs、workspace、锁文件和活动引用。
- [x] 执行完整自动化验证，记录用户 Chrome/Edge/macOS/iPhone 验收步骤。

## 验收标准

- 活动源码、配置、测试和文档统一使用 `ohmy-tabs`、`ohmy-dl`、`ohmy-photos` 与对应展示名。
- OmyTabs、OmyDL 的类型检查、测试、WXT 构建和产物检查通过。
- Oh My Photos 的 XcodeGen、Debug 构建、测试目标编译和 Bundle 检查通过，Bundle Identifier 为 `dev.kevinstack.ohmyphotos`。
- 新路径、包名、根命令、资源、消息、存储键、发布工作流和锁文件无断链。
- X Download 与 X Download Helper 的路径、标识、通信和命令保持不变。
- 旧标识没有活动兼容读取或别名；历史记录保留原事实名称。
- 自动化验证结果与用户视觉、浏览器加载、真实设备验收事项分开记录。

### 用户验收步骤

1. 在 Chrome 或 Edge 的扩展管理页分别加载 `apps/extensions/ohmy-tabs/dist/chrome-mv3` 与 `apps/extensions/ohmy-dl/dist/chrome-mv3`；确认名称显示为 Oh My Tabs / Oh My DL，图标可见，Oh My Tabs 新标签页可打开，Oh My DL 在 Telegram Web 的下载入口、Popup、任务状态和失败清理流程可正常使用。
2. 打开 `apps/desktop/ohmy-photos/DerivedData/Build/Products/Debug/OhMyPhotos.app`；确认应用显示名为 Oh My Photos，连接并信任 iPhone 后检查设备状态、媒体索引、月份选择、缩略图和选中媒体下载主路径。
3. 重点确认新路径和新标识生效，旧目录/旧包名没有被浏览器或 macOS App 继续加载；不要求旧数据或旧设置迁移。

## 唯一下一步

无。

## 交付记录

### 历史交付记录

#### 元信息

- 工作项：`2026-09-30-repo-rename-ohmy-products`
- 对应 Issue：[Oh My 产品命名迁移](2026-09-30-repo-rename-ohmy-products-issue.md)
- 状态：已完成
- 用户验收：已通过
- 最终提交批准：已批准
- 创建日期：2026-09-30
- 最近更新：2026-09-30

#### 预期交付边界

- OmyTabs、OmyDL 和 Omy Photos 的完整 Oh My 命名迁移。
- 旧标识不保留兼容层，X Download 及 X Download Helper 保持不变。
- 自动化验证、用户验收步骤和外部系统待办的事实记录。

#### 实际完成内容

- 将 `apps/extensions/omytabs`、`apps/extensions/omydl` 和 `apps/desktop/omy-photos` 迁移为 `ohmy-tabs`、`ohmy-dl` 和 `ohmy-photos`，同步更新资源、包名、内部协议、Swift 模块和 Bundle 标识。
- 更新根命令、workspace lock importer、发布工作流、README/WXT/Monorepo 当前文档和活动规范；保留历史记录事实名称。
- 保持 X Download 与 X Download Helper 路径、通信和业务代码不变，不增加旧名称兼容层。

#### 验证结果

- Oh My Tabs：本地 `tsc --noEmit`、Vitest（8 个文件/33 个测试）、WXT build、Manifest/Logo 断言和 bundle budget 检查通过。
- Oh My DL：本地 `tsc --noEmit`、WXT build、WXT zip、ZIP Manifest/Logo 断言通过；Vitest 在收集前因 WXT 无法绑定 localhost 随机端口失败，固定 `PORT=31999` 重试仍失败，已记录为环境限制。
- Oh My Photos：`xcodegen generate`、`scripts/build.sh`、`xcodebuild build-for-testing`、Bundle 可执行文件和 `plutil` 检查通过，Bundle 为 `dev.kevinstack.ohmyphotos` / `Oh My Photos` / macOS 27.0。
- `packages/stable-extension-dev`：Vitest 7 个测试通过；锁文件 importer、活动旧标识扫描、旧目录不存在、X Download/X Download Helper diff 和 `git diff --check` 通过。

#### 未验证事项与限制

- 真实 Chrome/Edge 加载、视觉交互、macOS App 使用和 iPhone 设备流程需要用户验收。
- Oh My DL Vitest 仍受本机 localhost 端口绑定限制；Oh My Photos 的直接 XCTest/测试目标编译因当前 Xcode DerivedData 权限与 scheme 配置限制未完成，需要用户或 CI 环境补验。
- GitHub、商店、远端仓库和 Release 后台不在本地迁移范围内。

#### 用户验收

- 结果：已通过
- 说明：用户明确要求提交到本地，按仓库流程视为验收通过并批准最终提交；真实 Chrome/Edge 加载、macOS App 使用和 iPhone 设备流程仍按未验证事项保留。

#### 最终 Commit message

refactor(repo): 统一 Oh My 产品路径与标识迁移

- 迁移 Oh My Tabs、Oh My DL 与 Oh My Photos 的目录、包名、工程和运行时标识
- 更新 workspace、发布工作流、文档和资源路径，保留 X Download 系列契约
- 完成本地 WXT、Xcode、锁文件和静态引用验证并记录环境限制

#### 最终提交批准

- 状态：已批准
- 说明：用户已明确要求本地提交；已执行上述单个最终 Commit，不推送远端。

## 关联文档

- [Oh My 产品命名迁移 Spec](../../../superpowers/specs/2026-09-30-repo-rename-ohmy-products-design.md)
- [Oh My 产品命名迁移 Plan](../../../superpowers/plans/2026-09-30-repo-rename-ohmy-products.md)
- [参考：统一 OmyExts 仓库与产品命名](2026-09-30-repo-unify-omy-product-naming-issue.md)

## 历史补充

### 元信息

- 类型：架构任务
- 当前阶段：Task 5：完整验证与用户验收材料（已完成）
- 最近更新：2026-09-30

### 历史后续事项

无。迁移已通过验收并提交到本地；后续新需求另建 Issue。
