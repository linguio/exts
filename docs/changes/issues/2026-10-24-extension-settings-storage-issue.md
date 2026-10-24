# 统一 Settings 本地配置与公共读写

## 元信息

- 工作项：2026-10-24-extension-settings-storage
- 状态：已完成
- 当前阶段：用户于 2026-10-24 明确要求本地 commit，批准按已展示范围提交并完结；浏览器未验证事项照实保留。
- 批准依据：用户确认顶层 settings/downloads 对象结构，并要求先改造现有 Settings；theme 直接放在 settings 下。
- 规模：单一配置迁移工作项，一个最终交付 Commit。

## 背景与目标

现有主题、TG 下载与历史清理配置分别保存。统一以 chrome.storage.local 的 settings 对象为正式来源，提供公共默认值、迁移、读写和订阅，保持功能行为与现有界面。

## 范围与设计

- settings 包含 version: 1、theme: system、telegramDownload.enabled: true、historyCleaner.enabled: false。
- 后台加载时初始化，安装和更新补齐配置；已有有效值优先，缺失字段迁入旧键或采用默认值，不重置用户选择。
- shared/storage 提供可供后续 downloads 复用的顶层对象串行读写与订阅；shared/settings 负责配置格式、默认值、迁移和专属接口，后台统一合并写入。
- TG、历史清理接入统一配置；权限与功能执行仍由业务模块负责。
- 主题以 settings.theme 为正式来源，保留原 localStorage 首屏缓存；从旧 Chrome 存储副本迁入，其他页面同步更新。
- 新对象成功保存后移除旧 Chrome 配置键；不清除其他存储数据。

## 排除项

- 不实现 downloads 对象、历史记录、X 下载或界面重设计。
- 不新增依赖、权限、假 DOM 或视觉交互测试；不执行浏览器验收、提交、推送和发布。

## Todo

- [x] 建立 settings 默认结构、迁移与后台串行更新，补充纯逻辑测试。
- [x] 接入 TG、历史清理和主题，移除被替代的散落配置实现。
- [x] 执行针对性验证及一次完整测试、类型检查和构建。
- [x] 同步配置说明与交付记录，提供用户验收步骤。

## 验收标准

- 新安装或无配置时生成完整 settings 对象；重复加载不重置配置。
- 原主题和开关值迁入后保持，新旧字段冲突时优先新结构。
- 同时更新不同设置不丢失其他字段，写入失败向调用方报错且后续可继续保存。
- TG 开关跨页面生效；历史清理授权边界保持；主题跨页面同步并保留首屏缓存。
- 不修改其他存储数据或增加 downloads 功能。

## 关联文档

- [Commit 记录](../commits/2026-10-24-extension-settings-storage-commit.md)
- [Plan](../../superpowers/plans/2026-10-24-extension-settings-storage.md)

## 验证与限制

- 统一存储与历史清理针对性测试：4 个文件、24 项通过；完整扩展测试：13 个文件、68 项通过。
- TypeScript 类型检查与 `pnpm ext:build` 通过；构建仍有既有 `theme-init.js` 非 module 提示。`git diff --check` 无错误。
- 生产产物为 `dist/build/chrome-mv3`，Manifest 仍为 1.4.0，未增加权限或依赖。
- 未执行 Chrome/Edge 实际加载、视觉、交互、跨页面刷新和真实历史清理验收；提交时未追加验证，不推送或发布。
- 旧主题迁移来源是原扩展存储中的 `exts.theme` 副本。若此前仅本地首屏缓存保存成功而该副本写入失败，首次迁移可能回到 system；浏览器验收时需关注旧主题是否保留。

## 用户验收步骤

1. 在 Chrome 或 Edge 中加载 `dist/build/chrome-mv3`，打开 Newtab 的 Settings；确认旧主题、TG 开关和历史清理开关显示原先选择。
2. 切换主题并刷新 Newtab、另开 Newtab；确认首屏主题与最终主题一致，System 继续跟随系统。
3. 在 Telegram Web 打开媒体，切换 TG 开关；确认关闭后不能开始新下载、重新开启后恢复；已有下载不被中断。
4. 切换历史清理，确认开启需要浏览数据权限；撤销权限后界面显示关闭。真实浏览历史清理只在专用浏览器配置文件中验证。
5. 在扩展 DevTools 查看 Storage 的 Local，确认 `settings` 下有 version/theme/telegramDownload/historyCleaner，旧三个扩展存储键已迁移；Newtab 首屏缓存仍可有 `exts.theme`。

## 唯一下一步

当前工作项已按用户明确要求完成本地提交；后续 downloads 另立工作项。
