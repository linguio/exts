# 修复 Windows 下 API 本地启动：交付记录

## 对应工作项

- [Issue](../issues/2026-11-02-api-windows-dev-issue.md)

## 预期交付边界

修复 API 本地启动的 Windows 虚拟环境路径兼容，保留原有命令及 macOS/Linux 参数，补充缺失环境提示和各平台准备说明。用户已明确批准实施；不自动安装环境、升级依赖或修改云端配置。

## 实际交付

- apps/api/package.json 转发到应用内 Node 启动器；Windows 使用项目虚拟环境 Scripts/python.exe，macOS/Linux 使用 bin/python，以绝对路径启动且不经过 shell，支持含空格的仓库路径。
- 保留 API 工作目录、监听地址、端口及 Uvicorn 参数；传递解释器退出码和启动错误，不自动使用全局 Python。
- 缺少虚拟环境时返回 1 并给出准备命令；README 补充 Windows 准备及测试命令、无需激活环境说明和 Python 3.12.13 无官方 Windows 安装包的限制。
- 同步构建文档、Issue 与工作台，无依赖、API 路由或云端设置变更。

## 验证与限制

- node --test 默认子进程隔离在当前工具环境因 spawn EPERM 无法运行；切换为 --test-isolation=none，未修改业务代码规避工具限制。
- 实现前运行无隔离测试确认缺少启动器模块而失败；实现后执行 node --test --test-isolation=none apps/api/tests/dev.test.mjs，7 项全部通过。覆盖三类系统路径及参数、缺失环境不启动进程、成功与失败退出码、启动错误和中断状态映射；平台与子进程结果使用注入验证，不代表实机服务验证。
- 真实执行 pnpm api:dev，正确进入 Node 启动器并提示缺少 Windows 虚拟环境，返回 1；原始 `'..'` 命令错误未再出现，此退出属于缺少环境的预期结果。
- node --check apps/api/scripts/dev.mjs 与 git diff --check 通过。
- 代理验证时未发现项目虚拟环境，Python 命令仅发现 WindowsApps 路径，未将其认定为可用解释器。代理未安装 Python 或依赖，未运行现有 Python 路由测试、真实 Uvicorn 服务、Ctrl+C 进程清理、Mac/Linux 实机或浏览器验收；后续 Windows 本地启动由用户反馈确认。
- Python 官方 3.12.13 发布页确认该版本仅提供源码，无官方 Windows 二进制安装包；随后向用户提供 uv 安装精确 Python 版本、创建虚拟环境与安装依赖的手动步骤。用户反馈“可以了”，未另行提供安装日志，不将具体安装版本或其他检查记为代理验证通过。
- 此次只修改 API 启动脚本及说明，无独立编译步骤；未运行不相关的三端构建和类型检查，根构建本来仅支持 macOS。

## 用户验收

用户于 2026-11-02 在收到 Windows 环境准备与启动步骤后反馈“可以了”，确认 Windows 本地启动验收通过，随后明确要求“commit”，批准本地提交完结。用户未逐项确认浏览器、/hello、Ctrl+C 或 Mac/Linux 实机检查，不将这些事项记为已验证；提交时沿用已有结果，不追加验证。

保留以下可复现验收步骤：

1. 未准备环境时，从根目录运行 pnpm api:dev，应显示解释器位置、Python 版本和准备命令，返回非零状态，不再出现原始命令路径错误。
2. 先准备 Python 3.12.13，按 API README 创建本机虚拟环境并安装开发依赖，再运行 pnpm api:dev，应监听 127.0.0.1:8000。
3. 在 Chrome 或 Edge 打开 http://127.0.0.1:8000/，应跳转 /docs 并加载 Scalar；访问 /hello 应仍为 404。
4. 在终端按 Ctrl+C，应停止服务且端口不再提供响应；Mac/Linux 需在对应系统执行同样流程。

## 提交方案

### 代码提交

- 文件：apps/api/package.json、apps/api/scripts/dev.mjs、apps/api/tests/dev.test.mjs。
- diff 摘要：替换固定 Unix 路径入口，按系统选取项目解释器，补充准备提示及退出状态验证。

```text
fix(api): 兼容 Windows 本地开发启动

- 按系统选择项目虚拟环境并保留既有启动参数
- 提示缺失环境并验证启动路径与退出状态
```

### 文档提交

- 文件：apps/api/README.md、docs/build-release.md、当前 Issue、当前 Commit 记录、docs/changes/README.md。
- diff 摘要：补充平台准备说明，记录实际验证及 Python 安装与实机验证限制。
- 用户已批准本地提交，文档提交包含的机械性终态更新为：Issue 状态及工作台索引改为已完成，用户验收如实记录批准完结与未验证项，最终提交批准改为已批准。

```text
docs(api): 记录跨平台启动说明与验证结果

- 补充 Windows 环境准备与固定 Python 版本限制
- 同步工作项交付和未验证事项
```

## 最终提交批准

已批准。用户于 2026-11-02 明确要求“commit”，批准按已展示范围执行代码、文档两笔本地提交并完结；不包含推送或部署。
