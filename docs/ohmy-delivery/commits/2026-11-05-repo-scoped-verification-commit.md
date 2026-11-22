# 按变更影响范围执行验证：交付记录

## 对应工作项

- [Issue](../issues/2026-11-05-repo-scoped-verification-issue.md)

## 预期交付边界

独立维护分级验证规范，精简根规范入口；新增仓库内 tests Skill 仅承担检查选择方法，并衔接 workflow-change。不安装全局 Skill，不新增 CI、依赖分析工具或缓存系统。

## 实际交付

- 新增 skills/tests/SKILL.md 及 agents/openai.yaml：按影响选择检查、复用结果、控制失败和资源成本；仅本地提交不触发。
- 新增 docs/verification.md：记录变更分级、完整应用与完整仓库边界、结果失效条件，以及 CI 和缓存尚未实现的限制。
- 根 AGENTS 替换两处固定完整验证表述；workflow-change 增加按需入口，不默认启动额外检查链。
- 按用户追加要求，在官网共享产品数据中新增 tests 的介绍及源码链接，沿用现有 Skills 条目结构。

## 验证与限制

- 文本审阅四种场景：SVG 只查资源及必要构建，局部业务查对应行为和类型，目录迁移查所属应用，纯本地提交不启动验证。此为规则走查，不是独立代理行为测试。
- 官方 quick_validate.py 因缺少 PyYAML 无法运行；备用 Node YAML 解析同样缺依赖，已停止重试，不安装依赖。元数据和相对链接采用文本核对，自动 YAML 校验未完成。
- Skill 与规范阶段未运行应用检查；追加官网展示数据修改后，仅运行官网 tsc --noEmit，结果通过。未运行应用测试、构建、浏览器检查或独立子代理评估；仓库规则禁止子代理。
- 仓库文件已创建不等于本机会话自动发现或全局安装；当前已安装 workflow-change 副本没有同步修改。

## 用户验收

用户明确要求“提交关于tests skill的”，据此批准当前工作项完结和两笔本地提交；已有结果与未验证事项保留，不追加验证。

## 提交方案

追加官网展示数据后按代码与文档两笔提交。代码范围：apps/website/src/shared/products/categories.ts，仅新增 tests 条目。拟用完整消息：

```text
feat(website): 在产品介绍中展示 tests 技能

- 新增按影响范围验证的说明与源码入口
```

文档范围：AGENTS.md、docs/verification.md、skills/tests/SKILL.md、skills/tests/agents/openai.yaml、skills/workflow-change/SKILL.md、本 Issue、Commit 记录及工作台中对应条目。其他 Logo 与目录迁移工作项不混入。

拟用完整消息：

```text
docs(repo): 新增按影响范围验证的 tests 技能

- 独立维护分级检查与验证结果复用规范
- 本地提交不追加验证并按需衔接开发工作流
```

用户已批准，上述代码与文档范围、完整消息和机械性终态更新已展示；代码提交完成，随本次文档提交将 Issue、交付记录和工作台同步为已完成。

## 最终提交批准

已批准并按上述两笔执行本地提交；未推送或部署。
