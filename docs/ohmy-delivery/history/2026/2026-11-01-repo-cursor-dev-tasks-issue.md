---
date: "2026-11-01"
scope: [build]
status: completed
type: task
---

# 配置 Cursor 独立开发终端

## 当前阶段

已完成。

## 目标与范围

### 背景与目标

希望一次启动官网、扩展、API 与 Desktop，保留单项启动失败不终止其他任务的行为。用户最新要求增加 pnpm dev 并调整根 scripts 排序，全部启动包括 Desktop；Cursor 同时提供独立命名终端入口。

### 范围

- 新增根 dev 命令，使用仓库已有 Turbo 注册四个根任务，以 --continue=always 同时运行 web:dev、ext:dev、desk:dev、api:dev；禁用开发缓存并保留现有进程环境。统一命令置顶，各端按 web、ext、desk、api 分组排序，不改既有子命令内容。
- 新增根 .vscode/tasks.json：Dev 组合任务同时启动 Website、Extension、API、Desktop，调用既有四端开发命令。
- 各任务使用独立、可复用的命名终端，在同一终端面板中通过标签列表切换，不配置同组分屏，避免重复运行同一任务创建额外服务实例。
- Desktop 同时保留单独任务并加入 Dev，保留现有非 macOS 平台报错行为。
- .gitignore 只放行 .vscode/tasks.json，其余编辑器个人文件继续忽略。
- 不自动随工作区打开启动服务，通过 Cursor 的运行任务入口启动。
- 同步 docs/build-release.md 的根开发命令与两种启动方式说明。

### 排除项

- 不修改既有子命令内容、端口、Python 环境、应用代码、依赖或发布配置。
- 不启动实际开发服务，不执行 Cursor 界面或浏览器交互验收，不新增仓库测试文件；允许静态配置与任务图检查。
- 不处理双版本扩展、登录或其他功能，不自动提交、推送或部署。
- 不在本次修复既有 API 命令的 Windows 虚拟环境路径兼容问题；Desktop 仍仅支持 macOS。

## Todo

- [x] 增加根 dev 命令并调整 scripts 排序，将四端纳入 CLI 与 Cursor 的 Dev 启动。
- [x] 放行共享任务文件，检查 JSON、命令引用和 Git 忽略边界。
- [x] 更新命令说明、交付记录与试用步骤，停在用户验收。

## 验收标准

- 根目录 pnpm dev 同时调用四个现有开发命令，日志按任务名区分；不匹配 dev 自身或任何构建、发布命令。
- Cursor 打开仓库根目录，运行 Dev 后，Website、Extension、API、Desktop 分别在独立命名终端运行；同一面板通过标签列表切换，不自动分屏，支持单独停止或重启。
- 一个任务启动失败不会自动终止其他已运行任务；组合任务允许报告失败。
- 重复运行单任务不新建并发实例；停止后可复用专属终端重新运行。
- Desktop 随 Dev 启动，也可单独运行；非 macOS 时输出现有“桌面应用需要在 macOS 上运行和构建”并退出，其他任务不因此自动停止。
- tasks.json 可由 Git 跟踪，其他 .vscode 个人配置仍忽略；不改动端口与稳定开发产物目录。
- 代理只检查配置，不声称已完成编辑器及多服务运行验收。

## 唯一下一步

无。

## 交付记录

### 历史交付记录

#### 对应工作项

- [Issue](2026-11-01-repo-cursor-dev-tasks-issue.md)

#### 预期交付边界

新增共享 Cursor 任务配置及根 pnpm dev，按用户最新要求同时启动官网、扩展、Desktop 与 API；保留单端命令，整理 scripts 顺序，不修改端口、依赖或应用逻辑。

#### 实际交付

- package.json 增加 dev，统一 dev/build/release 置顶，各端按 web、ext、desk、api 分组；既有子命令内容保留。
- 使用已有 Turbo 注册四个根开发任务，禁用缓存，设置 --continue=always 与流式日志，进程环境使用 loose 模式保留。
- .vscode/tasks.json 提供 Dev、Website、Extension、API、Desktop 五个任务，Dev 同时启动四端，每个任务使用专属终端，在同一面板通过标签列表切换，不设置同组分屏；单任务限制一个实例，不自动随工作区打开启动。
- Desktop 也可独立启动，保留既有 macOS 限制；Windows 平台错误不会按配置主动取消其他任务。
- .gitignore 仅放行 tasks.json，其余 .vscode 内容仍忽略；同步 docs/build-release.md 的命令与平台说明。

