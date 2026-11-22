---
date: "2026-09-19"
scope: extension
status: completed
type: feature
---

# 建立 X 单帖链接识别插件

## 当前阶段

已完成。

## 目标与范围

### 背景

需要在仓库中新建一个面向 Chrome 和 Edge 的 X 浏览器插件。未来下载链路会把单篇帖子链接交给桌面 Helper，但第一版只建立最小且稳定的链接识别边界。

### 目标

用户打开一篇具体的 X 帖子后点击插件图标，插件从当前标签页地址中识别帖子 ID 并生成规范化链接。该版本不向用户展示结果，只为后续 Helper 通信保留可验证的输入边界。

### 范围

- 在 `apps/extensions/x-download` 建立 WXT + TypeScript 的 Manifest V3 插件。
- 通过工具栏图标点击事件读取当前活动标签页地址。
- 只识别单篇 X 帖子详情页，输出帖子 ID 和规范化链接。
- 对非帖子页面静默结束，不触发其他行为。
- 使用用户提供的 `/Users/kevin/Downloads/x (1).svg` 作为唯一 Logo 源稿，按仓库规则生成黑白两套 PNG 图标。
- 仅在 X 相关页面读取系统深浅色主题，同步工具栏图标，不读取页面 DOM。
- 为地址识别规则编写与用户行为对应的单元测试。

### 排除项

- 不解析或下载图片、视频和音频。
- 不检查帖子是否含有视频。
- 不从首页、搜索页、个人主页或其他列表页扫描帖子。
- 不支持多帖子、批量任务、历史记录或持久化存储。
- 不实现 popup、角标、Toast、系统通知或页面注入提示。
- 不引入 React 或 UI 组件库；仅使用一个只读取系统主题的 X 页面 content script，不扫描 DOM。
- 不实现桌面 Helper、Native Messaging 或 yt-dlp 集成。

## Todo

- [x] 审核并批准架构 Spec。
- [x] 建立最小 WXT 插件骨架与 Manifest 配置。
- [x] 实现单帖地址识别和工具栏点击入口。
- [x] 纳入 Logo 源稿并生成黑白 PNG 图标。
- [x] 在仓库根目录提供 `x:dev` 和 `x:build` 脚本；测试和类型检查保留在插件目录。
- [x] 完成针对性测试、类型检查、构建和浏览器验收。

## 验收标准

- 插件能以 Manifest V3 产物加载到当前稳定版 Chrome 或 Edge。
- 用户打开 `https://x.com/<account>/status/<id>` 形式的具体帖子并点击插件时，内部识别结果包含数字帖子 ID 和去除查询参数、锚点及媒体尾路径的规范化链接。
- 用户在 X 列表页或非 X 页面点击插件时，不生成帖子目标，也不产生用户可见副作用。
- Manifest 只声明当前识别流程必需的 `activeTab` 权限，不声明 X 全站主机权限。
- 地址识别的成功、规范化和拒绝分支有针对性单元测试覆盖。
- 项目的针对性测试、TypeScript 类型检查和 WXT 构建全部通过。
- 图标以用户提供的 SVG 为唯一源稿，黑白版本的图案、比例和透明度保持一致。
- 在 X 页面内可根据系统深浅色主题切换工具栏黑色或白色图标。

## 唯一下一步

无。

## 交付记录

### 历史交付记录

#### 元信息

- 工作项：`2026-09-19-x-download-post-url`
- 对应 Issue：[建立 X 单帖链接识别插件](2026-09-19-x-download-post-url-issue.md)
- 状态：已完成
- 用户验收：已通过
- 最终提交批准：已批准
- 创建日期：2026-09-19
- 最近更新：2026-09-19

#### 预期交付边界

- 新建 `X Download` Manifest V3 插件，只识别当前打开的 X 单篇帖子地址。
- 保留规范化帖子链接和帖子 ID 的内部边界，供后续独立工作项接入 Helper。
- 纳入用户提供的 Logo 源稿并生成符合仓库规则的黑白 PNG 图标。
- 不实现下载、页面扫描、用户提示、持久化、Helper 或 Native Messaging。

#### 实际完成内容

- 新建 `apps/extensions/x-download` 扩展，使用 WXT + TypeScript 构建 Manifest V3 后台入口。
- 实现 `x.com` 单帖地址识别、帖子 ID 提取、媒体尾路径移除和非法地址拒绝。
- 纳入用户提供的 X Logo 源稿，生成黑白两套 `16/32/48/128` PNG，Manifest 只使用黑色默认版。
- 在仓库根目录新增 `x:dev`、`x:build` 脚本，并将全 workspace 聚合命令明确命名为 `dev:all`、`build:all`，不提供根 `test` 命令。
- 在 Monorepo 文档中说明单插件命令、测试入口和端口策略。
- 仅在 X 相关页面通过 `prefers-color-scheme` 同步工具栏黑色或白色图标，不扫描页面 DOM。
- 保持无 popup、无提示、无页面 DOM 改写、无持久化、无 Helper 和无下载行为。

#### 验证结果

- URL 单元测试：6 个测试全部通过。
- 主题同步单元测试：6 个测试全部通过。
- TypeScript 检查：`tsc --noEmit` 通过。
- WXT 构建：生成 `dist/chrome-mv3` 且 Manifest 与 8 个 PNG 资源完整。
- Manifest 检查：Manifest V3、`activeTab`、无 popup、Service Worker 入口和仅匹配 X 域名的主题 content script 均符合设计。
- `git diff --check`：通过。
- 根目录 `package.json`：JSON 解析通过，聚合命令为 `dev:all`、`build:all`，未保留根 `test`。

#### 未验证事项与限制

- 当前环境的 `pnpm install --offline` 无输出超时，已终止两次；本次验证使用已缓存的 workspace 依赖直接执行，未引入新版本。
- 未做视觉、布局或交互自动化验证；用户已在 Chrome/Edge 中完成实际加载和功能确认。

#### 用户验收

- 结果：已通过
- 说明：用户已确认构建产物加载、X 页面主题图标切换、单帖点击无界面行为和非 X 页面边界均符合预期。

#### 最终 Commit message

```text
feat(x-download): 建立 X 单帖链接识别插件

- 新增单篇 X 帖子地址识别与工具栏点击入口
- 增加黑白主题图标和 X 页面系统主题同步
- 完善单插件命令与交付文档
```

#### 最终提交批准

- 状态：已批准
- 说明：用户已明确批准执行本地 Git Commit，不推送远端。

## 关联文档

- [架构设计](../../../superpowers/specs/2026-09-19-x-download-post-url-design.md)

## 历史补充

### 元信息

- 类型：小型功能
- 当前阶段：已完成
- 最近更新：2026-09-19

### 历史后续事项

### 下一步

本 Issue 已完成；后续 Helper 接入另建独立 Issue。
