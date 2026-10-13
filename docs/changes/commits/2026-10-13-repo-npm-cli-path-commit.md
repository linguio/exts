# 修复 NPM 发布器的跨平台 CLI 路径：Commit 记录

## 对应 Issue

[Issue](../issues/2026-10-13-repo-npm-cli-path-issue.md)

## 预期交付边界

仅修复 npm CLI 默认路径、补充回归测试和工作项记录；保留显式覆盖与原暂存发布流程。

## 实际交付

- 提取 npm CLI 路径解析：Linux/macOS 使用安装前缀 lib/node_modules，Windows 使用 Node 目录 node_modules。
- 保留 NPM_CLI_PATH 覆盖及直接 Node、参数数组、shell: false 调用；prepare 与 stage 共用修复。
- 增加跨平台路径与显式覆盖回归测试，建立 Issue 和工作台验收记录。

## 验证结果

- 新用例在缺少解析函数时失败；修复后 Node 24.16.0 运行发布工具全部测试，9 项通过、0 失败。
- 本机通过修正后的路径执行 npm --version，返回 11.13.0；CI 固定 npm 11.15.0 未变。
- node --check 与 git diff --check 通过。无应用源码变更，不运行应用测试、类型检查或构建。

## 未验证事项与限制

远程 Ubuntu Actions 和 Windows 实机尚未验证，不执行上传或发布。

## 用户验收

待验收。

## 最终提交批准

待批准，不自动提交。

## 最终 Commit message

```text
fix(repo): 修复 NPM 发布器跨平台 CLI 路径

- 按平台解析 npm CLI 并保留显式路径覆盖
- 补充路径回归测试与发布验收记录
```
