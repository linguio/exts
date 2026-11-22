# 拆分 Dock 与 Settings 并归位 Home

## 元信息

- 工作项：2026-10-28-extension-module-boundaries
- 状态：已完成
- 当前阶段：代码已独立提交、用户验收通过；用户最新要求剩余全部本地提交，本轮随统一文档提交完结，沿用已有结果，不追加验证或推送。
- 任务规模：小型任务，保持行为的模块迁移；实施顺序记录在本 Issue。
- 批准依据：用户确认独立 dock、settings 模块，Dock 组合入口，Home 实现归 Newtab，并明确要求开始。

## 背景与目标

Dock 和设置界面目前位于 Newtab 内，Home 实现混在应用组合层。明确各自归属，保持现有布局、主题、配置和交互。

## 范围

- 新增 modules/dock，迁入 Dock 布局、Actions、下载和设置入口及抽屉提示协调。
- 新增 modules/settings，持有 Settings Sheet、General 和媒体下载设置视图；共享配置仍归 shared/settings，业务操作仍归所属模块。
- 将 NewtabHome 及其布局测量、书签打开行为移回 modules/newtab；app 负责主视图切换、公共 Provider 和常驻 Dock 的组合。
- 同步当前应用规范和 UI 来源文档的归属描述；应用 README 的现状与过时说明按用户最新要求留到整轮整理最后更新，本项不修改 README。

## 排除项

- 不迁移品牌资源或 Activity，不删除其现有数据；这两项待当前 Issue 完结后顺序推进。
- 不重做布局、样式、交互、配置数据或后台行为，不升级依赖，不新增全局状态框架。
- 代理不执行浏览器视觉和交互验证，不新增此类自动化测试；用户已批准仅代码本地提交，不包含文档或推送。

## Todo

- [x] 迁入 Home，精简应用组合层并保持原布局与挂载方式。
- [x] 迁出 Dock，保持收藏传入、入口顺序、菜单及提示协调。
- [x] 拆出 Settings Sheet，Dock 仅提供入口与打开状态。
- [x] 同步当前文档并检查旧引用及实际 diff。
- [x] 运行一次扩展完整测试、类型检查、生产构建和 diff 检查，记录结果并停在待验收。
- [x] 根据用户验收更新状态，仅提交代码，文档保留未提交；应用 README 推迟到整轮整理最后更新。

## 验证结果与限制

- 扩展完整测试 15 个文件、76 项通过，TypeScript 无错误，WXT 生产构建成功；Manifest 可解析，页面、后台、主题入口文件存在，diff 检查通过。
- pnpm 启动时尝试处理依赖目录并遇到 ERR_PNPM_PACKAGE_MANAGER_REMOVE_MODULES_DIR；未重装依赖，改用现有工具执行。Vitest 默认 forks 受 spawn EPERM 阻断，改用单线程串行模式后通过。
- Home 实现和 Settings Sheet 内容与迁移前逐段核对一致，旧源码引用已清理。Node 内部启动 Git 的核对方式受 spawnSync EPERM 阻断，改由 PowerShell 直接读取 Git 后完成核对。
- 构建保留 theme-init.js 非 module 脚本的 Vite 提示；脚本构建成功且产物存在，本次未改变其加载方式。
- 用户于 2026-10-28 明确表示验证通过；代理未独立执行 Chrome/Edge 视觉、布局、菜单、焦点或权限交互验收。代码提交沿用已有验证结果，没有追加测试或构建。

## 验收标准

- app 不再包含 Home 的书签布局测量与书签打开实现；Home 与 Studio 切换、常驻 Dock 结构保留。
- Dock 不再位于 Newtab，Settings 界面不依赖 Dock 内部代码；公共配置接口和业务模块归属不变。
- 用户在 Chrome/Edge 加载根 dist/build/chrome-mv3，确认书签与卡片位置、Dock、Studio 切换、Actions、下载和设置抽屉行为保持原样。
- 设置仍可切换主题、操作已有功能开关；Download 展示既有记录；抽屉关闭后的焦点和提示行为保持现状。
- 自动化验证不等于用户验收；未执行项目如实记录。

## 关联文档

- [Commit 记录](../commits/2026-10-28-extension-module-boundaries-commit.md)
- [工作台](../README.md)

## 唯一下一步

本项完成。后续工作按工作台队列和明确批准范围推进，README 按用户要求留到整轮整理最后更新，不自动实施排队功能或推送。
