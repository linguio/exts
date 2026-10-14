# 切换扩展到 npm 正式稳定产物工具

## 元信息

- 工作项：2026-10-14-extension-registry-stable-output
- 项目：extension
- 类型：小型依赖来源调整
- 状态：已完成
- 创建日期：2026-10-14
- 当前阶段：本地交付已验收并批准结项提交；浏览器与真实开发生命周期尚未验证
- 用户批准：用户明确要求切到线上地址并试用，不使用本地包；随后要求“拆两个commit 提交到本地”，表示本地验收通过并批准 npm 切换与 Dock 调整分别提交，以及本工作项的终态更新；不推送或发布。Dock 按用户要求不建 Issue，独立提交，不属于本项交付范围。

## 背景与目标

@linguio/wxt-stable-output 的 1.0.0 已正式发布。扩展目前使用 workspace 本地源码，切换到 npm 官方 registry 的精确 1.0.0，并验证实际加载已发布包。

## 范围

- apps/extension 的工具依赖改为精确 1.0.0，更新 pnpm-lock.yaml。
- pnpm 安装因刚发布的版本自动添加仅针对 @linguio/wxt-stable-output@1.0.0 的 minimumReleaseAgeExclude；保留此精确版本安装配置，不放宽其他依赖。
- 重新安装并核对依赖解析路径与 registry 完整性记录。
- 验证已下载包的 WXT 配置加载、扩展测试、类型检查、生产构建与稳定产物发布逻辑。
- 同步构建规范和 npm 发布说明的当前依赖来源。

## 排除项

不删除本地工具源码，不升级包或无关依赖，不修改应用业务功能，不启动 watch 或浏览器视觉交互验收，不推送或发布。

## Todo

- [x] 切换依赖并更新来源文档和锁文件。
- [x] 冻结安装并确认实际加载 npm 包而非 workspace 链接。
- [x] 运行对应逻辑测试、类型检查和构建，记录稳定发布验证及限制。
- [x] 提供用户验收步骤，停在验收。
- [x] 用户验收通过并批准本地结项提交，终态随本项交付提交完成。

## 验收标准

扩展依赖锁定 1.0.0，锁文件解析为 registry 包且有完整性信息；实际加载路径不指向 packages/wxt-stable-output。安装、类型检查和构建成功；稳定产物逻辑使用下载的包通过验证。浏览器成功→失败→恢复成功由用户实际验收。

## 关联文档

- [Commit 记录](../commits/2026-10-14-extension-registry-stable-output-commit.md)
- [工作台](../README.md)

## 唯一下一步

无；本地交付已验收并批准提交，不自动推送、发布或开始队列事项。

## 本地验证结果

- pnpm 12.4.2 从 https://registry.npmjs.org 解析并下载正式 1.0.0；冻结安装成功，下载 1 个包，WXT prepare 成功。
- ESM 解析及 realpath 确认实际入口位于根 node_modules/.pnpm/@linguio+wxt-stable-output@1.0.0_...，不指向 packages/wxt-stable-output。本包只导出 ESM，最初使用 require.resolve 的检查失败，改用正确 ESM 解析后通过，未修改包代码。
- Node 24.16.0 直接运行扩展 Vitest：4 个文件、15 项测试通过；pnpm --filter @exts/extension typecheck、pnpm ext:build、包体积检查通过。产物为 dist/build/chrome-mv3，共 34 个文件。
- 用下载包公开 publishStableBuild 接口验证 34 个真实生产产物：成功发布、manifest 无效时保留旧产物、修复后恢复发布全部通过；只操作隔离目录 dist/.cache/registry-stable-output/verify-SZpDIc。
- git diff --check 通过。默认沙箱安装解析未完成已终止，联网标准命令成功；未持续重试、运行 watch 或浏览器交互。

## 用户验收步骤与限制

1. 检查扩展 package.json 精确 1.0.0、锁文件的 registry 版本与 SHA-512，不再有该消费方的 workspace/link 引用；本地工具源码保留。
2. Chrome/Edge 开发者模式加载 dist/build/chrome-mv3，打开新标签页，确认原功能正常；代理未执行视觉或交互验收。
3. 开发稳定目录验收由用户启动 pnpm ext:dev，浏览器只加载 dist/dev/chrome-mv3-dev-stable。观察成功构建同步、失败时保留最后成功版本、恢复后同步；本轮仅验证下载包的纯文件发布逻辑，未验证真实 dev server 生命周期或浏览器成功→失败→恢复。
4. 本项不升级版本、不发布 npm，不运行远程 Actions；未进行 Windows 实机验证。
