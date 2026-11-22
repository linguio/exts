# 整理账户菜单、设置与通知声音

## 元信息

- 工作项：2026-11-13-extension-toast-sound
- 状态：已完成
- 当前阶段：用户验收通过，已批准代码与文档两笔本地提交完结
- 批准依据：2026-11-16 用户确认最终目录、Default／Error 两行、仅 Error 发声、默认关闭、单字段 Settings 接口、数据库加列和节流方案，并明确要求“开始吧”。批准本地实现及必要验证，不包含线上数据库操作、部署或 Git 提交。
- 规模：包含现有 Settings 公共契约及数据库单字段扩展，一个交付结果；已在本 Issue 记录设计与边界，使用 6 项 Todo，不额外创建 Spec、Plan 或子 Issue。

## 背景与目标

Account 菜单内 Account、Notifications 当前没有实际操作。将通知设置归入 General，并提供固定音效试听；抽取现有倒计时的可复用音频能力，让通知与倒计时共同使用，同时保持倒计时原有行为。当前 Toast 本身没有声音，倒计时通过 Web Audio API 合成声音。

## 范围

- 精简 Studio 与 Newtab 共用账户菜单：删除 Account、Notifications 两条操作项；保留顶部用户信息、Settings、About、Log out。
- Notifications 放在 General 的 Theme 下方，沿用 Media Download 的官方 Collapsible 和 Item 列表组合，默认收起，折叠箭头与声音总开关独立。
- 声音总开关默认关闭，只控制通知声音，不隐藏 Toast、不影响倒计时偏好；关闭时仍可主动试听。关闭立即停止当前通知音，倒计时声音继续。
- 展开仅两行：Default 与 Error。Default 的问号提示列出 Default、Success、Warning、Info、Loading，右侧静音图标；Error 右侧声音图标可试听固定错误音，不提供音色选择或子项开关。前端组合参考 Media Download。
- 仅 Error 自动发声，其他类型全部无声；固定短促低音双声，音效参数集中维护，听感由用户验收。不新增逐条控制声音的调用参数。
- 试听只播放声音，不额外弹 Toast；连续试听停止上一段，避免叠音。真实 Toast 仅 Error 播放固定音效，Loading 不重复响，异步任务仅最终 Error 发声；promise/custom 不增加为独立状态。
- 自动通知声音采用首条立即播放、冷却 1 秒、不补播的节流规则；播放未结束时不叠音，无声类型不占冷却时间。主动试听不受该节流限制，不增加严重程度抢占规则。
- 同一个 Toast 仅更新文案不重复发声，Loading 转最终结果时响一次。各页面独立节流，同一业务结果只由原触发页面发声，设置同步不触发声音，不新增跨标签页协调。媒体下载网页内的通知同样遵循声音开关与节流，不改变下载流程或新增权限。
- 音频暂停或不可用时，在 Notifications 主行下显示持续状态提示，不依赖展开；点击试听尝试恢复，成功后清除提示，失败则保留。Toast 文字照常显示，不补播历史声音；不把 suspended 直接判断为权限被拒绝，不声称能够检测系统静音。该状态仅存在当前页面，不上传、不持久化；页面关闭释放音频资源。
- lib/audio 集中维护音效、声音合成、播放、停止、试听及资源释放，继续使用 Web Audio API，不新增音频文件。notification-sounds.ts 维护状态与音效映射，不依赖 React、Sonner、Chrome 存储或业务状态。
- 倒计时保留音色选择、默认 Metronome/Harp、本地偏好、节拍与循环调度；复用共用音频能力。到时只播放选定结束音，对应 Success Toast 不再叠加通知音。
- Settings 使用 general-*、feature-* 扁平文件，由 features/settings/index.tsx 组合 General、Features；pages/settings/index.tsx 只保留 Sheet 容器。
- 历史清理、媒体下载的设置界面直接迁入 feature-* 文件，不新增转发包装；业务逻辑和数据能力留在原业务模块。保留 theme.ts 的主题读写订阅和 messages.ts 的共用反馈文案。
- 删除被替代的 general-settings.tsx、迁出的旧设置界面与音频实现，调整引用及相关行为测试；同步受影响的 Extension 规范、UI 文档和来源差异记录。

## 目标目录

