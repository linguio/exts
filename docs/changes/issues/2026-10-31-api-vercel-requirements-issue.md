# 展开依赖清单以修复部署解析错误

## 元信息

- 工作项：2026-10-31-api-vercel-requirements
- 状态：已完成
- 当前阶段：用户明确要求本地提交完结；代码已提交，完成状态随文档提交归档。Vercel 云端结果仍未验证。
- 批准依据：用户报告 Vercel PYTHON_REQUIREMENTS_PARSE_ERROR，并明确批准将固定版本依赖直接写入 requirements.txt、去掉 constraints.txt 引用，保持依赖版本和接口行为不变。
- 任务规模：小型兼容性修复，一个 Issue，不另建 Spec 或 Plan。

## 背景

Vercel 报告 requirements.txt 在 position 0 解析引用文件失败。该位置对应第一行 -c constraints.txt；已确认故障发生在引用解析阶段，完整底层原因日志未提供，不将其描述为 Vercel 一概不支持约束文件。

## 目标与范围

- 将运行时所需的现有固定版本依赖直接写入 apps/api/requirements.txt。
- 测试专用依赖保留在 requirements-dev.txt，保持现有全部版本和 psycopg binary 安装方式。
- 删除被替代的 constraints.txt，补充依赖维护说明。
- 进行一次依赖解析、版本一致性、接口逻辑与 diff 检查，停在用户验收。

## 排除项

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

## 关联文档

- [Commit 记录](../commits/2026-10-31-api-vercel-requirements-commit.md)
- [原接入 Issue](2026-10-31-api-neon-setup-issue.md)
- [工作台](../README.md)

## 唯一下一步

本工作项按用户要求本地提交完结；后续推送新代码并在 Vercel 部署该提交，确认不再出现引用文件解析错误，再在 /docs 携带令牌执行 /hello，预期 200 和 database: ok。云端结果尚未验证，不自动推送或部署。
