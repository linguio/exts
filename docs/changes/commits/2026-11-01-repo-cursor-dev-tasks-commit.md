# 配置 Cursor 独立开发终端：交付记录

## 对应工作项

- [Issue](../issues/2026-11-01-repo-cursor-dev-tasks-issue.md)

## 预期交付边界

新增共享 Cursor 任务配置及根 pnpm dev，按用户最新要求同时启动官网、扩展、Desktop 与 API；保留单端命令，整理 scripts 顺序，不修改端口、依赖或应用逻辑。

## 实际交付

- package.json 增加 dev，统一 dev/build/release 置顶，各端按 web、ext、desk、api 分组；既有子命令内容保留。
- 使用已有 Turbo 注册四个根开发任务，禁用缓存，设置 --continue=always 与流式日志，进程环境使用 loose 模式保留。
- .vscode/tasks.json 提供 Dev、Website、Extension、API、Desktop 五个任务，Dev 同时启动四端，每个任务使用专属终端，在同一面板通过标签列表切换，不设置同组分屏；单任务限制一个实例，不自动随工作区打开启动。
- Desktop 也可独立启动，保留既有 macOS 限制；Windows 平台错误不会按配置主动取消其他任务。
- .gitignore 仅放行 tasks.json，其余 .vscode 内容仍忽略；同步 docs/build-release.md 的命令与平台说明。

## 验证与限制

- JSON、根 scripts 排序、既有命令内容保留及四端 Cursor 任务引用检查通过；Git 忽略边界与 diff 检查通过。
- 实际执行 pnpm dev --dry-run=json 通过，任务图仅含四个根开发任务，均无依赖、不缓存并标记为持续任务，未执行实际应用命令。
- pnpm 多脚本选择的临时短任务验证未满足并行要求，确认首项会阻塞后停止该路径，最终配置已改用现有 Turbo。Turbo 的临时隔离目录调度验证未产生有效执行结果，不记为通过；最终以实际工程 dry-run 确认任务图。
- 未启动实际开发服务，未验证真实进程的失败隔离、停止清理或 Cursor 终端显示与复用；不把配置检查或 dry-run 写成运行验收通过。
- 未在 Windows 验证。API 仍调用既有 Unix 虚拟环境路径 dist/.cache/api/venv/bin/python；Desktop 非 macOS 提示并退出。本次不改跨平台运行逻辑。
- 未改依赖，无需安装或修改锁文件；未运行无关应用测试、构建或浏览器交互。

## 用户验收

用户于 2026-11-01 明确要求 commit，批准本地提交完结；不追加验证或追问验收。真实四端运行、失败隔离与 Cursor 标签终端显示未完整验收，不记为通过。可复现步骤：根目录执行 pnpm dev，四端日志在同一终端按任务名输出；需要独立终端时先停止原任务并关闭旧分屏终端，再执行 Cursor Tasks: Run Task → Dev，观察四个标签终端。各任务可单独运行，切换入口前先停止原有服务，Desktop 应用可自行退出。

## 提交方案

### 配置提交

- 文件：.gitignore、.vscode/tasks.json、package.json、turbo.json。
- diff 摘要：增加四端统一 dev 与独立终端配置，整理命令顺序，复用现有调度工具并仅放行共享编辑器任务文件。

```text
chore(repo): 配置四端统一开发命令与独立终端

- 增加统一 dev 并保留四端独立启动命令
- 配置 Cursor 独立终端与开发任务失败后继续运行
```

### 文档提交

- 文件：docs/build-release.md、当前 Issue、当前 Commit 记录、docs/changes/README.md。
- diff 摘要：记录命令、平台边界、配置和 dry-run 结果及用户试用步骤。
- 若用户批准本地提交，随文档提交更新 Issue 与工作台为已完成、最终提交批准为已批准，并如实记录用户批准完结及未验证事项。

```text
docs(repo): 记录四端开发启动配置交付

- 同步统一命令与编辑器任务使用说明
- 记录配置验证结果及未执行的运行验收
```

## 最终提交批准

已批准。用户于 2026-11-01 明确要求 commit，批准当前配置与文档两笔本地提交并同步工作项完成状态；不包含推送或部署。
