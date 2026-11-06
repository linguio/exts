# 自动准备 API 开发环境：交付记录

## 对应工作项

- [Issue](../issues/2026-11-06-api-dev-environment-issue.md)

## 预期交付边界

现有 API 开发启动器自动准备虚拟环境、同步固定依赖并预检配置，补充对应测试和首次运行说明。不改依赖版本、系统软件、env 或数据库。

## 实际交付

- 启动器检查精确 Python 版本；缺少虚拟环境时创建，已有环境版本不符时停止并提示手动重建。
- 首次或 Python/两份 requirements 清单摘要变化时自动安装固定依赖；成功后保存摘要，失败停止，下次重试。
- 配置预检复用 API 的 env 读取规则，缺少 DATABASE_URL、NEON_AUTH_ISSUER、API_RESOURCE 时只提示变量名。
- 保持 pnpm api:dev、pnpm dev、跨平台解释器路径和 Uvicorn 重载；更新首次运行说明。

## 验证与限制

- `node --test --test-isolation=none apps/api/tests/dev.test.mjs`：9 项通过；使用临时目录和替代进程执行器验证首次创建、首次同步、跳过安装、两份清单变化、创建/安装/配置失败停止、重试及服务退出状态；macOS/Linux/Windows 路径均覆盖。
- `dist/.cache/api/venv/bin/python -B -m unittest discover -s apps/api/tests -p test_dev_environment.py -v`：2 项通过，覆盖缺失配置提示及 env/进程变量优先级。
- API 目录执行 `../../dist/.cache/api/venv/bin/python -B -m scripts.check_environment`：当前本机配置预检通过，无凭据输出。
- `node --check apps/api/scripts/dev.mjs` 与 `git diff --check` 通过。
- 先运行新增启动器行为测试，旧实现 9 项失败；实现后 9 项通过。
- 未实际下载依赖或创建真实虚拟环境，未启动 Uvicorn/watch、未运行全量 API 业务测试、未联调数据库或验收 Newtab。跨平台使用模拟进程边界，未在 Windows/Linux 真机执行。摘要仅跟踪声明变化，不检测用户手动卸载的包；手动损坏环境时需删除摘要重新同步。
- 未升级依赖、修改 env、执行迁移、推送或部署。

## 用户验收

用户于 2026-11-06 明确表示“验收通过”，随后要求“commit”；按其批准完结并分开本地提交。以下保留验收步骤供复现。

1. 停止此前失败的 API 进程，在仓库根目录执行 `pnpm api:dev`；现有环境首次应显示同步依赖，并在配置齐全时最终出现 `Application startup complete`。
2. Ctrl+C 后再次执行同一命令；清单未变时不应再次显示依赖同步，服务正常启动。
3. 保持 API 运行，刷新原先加载的 Newtab 开发版，确认登录后的 Activity 数据加载；此步骤仍依赖数据库迁移、认证及网络可用。
4. 必需变量缺失或 Python 版本不符时，应在启动服务前收到明确提示；安装网络错误应停止并在下次启动重试。自动化已覆盖这些失败分支，无需为验收删除现有真实环境或凭据。

## 提交方案

### 代码提交

文件：`apps/api/scripts/dev.mjs`、`apps/api/scripts/check_environment.py`、`apps/api/tests/dev.test.mjs`、`apps/api/tests/test_dev_environment.py`。

Diff 摘要：自动准备环境、按摘要同步依赖及配置预检；保留并调整已有启动器行为测试，补充配置读取验证。

```text
chore(api): 自动准备本地开发环境

- 启动前检查 Python 并创建虚拟环境和同步固定依赖
- 预检必要配置并覆盖环境准备与失败停止行为
```

### 文档提交

文件：`apps/api/README.md`、`docs/changes/README.md`、本 Issue 和本 Commit 记录。

Diff 摘要：更新首次启动方式、自动同步边界及故障处理，记录本工作项交付、验证和限制。

```text
docs(api): 记录开发环境自动准备流程

- 说明首次启动和依赖同步及配置预检行为
- 记录启动器交付与验证结果及验收限制
```

若用户后续明确批准本地提交，仅随文档提交机械更新 Issue 状态为已完成、当前阶段为已完成、唯一下一步为无；本记录的用户验收按用户原话记录、最终提交批准改为已批准；工作台当前 Issue 移入已完成。代码先提交，文档后提交；失败按仓库规则恢复未完成部分的待提交、待批准状态。

## 最终提交批准

已批准。用户于 2026-11-06 明确要求“commit”，批准已展示代码与文档两笔本地提交和终态更新；不包含推送或发布。
