# 统一 Actions 名称与部署入口

## 元信息

- 工作项：2026-10-13-repo-unify-actions-entrypoints
- 项目：repo
- 类型：小型任务；合并现有部署入口并调整展示，不接入新构建或发布能力
- 状态：已完成
- 创建日期：2026-10-13
- 当前阶段：本地交付已验收并批准拆分两笔提交；本工作项已完成，远程 Actions 未运行
- 用户批准：已要求开始并明确 Desktop 仅列为可选项，不构建、打包、上传或发布桌面产物；批准本项 workflow 与文档修改，用户已确认本轮验收并批准两笔本地提交，不包含推送、远程运行或发布。

## 背景

本项开始前，官网部署与 Chrome 草稿 Release 分别使用 `Exts Website Deploy`、`Exts Release Deploy`。NPM 暂存发布使用 `NPM Packages Publish`，大写修正已随上一 Issue 结项提交。本项将入口统一为 `Exts Deploy` 与 `NPM Publish`，Desktop 仅列为可选提示。

用户确认希望使用 `Exts Deploy` 和 `NPM Publish` 两个简洁入口；Deploy 通过 GitHub 原生下拉框选择 Website、Chrome、Desktop。展示文字中的 NPM 大写，实际命令、包名与路径保留原有大小写；桌面展示名使用 Desktop，现有 `desk:*` 命令保留。

## 目标

GitHub Actions 提供统一、可选择的产品部署入口与独立 NPM 发布入口，每次只执行所选目标，并清楚区分产物准备、暂存上传和正式发布。

## 范围

- 产品入口名称为 `Exts Deploy`，原生下拉选项为 `Website`、`Chrome`、`Desktop`；仅手动触发。
- Website 保留现有官网构建、校验和 GitHub Pages 部署行为。
- Chrome 保留现有扩展验证、固定 ZIP 产物及草稿 Release 行为。
- Desktop 仅加入下拉列表；选择后明确提示桌面发布尚未接入并结束，不构建、打包、上传产物或操作 Release。
- NPM 入口名称为 `NPM Publish`，独立保留公开包下拉选择、stage-only Token、暂存上传和 npm 网页人工批准流程。
- 按目标隔离 runner、权限、环境和并发组，避免选中一个目标时执行其他目标或获得不需要的发布权限。
- 同步构建发布规范、操作指引和必要工作项引用；替换现有 Deploy 入口后移除重复入口。

## 已确认边界

- 用户明确 Desktop 当前只需列表可选，安装包、macOS runner、签名公证及共用 Release 附件策略均不属于本项。
- Website、Chrome 保持原有 runner、校验、权限、环境与发布行为，Desktop 不获得发布权限。
- 不增加独立 Spec 或 Plan，用本 Issue 的 Todo 记录实施与停止点。

## 排除项

- 不修改产品业务功能，不更换 Swift/SwiftUI 技术路线，不升级无关依赖。
- 不增加自动推送触发、全目标批量部署、自动版本升级、自动批准 npm 暂存项或新的发布平台。
- 不改变 NPM 包版本与根产品版本的独立关系，不自动管理 Token、Secret、签名证书或账号设置。
- 不将 Desktop 显示为已实现发布，选择后的说明必须明确尚未接入。
- 不自动 Git 提交、推送或运行 workflow；上一 Issue 的结项提交成功前不修改部署实现。

## Todo

- [x] 上一 Issue 已结项提交，本项设为唯一活动 Issue；用户已确认开始及 Desktop 仅可选的范围。
- [x] 合并 Website、Chrome 部署入口，逐项核对保留原有步骤、runner、权限和环境；各目标独立并发。
- [x] 添加 Desktop 可选项及尚未接入提示，统一 `Exts Deploy` 与 `NPM Publish` 展示名称。
- [x] 同步规范、官网 README、NPM 指导并移除两份旧入口；目标条件、依赖、并发、UTF-8 及 diff 核对通过。仅修改 workflow 和文档，不重复应用测试或构建。
- [x] 提供本节下方的 Website、Chrome、NPM 与 Desktop 验收步骤，实际 GitHub 运行尚未执行。
- [x] 用户验收通过并在看到文件边界、验证限制与完整 message 后批准两笔本地提交；完成终态随最终记录提交交付。

## 验收标准

- GitHub Actions 显示 `Exts Deploy`、`NPM Publish`，不存在被替代的重复 Deploy 入口。
- Deploy 下拉完整展示 Website、Chrome、Desktop；每次只执行选择的目标。
- Website 部署结果、Chrome ZIP 与草稿 Release 符合现有规范；Desktop 只提示尚未接入，不产生构建、上传或发布副作用。
- 失败时不覆盖已有有效产物或 Release，不自动切换目标或扩大权限。
- NPM Action 成功只表示暂存成功，仍由用户在 npm 网页完成 2FA 后批准正式发布。
- 命令与包名保持正确大小写；远程和 macOS 未执行的检查明确记录，不宣称已验收。

## 关联文档

- [Commit 记录](../commits/2026-10-13-repo-unify-actions-entrypoints-commit.md)
- [工作台](../README.md)
- [构建与分发规范](../../build-release.md)
- [NPM 发布与验收指导](../../npm-release.md)
- [当前 NPM 发布 Issue](./2026-10-12-wxt-stable-output-npm-release-issue.md)
- 本项只使用 Issue Todo，不创建独立 Spec 或 Plan。

## 本地验证与阶段验收

- 迁移比对确认 Website、Chrome 的全部原有步骤、runner、权限、环境不变；仅调整 job 名称、官网依赖名称和目标条件。
- main 下 Website 仅选中 website-build/website-deploy，Chrome 仅选中 chrome-release，Desktop 仅选中 desktop；非 main 全部跳过。并发按 target 隔离，仍不取消运行中的同目标任务。
- Desktop 无仓库权限、无 checkout，不构建或上传；两份旧 workflow 已移除。没有独立 YAML 解析器或 GitHub 远程运行结果，本地核对不替代远程验收。
- 用户提交并推送批准范围后，Actions 应显示 Exts Deploy 与 NPM Publish，旧入口不再作为当前流程展示；历史运行记录可能仍显示旧名称。
- Exts Deploy 的 target 下拉应包含 Website、Chrome、Desktop。选择 Desktop 后只执行提示任务，日志和摘要明确未生成或发布桌面产物，其余 job 跳过。
- 选择 Website 后只构建与部署官网；失败时官网部署 job 不执行，Chrome 与 Desktop 跳过。
- 确认需要生成草稿 Release 时选择 Chrome，检查原版本冲突校验和 ZIP 附件；Website 与 Desktop 跳过，公开 Release 仍由用户审核。
- NPM Publish 保留公开包下拉；实际上传仍进入暂存区，不自动批准。其他分支运行 Exts Deploy 不执行目标任务。

## 唯一下一步

无；用户已确认本地验收并批准结项提交。不自动推送、运行流程或开始下一工作项。
