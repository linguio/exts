---
date: "2026-09-21"
scope: [extension, desktop]
status: completed
type: task
---

# 让 X Download 使用页面媒体源下载视频

## 当前阶段

已完成。

## 目标与范围

### 背景

后续工作项 `2026-09-21-x-download-media-source-only-download` 已将本工作项中“媒体来源获取失败时回退到帖子 URL 解析”的设计废止；当前有效行为以该后续 Issue 为准。

现有 Helper 已具备队列、去重、工具调用、音视频合并、桌面落盘和完整失败反馈，但 yt-dlp 游客解析无法识别部分浏览器中可以正常播放的 X 视频。读取 Chrome 或 Edge Cookie 数据库既不能稳定覆盖浏览器 Profile，也会引入 macOS 隐私权限问题。

用户提供的目标帖子和 HAR 已确认：已登录的 X 页面能够取得 `video.twimg.com` 媒体分片，但 `<video>` 使用的是仅在页面进程内有效的 `blob:` 地址，HAR 中已出现的孤立 `.m4s` 分片也不足以交给 Helper 独立完成下载。因此需要由扩展利用现有页面会话取得完整媒体来源，再由 Helper 执行下载。

### 目标

让扩展在不传递 Cookie、不读取浏览器数据库且不要求用户手动播放视频的前提下，从当前 X 单帖页面取得完整视频来源；点击插件后，把规范化帖子信息和经过校验的媒体来源交给 Helper，由现有队列完成下载。

### 范围

- 在 X 页面主执行环境中观察页面自身的媒体接口响应，不修改原请求或响应。
- 仅提取当前帖子的完整 HLS、DASH 或 MP4 视频来源，忽略图片和孤立媒体分片。
- 在扩展内存中按 `postId` 暂存清洗后的媒体描述，页面导航后清除旧数据。
- 点击插件时短暂等待当前帖子媒体信息；取得完整来源后通过 Native Messaging 交给 Helper。
- Native Messaging 协议升级并兼容当前只包含帖子地址的请求。
- Helper 对媒体来源执行严格校验，沿用现有队列、去重、串行下载、合并、桌面落盘和错误反馈。
- 未取得完整来源时保留现有帖子地址解析作为降级路径。
- 捕获探针按用户要求跳过；媒体来源捕获失败时保留现有地址解析降级。

### 排除项

- 不处理图片、Cookie、Authorization、浏览器 Profile 或 Cookie 数据库。
- 不要求完全磁盘访问权限，不启动本地 HTTP 服务。
- 不持久化页面接口原始响应、媒体缓存、任务历史或去重记录。
- 不主动点击播放器、不强制播放视频、不下载孤立 `.m4s` 分片。
- 不绑定单个固定 GraphQL 操作哈希，不复刻完整 X 私有 API 客户端。
- 不在本工作项中实现取消、删除、手动重试、断点续传或多视频部分失败恢复。
- 不新增下载设置、清晰度选择、保存目录选择或系统通知。
- 不处理 Windows、Firefox、Safari、签名、公证、安装器或对外分发。

## Todo

### Sub-issues

#### 1. 验证页面媒体捕获可行性

- [x] 建立最小主世界捕获探针，只观察候选 X API 响应的副本。
- [x] 按用户要求跳过独立捕获验收，媒体来源失败时由地址解析降级承接。

#### 2. 打通扩展媒体来源传递

- [x] 实现媒体结构识别、来源选择、当前帖子内存缓存和 SPA 导航清理。
- [x] 实现主世界到隔离世界的数据校验与当前帖子绑定。
- [x] 升级 Native Messaging 请求并保留地址请求兼容降级。

#### 3. 接入 Helper 直接下载

- [x] 实现 Helper 媒体来源模型、域名与格式校验以及同任务刷新规则。
- [x] 复用内置 yt-dlp 与 FFmpeg 完成单视频、多视频串行下载。
- [x] 完成逻辑、协议、构建验证，交由用户在 Chrome、Edge 与 Helper 中直接验收。

## 验收标准

