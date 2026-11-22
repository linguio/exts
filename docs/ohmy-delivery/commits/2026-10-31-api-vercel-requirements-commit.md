# 部署依赖清单修复交付记录

- 对应 [Issue](../issues/2026-10-31-api-vercel-requirements-issue.md)
- 状态：已完成；用户明确批准代码、文档两笔本地提交，完成状态随文档提交归档。

## 预期交付边界

- 代码：apps/api/requirements.txt、requirements-dev.txt、constraints.txt 的展开与清理。
- 文档：API README、本 Issue、Commit 记录与工作台。
- 不修改依赖版本、接口、私有环境文件或云端配置。

## 实际交付

- requirements.txt 直接列出 17 项固定版本的生产依赖，不再包含 -c 文件引用。
- requirements-dev.txt 保留生产清单引用，并固定 3 项测试专用依赖；原有 20 项固定版本全部保持一致。
- 删除被替代的 constraints.txt；API README 补充生产和开发清单的维护方式。

## 验证与限制

- 修改前后 20 项固定版本一致，均与现有本机环境匹配。
- pip install --dry-run --no-index --disable-pip-version-check -r apps/api/requirements-dev.txt 通过，未安装或升级包。
- 现有 4 项接口测试通过，git diff --check 通过；沿用的 Starlette httpx 弃用提示未处理，不影响测试。
- 本地检查不等同于 Vercel 构建；尚未执行全新 Linux 安装、Vercel 重新部署、云端 HTTP 联通或三端 build。
- 未改环境变量、数据库、接口或根命令。用户明确要求本地提交完结，沿用已有验证，不追加检查；代码已提交，文档单独提交，不推送 Git。

## 完整 Commit message

代码范围：apps/api/requirements.txt、requirements-dev.txt、删除 constraints.txt。

```text
fix(api): 展开部署依赖清单以避免引用解析失败

- 将生产依赖直接列入固定版本清单
- 保留测试专用依赖并移除旧约束文件
```

文档范围：API README、本 Issue、Commit 记录与工作台。

```text
docs(api): 记录部署依赖解析修复与验证结果

- 说明生产与开发依赖清单的维护方式
- 记录修复范围和云端待验收事项
```

用户已明确批准本地提交，提交前已展示两笔范围、完整消息、验证结果和未验证事项。代码提交成功后将 Issue、交付记录与工作台同步为已完成，终态随文档提交归档；Vercel 重新部署未验证，不自动推送或部署。
