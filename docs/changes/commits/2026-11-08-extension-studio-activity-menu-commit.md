# 完善 Studio 登录提示与活动入口：交付记录

## 对应工作项

- 状态：已完成。

- [Issue](../issues/2026-11-08-extension-studio-activity-menu-issue.md)

## 预期交付边界

Studio 共用账号提示与内容重置、dashboard-01 侧栏、Activity / Daily 查询空表结构、Activity 目录整理、完整官方基础主题及规范、本机视图偏好。Daily 不接接口，不修改后端契约。

## 实际交付

- Studio 统一读取账号，访客左侧显示官方 Empty、右侧显示登录提示，复用现有 AccountDialog；会话过期与普通错误分别处理。登录不自动选择页面，账号变化以账号 ID 和重置版本使内容与旧选择失效。
- dashboard-01 inset/offcanvas 侧栏按用户截图采用分组标题 Activity 与图标平铺项 Daily，保留 Exts、Home、账号入口；移除折叠菜单和缩进。官方 SidebarGroup/Label、BreadcrumbSeparator、EmptyContent 按固定版本补齐。
- Daily 展示官方日期范围筛选、六列表头和明确未接入的 Empty；不填模拟记录或调用 API，不显示总数、分页、页面标题说明及可见 caption。Columns 位于工具栏最右侧，固定文案使用英文。
- 通用 DataTable 增加可选 emptyContent、showPagination、showCaption，默认行为保留，无障碍名称保留。业务列和文案属于 Activity。
- Activity 按 charts/daily/data 分组，原卡片、Provider、算法与消息入口引用同步；保留原时长格式、上海跨日展示更新和既有行为测试，不增加跨日请求。
- 完整迁入固定官方主题骨架 shadcn-theme.css 与 Tailwind 扩展 shadcn.css；核对 70 个标准变量/映射名称。tw-animate-css 精确版本 1.4.0 及锁文件同步；默认边框、轮廓、明暗变体接入现有主题，原个性化颜色/材质/圆角覆盖保留。
- chrome.storage.local.ui.view 保存 Home/Studio，启动读取后再挂载，快速切换串行保存，不广播其他已打开标签页导航。账号重置统一移除除 ui 外的本地键，不把位置混入云端 settings，不保留 Daily 选择或业务数据。
- 扩展 AGENTS、UI 规范、DataTable API 说明、官方来源、Issue 与工作台同步。

## 验证与限制

- pnpm --filter @exts/extension test --no-file-parallelism --maxWorkers=1：31 个文件、129 项通过。
- 本机位置读取最初缺少 view 属性类型收窄，补齐后相关视图偏好/账号重置 2 个文件、4 项复测通过。
- pnpm --filter @exts/extension typecheck：最终通过。
- pnpm ext:build：最终通过，产物 dist/build/chrome-mv3；既有 theme-init 非 module 脚本和大分块警告保留。
- 固定官方主题的 70 个标准变量/映射名称齐全，目标 var 均有定义；按声明与选择器核对，明暗两种模式原有 Token 取值保留。这不等于浏览器视觉验收。
- git diff --check：开发交付时通过；本地提交请求后未追加检查。
- 未执行代理真实浏览器视觉、布局、焦点、键盘、登录/退出、多标签页或刷新验收；未更新 dist/dev 稳定开发目录。未接 Daily API，未推送或部署。

## 用户验收

用户于 2026-11-08 明确要求 commit，按仓库规则批准当前工作项本地提交完结；实际浏览器验收细节未另行记录，不把未执行事项记为通过。

## 提交方案

### 代码提交

- apps/extension/package.json、pnpm-lock.yaml。
- apps/extension/src/app/{App.tsx,view-preference.ts}、entrypoints/newtab/main.tsx、features/account/background.ts。
- apps/extension/src/components/custom/data-table/{data-table.tsx,toolbar.tsx,types.ts}、components/custom/{types.ts,ui-icon.tsx}、components/ui/{breadcrumb.tsx,empty.tsx,sidebar.tsx}。
- apps/extension/src/features/activity 原文件迁移至 charts/ 与 data/，根 background.ts 引用调整，daily/{columns.tsx,daily-empty.tsx,daily-records.tsx}；pages/newtab/cards.tsx。
- apps/extension/src/pages/studio/{index.tsx,studio-sidebar.tsx,daily-page.tsx,menu.ts,studio-access.ts,studio-content.tsx}。
- apps/extension/src/styles/{index.css,theme.css,shadcn-theme.css,shadcn.css}。
- apps/extension/tests/app/view-preference.test.ts、tests/pages/studio/studio-access.test.ts、tests/features/account/account-reset.test.ts、tests/features/activity/{activity-calendar.test.ts,data.test.ts}。
- 摘要：交付 Studio 账号与菜单、Daily 查询空表、本机视图偏好，完成目录迁移与官方样式基础层对齐。

```text
feat(extension): 完善 Studio 活动页面与本机视图偏好

- 统一账号内容边界并加入 Activity 与 Daily 查询空表
- 整理 Activity 目录并完整对齐 shadcn 基础主题
- 保存本机视图位置并在账号重置时保留
```

### 文档提交

- apps/extension/AGENTS.md、docs/extension/{ui.md,data-table.md}、docs/web-ui-sources.md、docs/changes/README.md、对应 Issue 与本 Commit 记录。
- 摘要：同步实际目录、官方组件与主题边界、本机持久化、接入说明及有效验证结果。
- 随文档提交的机械性终态更新：Issue 与交付记录已完成、提交批准已批准、工作台清空当前 Issue 并移入完成索引。失败时保留成功代码提交，文档恢复待提交及待批准。

```text
docs(extension): 记录 Studio 改造与基础主题规范

- 记录菜单和活动页面边界及本机偏好规则
- 同步官方样式来源与工作项完成状态
```

## 最终提交批准

已批准。用户于 2026-11-08 明确要求 commit，批准两笔本地提交与上述机械性终态更新，不包含推送或发布。
