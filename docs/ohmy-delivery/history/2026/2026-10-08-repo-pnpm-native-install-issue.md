---
date: "2026-10-08"
scope: [build, extension]
status: completed
type: bug
---

# 修复 pnpm 安装缺少原生依赖

## 当前阶段

已完成。

## 目标与范围

### 背景与目标

根目录 pnpm i 在 extension postinstall 的 wxt prepare 中找不到 @tailwindcss/oxide-darwin-arm64。加入 extension Workspace 后，安装首次执行 WXT 配置加载，从而暴露锁文件遗漏的 Oxide 原生 optionalDependencies。实际包元数据声明这些依赖，旧锁文件却将 oxide snapshot 记为 {}。本项修复该缺项，不将报错中的 npm bug 提示当作已证实原因。

### 范围与排除项

固定 pnpm 12.4.2 修复锁记录，保留直接及已有传递依赖引用，正常运行 postinstall。不改业务、应用身份、图标、用户数据或归档，不推送远端。

## Todo

- [x] 复现冻结安装失败，确认 oxide 元数据与锁记录的差异。
- [x] 补回原生 optionalDependencies 和缺失包记录，保留原版本引用。
- [x] 验证正常与冻结安装、WXT prepare 和扩展生产构建。
- [x] 展示拆分范围及完整 Commit message，记录用户验收与本地提交批准。

## 验收标准

历史记录未单列。

## 唯一下一步

无。

## 交付记录

### 实际结果与验收

锁文件新增 13 个缺失的原生包记录，恢复 oxide 的平台依赖。修锁时附带的 tinyexec 引用变化已恢复为原值 1.3.0。正常安装、冻结安装、WXT prepare 与扩展生产构建通过。

用户看到上述结果后明确要求拆分提交本地，按根规范同时表示验收通过和提交批准。用户可在根目录执行 pnpm i、pnpm ext:build 复核正常退出及无 native binding 错误。无缓存全新安装、其他平台安装和此前生成缺项锁文件的具体命令未验证。

### 历史交付记录

#### 关联 Issue

- [修复 pnpm 安装缺少原生依赖](2026-10-08-repo-pnpm-native-install-issue.md)

#### 预期交付边界

保留现有版本及正常 WXT prepare，修复根安装的原生依赖遗漏。

#### 实际交付

补全 Oxide 平台 optionalDependencies 与 13 个缺失原生包记录。修锁时附带的 WXT tinyexec 引用变化恢复原值 1.3.0。内部包改名属于下一份应用结构 Commit，本份不包含命名或业务变更。

#### 验证结果

正常安装、冻结锁文件安装、WXT prepare 与扩展构建通过；恢复原引用后冻结安装、prepare 和构建再次通过。已有依赖版本保留。

#### 未验证事项与限制

无缓存全新安装及其他平台安装未验证；未核实旧缺项锁文件具体生成命令。SQLite 缺陷属于应用既有实现，与本项修锁无关。

#### 用户验收与提交批准

- 用户验收：已通过，2026-10-09 明确要求拆分提交本地。
- 最终提交批准：已批准，仅本地，不推送。
- 状态：已完成。

#### 最终 Commit message

```text
fix(repo): 修复 pnpm 安装缺少原生依赖

- 补全 Tailwind Oxide 的原生可选依赖锁记录
- 保留现有版本并验证正常与冻结安装
```

## 关联文档

- [应用结构 Issue](2026-10-08-repo-app-foundations-root-commands-issue.md)
- [工作台](../../readme.md)

## 历史补充

### 元信息

- 日期：2026-10-08；最终验收与提交批准：2026-10-09
- 当前阶段：用户明确要求拆分并提交本地，本项作为独立 fix 交付
- 批准范围：锁文件原生依赖修复及对应文档；不推送远端，不升级依赖

### 历史后续事项

本地提交成功后本项收口；不推送远端或启动新任务。
