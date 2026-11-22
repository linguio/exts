# 计时卡片与表格操作交付记录

- [对应Issue](../issues/2026-11-14-extension-timer-digit-scale-issue.md)
- 状态：已完成
- 用户验收：已通过
- 提交批准：已批准；计时与表格代码分别提交，文档独立提交

## 已批准交付边界
用户明确将表格调整合并当前计时卡片工作项，不另建Issue。包括数字比例2.5、精简音色及默认值、Actions固定修正、Edit更多菜单及10条分页。保留原计时与编辑业务流程，不实现Delete或缓存。

## 实际交付
- 用户验收补充：Edit菜单项增加16px Lucide SquarePen，与现有编辑Sheet图标一致，通过UiIcon静态映射复用主题；类型检查与构建通过，不追加无关逻辑测试。
- timer.css文字层scaleY从2.8改为2.5，字号、外框和留白不变。
- Timer Sound仅Metronome、Brown Noise，Completion Sound仅Harp、Glass Chime；默认Metronome＋Harp。保留有效与null静音偏好，移除项回退默认；删除不再使用的音色合成分支并更新原测试。
- DataTable顶部固定从thead下放到各th；普通表头top-0/z-20，Actions表头同时right-0/z-30，Actions数据格right-0/z-10，不拆表、不新增滚动容器。
- QueryDataTable标准Edit由原列编辑配置与updateFn/previewEdits决定，改为DataTableRowActions中的官方更多按钮与DropdownMenuItem；加载时禁用，选中Edit打开原Sheet并避免菜单抢回焦点。不新增操作配置层或Delete。
- 共用默认pageSizes与Daily显式配置均为10/20/50/100；initialQuery默认20不变。切10仍走原查询流程并回第一页。
- 同步应用规范、表格长期规范、DataTable说明、UI规范及官方组件组合来源；历史交付记录不改。

## 验证结果与限制
- 原先构建触发依赖补装并遇到DNS失败，已中止；随后使用pnpm install --frozen-lockfile补齐373个现有依赖，全部复用缓存、无版本升级或锁文件变动，WXT prepare完成。原依赖阻塞已解除。
- Node原生断言通过：声音新默认、旧值回退、合法选项/静音保持、独立保存、棕噪声幅度；表格默认20、切10回首页且请求pageSize=10。
- 定向Vitest覆盖表格状态/查询/列配置/行预览、Daily查询与更新、timer：首轮10文件46项通过、2项失败，均为此前声音默认调整时的错误测试预期。修正保留Brown Noise和旧Rain Tap回退Metronome两处预期后，仅复跑该文件6项通过；合计当前10文件48项有效通过。
- pnpm --filter @exts/extension typecheck：通过。
- pnpm --filter @exts/extension build：通过，产物dist/build/chrome-mv3。仍有theme-init.js非module脚本及chunk超过500kB警告。
- git diff --check通过。未执行本轮全量应用测试；此前4项旧导航存储断言失败不在本次修改范围。
- 未执行Chrome/Edge视觉、横纵滚动、菜单/焦点或声音听感验收，不新增截图、布局、指针、焦点测试或假DOM。
- 白噪声试听后重新启动的衔接限制不在本次修复范围。
- 用户验收通过并批准本地提交；计时与表格代码均已提交，文档随本笔提交完结。未推送或发布。

## 用户验收步骤
1. Chrome/Edge重新加载dist/build/chrome-mv3，检查时钟与倒计时数字纵向比例2.5；右键确认两组各两种声音及默认Metronome/Harp，有效本地选择和静音不被重置。
2. 登录Studio→Activity→Daily，默认每页20条；Rows per page可选10/20/50/100，选择10回第一页且显示最多10条。
3. 缩窄窗口或显示足够多列以产生横向滚动；滚到左/右边界，Actions表头与行入口应始终固定右侧。纵向滚动记录，表头固定顶部且右上角Actions不随记录离开。
4. 某行更多按钮→Edit，仅展示Edit；应打开该行原Sheet，保持标题初始焦点、校验、保存及关闭行为。加载时入口禁用，排序、筛选、空态与分页保持正常。

## 提交边界与完整消息
代码包含计时CSS/音频/偏好及测试，以及DataTable/QueryDataTable/行菜单、通用图标、Daily分页及表格状态测试。
文档包含应用AGENTS、UI/表格规范、DataTable说明、来源、Issue/Commit记录和工作台。用户已批准上述范围本地提交。

计时代码消息：
```text
refactor(extension): 调整计时数字比例并精简音色

- 减少数字文字拉伸并保留原有布局
- 精简音色并兼容旧本地偏好
```

表格代码消息：
```text
fix(extension): 修复表格固定操作列并收拢编辑菜单

- 将固定表头下放到单元格并固定右上角 Actions
- 通过更多菜单编辑记录并增加每页十条选项，默认保持二十条
```

文档消息：
```text
docs(extension): 记录计时卡片与表格操作调整

- 同步现行规则、交付边界与验证结果
```