```text
apps/extension/src/
├─ lib/audio/
│  ├─ presets.ts                 # 内置音效与固定参数
│  ├─ synthesis.ts               # 音调、噪声合成，承接原 ambient.ts
│  ├─ player.ts                  # 播放、停止、试听及资源释放
│  └─ notification-sounds.ts     # 通知状态与固定音效映射
├─ features/settings/
│  ├─ index.tsx                  # General、Features 分区组合
│  ├─ store-client.ts            # 原 index.ts 数据请求与订阅入口
│  ├─ notification-audio.ts      # Sonner 状态接入与扩展设置适配
│  ├─ general-theme.tsx
│  ├─ general-notifications.tsx  # 通知折叠项、总开关与试听
│  ├─ feature-history-cleaner.tsx
│  ├─ feature-media-download.tsx
│  ├─ theme.ts                   # 现有主题读写订阅
│  ├─ messages.ts                # 现有共用反馈文案
│  └─ …                         # 其他现有公共设置文件
├─ features/activity/timer/
│  ├─ audio.ts                   # 倒计时专用调度
│  ├─ sound-preference.ts        # 现有声音选项与偏好
│  ├─ sound-menu.tsx             # 现有声音选择界面
│  └─ …
├─ components/ui/sonner.tsx      # 共用 Toast 入口
└─ pages/
   ├─ settings/index.tsx        # Sheet 容器
   └─ studio/account/menu.tsx   # 共用账户菜单
```

### 设置接口与数据库

- 用户已批准复用 POST /api/settings/preferences 和 POST /api/settings/preferences/update，不新增路由。新增 notifications: { soundEnabled: boolean }，更新接口保持一次只改一个设置项、返回完整设置，身份沿用现有认证规则，不接受调用方指定用户身份。
- public.user_settings 只增加 notification_sound_enabled boolean NOT NULL DEFAULT false 一列；保留仓库 SQL 变更记录，不做数据搬迁、不新建表。现有用户、新用户、API 默认值及本地旧数据缺字段统一为 false。
- 未登录保存在本机，登录后遵循现有账号设置规则。音效参数、类型映射、节流时间、浏览器播放状态不入库，倒计时声音偏好保持原状。
- 顺序为数据库加列、兼容 API 部署、扩展更新。旧 API 可继续使用新增列后的表；应用回退时先保留该列。实际数据库操作与部署待用户明确指示执行，不随代码实施自动操作外部环境。
- 原 features/settings/index.ts 数据入口迁为 store-client.ts，避免与 UI index.tsx 同名；后台及非 UI 消费者直接引用数据入口，不经过 React 组合入口。

## 排除项

- 不新增通知中心、浏览器系统通知、音效选择器、音频上传、音量调节或额外 Toast 状态。
- 不新增通知包装器、全局通知管理层、跨应用音频包或依赖。
- 不改变业务提示文案和原有触发时机，不改变倒计时偏好契约、历史清理或媒体下载实际功能。
- 不修改其他应用，不升级依赖或产品版本；不顺带重设计现有 UI。
- 不新增截图、样式、布局、焦点、菜单或指针交互测试；代理不执行浏览器视觉或交互验收。
- 建档不代表实现完成、用户验收通过或 Git 提交获批。

## Todo

- [x] 完成默认关闭的数据库加列 SQL、Settings 契约与本机兼容；实际加列和部署按明确指令执行。
- [x] 抽取共用音效、合成与播放能力，接入倒计时并清理被替代实现。
- [x] 按扁平目录迁移设置界面和分区组合，精简共用账户菜单。
- [x] 实现 Default／Error 通知展示、固定声音试听、总开关及真实 Toast 发声，避免倒计时完成双响。
- [x] 保留调整相关行为测试，完成必要逻辑、类型与构建验证，同步相关规范。
- [x] 用户确认验收通过并批准本地提交完结。

## 验收标准

- 本次建档：Issue 与 Commit 记录互相链接，队列标题一致，实施 Todo 全部保持未完成，不新增第二个活动 Issue。
- 实施后明确实际构建产物路径，用户在 Chrome 或 Edge 加载；开发产物仅加载根 dist/dev 下稳定目录。
- Studio、Newtab 账户菜单均保留用户信息，操作仅剩 Settings、About、Log out。
- General 按 Theme、Notifications 排列，通知默认收起，展开可见 Default、Error 两行及对应图标；Features 原设置功能保持。
- Error 可试听固定音效，Default 不播放声音，不出现选择器或额外 Toast；连续试听不叠音。
- 真实通知仅 Error 发声，其余类型无声；关闭声音总开关后 Toast 仍显示且自动声音停止，重新打开设置后偏好保留。
- 新用户及旧数据缺字段时声音默认关闭；保存新字段不覆盖其他设置。连续通知首条立即响、1 秒内后续不响且不补播，同 Toast 文案更新不重复响。
- 音频暂停时 Settings 显示状态，用户点击试听恢复后提示消失；无法恢复时保留提示，原 Toast 和下载等核心行为不受影响。
- 倒计时声音选择、关闭、试听及计时行为保持；到时只响选定结束音，不再叠加 Success 通知音。
- 按分级验证规范对共用音频跨模块影响执行 Extension 完整逻辑测试、类型检查及构建，保留迁移行为覆盖，不扩大到无关应用。视觉、交互、听感及浏览器音频限制由用户实际验收，自动化通过不代表用户验收通过。

## 关联文档

