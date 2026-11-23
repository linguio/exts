---
date: "2026-10-01"
scope: [build, desktop]
status: completed
type: task
---

# 补充 Omy Photos 根目录开发命令

## 当前阶段

已完成。

## 目标与范围

### 背景

Omy Photos 已有 macOS Debug 构建脚本，但根目录 `package.json` 没有对应的 `pnpm` 入口，无法统一使用 `pnpm ohmy-photos:dev`。

### 目标

增加 `pnpm ohmy-photos:dev`，复用现有 Omy Photos 构建入口生成 Xcode 工程、构建 Debug App，并在构建成功后自动启动应用。

### 范围

- 在根目录 `package.json` 增加 `ohmy-photos:dev` 脚本。
- 建立并更新本工作项的 Issue、Commit 记录和工作台状态。
- 让现有构建脚本在成功后启动 Debug App。
- 验证脚本配置、构建入口和启动步骤。

### 排除项

- 不修改 Omy Photos Swift/Xcode 业务代码。
- 不改变现有 `apps/desktop/ohmy-photos/scripts/build.sh` 行为。
- 不恢复或调整当前已有的其他根目录脚本删除改动。

## Todo

- [x] 创建 Issue 与对应 Commit 记录，并登记为当前活动 Issue。
- [x] 增加 `ohmy-photos:dev` 根命令，指向现有构建脚本。
- [x] 完成配置断言、脚本语法检查和差异检查。
- [x] 增加构建成功后的 `OhMyPhotos.app` 启动步骤。
- [x] 完成实际 Debug 构建并确认应用启动。
- [x] 完成用户验收并取得明确本地提交批准。

## 验收标准

- `pnpm ohmy-photos:dev` 能解析到 `zsh apps/desktop/ohmy-photos/scripts/build.sh`。
- 构建成功后自动打开 `DerivedData/Build/Products/Debug/OhMyPhotos.app`；构建失败时不启动应用。
- 工作台、Issue 和 Commit 记录准确反映验证结果，并在提交前保持待验收状态。

## 唯一下一步

无。

## 交付记录

### 历史交付记录

#### 元信息

- 工作项：`2026-10-01-repo-ohmy-photos-dev-command`
- 对应 Issue：[补充 Omy Photos 根目录开发命令](2026-10-01-repo-ohmy-photos-dev-command-issue.md)
- 状态：已完成
- 用户验收：已通过；用户已实际启动应用并进入图库界面
- 最终提交批准：已批准
- 创建日期：2026-10-01
- 最近更新：2026-10-01

#### 预期交付边界

- 根目录提供 `pnpm ohmy-photos:dev` 入口。
- 入口复用现有 Omy Photos Debug 构建脚本，并在构建成功后自动启动应用。

#### 实际完成内容

- 在根目录 `package.json` 增加 `ohmy-photos:dev`，指向现有 `apps/desktop/ohmy-photos/scripts/build.sh`。
- 让构建脚本在 Debug 构建成功后打开 `OhMyPhotos.app`。
- 保留用户已有的 `ohmy-tabs:build` 与 `ohmy-dl:build` 删除改动。

#### 验证结果

- 配置断言通过：`ohmy-photos:dev` 的命令值与现有构建脚本一致。
- `zsh -n apps/desktop/ohmy-photos/scripts/build.sh`：通过。
- `git diff --check`：通过。
- `pnpm ohmy-photos:dev`：已启动但约 90 秒无 stdout/stderr，按熔断规则停止；未确认 Debug 构建成功。
- 构建后自动启动步骤：已实现；由于构建未返回，未实际执行到 `open`。
- 用户环境：已实际完成应用启动并进入图库界面，开发运行命令通过用户验收。

#### 未验证事项与限制

- 当前代理环境未取得 `pnpm ohmy-photos:dev` 的构建退出码，自动化侧不能将 Debug 构建宣称为通过。
- 实际构建与启动结果来自用户环境验收。

#### 用户验收

- 结果：通过。
- 说明：用户已实际启动应用并进入图库界面，同时提出后续媒体与界面改进需求。

#### 最终 Commit message

```text
chore(ohmy-photos): 增加本地开发运行命令

- 根目录提供 pnpm ohmy-photos:dev
- Debug 构建成功后自动启动应用
```

#### 最终提交批准

- 状态：已批准。
- 说明：用户明确要求提交到本地，并在确认后授权开始后续 Issue。

## 关联文档

- [Omy Photos 构建脚本（历史版本）](https://github.com/linguio/exts/blob/5a8647101bed6e95124265cadafee4f7d2cedcae/apps/desktop/ohmy-photos/scripts/build.sh)

## 历史补充

### 元信息

- 类型：小型任务
- 当前阶段：用户已实际启动并验收开发运行命令
- 最近更新：2026-10-01

### 历史后续事项

无；本 Issue 已完成并进入最终交付 Commit。
