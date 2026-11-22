---
date: "2026-10-24"
scope: extension
status: completed
type: feature
---

# 展示 Download 下载记录

## 当前阶段

已完成。

## 目标与范围

### 背景与目标

Newtab 的 Download 原为一个空抽屉。本工作项沿用已提交方案及最新批准修订，实施 TG 成功记录、紧凑列表、来源筛选、按筛选清空和文件夹不可用反馈；X 与 Desktop 保持后续独立接入。

### 排除项

- 不新增权限、依赖或 Desktop 通信，不创建目录或打开 Finder；不改变 TG 取流、目录授权和实际保存规则。
- X 下载尚未迁入当前 Extension，不把旧归档功能视为已接入；不承诺本次产生 X 记录。
- 不自动改变 TG 的保存位置，不强制 TG 使用预设目录，也不把预设目录误称为实际保存位置。
- 本轮不包含 Desktop 通信与预建目录、X 下载接入、单条删除或下载进度与失败任务列表。

## Todo

- [x] 明确紧凑列表、图标工具栏、确认框与 TG/Desktop/X 的实施边界。
- [x] 复用公共存储实现记录、订阅和按来源清空，并验证来源校验与并发写入。
- [x] TG 文件关闭成功后上报实际文件名和字节数，失败与取消不记录。
- [x] 完成列表、图标工具栏、官方确认框和文件夹提示；同步组件来源与功能说明。
- [x] 执行扩展测试、类型检查与构建，同步记录并停在用户验收。

## 验收标准

- 本 Issue 与对应 Commit 记录互相链接，工作台列出当前待验收功能。
- 文档准确写明全部、TG、X 的目录映射，目录缺失与 Desktop 不可用的区别，以及点击不自动创建目录。
- TG 任意目录选择保持不变，X 尚未迁入，Finder 打开尚未实施；原方案交付与本轮功能实现状态区分准确。
- 文档准确记录紧凑列表、图标工具栏、按筛选清空、确认框位置、大小缺失为 0 MB 及无角标。
- TG 成功保存后记录持久化并同步到已打开 Newtab；失败与取消不记录，原页面成功 Toast 保留且 Newtab 不重复提示。
- 全部、TG、X 筛选与清空范围正确，不删除实际文件；文件夹按钮显示尚未接入提示，不误报目录不存在。
- Chrome/Edge 加载生产产物后由用户验证布局、Tooltip、确认框和上述流程；代理不执行视觉或交互验收。不自动提交或推送。

### 用户验收步骤

1. Chrome/Edge 重新加载根 dist/build/chrome-mv3，刷新 Telegram Web K，打开一个 Newtab 的 Download；确认默认全部、空列表文案与清空禁用。
2. 在 Telegram 成功保存图片和视频；页面显示既有完成 Toast，Download 同步新增记录，核对实际文件名、大小、倒序；刷新 Newtab 后记录仍在，另开 Newtab 也能同步更新。
3. 切换全部/TG/X：TG 显示新记录，X 暂为空。点击清空，检查确认框在整个页面中心；取消保留记录，确认只清当前范围，实际文件仍在。全部/TG/X 的跨来源隔离已有纯逻辑测试，真实 X 下载不在本轮验收范围。
4. 验证 40px 紧凑行、长文件名省略保留前缀和扩展名、截断时完整 Tooltip、图标提示与明暗主题；按钮顺序为文件夹、清空，间距 4px。TG 成功 Toast 与 Newtab 提示均位于各自页面视口右下角；空列表文案位于工具栏下列表区域正中。
5. 取消系统选择或使实际保存失败，不得新增成功记录。三个筛选下点击文件夹（包括空列表）均显示尚未接入 Desktop 提示，不创建或打开目录。

## 唯一下一步

无。

## 交付记录

### 验证与限制

- 针对性测试经历预期失败再通过；完整扩展 74 项测试通过，涵盖保存成功/失败、缺失大小、并发记录、来源校验、按来源清空、持久化和存储失败保留原值。
- 类型检查通过：首次仅测试代码数组索引可能为空，修正为可选访问后复查通过；生产构建通过，保留既有 theme-init.js 非 module 脚本提示。
- 用户反馈调整后重新执行完整扩展 74 项测试、类型检查与生产构建，均通过；本次只改提示默认位置和空状态布局，不新增样式或交互测试。
- 静态自查完成，未启用子代理，未执行浏览器视觉、布局、Tooltip、确认框、焦点或真实文件系统验收；自动化结果不代替用户验收。无新增依赖或权限，未接 Desktop/X 下载。
- 历史文件不自动补录；更新扩展后刷新 Telegram 页面，之后成功保存才会产生新记录。存储失败在 TG 控制台记录错误，实际文件和页面成功 Toast 保持原行为。

### 历史交付记录

#### 对应工作项

- [Issue](2026-10-24-extension-download-panel-design-issue.md)

#### 预期交付边界

按最新批准方案实现 TG 成功记录、Download 紧凑列表、筛选、按来源清空、官方确认框和文件夹不可用反馈；不接 Desktop/X 下载，不改变 TG 实际保存行为。