- [Commit 记录](../commits/2026-11-13-extension-toast-sound-commit.md)
- [工作台](../README.md)
- [分级验证规范](../../verification.md)
- [Extension 规范](../../../apps/extension/AGENTS.md)
- [Extension UI](../../extension/ui.md)
- [Web UI 来源](../../web-ui-sources.md)

## 验证结果与实施限制

- pnpm --filter @exts/extension test：45 个文件、182 项测试通过；覆盖通知默认关闭、旧数据兼容、单项更新、仅错误发声、1秒节流、同 Toast 去重、不补播和关闭后试听，以及迁移后的原噪声行为覆盖。
- MAIN 环境核对后补充修正：Telegram 通过原有隔离桥传 soundEnabled，MAIN 展示组件只接收布尔值。修正后音频/设置/媒体下载相关 11 文件、47 项测试通过，类型检查和构建通过；产物核对 MAIN 不包含扩展设置请求，隔离桥包含声音配置。
- pnpm --filter @exts/extension typecheck：通过。
- pnpm ext:build：通过，产物为 dist/build/chrome-mv3；仍有 theme-init.js 非 module 和大 chunk 警告。
- API Settings 6 项、迁移工具 5 项、应用/OpenAPI 5 项通过；PostgreSQL 8 项因未配置显式隔离测试库跳过。Python 保留既有 Starlette/httpx 弃用提示，不升级依赖。
- SQL 0005 已在配置目标 neondb 执行；API 未由代理部署。账号保存 notifications.soundEnabled 需先加列并部署新 API。本机未登录设置可独立使用；音色、界面交互和浏览器播放恢复尚未实际验收。

## 用户验收步骤

1. 在 Chrome/Edge 扩展管理页加载 D:/GitHub/exts/dist/build/chrome-mv3，刷新 Newtab；分别在首页和 Studio 打开头像菜单，检查用户信息保留，Account、Notifications 菜单项删除。
2. 打开 Settings，检查 General 下 Theme、Notifications 顺序，Features 原历史清理和媒体下载设置保持；Notifications 默认收起，首次或旧设置默认关闭。
3. 展开 Notifications，检查仅 Default、Error 两行；Default 问号说明五种静音状态，右侧静音图标；Error 按钮在总开关关闭时也可试听固定短音，连续点击不叠音，且不出现额外 Toast。
4. 未登录时切换通知声音开关并重新打开 Settings/刷新页面，检查偏好保留。账号场景待明确执行数据库加列及 API 部署后验证；后端未就绪时保存失败应正常显示 Error，不冒充保存成功。
5. 开启声音并在有新后端的账号环境下暂时阻断 API 请求，再尝试切换主题以触发保存失败，检查 Error 可见且发声；1秒内连续失败不重复响，1秒后新错误可再响。恢复网络；关闭声音后同类失败仅显示 Toast。正常保存的 Success 不发声。
6. 验证倒计时原过程音、结束音选择与关闭，到时仅原结束音。若浏览器实际暂停音频，检查 Notifications 主行提示，点击 Error 试听尝试恢复；当前页面恢复不代表其他页面已恢复，系统静音无法自动检测。

## 唯一下一步

工作项已完成；按用户批准执行代码、文档两笔本地提交，不推送远端。

2026-11-16 最新用户验收调整：Settings 模块内部使用官方 ItemSeparator 的 1px 分隔线，覆盖卡片内主项、折叠主项与内容、展开子项之间；保持标签左对齐，替代此前去除内部线的要求。

2026-11-16 用户验收调整：Settings 在唯一组合入口明确使用 text-left，主项及展开子项标签统一左对齐，不修改共用 Item 默认样式。

2026-11-16 分隔线验收修正：用户截图显示同为 h-px 的背景线呈现不同厚度。Settings 唯一组合入口统一将 ItemSeparator 改为零内容高度、1px border-top、透明背景，复用 border Token，不修改官方基础组件；缩放下实际观感仍待用户复验。

未登录保存失败待排查：用户实际报告 Notifications 保存失败，统一 Settings 的 9 项逻辑测试通过，未复现运行环境错误；在唯一客户端请求入口保留操作、字段名、错误码和 HTTP 状态的正式异常日志，不记录设置值或令牌，不修改保存语义、不增加回退和自动重试。需取得实际错误码后继续定位，不能记为修复完成。

2026-11-16 数据库实际操作：用户明确批准“添加”后，只读确认配置目标 neondb 缺列且仅待执行 0005；通过现有 migrate.py --apply 成功应用唯一迁移 0005_notification_sound.sql。复核字段 boolean、NOT NULL、DEFAULT false，Settings 实际查询可执行，迁移队列为空。未读写用户设置值，未执行 API 部署。此前“数据库未执行”的描述为操作前历史状态，以本条为准；用户重新尝试加载和保存仍待验收。

2026-11-16 终态：用户明确“验收通过 commit”，本工作项验收通过、本地提交已批准。此前待复验与待排查描述为实施过程记录，不再代表当前验收状态；未执行的隔离数据库测试仍如实保留为跳过。
