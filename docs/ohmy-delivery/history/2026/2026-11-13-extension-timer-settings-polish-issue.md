---
date: "2026-11-13"
scope: extension
status: completed
type: feature
---

# 优化时间卡片、声音选择与主题保存反馈

## 当前阶段

已完成。

## 目标与范围

### 背景与目标

时间卡片内部偏空，声音无法关闭，主题慢请求期间缺少明确反馈。优化现有体验，不增加卡片内容。

### 范围

- 外框保持178px基准；翻页牌约63×88px，Geist Sans 600数字纵向拉高110%。
- 两组声音独立单选或全不选，再选取消并保存本机；不显示播放图标或动画，切换不叠加、不重置计时；关闭完成音保留Toast。
- 主题保存时点击按钮内显示spinner并禁用整组；成功应用主题，失败保留原主题并使用现有错误Toast；不阻塞其他设置。

### 排除项

不增加天气日期或字体依赖；不改变其他设置业务；不进行浏览器视觉交互验收，不提交Git。

## Todo

### Todo / 实施顺序

- [x] 增高翻页牌与数字。
- [x] 接入官方CheckboxItem，支持静音持久化与选择即试听。
- [x] 增加主题保存pending反馈与重复请求保护。
- [x] 执行相关纯逻辑测试、类型检查与扩展构建，同步规范与交付记录。

## 验收标准

- 方形外框不变，数字和翻页牌同步增高，无新增内容。
- 两组声音可分别取消、刷新保持关闭；选择即试听，不显示播放图标或动画。
- 慢请求期间主题整组不可重复提交，所点按钮显示spinner，成功或失败后解除禁用。
- 自动化仅检查逻辑和编译；用户在Chrome/Edge验收声音、外观与交互。

## 唯一下一步

无。

## 交付记录

### 历史交付记录

- 对应[Issue](2026-11-13-extension-timer-settings-polish-issue.md)
- 状态：已完成
- 用户验收：已通过（用户明确表示验收通过）
- Git提交批准：已批准（用户明确要求本地commit）

#### 预期交付边界
代码：时间卡片比例、可关闭的声音与选择即试听、主题按钮pending反馈和相关逻辑测试。
文档：Issue、本记录、工作台、扩展UI规范及官方来源。

#### 实际交付
- 方形外框不变，翻页牌宽高比0.72、数字文字层纵向缩放2.1，保留Geist Sans 600。
- 官方CheckboxItem支持两组独立静音，null持久化；菜单选择后保持打开，按用户最新要求移除播放图标、动画及专用状态回调，保留选择即试听；静音不影响归零Toast。
- 主题保存时所点按钮使用StatusIcon spinner，禁用主题整组并用同步锁防重复请求；finally恢复，不遮罩Settings。
- 无新增依赖、字体或业务内容。

#### 验证与限制
- 用户最新指定比例2.1，最终纵向缩放调整为2.1；仅CSS比例变化，重新构建通过，复用类型检查与逻辑测试，用户已明确验收通过。
- 移除播放图标及专用回调后重新执行类型检查与构建，均通过；静音存储、计时与设置逻辑未变，复用下列19项测试结果。用户已明确验收通过；不推断具体手工测试覆盖。
- 新增静音持久化测试先失败（null被回退为默认音色），实现后通过。
- `pnpm --filter @exts/extension test tests/features/activity/timer tests/features/settings`：5文件、19项通过。
- `pnpm --filter @exts/extension typecheck`：通过。
- `pnpm --filter @exts/extension build`：通过，产物dist/build/chrome-mv3；保留theme-init.js非module提示与大于500kB chunk警告。
- 未执行浏览器外观、菜单、声音听感、真实慢网或失败交互验证；未启动dev server；按用户批准执行两笔本地提交，不推送。

#### 用户验收步骤
1. Chrome/Edge扩展管理页加载或重新加载本次产物dist/build/chrome-mv3，打开新标签页；核对178px方形外框不变、翻页牌及数字增高，时钟/倒计时切换无溢出，明暗主题均可读。
2. 右键时间卡片，选择不同音色，菜单保持打开；选择即试听，不显示播放图标或动画。再选当前项取消，刷新后保持关闭；两组可独立切换，切换不叠音、不重置倒计时。
3. 拖动到5分钟等待归零；完成音关闭时仅显示Toast，开启时有完成音。运行中关闭计时音立即停止该声音。
4. 打开Settings，已登录时对扩展后台接口请求设置慢网或使用慢响应环境；切换主题，核对所点按钮spinner、整组禁用，其他设置仍可用；成功后切换主题并解锁，失败或超时后保留原主题、错误Toast并解锁。仅给Newtab页面设置限速不一定影响后台请求。

#### 提交边界与完整消息
代码边界：apps/extension/src/components/ui/context-menu.tsx；features/activity/timer下audio、flip-digit、sound-menu、sound-preference、timer-card、timer.css、use-countdown；features/settings/general-settings.tsx；对应sound-preference.test.ts。

```text
feat(extension): 优化时间卡片与设置保存反馈

- 增高翻页数字并支持声音取消与试听
- 主题保存时显示按钮加载状态并阻止重复请求
```

文档边界：本Issue、Commit记录、工作台、docs/extension/ui.md、docs/web-ui-sources.md。

```text
docs(extension): 记录时间卡片与设置反馈优化

- 同步声音选择与主题保存规范
- 记录交付范围、验证结果与验收步骤
```

用户已验收通过并批准上述代码、文档两笔本地提交；终态同步为已完成。

## 关联文档

- [UI规范](../../../extension/ui.md)
- [官方来源](../../../web-ui-sources.md)

## 历史补充

### 元信息

- 批准：用户确认方案后明确要求“开始”

### 历史后续事项

用户已验收通过并批准代码、文档两笔本地提交；本工作项完结。
