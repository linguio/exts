# 修复 NPM 发布器的跨平台 CLI 路径

## 元信息

- 工作项：2026-10-13-repo-npm-cli-path
- 项目：repo
- 类型：小型故障修复
- 状态：已完成
- 创建日期：2026-10-13
- 当前阶段：路径修复已存在本地提交，本轮修复暂存任务缓存配置并完成结项提交；远程仍待验证
- 用户批准：用户先要求“直接改”，随后明确要求“改完直接提交到本地”，批准追加 stage 自动缓存修复及本地验收、提交和记录终态更新；不包含推送或发布。

## 背景与目标

NPM Publish 的 prepare 在 Ubuntu 上将 CLI 解析为 Node 的 bin/node_modules 路径，触发 ENOENT。修正跨平台路径，让 prepare 与 stage 能调用已安装的 npm CLI。

## 范围

- 修正 publish.mjs 默认路径解析，保留 NPM_CLI_PATH 覆盖和无 Shell 调用。
- 测试 Linux、macOS、Windows 默认路径及显式覆盖。
- 验证发布工具全部测试与本机 npm CLI 调用。
- 关闭 stage 的 setup-node 自动包管理器缓存，避免未安装 pnpm 时缓存初始化失败。

## 排除项

不升级依赖、修改包版本或发布策略，不运行远程 Actions，不推送或上传 npm。

## Todo

- [x] 添加路径回归测试并确认缺少解析函数时失败。
- [x] 修正默认路径并保留显式覆盖。
- [x] 运行发布工具完整测试、语法与 diff 检查，核对本机 CLI 调用。
- [x] 提供远程验收步骤，停在用户验收。
- [x] 按用户追加批准关闭 stage 自动缓存；核对配置和 diff 后完成本地结项提交。

## 验收标准

- Linux/macOS 使用 Node 安装前缀的 lib/node_modules/npm/bin/npm-cli.js；Windows 使用 Node 所在目录的 node_modules/npm/bin/npm-cli.js。
- 显式 NPM_CLI_PATH 优先；保留参数数组和 shell: false。
- 回归测试通过；GitHub 上重新运行后 prepare 不再因本次错误失败，stage 仍只暂存。
- stage 的 setup-node 设置 package-manager-cache: false，不为只使用 npm 的任务调用未安装的 pnpm。

## 关联文档

- [Commit 记录](../commits/2026-10-13-repo-npm-cli-path-commit.md)
- [工作台](../README.md)

## 唯一下一步

无；本地交付已获用户验收和提交批准，不自动推送或运行远程流程。

## 本地验证与验收步骤

- Node 24.16.0 执行发布工具全部测试：9 项通过，0 失败；Linux/macOS、Windows 路径和显式覆盖用例通过。
- 本机 runNpm(['--version']) 成功返回 11.13.0；这是本机 npm 版本，未更改 CI 固定 npm 11.15.0。
- publish.mjs 的 node --check 与 git diff --check 通过。纯发布脚本修复，无应用代码变更；未运行应用测试、类型检查或构建。
- 待用户自行提交并推送后，在 main 手动运行 NPM Publish，选择目标包。Verify and pack 应能调用 npm，不再出现 bin/node_modules 路径的 ENOENT；成功后检查 tarball 与 receipt 上传。
- stage 仍只上传暂存区；成功应显示暂存编号，正式发布仍需用户网页批准。遇到其他错误时保留日志，不将本次修复视为全流程验收。
- 未执行 GitHub Ubuntu Actions、Windows 实机调用或真实暂存上传；不宣称远程发布流程已通过。
- 本轮仅追加 workflow 缓存配置与记录，配置核对和 git diff --check 通过，不重复运行无代码变化的测试或构建。
- 用户推送后重新运行 NPM Publish，stage 的 Setup Node.js 应不再出现找不到 pnpm；后续 npm 暂存上传仍需远程实际验证。punycode 警告不属于本次失败原因。
