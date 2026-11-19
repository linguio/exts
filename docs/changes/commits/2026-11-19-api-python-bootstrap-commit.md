# 统一 API 开发环境的跨平台自动准备：交付记录

## 对应工作项

- [Issue](../issues/2026-11-19-api-python-bootstrap-issue.md)

## 实际交付

- Windows无项目环境时依次查py -3.12、python3.12、python，精确核对.python-version的3.12.13，兼容当前uv安装的PATH命令；不绑定本机路径或Astral标签，不要求安装uv/Launcher。
- 探测失败区分命令缺失、执行失败、版本不符，允许后续候选；全失败不创建环境。macOS/Linux保持原python3.12，共用既有环境创建、依赖摘要同步、配置预检及服务启动。
- 已有环境优先校验，不自动删除或替换不匹配版本。现有创建/安装/配置失败与退出码处理沿用。
- 补充2项Windows行为测试，更新API README和构建说明，纠正手动创建环境的旧描述。版本、依赖、业务、系统Python/PATH/注册表未改。

## 验证与限制

- node --test apps/api/tests/dev.test.mjs：新增回退测试先确认旧实现失败，修复后11项通过。包括三平台首次管线、Windows Launcher缺失/失败/错误版本回退、通用python兜底、全失败分类且不创建、已有环境/摘要复用、各步骤失败与退出码。
- 本机隔离实际验证：dist/.cache/api-bootstrap-verify/e682f424-09b1-41ef-859b-e125a0494367。真实解释器发现、venv与pip运行两次，创建及安装各1次，第二次复用；依赖是隔离空清单，配置检查和服务启动被拦截，没有后台服务或数据库访问。
- git diff --check通过；不运行无关181项扩展测试、全仓发布检查或API业务测试。
- Windows完整真实依赖安装、API配置及服务启动尚待用户运行pnpm api:dev验收；macOS实机未验证，不把进程行为测试当实机结果。未启动长期dev/watch。

## 用户验收

2026-11-19用户明确“验收通过 push”，批准当前启动修复交付、两笔本地提交及推送。复用已有验证，不追加测试；macOS实机未验证限制保留。

## 提交方案

代码已提交，文档随本记录提交。代码2文件：apps/api/scripts/dev.mjs、apps/api/tests/dev.test.mjs。

```text
fix(api): 兼容Windows Python解释器发现并自动准备环境

- 支持 Launcher 与 PATH 精确版本解释器回退
- 区分探测失败原因并保留环境复用和启动流程
```

文档5文件：apps/api/README.md、docs/build-release.md、docs/changes/README.md、本Issue与本记录。

```text
docs(api): 统一跨平台单命令启动说明与验收记录

- 说明自行安装Python后的自动环境准备流程
- 记录回退测试、真实环境验证及实机待验收事项
```

提交前展示范围、消息、结果与限制；明确批准本地提交后仅同步Issue/本记录/工作台的验收、批准与完成状态，保留未实机验证限制。不自动推送或部署。

## 最终提交批准

已批准：2026-11-19用户“验收通过 push”。按已展示范围完成代码/文档提交，Issue与工作台同步已完成，再推送main。本记录提交时尚未推送；本次将携带此前README修正和2.5.0本地提交，触发现有官网/Release草稿检查，不自动公开Release或批准npm正式发布。
