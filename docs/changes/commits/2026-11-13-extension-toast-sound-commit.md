# 整理账户菜单、设置与通知声音：交付记录

## 对应工作项

- [Issue](../issues/2026-11-13-extension-toast-sound-issue.md)
- 状态：已完成；用户验收通过，本地提交已批准

## 预期交付边界

精简共用账户菜单；Settings 使用 general-*、feature-* 扁平文件及 index 组合；General 增加 Default／Error 两行、固定错误音试听和默认关闭的总开关；仅 Error 自动发声，1秒节流且不补播；抽取 lib/audio 共用能力，保留倒计时行为。Settings API 与数据库仅扩展通知声音一个布尔字段，不升级依赖。

## 实际交付

- Studio/Newtab 共用账户菜单删除 Account、Notifications 操作，保留用户信息及 Settings、About、Log out。
- 设置界面平铺为 general-theme、general-notifications、feature-history-cleaner、feature-media-download，由 index.tsx 组合；原 index.ts 数据入口迁为 store-client.ts，后台和非 UI 消费者不经过 React 聚合入口。
- Notifications 沿用 Media Download 折叠组合。Default 问号说明 Default/Success/Warning/Info/Loading 静音，Error 可试听固定短低音双声；总开关默认关闭，关闭仍可试听。当前页面音频暂停/不可用时按需显示状态，试听尝试恢复，不检测系统静音或上传该状态。
- lib/audio 集中维护 presets、synthesis、player、notification-sounds，原 ambient.ts 与对应噪声测试迁入共用音频职责；倒计时保留原音色参数、偏好和专用调度，通知播放器独立，不因通知静音停止倒计时。
- notification-audio 使用 Sonner 2.0.8 官方 useSonner 状态接入实际 Error；不新增业务调用参数或通知包装器。同 Toast 更新不重复响，Loading 转 Error 响一次；1秒首条节流、播放不叠音、不排队补播。页面离开释放资源，恢复后重新读取偏好。
- Telegram 的 MAIN 展示组件只接收布尔声音开关，由原有隔离桥传递，不直接调用 Chrome 设置 API；扩展页面单独适配设置读写。
- Settings 增加 notifications.soundEnabled；SQL 0005 为 public.user_settings 增加 notification_sound_enabled BOOLEAN NOT NULL DEFAULT FALSE。新用户、旧行及本地缺字段均默认关闭，保持单项更新和身份归属规则。SQL 已于用户明确批准后应用，API 未由代理部署。
- 同步 Extension 规范、UI/官方来源记录、API 契约和 README，保留并调整受影响的逻辑测试。

## 验证与限制

- pnpm --filter @exts/extension test：45 文件、182 项通过。
- MAIN 环境接入修正后，音频/设置/媒体下载相关 11 文件、47 项测试通过；类型检查与正式构建重新通过。产物检查 MAIN 未包含扩展设置请求，隔离桥包含 soundEnabled。
- pnpm --filter @exts/extension typecheck：通过。
- pnpm ext:build：通过，产物 D:/GitHub/exts/dist/build/chrome-mv3；保留 theme-init.js 非 module 和大 chunk 构建警告，不因本任务扩大优化。
- Python unittest：test_settings.py 6 项、test_migrations.py 5 项、test_app.py 5 项通过；test_postgres.py 8 项因未配置 API_TEST_DATABASE_URL 跳过，未借用线上库验证。
- 首次 Python 执行被沙箱阻止 uv 启动解释器，改用批准的现有虚拟环境执行，未安装或升级依赖；保留 Starlette/httpx 既有弃用提示。
- git diff --check 通过；Manifest 可解析，8 个声明资源存在；Issue 与 Commit 相对链接核对通过。未执行浏览器视觉/交互或听感验收。真实数据库字段、账号保存及部署后链路待验证，先加列、再部署兼容 API、最后更新扩展。

## 用户验收

2026-11-16 用户明确确认“验收通过 commit”，验收通过；按当前实际检查结果与跳过项完结，不追加验证。

## 提交方案

用户已批准按下列文件边界与完整消息执行代码、文档两笔本地提交，不推送。

### 代码提交

范围：apps/api/modules/settings、migrations/0005_notification_sound.sql、相关 API 测试；Extension 菜单、设置界面和数据入口迁移、lib/audio、App/TG 接入、倒计时、图标及相关逻辑测试。删除的旧文件按迁移处理，不混入文档。

```text
feat(extension): 整合设置入口与默认关闭的错误提示音

- 精简账户菜单并按分区命名平铺设置界面
- 共用声音合成与播放，仅错误通知节流发声并保留倒计时音色
- 扩展账号声音开关契约与数据库单列默认值
```

### 文档提交

范围：本 Issue、Commit 记录、工作台、apps/extension/AGENTS.md、apps/api/README.md、docs/api-conventions.md、docs/extension/ui.md、docs/web-ui-sources.md。

```text
docs(extension): 记录设置与通知声音改造边界

- 同步设置目录、声音行为及账号字段契约
- 记录验证结果、数据库加列结果与用户验收结论
```

## 最终提交批准

已批准。2026-11-16 用户明确“验收通过 commit”，批准本地提交并完结工作项；随文档提交将 Issue、Commit 记录改为已完成、用户验收通过、提交批准已批准，工作台移入已完成索引。未批准推送或发布。

2026-11-16 最新用户验收调整：Settings 模块内部使用官方 ItemSeparator 的 1px 分隔线，覆盖卡片内主项、折叠主项与内容、展开子项之间；保持标签左对齐，替代此前去除内部线的要求。

2026-11-16 用户验收调整：Settings 在唯一组合入口明确使用 text-left，主项及展开子项标签统一左对齐，不修改共用 Item 默认样式。

2026-11-16 分隔线验收修正：用户截图显示同为 h-px 的背景线呈现不同厚度。Settings 唯一组合入口统一将 ItemSeparator 改为零内容高度、1px border-top、透明背景，复用 border Token，不修改官方基础组件；缩放下实际观感仍待用户复验。

未登录保存失败待排查：用户实际报告 Notifications 保存失败，统一 Settings 的 9 项逻辑测试通过，未复现运行环境错误；在唯一客户端请求入口保留操作、字段名、错误码和 HTTP 状态的正式异常日志，不记录设置值或令牌，不修改保存语义、不增加回退和自动重试。需取得实际错误码后继续定位，不能记为修复完成。

2026-11-16 数据库实际操作：用户明确批准“添加”后，只读确认配置目标 neondb 缺列且仅待执行 0005；通过现有 migrate.py --apply 成功应用唯一迁移 0005_notification_sound.sql。复核字段 boolean、NOT NULL、DEFAULT false，Settings 实际查询可执行，迁移队列为空。未读写用户设置值，未执行 API 部署。此前“数据库未执行”的描述为操作前历史状态，以本条为准；用户重新尝试加载和保存仍待验收。

2026-11-16 终态：用户验收通过并批准本地提交；此前未登录保存故障与分隔线的待验收描述为过程记录，以本次验收结论为准。
