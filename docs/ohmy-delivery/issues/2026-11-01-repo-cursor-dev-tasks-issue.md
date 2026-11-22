# 配置 Cursor 独立开发终端

## 元信息

- 工作项：2026-11-01-repo-cursor-dev-tasks
- 状态：已完成
- 当前阶段：用户明确要求本地提交完结，配置已提交，完成状态随文档提交归档；沿用已有检查结果，真实四端运行及编辑器交互未完整验收，未推送。
- 批准依据：用户要求“改下配置我试试看”，随后明确“修改下 issue 先commit 再 直接改”；前置 API 工作项两笔本地提交已完成。
- 任务规模：小型配置任务，使用 Todo，不创建 Sub-issue、Spec 或 Plan。

## 背景与目标

希望一次启动官网、扩展、API 与 Desktop，保留单项启动失败不终止其他任务的行为。用户最新要求增加 pnpm dev 并调整根 scripts 排序，全部启动包括 Desktop；Cursor 同时提供独立命名终端入口。

## 范围

- 新增根 dev 命令，使用仓库已有 Turbo 注册四个根任务，以 --continue=always 同时运行 web:dev、ext:dev、desk:dev、api:dev；禁用开发缓存并保留现有进程环境。统一命令置顶，各端按 web、ext、desk、api 分组排序，不改既有子命令内容。
- 新增根 .vscode/tasks.json：Dev 组合任务同时启动 Website、Extension、API、Desktop，调用既有四端开发命令。
- 各任务使用独立、可复用的命名终端，在同一终端面板中通过标签列表切换，不配置同组分屏，避免重复运行同一任务创建额外服务实例。
- Desktop 同时保留单独任务并加入 Dev，保留现有非 macOS 平台报错行为。
- .gitignore 只放行 .vscode/tasks.json，其余编辑器个人文件继续忽略。
- 不自动随工作区打开启动服务，通过 Cursor 的运行任务入口启动。
- 同步 docs/build-release.md 的根开发命令与两种启动方式说明。

## 排除项

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

## 关联文档

- [Commit 记录](../commits/2026-11-01-repo-cursor-dev-tasks-commit.md)
- [工作台](../README.md)
- [前置 API Issue](2026-11-01-api-root-docs-redirect-issue.md)
- [VS Code 任务说明](https://code.visualstudio.com/docs/debugtest/tasks)

## 唯一下一步

本工作项按用户明确批准本地提交完结；不自动推送。后续可运行 pnpm dev 或 Cursor Tasks: Run Task → Dev 试用四端启动，先停止原有服务再切换另一入口，避免端口冲突。