#### 实际交付

- 独立 modules/downloads 复用 shared/storage，实现持久化、后台串行新增/清空与订阅；TG 成功后只上报实际文件名及字节数，后台生成标识和完成时间并校验来源。
- Newtab 展示 40px 紧凑行、实际文件名与大小，缺失显示 0 MB；无角标或单条删除，截断提示使用现有 Tooltip。
- 图标筛选靠左，文件夹与清空靠右，32px 按钮、16px 图标、4px 间距；清空跟随筛选，官方 Alert Dialog 在整个页面居中，仅删除记录。
- TG 成功提示保留在原页面；X 只预留，文件夹按钮提示尚未接入 Desktop，不连接、不创建或打开目录。
- 按用户反馈把共用 Toaster 默认位置明确为右下角，TG 去除单独的位置覆盖；空列表文案在工具栏下列表可用区域水平、垂直居中。
- 同步现行 TG 边界、Newtab 说明、官方固定源码与必要差异、Issue/Plan/工作台。数量上限未批准，不自动淘汰记录；存储失败保留原数据。

#### 验证与限制

- 完整扩展 74 项测试通过；类型检查和生产构建通过，既有 theme-init.js 非 module 脚本提示仍保留。
- 右下角提示及空状态居中调整后，重新执行 74 项测试、类型检查及生产构建，均通过；视觉与交互仍待用户验收。
- 类型检查首次发现测试索引可能为空，修正可选访问后复查通过；没有为工具问题更改业务行为。
- 已静态自查，未执行浏览器视觉、交互、焦点、系统授权及真实文件验收；无新增权限或依赖，未接 Desktop/X，不自动补录历史记录，不推送。

#### 用户验收

用户明确要求 commit，批准按已展示的两笔拆分方案本地提交并完结；浏览器视觉、交互和真实文件验收未由代理执行，既有限制保留。

#### 提交方案与完整 Commit message

- 用户已明确批准按以下两笔执行本地提交，不改写已有历史，不推送。

##### 第一笔：统一右下角提示

- 文件：src/shared/ui/sonner.tsx、src/modules/tg-download/components/download-menu/index.tsx（均位于 apps/extension 下）。
- 文档分段：docs/extension/telegram-download.md 仅右下角默认位置说明；docs/web-ui-sources.md 仅 Sonner 默认位置说明。记录接入与 Alert Dialog 的说明留给第二笔。
- 结果：共用 Toaster 默认 bottom-right，TG 去除 top-right 覆盖，保留原成功文案、触发及堆叠行为。

```text
fix(extension): 统一下载提示到右下角

- 在共用 Toaster 设置右下角默认位置
- 移除 TG 单独的位置覆盖并同步说明
```

##### 第二笔：下载记录功能与工作项收尾

- 新增：src/modules/downloads/、src/modules/newtab/views/downloads/、src/shared/ui/alert-dialog.tsx、tests/modules/downloads/（均位于 apps/extension 下）。
- 接入：src/entrypoints/background.ts、src/modules/newtab/views/dock/dock-download.tsx、src/modules/tg-download/download-core/save-media.ts、src/modules/tg-download/page/{index,content-bridge,events}.ts、src/shared/ui/types.ts、src/shared/ui/ui-icon.tsx 及 tests/modules/tg-download/download-core/download-media.test.ts；上述路径均位于 apps/extension 下。
- 说明与记录：apps/extension/AGENTS.md、docs/extension/newtab.md、上述两份文档剩余功能片段、本 Issue、本 Commit 记录、对应 Plan 和 docs/ohmy-delivery/readme.md。
- 结果：TG 成功元数据持久化并同步展示；紧凑列表、图标筛选、按筛选清空、页面居中确认、空状态居中及文件夹不可用提示。
- 用户已明确批准提交，第二笔同步 Issue 和交付记录为已完成、工作台移入已完成索引；提交失败则恢复待提交/待批准状态。

```text
feat(extension): 展示 TG 下载记录并支持筛选清空

- 持久化 TG 成功记录并同步到 Download 紧凑列表
- 添加来源筛选和页面居中的清空确认框
- 保留页面完成提示并提供文件夹未接入反馈
```

#### 最终提交批准

已批准并按两笔本地提交完结。Issue、交付记录和工作台同步为已完成；不追加验证，不推送。

## 关联文档

- [工作台](../../readme.md)
- [实施顺序](../../../superpowers/plans/2026-10-24-extension-download-panel-design.md)

## 历史补充

### 元信息

- 当前阶段：用户明确批准按两笔本地提交完结，已有验证与未验证限制如实保留。
- 批准依据：用户在更新方案后明确要求“开始吧”；不自动提交或推送。
- 任务规模：同一 Download 交付的小型任务，串行实施。

### 本次范围

- 本轮仅接入 TG 成功记录、Download 展示与清空，以及文件夹按钮的不可用反馈。

#### 顶部布局与记录样式

