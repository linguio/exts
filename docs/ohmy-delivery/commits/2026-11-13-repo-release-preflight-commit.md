# 发布前排查与媒体分页交付记录

- [Issue](../issues/2026-11-13-repo-release-preflight-issue.md)
- 状态：已完成
- 用户验收：已通过
- 提交批准：已批准（用户明确要求本地commit）

## 预期边界
SQLite媒体分页及对应测试；有证据的同类发布阻塞最小修复，范围随调查记录，不扩大功能。

## 实际交付、排查与验证
- SQLiteMediaStore基础SQL明确追加换行，解决首页mediaORDER与两个游标分支mediaWHERE缺分隔；原有失败测试保留。
- 新增一个Swift行为用例，覆盖同日期ID稳定排序、日期转空日期、空日期继续翻页、末页、未知游标与零上限；没有新增测试框架或源码字符串断言测试。
- 实际内存SQLite查询计划发现冗余CASE导致首页临时排序；按[SQLite官方排序规则](https://www.sqlite.org/lang_select.html)，降序天然空值最后，简化为sort_date DESC/id ASC，不改排序语义、不加索引。最终首页使用已有media_sort_index，空日期游标也使用该索引。
- 有日期游标的OR分支仍可产生临时排序，不声称所有分页分支完全优化；本轮未为消除计划字样重写分页或增加架构。

## 排查范围与结论
- 核对v2.2.0至当前交付的活动代码变更列表，以及Desktop、Extension、Website、API、根脚本与公共包的测试/发布入口；活动代码进行SQL拼接、崩溃断言和高风险入口模式检索，重点读取媒体分页、下载文件操作、计时声音调度、账号/设置会话边界及API查询构造。不是所有业务源码逐行审计，不承诺无缺陷。
- Desktop其他查询是独立完整SQL；未检索到另一处同类base拼接，首个错误会阻塞后续测试分支的问题由新增分页行为覆盖补足。
- API活动查询通过psycopg.SQL/Identifier与绑定参数组合，未发现本次SQLite式缺分隔或直接字符串拼入条件的问题；设置更新本次没有新增实现变化。
- 计时状态使用截止时间与一次完成标记，声音取消保持现有本地偏好与不重置计时；未新增无证据的模块重构。
- 发布检查仍先于打Tag与创建Release草稿；完整原生测试入口保留，不恢复4类白名单，不通过删测试或取消隔离/全量来提速。
- 先前账户request-failed仅为安全归类日志，没有原始请求证据，且用户后续表示可以；本轮没有据此改认证或冒称已定位外部网络原因。
- 除已确认的媒体分页根因与首页排序优化，尚未发现有足够证据的第二个独立发布阻塞。构建警告、实库与原生执行限制如下，不冒称全仓库已无其他问题。

## 本轮实际验证
- 修复前提取实际Swift分页SQL，在Python内存SQLite复现near CASE；不连接任何已有数据库。
- 修复后实际三分支SQL在内存SQLite六组结果通过：同日期、日期游标、转空日期、空日期游标、末页、零上限。该验证只覆盖SQL层，不能代替Swift编译、绑定与原生测试。
- 最终查询计划检查：首轮对全部分支均无临时排序的预期过宽，日期游标OR计划不满足；一次定位后仅修正诊断断言为首页优化，未改业务迎合工具。重试通过，日期游标计划限制如实保留。
- `pnpm --filter @exts/extension test --maxWorkers 1`：43文件177项通过，约21秒。
- Node完整入口（根build/release/release-notes、Desktop/API启动、官网三份逻辑、npm工具）：72项通过。
- API完整unittest入口：63项中55通过、8项因无隔离PostgreSQL跳过；未连接生产库，保留Starlette/httpx弃用提示。
- 稳定产物工具：10项通过，类型检查及tarball独立安装/真实WXT构建、增量、注入失败保留、恢复和重启集成通过并退出；未留下长期dev进程。
- Extension与Website类型检查、构建通过；保留theme-init.js非module与chunk大小警告。版本2.3.0和四条发布说明输出正确，本轮没有修改。
- `git diff --check`通过；本轮没有新增依赖或修改CI/版本/Changelog；按用户批准执行代码、文档两笔本地提交，不推送或发布。

## 待验证与用户验收步骤
1. 审阅SQLiteMediaStore和新增SQLiteMediaStoreTests用例，确认修复只涉及SQL分隔、等价排序和对应行为覆盖。
2. Windows不能执行Swift/Xcode。macOS在apps/desktop内先运行`xcodegen generate`，再沿现有工作流执行完整extsTests（不加only-testing白名单，禁用并行，DerivedData仍在根dist缓存）；或用户批准提交/推送后查看GitHub完整原生测试。原两项分页失败应消失，新增空日期分页用例应通过；结果未知前不宣称原生通过。
3. 原生测试通过后继续现有双端打包与ZIP/DMG校验，尚未在本地完成。最终公开Release由用户验收，当前没有发布授权。
4. 8项PostgreSQL实库测试仍缺隔离环境，记录待验证，不用生产数据库补测。真实登录/浏览器声音/布局交互也未由代理执行，不把逻辑测试算真实用户验收。

## 提交边界与消息
代码：apps/desktop/src/modules/media/Library/SQLiteMediaStore.swift与对应SQLiteMediaStoreTests.swift。

```text
fix(desktop): 修复媒体分页查询并简化排序

- 补齐基础SQL与分页子句的分隔并复用已有排序索引
- 覆盖同日期与空日期游标的连续分页行为
```

文档：Issue、Commit记录和工作台。

```text
docs(repo): 记录发布前排查与分页修复验证

- 记录本地全量检查与SQL修复结果
- 明确原生、实库和发布验收限制
```

用户已验收通过并批准上述两笔本地提交，Issue、Commit记录和工作台同步为已完成，未验证事项保留。
