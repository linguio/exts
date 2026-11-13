# 版本整理与全量验证流程交付记录

- [Issue](../issues/2026-11-13-repo-release-workflow-issue.md)
- 状态：已完成
- 用户验收：已通过
- 提交批准：已批准（用户明确要求本地commit）

## 实际交付
- 现有workflow-change、workflow-tests及提示元数据区分日常最小充分验证、普通commit复用、发版本全量检查。
- 更新产品版本先整理上一正式版本以来全部提交与必要diff，展示版本号和Changelog标题/分类/正文草稿，用户审定后才写入；已有审定不重复确认。
- 全量检查同时审查过期、无调用代码、重复、实现细节断言和执行入口，列证据及建议；不凭失败或mock/readFile直接删测试，不授权擅自清理。
- 结合用户进一步批准，在同一Issue更新9份Extension测试，清理无调用的selectedStudioPage；根规则、验证规范、发布规范及现行导航规范同步，未改版本号、日志或应用依赖。

## 76个活动测试文件的扫描与实施
根3、Website3、Extension43、API12、Desktop13（Swift12）、两个公共工具各1；排除archive、dist与依赖。扫描声明、导入、实现细节/视觉断言与实际入口，并追踪候选生产调用；不宣称逐条动态验证Swift或穷尽缺陷。

| 文件（apps/extension/tests下） | 实际调整 |
| --- | --- |
| app/view-preference.test.ts | 采用session/ui-session契约，验证最终位置、并发路由/视图互不覆盖和账号隔离；local清理合并到集成覆盖 |
| features/account/account-reset.test.ts | local全清、session导航不被清理；保留清理先于认证、清理失败阻止登录和取消处理 |
| pages/studio/login/account-state.test.ts | 旧无调用helper测试替换为实际路由注册表的恢复/未知回退，其他身份状态覆盖保留 |
| components/ui/toast-copy-action.test.ts | 删除class拼接、Tooltip和延迟常量断言，保留复制前后可访问名称 |
| components/custom/data-table/row-preview.test.ts | 删除重复成功路径，保留匹配合并、null/0、目标缺失 |
| features/bookmarks/bookmarks.test.mjs | 不复制整份默认配置；验证各实际列表内ID唯一、HTTPS、资源存在及已确认UI/EDU和Dock顺序，不禁止跨文件夹复用书签 |
| components/query-data-table.test.ts | 只保留草稿/生效条件、Query/Reset和重试状态 |
| components/custom/data-table/query-request.test.ts | 集中响应/忽略signal、迟到成功/失败、重试、非法total与分页元数据、安全错误覆盖 |
| config/manifest.test.mjs | 移除optimizeDeps写法断言，保留权限、版本、图标/资源与输出隔离 |

生产旧helper位于apps/extension/src/pages/studio/login/account-state.ts，仅删除无调用函数，不改变产品导航行为；Extension AGENTS与UI规范改为当前session导航、账号路由恢复与Overview默认页。

API/Website和桌面其余用例暂未发现支持批量删除的证据；认证/权限/下载/数据隔离保留。根/公共工具readFile验证的是产物与失败保留，不能当成源码测试删除。前后端分别校验不受信输入不自动当重复。未发现假DOM、截图或真实焦点/指针自动化测试。

## CI入口实际调整
- Website构建新增现有三份官网逻辑测试；Release的Node入口补API启动脚本、官网逻辑及npm发布工具，单并发执行。
- Release补稳定产物工具类型与真实包集成，Extension单worker；原生测试去掉4类白名单，完整执行extsTests并禁用并行，保留既有40万条压力用例。
- API测试使用固定[setup-uv v10.3.3](https://github.com/astral-sh/setup-uv/blob/v10.3.3/action.yml)和[uv 0.11.19](https://github.com/astral-sh/uv/releases/tag/0.11.19)，Python读取apps/api/.python-version，安装现有精确requirements-dev.txt；不改Python或应用依赖版本。
- API_TEST_DATABASE_URL显式置空，不建外部数据库、不接生产库；8项实库测试仍会跳过，不能称数据库全量通过。
- 发布规范同步现有“根版本高于最新远端Tag或无Tag才触发”事实，不修改触发器、部署目标、权限和发布产物。

## 有效验证结果
- 原始Extension全量：173通过、4失败，确认旧local断言与session实现冲突；随后更新契约并保留风险覆盖。
- 更新后`pnpm --filter @exts/extension test --maxWorkers 1`：43文件、177项全部通过，约18秒；数量不变是删重复后补真实边界，不是改业务迎合断言。
- 随后书签约束收窄为各实际列表内ID唯一，针对该文件重跑3项通过；其余有效结果复用。
- Extension类型检查与构建通过；保留theme-init.js非module及chunk大小警告。
- 同次本地全量已通过且输入未失效的结果：根/官网/API及Desktop启动脚本/npm工具Node测试72项；API 55通过、8跳过；稳定工具10项、类型与真实WXT包集成通过；官网类型检查与构建通过。集成中主动注入缺失导入后恢复成功，非遗留失败。
- 版本输出2.3.0、发布说明四条正确；本轮未修改这两项。
- `git diff --check`通过（仅Git行尾转换提示），Markdown引用目标存在，Skill元数据与调用策略保留；日常/普通commit/草稿待审/发布全量/用例适用性/平台待验证场景人工审阅。

## 未验证与限制
- Windows不能执行macOS完整原生测试和双端发布打包；40万条原生压力用例耗时与资源待macOS确认，保留现有超时和串行规则，不静默跳过。
- 新CI的uv安装、API环境准备、完整原生及发布执行尚未在GitHub实际运行；工作流步骤与缩进人工审阅，本机无actionlint或YAML解析器，未声称通过这些工具校验。
- 隔离PostgreSQL未配置，8项跳过仍待验证；不能把CI成功等同数据库全量验收。
- 未执行浏览器视觉/交互验收、独立代理评估，按用户批准执行代码与文档两笔本地提交，不推送或发布。原四项失败已消除，但整套发布验证仍受上述平台/数据库条件限制。

## 用户验收步骤
1. 核对两个Skill：发版本先给草稿审定，发布全量包含用例适用性审查，日常与普通commit不额外跑全量。
2. 核对9份测试的精简范围与当前导航规范；可运行`pnpm --filter @exts/extension test --maxWorkers 1`，预期177项通过，不要求浏览器交互测试。
3. 审阅工作流新增入口；经单独授权推送后观察GitHub运行，确认API、官网/公共工具和全部原生类执行，8项实库跳过如实保留；macOS压力用例异常时停止定位，不扩大并发或资源。

## 提交边界与完整消息
代码提交：.github/workflows/exts-deploy.yml、旧account-state helper清理及上述9份测试。

```text
test(repo): 同步导航契约并补齐发布验证

- 更新过期导航测试并精简重复与实现细节断言
- 补齐官网、API、公共工具与完整原生测试入口
```

文档提交：两个SKILL.md、workflow-tests/agents/openai.yaml、根和Extension AGENTS、验证规范、发布规范、Extension UI、工作台、本Issue/Commit记录。

```text
docs(repo): 完善版本整理与全量验证流程

- 发版本先审定日志草稿并执行全量与用例适用性检查
- 同步导航规范、测试维护范围和验证限制
```

用户已验收通过并批准上述两笔本地提交；Issue、Commit记录与工作台终态同步为已完成，未验证事项保留。
