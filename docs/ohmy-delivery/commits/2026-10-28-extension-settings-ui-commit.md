# 统一设置列表与全局状态反馈：交付记录

## 对应工作项

- [Issue](../issues/2026-10-28-extension-settings-ui-issue.md)

## 实际交付

官方组件设置分组、可折叠下载子项、主项问号、英文分段帮助；StatusIcon 六级和业务自有 Tooltip；设置英文反馈文案集中维护，统一 Sonner Toast，清理临时排错日志。保留下载、主题和权限业务，无新增依赖。

## 验证与用户验收

拆分前最终工作树 76 项逻辑测试、类型检查及生产构建通过，既有 theme-init.js 提示不阻塞。用户已确认没有问题；浏览器由用户验收，代理未执行视觉／交互或 macOS 验证。X／Helper 未接入。

本次只拆分提交，不重复测试中间快照；最终代码保持已验收成果。

## 文件边界

- 代码：Newtab GeneralSettings、MediaDownloadSettings、DockSettings；HistoryCleanerSettings 行布局／Toast；shared/settings/messages.ts；官方 Item／Collapsible、StatusIcon、UiIcon 映射与类型。
- 文档：本 Issue／记录、工作台、根 AGENTS，以及应用 AGENTS、UI、功能和来源文档的设置部分。

## 完整 Commit message

### 代码

```text
feat(settings): 统一设置列表与状态反馈

- 采用官方分组列表及可折叠下载状态
- 统一状态图标等级与业务提示文案
- 将设置失败反馈集中为 Toast
```

### 文档

```text
docs(settings): 完结设置与状态等级改造记录

- 记录设置界面与状态等级规范
- 同步验收结果并完结设置工作项
```

## 最终提交批准

用户于 2026-10-28 明确要求设置 Issue 独立本地提交。下载工作项完结后先代码、后文档；随文档提交将本 Issue／记录／工作台同步为已完成，不推送。

## 提交状态

已完成；下载工作项完结后，本项代码与文档按用户批准依次提交，不推送。
