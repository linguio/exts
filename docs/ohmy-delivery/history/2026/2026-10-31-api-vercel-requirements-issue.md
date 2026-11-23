---
date: "2026-10-31"
scope: [build, api]
status: completed
type: bug
---

# 展开依赖清单以修复部署解析错误

## 当前阶段

已完成。

## 目标与范围

### 背景

Vercel 报告 requirements.txt 在 position 0 解析引用文件失败。该位置对应第一行 -c constraints.txt；已确认故障发生在引用解析阶段，完整底层原因日志未提供，不将其描述为 Vercel 一概不支持约束文件。

- 将运行时所需的现有固定版本依赖直接写入 apps/api/requirements.txt。
- 测试专用依赖保留在 requirements-dev.txt，保持现有全部版本和 psycopg binary 安装方式。
- 删除被替代的 constraints.txt，补充依赖维护说明。
- 进行一次依赖解析、版本一致性、接口逻辑与 diff 检查，停在用户验收。

### 排除项

- 不升级依赖，不改接口、鉴权、数据库、环境变量或根目录命令。
- 不运行三端 build，不部署 Vercel，不推送 Git；用户最新明确批准代码、文档两笔本地提交。

## Todo

- [x] 展开运行时与测试专用依赖，移除约束引用和旧文件。
- [x] 确认修改前后固定版本一致，检查安装解析与现有接口测试。
- [x] 补充文档与交付记录，停在用户重新部署验收。

## 验收标准

- 生产 requirements.txt 为直接依赖列表，不再引用其他文件。
- 原有固定版本保持一致，测试专用包不引入生产清单。
- 本地依赖解析与现有接口逻辑验证通过。
- Vercel 实际重新部署由用户执行；未执行前不声称部署成功。

## 唯一下一步

无。

## 交付记录

### 历史交付记录

- 对应 [Issue](2026-10-31-api-vercel-requirements-issue.md)
- 状态：已完成；用户明确批准代码、文档两笔本地提交，完成状态随文档提交归档。

#### 预期交付边界

- 代码：apps/api/requirements.txt、requirements-dev.txt、constraints.txt 的展开与清理。
- 文档：API README、本 Issue、Commit 记录与工作台。
- 不修改依赖版本、接口、私有环境文件或云端配置。

#### 实际交付

- requirements.txt 直接列出 17 项固定版本的生产依赖，不再包含 -c 文件引用。
- requirements-dev.txt 保留生产清单引用，并固定 3 项测试专用依赖；原有 20 项固定版本全部保持一致。
- 删除被替代的 constraints.txt；API README 补充生产和开发清单的维护方式。

#### 验证与限制

- 修改前后 20 项固定版本一致，均与现有本机环境匹配。
- pip install --dry-run --no-index --disable-pip-version-check -r apps/api/requirements-dev.txt 通过，未安装或升级包。
- 现有 4 项接口测试通过，git diff --check 通过；沿用的 Starlette httpx 弃用提示未处理，不影响测试。
- 本地检查不等同于 Vercel 构建；尚未执行全新 Linux 安装、Vercel 重新部署、云端 HTTP 联通或三端 build。
- 未改环境变量、数据库、接口或根命令。用户明确要求本地提交完结，沿用已有验证，不追加检查；代码已提交，文档单独提交，不推送 Git。

#### 完整 Commit message

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

## 关联文档

- [原接入 Issue](2026-10-31-api-neon-setup-issue.md)
- [工作台](../../readme.md)

## 历史补充

### 元信息

- 当前阶段：用户明确要求本地提交完结；代码已提交，完成状态随文档提交归档。Vercel 云端结果仍未验证。
- 批准依据：用户报告 Vercel PYTHON_REQUIREMENTS_PARSE_ERROR，并明确批准将固定版本依赖直接写入 requirements.txt、去掉 constraints.txt 引用，保持依赖版本和接口行为不变。
- 任务规模：小型兼容性修复，一个 Issue，不另建 Spec 或 Plan。

### 历史后续事项

本工作项按用户要求本地提交完结；后续推送新代码并在 Vercel 部署该提交，确认不再出现引用文件解析错误，再在 /docs 携带令牌执行 /hello，预期 200 和 database: ok。云端结果尚未验证，不自动推送或部署。
