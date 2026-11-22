---
date: "2026-09-24"
scope: build
status: completed
type: task
---

# 统一 WXT HTML 入口扫描保护

## 当前阶段

已完成。

## 目标与范围

### 背景

X Download 与 My Tabs 都拥有 WXT HTML 源码入口和稳定开发产物。X Download 尚未限定 Vite 依赖扫描入口，存在与 TG Download 相同的生成目录竞态；My Tabs 已有正确配置，但回归测试只匹配源码文本。

### 目标

让剩余的 WXT HTML 入口扩展都使用明确的源码扫描入口，并通过实际配置结果验证这一边界。

### 范围

- 为 X Download 配置 `src/entrypoints/popup/index.html` 作为唯一 Vite 依赖扫描入口。
- 为 X Download 增加直接验证实际 WXT 配置结果的回归测试。
- 将 My Tabs 的依赖扫描测试从源码文本匹配改为实际配置结果验证。
- 删除 My Tabs 中匹配 `AGENTS.md` 文案的过时测试。

### 排除项

- 不改变任何扩展的 UI、业务逻辑、Manifest 权限或稳定发布工具。
- 不增加根目录聚合命令，不清理本地构建缓存。
- 不包含 X Download Popup 按钮功能。

## Todo

- [x] 先增加 X Download 失败配置测试，再实施最小配置修复。
- [x] 将 My Tabs 扫描入口测试改为实际配置结果，并删除过时的根规则文案匹配测试。
- [x] 串行执行 X Download 和 My Tabs 的测试、类型检查与构建。

## 验收标准

- X Download 的 `optimizeDeps.entries` 只包含 `src/entrypoints/popup/index.html`。
- My Tabs 测试直接断言实际配置返回的 `src/entrypoints/newtab/index.html`，不再用正则匹配实现文本。
- X Download 和 My Tabs 的现有测试、类型检查和生产构建通过。

## 唯一下一步

无。

## 交付记录

### 历史交付记录

#### 元信息

- 工作项：`2026-09-24-repo-wxt-entry-scan-safety`
- 对应 Issue：[统一 WXT HTML 入口扫描保护](2026-09-24-repo-wxt-entry-scan-safety-issue.md)
- 状态：已完成
- 用户验收：已通过
- 最终提交批准：已批准
- 创建日期：2026-09-24
- 最近更新：2026-09-24

#### 预期交付边界

- 为 X Download 增加明确的 Popup 源码扫描入口和实际配置测试。
- 将 My Tabs 现有扫描入口测试改为实际配置行为验证。

#### 实际完成内容

- 为 X Download 配置唯一的 Popup 源码扫描入口，避免 Vite 扫描 WXT 生成目录。
- 为 X Download 增加实际 WXT 配置测试，完成修复前失败和修复后通过的回归验证。
- 将 My Tabs 依赖扫描测试从源码正则匹配改为实际配置结果断言，并删除过时的 `AGENTS.md` 文案匹配测试。

#### 验证结果

- X Download 失败验证：修复前收到 `undefined`，1/1 项按预期失败；修复后针对性测试 1/1 通过。
- X Download 全量测试：9 个文件、46/46 项通过；`tsc --noEmit` 通过；WXT 生产构建成功，总大小 35.98 kB。
- X Download 的 pnpm shim 在本环境中无输出并卡住，按熔断规则停止；改用项目本地 Vitest、TypeScript 和 WXT 可执行文件完成等价验证，结果与上述一致。
- X Download 开发模式：5 个入口在 165 ms 内构建，稳定产物发布成功，未出现 `UNRESOLVED_ENTRY`，验证后已停止服务。
- My Tabs 首次针对性测试中，新的实际配置断言通过，旧 `AGENTS.md` 文案匹配测试因过时字符串失败；按用户批准删除后，全量测试 8 个文件、33/33 项通过。
- My Tabs `tsc --noEmit` 通过；WXT 生产构建成功，总大小 506.79 kB。

#### 未验证事项与限制

- 本变更仅影响构建工具配置和测试，不改变浏览器可观察的 UI 或业务行为，无需新的视觉验收。

#### 用户验收

- 结果：已通过
- 说明：用户明确要求先完成本 Issue 并提交到本地，该请求同时表示验收通过和 Git Commit 批准。

#### 最终 Commit message

`fix(repo): 统一 WXT HTML 入口扫描保护`

- 限定 X Download 与 My Tabs 的源码依赖扫描入口
- 用实际 WXT 配置结果覆盖扫描回归测试并移除过时规则测试

#### 最终提交批准

- 状态：已批准
- 说明：用户明确要求本地提交，已同时批准验收和最终 Git Commit。

## 关联文档

无独立关联文档。

## 历史补充

### 元信息

- 类型：小型任务
- 当前阶段：X Download 配置修复、My Tabs 测试整理、双项目验证和本地提交已完成
- 最近更新：2026-09-24

### 历史后续事项

无。用户已验收并批准本地提交。
