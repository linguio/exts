# 修复 NPM 发布器的跨平台 CLI 路径：Commit 记录

## 对应 Issue

[Issue](../issues/2026-10-13-repo-npm-cli-path-issue.md)

## 预期交付边界

修复 npm CLI 默认路径、补充回归测试和工作项记录；按用户追加批准关闭 stage 自动包管理器缓存，保留显式覆盖与原暂存发布流程。

## 实际交付

- 提取 npm CLI 路径解析：Linux/macOS 使用安装前缀 lib/node_modules，Windows 使用 Node 目录 node_modules。
- 保留 NPM_CLI_PATH 覆盖及直接 Node、参数数组、shell: false 调用；prepare 与 stage 共用修复。
- 增加跨平台路径与显式覆盖回归测试，建立 Issue 和工作台验收记录。
- stage 的 setup-node 设置 package-manager-cache: false，避免从根 packageManager 自动选择未安装的 pnpm。

## 验证结果

- 新用例在缺少解析函数时失败；修复后 Node 24.16.0 运行发布工具全部测试，9 项通过、0 失败。
- 本机通过修正后的路径执行 npm --version，返回 11.13.0；CI 固定 npm 11.15.0 未变。
- node --check 与 git diff --check 通过。无应用源码变更，不运行应用测试、类型检查或构建。
- 本轮核对缓存禁用仅作用于 stage，Node/npm 固定版本、registry 与上传步骤保持原配置；git diff --check 通过，无代码变化不重复测试。

## 未验证事项与限制

远程 Ubuntu Actions 和 Windows 实机尚未验证，不执行上传或发布。

## 用户验收

本地交付已通过。用户在获知根因、最小配置修复与远程未验证限制后明确要求“改完直接提交到本地”；远程成功未获验证，不将提交批准视为线上运行成功。

## 最终提交批准

已批准本轮配置修复和结项记录的本地提交；此前路径修复已存在本地提交，本轮不改写历史，不推送或发布。

## 最终 Commit message

```text
fix(repo): 修复 NPM 暂存任务的 pnpm 缓存错误

- 关闭暂存任务的自动包管理器缓存
- 同步发布故障修复的验收与完成记录
```

## 随本轮提交执行的终态更新

- Issue 和工作台改为已完成，当前 Issue 留空；本记录注明用户已验收并批准本地提交。
- 提交失败时恢复待提交、待批准，不留下虚假的完成状态。
