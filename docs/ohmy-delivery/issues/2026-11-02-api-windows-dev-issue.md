# 修复 Windows 下 API 本地启动

## 元信息

- 工作项：2026-11-02-api-windows-dev
- 状态：已完成
- 当前阶段：用户于 2026-11-02 明确要求本地提交，代码已提交，完成状态随文档提交归档；沿用既有验证，不追加验证，不推送。
- 批准依据：用户确认保留 Mac 行为后明确表示“可以 不过我本地可能没有py环境 开始吧”，批准当前修复范围；不包含系统环境安装或 Git 提交。
- 任务规模：小型任务，使用 Todo，不创建 Sub-issue、独立 Spec 或 Plan。

## 背景

Windows PowerShell 在仓库根目录执行 pnpm api:dev，经 @exts/api dev 转发后运行 ../../dist/.cache/api/venv/bin/python，报错 `'..' is not recognized as an internal or external command` 并退出。

apps/api/package.json 写死了 macOS/Linux 虚拟环境解释器路径；Windows 的标准路径为 Scripts/python.exe。API README 的准备和测试命令也只列出 Unix 路径，docs/build-release.md 已记录该兼容性限制。本地 API 运行需要 Python，pnpm 只负责转发命令；只开发官网或扩展时无需启动本地 API。

## 目标

完成 Python 和依赖准备后，用户在 Windows 仓库根目录执行原有 pnpm api:dev 即可启动 API，同时保留 macOS/Linux 的现有启动行为；缺少虚拟环境时给出可执行的准备提示。

## 范围

- 使用轻量跨平台启动脚本，按系统选择根 dist/.cache/api/venv 下的 Scripts/python.exe 或 bin/python，并保持 API 工作目录及现有 Uvicorn 参数。
- 虚拟环境解释器不存在时明确退出并提示初始化方式，不自动安装 Python 或依赖，不回退到来源不明的全局解释器。
- 在 API README 补充 Windows 的 Python 3.12.13、虚拟环境创建、依赖安装、启动及逻辑测试命令，保留 macOS/Linux 说明。
- 按实际结果更新构建文档中 API 的 Windows 限制说明及交付记录。
- 验证路径选择、缺失环境提示、启动退出状态传递及现有 API 逻辑；实际跨系统验证缺口如实记录。

## 排除项

- 不自动安装系统 Python、创建虚拟环境或下载依赖；环境准备由用户按说明执行，额外环境操作需单独批准。
- 不升级 Python、Node、pnpm 或第三方依赖，不修改 API 路由、数据库、认证、环境变量和部署配置。
- 不扩展 Windows 的根 build/release 或 Desktop 支持，不改动其他应用。
- 不自动提交、推送或部署，不执行浏览器视觉与交互验收。

## Todo

- [x] 确认并批准上述实施范围，记录可用 Python 与虚拟环境条件。
- [x] 接入跨平台 API 启动脚本及缺失环境提示，保持原有命令入口。
- [x] 补充两类系统的准备与测试说明，同步已解决和仍存在的平台限制。
- [x] 完成 7 项启动器逻辑测试及真实命令的缺失环境验证，填写 Commit 记录并停在用户验收；Python 服务启动因无虚拟环境尚未验证。

## 验收标准

- Windows 用户按 README 准备固定版本 Python、根 dist 下的虚拟环境及开发依赖后，在 PowerShell 执行 pnpm api:dev，API 监听 127.0.0.1:8000，不再出现当前命令路径错误。
- macOS/Linux 继续通过同一命令使用 bin/python 启动，监听地址和端口保持不变。
- 缺少虚拟环境时返回非零退出状态，并显示对应平台可执行的准备提示；不自动安装、不使用全局解释器掩盖缺失环境。
- 启动器正确传递子进程失败状态，用户可通过 Ctrl+C 停止服务，无遗留 API 进程。
- 用户启动后在 Chrome 或 Edge 打开 http://127.0.0.1:8000/，预期跳转 /docs 并加载现有 Scalar 文档；访问 /hello 仍返回 404。浏览器验收由用户执行。
- API 逻辑验证结果与 Windows/macOS/Linux 未实际执行的检查分别记录，不把模拟路径验证写成真实系统启动通过。

## 关联文档

- [Commit 记录](../commits/2026-11-02-api-windows-dev-commit.md)
- [工作台](../README.md)
- [API README](../../../apps/api/README.md)
- [构建与分发规范](../../build-release.md)

## 唯一下一步

按用户批准完成代码与文档两笔本地提交后归档，不推送。Windows 本地启动已获用户确认，未单独确认的浏览器、Ctrl+C 与 Mac/Linux 实机检查仍如实保留为未验证。
