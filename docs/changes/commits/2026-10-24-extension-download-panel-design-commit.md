# 展示 Download 下载记录：交付记录

## 对应工作项

- [Issue](../issues/2026-10-24-extension-download-panel-design-issue.md)

## 预期交付边界

按最新批准方案实现 TG 成功记录、Download 紧凑列表、筛选、按来源清空、官方确认框和文件夹不可用反馈；不接 Desktop/X 下载，不改变 TG 实际保存行为。

## 实际交付

- 独立 modules/downloads 复用 shared/storage，实现持久化、后台串行新增/清空与订阅；TG 成功后只上报实际文件名及字节数，后台生成标识和完成时间并校验来源。
- Newtab 展示 40px 紧凑行、实际文件名与大小，缺失显示 0 MB；无角标或单条删除，截断提示使用现有 Tooltip。
- 图标筛选靠左，文件夹与清空靠右，32px 按钮、16px 图标、4px 间距；清空跟随筛选，官方 Alert Dialog 在整个页面居中，仅删除记录。
- TG 成功提示保留在原页面；X 只预留，文件夹按钮提示尚未接入 Desktop，不连接、不创建或打开目录。
- 按用户反馈把共用 Toaster 默认位置明确为右下角，TG 去除单独的位置覆盖；空列表文案在工具栏下列表可用区域水平、垂直居中。
- 同步现行 TG 边界、Newtab 说明、官方固定源码与必要差异、Issue/Plan/工作台。数量上限未批准，不自动淘汰记录；存储失败保留原数据。

## 验证与限制

- 完整扩展 74 项测试通过；类型检查和生产构建通过，既有 theme-init.js 非 module 脚本提示仍保留。
- 右下角提示及空状态居中调整后，重新执行 74 项测试、类型检查及生产构建，均通过；视觉与交互仍待用户验收。
- 类型检查首次发现测试索引可能为空，修正可选访问后复查通过；没有为工具问题更改业务行为。
- 已静态自查，未执行浏览器视觉、交互、焦点、系统授权及真实文件验收；无新增权限或依赖，未接 Desktop/X，不自动补录历史记录，不推送。

## 用户验收

用户明确要求 commit，批准按已展示的两笔拆分方案本地提交并完结；浏览器视觉、交互和真实文件验收未由代理执行，既有限制保留。

## 提交方案与完整 Commit message

- 用户已明确批准按以下两笔执行本地提交，不改写已有历史，不推送。

### 第一笔：统一右下角提示

- 文件：src/shared/ui/sonner.tsx、src/modules/tg-download/components/download-menu/index.tsx（均位于 apps/extension 下）。
- 文档分段：docs/extension/telegram-download.md 仅右下角默认位置说明；docs/web-ui-sources.md 仅 Sonner 默认位置说明。记录接入与 Alert Dialog 的说明留给第二笔。
- 结果：共用 Toaster 默认 bottom-right，TG 去除 top-right 覆盖，保留原成功文案、触发及堆叠行为。

```text
fix(extension): 统一下载提示到右下角

- 在共用 Toaster 设置右下角默认位置
- 移除 TG 单独的位置覆盖并同步说明
```

### 第二笔：下载记录功能与工作项收尾

- 新增：src/modules/downloads/、src/modules/newtab/views/downloads/、src/shared/ui/alert-dialog.tsx、tests/modules/downloads/（均位于 apps/extension 下）。
- 接入：src/entrypoints/background.ts、src/modules/newtab/views/dock/dock-download.tsx、src/modules/tg-download/download-core/save-media.ts、src/modules/tg-download/page/{index,content-bridge,events}.ts、src/shared/ui/types.ts、src/shared/ui/ui-icon.tsx 及 tests/modules/tg-download/download-core/download-media.test.ts；上述路径均位于 apps/extension 下。
- 说明与记录：apps/extension/AGENTS.md、docs/extension/newtab.md、上述两份文档剩余功能片段、本 Issue、本 Commit 记录、对应 Plan 和 docs/changes/README.md。
- 结果：TG 成功元数据持久化并同步展示；紧凑列表、图标筛选、按筛选清空、页面居中确认、空状态居中及文件夹不可用提示。
- 用户已明确批准提交，第二笔同步 Issue 和交付记录为已完成、工作台移入已完成索引；提交失败则恢复待提交/待批准状态。

```text
feat(extension): 展示 TG 下载记录并支持筛选清空

- 持久化 TG 成功记录并同步到 Download 紧凑列表
- 添加来源筛选和页面居中的清空确认框
- 保留页面完成提示并提供文件夹未接入反馈
```

## 最终提交批准

已批准并按两笔本地提交完结。Issue、交付记录和工作台同步为已完成；不追加验证，不推送。
