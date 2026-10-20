# 整理开发工作流与观察 Skill 并更新项目介绍：Commit 记录

## 对应 Issue

- [Issue](../issues/2026-10-20-repo-development-skills-readme-issue.md)

## 预期交付边界

- 整理现有 Skill 为 workflow-change，保留有效交付规则并修正重复批准、范围追加、记录整理及提交恢复问题。
- 新增仅在项目开发 Skill 使用场景生效的 workflow-observer，支持按项目记录观察、考察真实需求及月度复盘提醒；不自动修改 Skill 或用户偏好。
- 更新根 README 的项目介绍、安装开发入口、结构和两份 Skill 说明。
- 用户随后指定最终名称 workflow-change，并批准在官网 Skills 分类加入两份 Skill 的用途与源码入口。
- 用户已批准设计、实施及本机两个符号链接接入，要求明确 Superpowers 配合；查看五笔完整方案后批准本地提交，不推送。

## 实际交付

- 将原 Skill 迁移为 workflow-change，重写入口与参考，精简两份模板及调用配置；补齐范围追加、批准延续、任务恢复、多笔提交和部分失败处理。
- 新增 workflow-observer 的入口、调用配置及记录／复盘参考，禁止隐式调用；开发观察按项目授权写入，重复和月度时间均不自动构成更新需求。
- 明确与 Superpowers 按需配合，共用工作项、设计和计划，用户与仓库对代理、并行、验收及 Git 操作的约束优先。
- 新增本项目观察日志，记录三条可核对事实及待考察线索，不读取其他会话、不写个人记忆、不认定永久偏好。
- 重写根 README，以模块定位替代具体功能清单，保留安装、本地开发与文档入口，说明 Skill 接入方式；目录树按用户指定只保留 .github、apps、packages、skills、docs、scripts、assets、dist，顺序不变，只展开 apps 三个应用。
- 官网 Skills 分类新增 workflow-change、workflow-observer 的用途与源码链接，复用现有模块展示；更新官网规范，不修改页面布局或新增组件。
- 在用户 .agents/skills 创建两个指向 D:/GitHub/exts/skills 对应源目录的符号链接，不复制源稿、不覆盖其他安装；链接本身位于仓库外，不纳入 Git Commit。

## 验证结果

- 最终改名及 README 精简后，14 个文件 UTF-8、41 处本地引用、新名称和调用策略核对通过；两份 Skill 的受限 YAML 结构、README 命令及版本此前核对通过。
- 10 个开发及观察场景完成当前代理串行走查，结果与约定边界一致；详见[实施计划](../../superpowers/plans/2026-10-20-repo-development-skills-readme.md)。
- 内置 quick_validate.py 因 Python 缺少 PyYAML 未运行成功；已用现有 Node 检查本次简单 YAML 结构及字段值，未安装依赖、未修改配置，不宣称原脚本通过。
- 官网两份 Skill 的名称、说明、源码地址和 hash 断言核对通过；现有 10 项逻辑测试、类型检查和生产构建通过，产物位于 dist/build/exts-web。
- 两个本机符号链接的目标及经链接读取的 8 个文件 SHA-256 核对通过；刷新后 workflow-change 已出现在当前会话可用 Skill 列表中。Observer 禁止隐式注入，其源文件已按链接读取核对。

## 未验证事项与限制

未进行独立代理压力评测、真实故障演练及跨月提醒运行；Observer 实际调用行为尚未完整验证，不创建后台自动化，不修改 Codex 配置。未进行浏览器视觉／交互验收或核实 GitHub 源码链接在线可用性，未推送前新目录链接可能不可用；效果仍待用户验收和后续实际开发验证。

## 用户验收

已通过：用户查看交付材料与五笔提交范围、完整消息后明确要求“提交到本地”，按仓库规则同时表示验收与提交批准；未独立验证的事项保留。

## 最终提交批准

已批准：按已展示五笔边界及完整消息本地提交，最后一笔同步 Issue、Commit 记录和工作台完成状态；不推送或部署。

## 最终 Commit message

以下五笔范围及完整消息已获用户批准；最后一笔同步 Issue 为已完成、验收为已通过、提交批准为已批准，并把工作台当前项移入完成索引；失败时恢复未完成部分真实状态，不推送。

### 1. Observer 与项目观察

范围：skills/workflow-observer/SKILL.md、skills/workflow-observer/agents/openai.yaml、skills/workflow-observer/references/observation-review.md、docs/skills/workflow-observer/observations.md。

```text
feat(skills): 新增开发协作观察与复盘机制

- 仅在开发任务中记录事实并按月检查复盘邀请
- 保留证据与推测边界并加入项目初始观察
```

### 2. Change 工作流重构

范围：删除 skills/local-issue-commit-workflow 下原有五个文件，迁移并重写为 skills/workflow-change/SKILL.md、agents/openai.yaml、references/workflow.md、assets/issue-template.md、assets/commit-template.md。

```text
refactor(skills): 整理本地变更工作流与交付规范

- 统一为 workflow-change 并精简模板与提交规则
- 明确 Superpowers 衔接与开发观察入口
```

### 3. 官网 Skills 介绍

范围：apps/website/src/features/products/categories.ts、docs/website/ui.md。

```text
docs(website): 添加开发工作流 Skill 介绍

- 展示两份 Skill 的用途与源码入口
- 同步官网模块展示规范
```

### 4. 根 README

范围：README.md。

```text
docs(repo): 梳理根目录模块与开发入口

- 以模块说明组织项目介绍与文档入口
- 整理安装开发指引并精简目录树
```

### 5. 设计与交付记录

范围：docs/changes/README.md、本 Issue、本 Commit 记录、docs/superpowers/specs/2026-10-20-repo-development-skills-readme-design.md、docs/superpowers/plans/2026-10-20-repo-development-skills-readme.md。

```text
docs(repo): 记录开发 Skill 整理与接入结果

- 记录设计验证和本机符号链接接入结果
- 同步验收与提交批准并完成当前工作项
```