#### 验证与限制

- JSON、根 scripts 排序、既有命令内容保留及四端 Cursor 任务引用检查通过；Git 忽略边界与 diff 检查通过。
- 实际执行 pnpm dev --dry-run=json 通过，任务图仅含四个根开发任务，均无依赖、不缓存并标记为持续任务，未执行实际应用命令。
- pnpm 多脚本选择的临时短任务验证未满足并行要求，确认首项会阻塞后停止该路径，最终配置已改用现有 Turbo。Turbo 的临时隔离目录调度验证未产生有效执行结果，不记为通过；最终以实际工程 dry-run 确认任务图。
- 未启动实际开发服务，未验证真实进程的失败隔离、停止清理或 Cursor 终端显示与复用；不把配置检查或 dry-run 写成运行验收通过。
- 未在 Windows 验证。API 仍调用既有 Unix 虚拟环境路径 dist/.cache/api/venv/bin/python；Desktop 非 macOS 提示并退出。本次不改跨平台运行逻辑。
- 未改依赖，无需安装或修改锁文件；未运行无关应用测试、构建或浏览器交互。

#### 用户验收

用户于 2026-11-01 明确要求 commit，批准本地提交完结；不追加验证或追问验收。真实四端运行、失败隔离与 Cursor 标签终端显示未完整验收，不记为通过。可复现步骤：根目录执行 pnpm dev，四端日志在同一终端按任务名输出；需要独立终端时先停止原任务并关闭旧分屏终端，再执行 Cursor Tasks: Run Task → Dev，观察四个标签终端。各任务可单独运行，切换入口前先停止原有服务，Desktop 应用可自行退出。

#### 提交方案

##### 配置提交

- 文件：.gitignore、.vscode/tasks.json、package.json、turbo.json。
- diff 摘要：增加四端统一 dev 与独立终端配置，整理命令顺序，复用现有调度工具并仅放行共享编辑器任务文件。

```text
chore(repo): 配置四端统一开发命令与独立终端

- 增加统一 dev 并保留四端独立启动命令
- 配置 Cursor 独立终端与开发任务失败后继续运行
```

##### 文档提交

- 文件：docs/build-release.md、当前 Issue、当前 Commit 记录、docs/ohmy-delivery/readme.md。
- diff 摘要：记录命令、平台边界、配置和 dry-run 结果及用户试用步骤。
- 若用户批准本地提交，随文档提交更新 Issue 与工作台为已完成、最终提交批准为已批准，并如实记录用户批准完结及未验证事项。

```text
docs(repo): 记录四端开发启动配置交付

- 同步统一命令与编辑器任务使用说明
- 记录配置验证结果及未执行的运行验收
```

#### 最终提交批准

已批准。用户于 2026-11-01 明确要求 commit，批准当前配置与文档两笔本地提交并同步工作项完成状态；不包含推送或部署。

## 关联文档

- [工作台](../../readme.md)
- [前置 API Issue](2026-11-01-api-root-docs-redirect-issue.md)
- [VS Code 任务说明](https://code.visualstudio.com/docs/debugtest/tasks)

## 历史补充

### 元信息

- 当前阶段：用户明确要求本地提交完结，配置已提交，完成状态随文档提交归档；沿用已有检查结果，真实四端运行及编辑器交互未完整验收，未推送。
- 批准依据：用户要求“改下配置我试试看”，随后明确“修改下 issue 先commit 再 直接改”；前置 API 工作项两笔本地提交已完成。
- 任务规模：小型配置任务，使用 Todo，不创建 Sub-issue、Spec 或 Plan。

### 历史后续事项

本工作项按用户明确批准本地提交完结；不自动推送。后续可运行 pnpm dev 或 Cursor Tasks: Run Task → Dev 试用四端启动，先停止原有服务再切换另一入口，避免端口冲突。
