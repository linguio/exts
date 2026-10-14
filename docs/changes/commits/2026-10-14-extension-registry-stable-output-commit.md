# 切换扩展到 npm 正式稳定产物工具：Commit 记录

## 对应 Issue

[Issue](../issues/2026-10-14-extension-registry-stable-output-issue.md)

## 预期交付边界

扩展消费 npm 官方 1.0.0 包，保留本地源码用于维护，更新锁文件和来源文档并验证。

## 实际交付

- 扩展 @linguio/wxt-stable-output 从 workspace:1.0.0 切为精确 1.0.0，锁文件改为 registry 包和 SHA-512 完整性记录。
- pnpm 自动加入刚发布的 @linguio/wxt-stable-output@1.0.0 精确版本发布时间例外；不修改其他依赖版本或放宽全局规则。
- 同步构建与 npm 来源说明，保留本地源码用于维护与发布。

## 验证结果

- 官方 registry 冻结安装成功，WXT prepare 通过；ESM realpath 确认扩展加载 node_modules/.pnpm 下载包而非本地源码。
- 扩展测试 4 个文件/15 项通过；类型检查、生产构建与体积检查通过，34 个生产产物生成在 dist/build/chrome-mv3。
- 下载包 publishStableBuild 对真实产物的成功→无效 manifest 保留→恢复发布验证通过，使用隔离缓存目录。
- git diff --check 通过。首次沙箱解析停止后联网标准安装成功；检查命令改用 ESM，未为工具命令问题修改业务或包源码。

## 未验证事项与限制

浏览器视觉、交互与实际加载由用户验收；本轮不启动 watch，未验证真实 dev server 生命周期及浏览器成功→失败→恢复，不运行远程 Actions或 Windows 实机。

## 用户验收

已通过。用户在获知交付、验证结果及浏览器与真实开发生命周期未验证限制后，明确要求拆两笔提交到本地；该批准不代表未执行的浏览器验收已通过。

## 最终提交批准

已批准本项本地提交及 Issue、Commit 记录、工作台终态更新；Dock 的两组件改动按用户要求独立提交，不纳入本项。完成事实以本项 Git Commit 成功为准，不推送或发布。

## 最终 Commit message

```text
chore(extension): 切换稳定产物工具到 npm 正式包

- 使用精确 1.0.0 正式依赖并更新锁文件
- 同步来源说明并验证安装构建与稳定发布逻辑
```

## 随提交执行的终态更新

- Issue 改为已完成，验收提交 Todo 完成，唯一下一步为无。
- 本记录验收为已通过、提交为已批准；工作台移入已完成，当前 Issue 留空。
- 提交失败时恢复待提交、待批准，不留下虚假完成状态。