- 指定目标帖子无需手动播放，点击插件即可由 Helper 下载视频到桌面。
- 扩展只传递帖子标识、规范化地址和清洗后的完整媒体来源，不传递 Cookie、Authorization 或完整接口响应。
- 图片和孤立 `.m4s` 分片不会进入 Helper 下载队列。
- 同一帖子排队或下载期间连续点击不会创建重复任务。
- 失败任务收到同一帖子的新版完整媒体来源时更新原任务并重试，不创建第二条任务。
- 多视频帖子按页面原始顺序在一个任务内串行下载。
- 未取得完整页面媒体来源时仍可运行现有 yt-dlp 地址解析，并展示真实完整错误。
- Chrome 和 Edge 均能加载稳定开发产物，目标帖子主路径和重复点击边界由用户实际验收。

## 唯一下一步

无。

## 交付记录

### 历史交付记录

#### 元信息

后续工作项 `2026-09-21-x-download-media-source-only-download` 已废止本记录中关于 v1 地址请求和帖子 URL 解析降级的当前有效性；本记录仅保留历史交付事实。

- 工作项：`2026-09-21-x-download-page-media-source`
- 对应 Issue：[让 X Download 使用页面媒体源下载视频](2026-09-21-x-download-page-media-source-issue.md)
- 状态：已完成
- 用户验收：已通过
- 最终提交批准：已批准
- 创建日期：2026-09-21
- 最近更新：2026-09-21

#### 预期交付边界

- 扩展从当前已登录 X 页面取得完整视频来源，不读取或传递 Cookie。
- Native Messaging 请求增加经过清洗的媒体来源，同时兼容现有地址请求。
- Helper 校验媒体来源并复用现有队列和工具链直接下载。
- 以目标帖子未播放即可下载作为主路径验收，不处理图片、孤立分片或失败恢复扩展功能。

#### 实际完成内容

- 扩展主世界观察 X API 响应副本，隔离桥按当前帖子校验并缓存完整 HLS、DASH、MP4 来源。
- Native Messaging 升级到 v2，传递 `mediaSources`，并保留 v1 地址请求兼容与空来源降级。
- Helper 和 Native Host 增加来源模型、严格域名/格式校验、失败任务原位刷新及直链串行下载；有来源时跳过帖子解析。

#### 验证结果

- 扩展：`node_modules/.bin/vitest run`，8 个测试文件、42 个测试通过。
- 扩展：`node_modules/.bin/tsc --noEmit` 通过；`node_modules/.bin/wxt build` 通过，产物为 `apps/extensions/x-download/dist/chrome-mv3`。
- Helper：`xcodebuild ... test`，41 个测试、0 失败；`scripts/build.sh` 构建成功；`scripts/verify_app_bundle.sh` 验证固定版本 yt-dlp/FFmpeg 成功。
- `git diff --check` 通过；敏感边界检查仅保留 `.m4s` 拒绝规则，没有 Cookie、Authorization 或新增 Header 传递。

#### 未验证事项与限制

- 尚未进行 Chrome/Edge 实际点击验收；按用户要求跳过独立捕获探针，首次实际点击可能走媒体来源直链或地址解析降级。
- 当前构建未签名/未公证，仅用于本机开发验收。

#### 用户验收

- 结果：通过
- 说明：用户已确认当前 GitHub 上的扩展与 Helper 实现通过验收，同意进入最终提交准备。

#### 最终 Commit message

```text
docs(x-download): 完结页面媒体来源下载工作项

- 记录用户验收和最终提交批准
- 将当前工作项移入已完成索引
```

#### 最终提交批准

- 状态：已批准
- 说明：用户已审核待提交文件、diff 摘要、验证结果、未验证事项和 Commit message，并明确批准最终 Git Commit。

## 关联文档

- [Spec](../../../superpowers/specs/2026-09-21-x-download-page-media-source-design.md)
- [Plan](../../../superpowers/plans/2026-09-21-x-download-page-media-source.md)
- 前置 Issue：[建立 X Download Helper 视频下载执行链路](2026-09-20-x-download-public-video-download-issue.md)
- 后续 Issue：[完善 X Download 视频下载失败恢复](2026-09-20-x-download-download-recovery-issue.md)

## 历史补充

### 元信息

- 类型：架构任务
- 当前阶段：扩展、Native Messaging v2、Helper 直链下载与构建已完成，用户验收和最终 Git Commit 批准已通过
- 最近更新：2026-09-21

### 历史后续事项

本工作项已完成；后续需求另建 Issue。