- 保留 Download 抽屉标题，沿用现有 560px 宽度。标题下左侧排列「全部 / TG / X」图标筛选，默认「全部」；全部使用列表图标，TG/X 沿用现有品牌资源，复用官方 ToggleGroup 及默认选中反馈。
- 同行右侧按“打开文件夹 → 清空记录”排列图标按钮，按钮 32×32px、图标 16px、按钮间距 4px。图标名称提示复用现有 shared/ui/Tooltip。
- 列表采用紧凑分隔行，行高 40px，不使用角标、缩略图或文件类型图标；左侧实际文件名，右侧文件大小，不放单条删除或重复时间。混合记录按完成时间倒序。
- 实际保存文件名以 TG_ / X_ 区分来源；TG 已有 TG_IMG_ / TG_VIDEO_ 命名，不重复添加前缀。X 的前缀约定留待其独立接入实施，不在列表中伪造文件名。
- 长文件名单行省略，保留来源前缀和扩展名，右侧大小不被挤压；仅截断时通过现有 Tooltip 展示完整名称。大小缺失显示 0 MB。
- 当前筛选无记录时，在工具栏下列表可用区域水平、垂直居中显示“暂无下载记录”，清空按钮禁用，文件夹按钮仍可点击。

#### 按筛选清空与提示

- 全部清空所有记录，TG 只清空 TG，X 只清空 X；仅删除记录，不删除实际文件，不提供单条删除。
- 清空前使用 shadcn 官方 Alert Dialog，在整个浏览器页面居中，遮罩覆盖整个页面；示例标题“清空 TG 下载记录？”，说明“仅清空记录，不删除已下载文件”，按钮“取消 / 清空记录”。关闭后仍留在 Download 抽屉。
- 官方通用组件放在 shared/ui/alert-dialog.tsx；Download 持有筛选范围、文案和清空逻辑，不新增全局弹窗管理。组件来源和必要差异在实施时登记。
- TG 下载成功继续只在 Telegram 页面显示现有完成 Toast；Download 不重复弹成功提示。文件夹不可用等临时提示复用现有官方 Sonner 样式组件。共用 Toaster 默认在视口右下角，TG 不再单独覆盖位置；不同页面各自在本页面挂载，统一组件及默认规则，不新增全局通知管理。

#### 存储与 TG 接入

- 使用 chrome.storage.local 顶层 downloads 对象，内部按 tg.records、x.records 分组；公共 downloads 模块负责记录读写，Newtab 负责读取和展示，各来源负责自己的下载。
- 复用 Settings 已建立的 shared/storage 顶层对象串行读写和订阅能力，以及通过 runtime 消息交给后台写入的模式；不把下载记录塞入 settings，不直接复用设置专属更新消息和来源权限。
- 在现有 TG 页面桥接上补充保存成功的反向通知及必要校验。文件成功保存后记录实际文件名、文件大小、完成时间和来源；失败或取消不写成功记录。TG 任意目录选择、页面侧保存和现有同名避重保持不变。
- X 尚未接入：首轮只保留筛选入口和存储分组，不实现 X 下载、记录事件或成功提示，不把归档实现视为已接入。

#### 文件夹入口与 Desktop 边界

- 文件夹按钮保留并随筛选映射：全部对应 ~/Downloads/Exts Downloads，TG 对应 Telegram 子目录，X 对应 X 子目录。这是预设目录，不代表记录实际保存位置；点击不创建目录。
- 首轮不接入 Desktop 通信，不检查目录存在性或打开 Finder；点击显示“暂无法打开文件夹，尚未接入 Exts Desktop”，不误报“文件夹不存在”，不影响记录、筛选和清空。
- Desktop 通信、目录预建和真实 Finder 打开留待后续独立工作。原设想为 Desktop 启动时补齐根目录及 Photos、Telegram、X 子目录，已有内容不删除、不迁移；不把媒体字节交给 Desktop。
- 后续真正接通后，目录存在则打开；确认目录不存在才提示“文件夹不存在，请先运行 Exts Desktop 创建。”Desktop 不可用或通信失败须使用不同反馈。

### 数据约定与后续边界

- 记录包含 id、source、filename、sizeBytes、completedAt；后台生成完成记录标识和时间，校验来源与消息字段。数量上限尚未批准，本轮不自动淘汰旧记录；存储写入失败保留原数据并报告错误，不影响已保存文件及成功 Toast。
- 页面桥接事件为 exts:telegram-download:saved，仅传 filename、sizeBytes；后台通过 exts:downloads:add-tg 接收，生成 id、completedAt，固定来源 tg；清空消息 exts:downloads:clear 仅允许扩展页面发送。MAIN world 同站页面事件不是密码学身份凭证，后台仍校验扩展发送者、Telegram 来源和字段，不赋予任意文件或目录操作能力。
- Desktop 的命令、安装与结果通信以及 X 下载接入均留在后续独立范围，不阻塞首轮记录功能。

### 历史后续事项

按用户批准完成两笔本地提交并完结，不推送；真实浏览器验收限制如上保留。
