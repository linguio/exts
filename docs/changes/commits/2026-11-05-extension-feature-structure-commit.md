# 按 React 功能模块整理扩展目录：交付记录

## 对应工作项

- [Issue](../issues/2026-11-05-extension-feature-structure-issue.md)

## 预期交付边界

按已确认方案迁移扩展入口、页面、业务 feature 与公共代码，同步引用、配置、有效逻辑测试和文档；保持功能、外观、权限、依赖及构建产物路径。SVG 减重与线上存储另行处理。

## 实际交付

- 迁移 132 个源码与测试文件，移除两个不再需要的界面转导出入口；旧 src/modules、src/shared、tests/modules、tests/shared 已移除。
- app/App.tsx 负责顶层装配，pages/dock 持有业务导航；pages/newtab、studio、settings 只组合页面。features 按 bookmarks、activity、account、settings、history-cleaner、media-download 组织；媒体下载按 telegram、records 细分，其余按实际需要平铺。
- 通用 UI、品牌、Hook、工具、存储及主题偏好解析分别归 components、hooks、lib；依赖设置业务的主题运行逻辑归 features/settings，公共目录没有反向导入 feature 或页面。
- Telegram 内容脚本改名为 telegram-page.content.ts、telegram-bridge.content.ts，并增加中文职责注释。启动配置、后台注册顺序、权限与固定 ID 保留，不新增 register 层。
- 更新相对引用、CSS inline 路径、shadcn 别名以及 README、应用规范、现行功能文档和组件来源路径说明。资源、env、依赖和产物路径未修改。
- 按用户后续明确要求，将 Dock 的 7 个文件从 app/dock 移至 pages/dock，与 Newtab、Studio 并列；App 保留顶层组合和全局 Tooltip/Toast，未改变页面显示关系。
- 按用户最终要求，account-dialog、account-menu-content 两个共享界面归 pages/account，Dock 和 Studio 共用；仅 Studio 使用且依赖 Sidebar 的 account-login 归 pages/studio，features/account 保留认证及会话业务。
- 按用户后续明确要求，将 BrandIcon、UiIcon、StatusIcon 归入 components/custom，IconSize 与 UiIconName 合并到 custom/types.ts；移除原 components/brand 目录和 ui/types.ts，ui 目录保留 shadcn 来源组件及其已有项目适配，同步引用与现行说明。
- 将 app/newtab.css 移至 pages/newtab/newtab.css，保留文件名与全部样式规则；App 原位置导入新的路径，保持全局样式导入顺序，同步 UI 规范。
- 按用户要求修正审查发现的现行规范旧路径、Account 归属及 Exts 展示资源说明；Dock 到 Settings 的引用简化为同级页面路径，不改变行为。
- GeneralSettings 最终保留在 features/settings/general-settings.tsx，Settings 页面仅组合各业务设置项；MediaDownloadSheet 移到 pages/download/index.tsx，原位置移除。同步引用及现行文档，修正共享 Account 和 Studio 的旧注释。
- 删除 BrandIcon 中未使用的 name/_name 参数及四处调用传值；图标仍为装饰性图片，可访问名称继续由已有外层文本或控件提供。
- 按用户追加要求互换 Dock 的 Account 与 Settings 展示顺序，工具区为 Studio、Actions、Download、Account、Settings；其他行为不变。仅调整 JSX 排列，不重复运行逻辑测试，视觉由用户验收。

## 验证与限制

