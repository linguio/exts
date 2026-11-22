---
date: "2026-10-14"
scope: extension
status: completed
type: task
---

# 切换扩展到 npm 正式稳定产物工具

## 当前阶段

已完成。

## 目标与范围

### 背景与目标

@linguio/wxt-stable-output 的 1.0.0 已正式发布。扩展目前使用 workspace 本地源码，切换到 npm 官方 registry 的精确 1.0.0，并验证实际加载已发布包。

### 范围

- apps/extension 的工具依赖改为精确 1.0.0，更新 pnpm-lock.yaml。
- pnpm 安装因刚发布的版本自动添加仅针对 @linguio/wxt-stable-output@1.0.0 的 minimumReleaseAgeExclude；保留此精确版本安装配置，不放宽其他依赖。
- 重新安装并核对依赖解析路径与 registry 完整性记录。
- 验证已下载包的 WXT 配置加载、扩展测试、类型检查、生产构建与稳定产物发布逻辑。
- 同步构建规范和 npm 发布说明的当前依赖来源。

### 排除项

不删除本地工具源码，不升级包或无关依赖，不修改应用业务功能，不启动 watch 或浏览器视觉交互验收，不推送或发布。

## Todo

- [x] 切换依赖并更新来源文档和锁文件。
- [x] 冻结安装并确认实际加载 npm 包而非 workspace 链接。
- [x] 运行对应逻辑测试、类型检查和构建，记录稳定发布验证及限制。
- [x] 提供用户验收步骤，停在验收。
- [x] 用户验收通过并批准本地结项提交，终态随本项交付提交完成。

## 验收标准

扩展依赖锁定 1.0.0，锁文件解析为 registry 包且有完整性信息；实际加载路径不指向 packages/wxt-stable-output。安装、类型检查和构建成功；稳定产物逻辑使用下载的包通过验证。浏览器成功→失败→恢复成功由用户实际验收。

### 用户验收步骤与限制

1. 检查扩展 package.json 精确 1.0.0、锁文件的 registry 版本与 SHA-512，不再有该消费方的 workspace/link 引用；本地工具源码保留。
2. Chrome/Edge 开发者模式加载 dist/build/chrome-mv3，打开新标签页，确认原功能正常；代理未执行视觉或交互验收。
3. 开发稳定目录验收由用户启动 pnpm ext:dev，浏览器只加载 dist/dev/chrome-mv3-dev-stable。观察成功构建同步、失败时保留最后成功版本、恢复后同步；本轮仅验证下载包的纯文件发布逻辑，未验证真实 dev server 生命周期或浏览器成功→失败→恢复。
4. 本项不升级版本、不发布 npm，不运行远程 Actions；未进行 Windows 实机验证。

## 唯一下一步

无。

## 交付记录

### 本地验证结果

- pnpm 12.4.2 从 https://registry.npmjs.org 解析并下载正式 1.0.0；冻结安装成功，下载 1 个包，WXT prepare 成功。
- ESM 解析及 realpath 确认实际入口位于根 node_modules/.pnpm/@linguio+wxt-stable-output@1.0.0_...，不指向 packages/wxt-stable-output。本包只导出 ESM，最初使用 require.resolve 的检查失败，改用正确 ESM 解析后通过，未修改包代码。
- Node 24.16.0 直接运行扩展 Vitest：4 个文件、15 项测试通过；pnpm --filter @exts/extension typecheck、pnpm ext:build、包体积检查通过。产物为 dist/build/chrome-mv3，共 34 个文件。
- 用下载包公开 publishStableBuild 接口验证 34 个真实生产产物：成功发布、manifest 无效时保留旧产物、修复后恢复发布全部通过；只操作隔离目录 dist/.cache/registry-stable-output/verify-SZpDIc。
- git diff --check 通过。默认沙箱安装解析未完成已终止，联网标准命令成功；未持续重试、运行 watch 或浏览器交互。

### 历史交付记录

#### 对应 Issue

[Issue](2026-10-14-extension-registry-stable-output-issue.md)

#### 预期交付边界

扩展消费 npm 官方 1.0.0 包，保留本地源码用于维护，更新锁文件和来源文档并验证。

#### 实际交付

- 扩展 @linguio/wxt-stable-output 从 workspace:1.0.0 切为精确 1.0.0，锁文件改为 registry 包和 SHA-512 完整性记录。
- pnpm 自动加入刚发布的 @linguio/wxt-stable-output@1.0.0 精确版本发布时间例外；不修改其他依赖版本或放宽全局规则。
- 同步构建与 npm 来源说明，保留本地源码用于维护与发布。

#### 验证结果

- 官方 registry 冻结安装成功，WXT prepare 通过；ESM realpath 确认扩展加载 node_modules/.pnpm 下载包而非本地源码。
- 扩展测试 4 个文件/15 项通过；类型检查、生产构建与体积检查通过，34 个生产产物生成在 dist/build/chrome-mv3。
- 下载包 publishStableBuild 对真实产物的成功→无效 manifest 保留→恢复发布验证通过，使用隔离缓存目录。
- git diff --check 通过。首次沙箱解析停止后联网标准安装成功；检查命令改用 ESM，未为工具命令问题修改业务或包源码。

#### 未验证事项与限制

浏览器视觉、交互与实际加载由用户验收；本轮不启动 watch，未验证真实 dev server 生命周期及浏览器成功→失败→恢复，不运行远程 Actions或 Windows 实机。

#### 用户验收

已通过。用户在获知交付、验证结果及浏览器与真实开发生命周期未验证限制后，明确要求拆两笔提交到本地；该批准不代表未执行的浏览器验收已通过。

#### 最终提交批准

已批准本项本地提交及 Issue、Commit 记录、工作台终态更新；Dock 的两组件改动按用户要求独立提交，不纳入本项。完成事实以本项 Git Commit 成功为准，不推送或发布。

#### 最终 Commit message

```text
chore(extension): 切换稳定产物工具到 npm 正式包

- 使用精确 1.0.0 正式依赖并更新锁文件
- 同步来源说明并验证安装构建与稳定发布逻辑
```

#### 随提交执行的终态更新

- Issue 改为已完成，验收提交 Todo 完成，唯一下一步为无。
- 本记录验收为已通过、提交为已批准；工作台移入已完成，当前 Issue 留空。
- 提交失败时恢复待提交、待批准，不留下虚假完成状态。

## 关联文档

- [工作台](../../readme.md)

## 历史补充

### 元信息

- 类型：小型依赖来源调整
- 当前阶段：本地交付已验收并批准结项提交；浏览器与真实开发生命周期尚未验证
- 用户批准：用户明确要求切到线上地址并试用，不使用本地包；随后要求“拆两个commit 提交到本地”，表示本地验收通过并批准 npm 切换与 Dock 调整分别提交，以及本工作项的终态更新；不推送或发布。Dock 按用户要求不建 Issue，独立提交，不属于本项交付范围。

### 历史后续事项

无；本地交付已验收并批准提交，不自动推送、发布或开始队列事项。