- 扩展 tsc --noEmit 通过；21 个测试文件、102 项测试串行执行通过，既有逻辑覆盖完整保留，未新增测试框架或视觉/交互测试。
- 首次构建定位到改名 CSS 的 ?inline 导入遗漏，修复该路径后仅重试一次生产构建，通过；没有重复运行已通过的逻辑测试。构建保留既有 theme-init 非 module 提示和大于 500 KB chunk 警告。
- Manifest 与迁移前构建比对通过：权限、主机权限、固定 key、content script matches/world/run_at 保留，仅两个 Telegram 输出脚本改名。44 个构建文件共 1712884 字节，约 1.71 MB。
- 旧目录移除、公共代码依赖方向及 git diff --check 检查通过；React 文件审阅限于此次路径与聚合入口调整，不借迁移修改 Hook、布局或交互。
- 未执行 Chrome/Edge 视觉或交互验收，未启动 dev server；dist/dev/chrome-mv3-dev-stable 仍是旧产物。加载本次 dist/build/chrome-mv3 验收，或用户运行原开发命令后再使用稳定目录。
- Dock 二次定位仅调整目录与引用，重新执行所属扩展类型检查及生产构建均通过；复用已通过的 102 项逻辑测试，不重复全量测试，构建警告同前。
- Account 界面迁移后类型检查及生产构建通过，继续复用未变更的认证业务测试结果；浏览器验收和提交仍未执行。
- custom 组件与共享类型分类后类型检查及生产构建通过；此次没有业务逻辑变化，不重复运行全量逻辑测试，既有构建警告保留。
- Newtab CSS 移动后仅执行扩展生产构建，通过；未重跑逻辑测试或类型检查，既有构建警告保留。
- 最后审查修正两处过时规范并简化一个等价导入，扩展类型检查通过；复用既有构建和逻辑测试结果，不追加全量验证。
- 冗余审查：tsc --noEmit --noUnusedLocals --noUnusedParameters 通过；静态扫描未发现自定义源码中无法从入口到达的文件、失效相对/别名导入、无其他引用的导出名或完全重复源码。此为静态检查，不证明所有动态分支均可达，也未清除官方组件的未使用导出。
- General/Download 归属调整及 BrandIcon 无效参数清理后，扩展严格未用变量类型检查与生产构建通过，复用既有逻辑测试；既有构建警告和浏览器验收限制保留。
- 按用户最终要求将 GeneralSettings 保留在 features/settings；该路径与界面内容已在本工作项早期构建通过，本轮严格未用变量类型检查通过，不重复业务测试或构建。
- 用户批准将 Studio 专用 AccountLogin 移至 pages/studio，更新侧栏及共享界面引用；严格未用变量类型检查通过，不重复业务测试或构建。
- 暂停图标管理工作项的文档删除是用户另行批准的未提交改动，不属于本迁移交付；不覆盖或混入提交。

## 用户验收

用户明确表示“验证通过 commit 把删除issue那条也一起提交了”，据此记录验收通过并批准本地提交；未追加验证，既有检查及未执行事项保持原记录。

1. Chrome/Edge 扩展管理页加载根 dist/build/chrome-mv3；避免同时启用相同 ID 的旧目录。
2. 打开新标签页，确认书签、文件夹、Activity、Dock 与迁移前一致；切换 Studio，再返回首页，原页面状态应保持。
3. 检查设置加载、主题切换、媒体下载总开关及刷新后恢复；关闭媒体下载后 Telegram 不出现新的下载入口，重新开启后恢复。
4. 刷新 Telegram Web，下载一项媒体，确认保存流程与成功提示、下载记录仍正常；账号登录/退出与已有取消或失败处理、历史清理权限和关闭状态保持原行为。历史清理实际删除只在用户专用浏览器环境验收，代理未操作真实历史。

## 提交方案

- 代码提交：apps/extension/src 的迁移与引用调整、apps/extension/tests 的功能对应迁移、apps/extension/components.json；不包含资源内容或依赖变更。完整消息：

```text
refactor(extension): 按页面与功能整理 React 目录

- 分离页面组合、业务功能与公共组件并同步引用
- 保留脚本运行边界和测试覆盖并清理无效参数
- 按确认顺序排列 Dock 账号与设置入口
```

- 文档提交：本 Issue、Commit 记录、工作台迁移条目、apps/extension/AGENTS.md、apps/extension/README.md、docs/extension/history-cleaner.md、newtab.md、telegram-download.md、ui.md 和 docs/web-ui-sources.md。完整消息：

```text
docs(extension): 记录功能目录迁移与验收结果

- 同步现行目录职责与组件来源路径说明
- 记录验证结果、用户验收及未验证事项
```
- 上述范围、完整消息、验证与未验证事项均已展示，按用户批准将 Issue、交付记录和工作台同步为已完成；代码提交成功，随文档提交完结。
- 用户同时批准独立提交已删除的图标管理工作项；仅包含 docs/changes/issues/2026-11-02-extension-remote-brand-cache-issue.md、对应 commits 文件和工作台索引删除，不混入迁移代码或迁移文档提交。完整消息：

```text
docs(repo): 删除暂停的网站图标管理工作项

- 删除对应 Issue、交付记录与工作台索引
```

## 最终提交批准

已批准并执行本地代码、文档提交；删除图标管理工作项另笔提交。未推送或部署。
