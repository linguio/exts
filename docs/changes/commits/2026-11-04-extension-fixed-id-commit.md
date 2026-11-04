# 固定扩展本地加载标识：交付记录

## 对应工作项

- [Issue](../issues/2026-11-04-extension-fixed-id-issue.md)

## 预期交付边界

仅固定扩展 Manifest 公钥及本地 ID，补充必要说明和验证；不接入登录或修改外部系统。

## 实际交付

- apps/extension/wxt.config.ts 在所有构建共用的 Manifest 中固定一次性生成的 RSA-2048 SPKI 公钥，派生 ID 为 gclkjdfiiibgahheiejgbmkglebbbgeh。私钥仅在生成进程内存在，未保存或输出。
- apps/extension/README.md 记录公钥用途、预期 ID、首次切换的存储边界及商店 ID 需独立确认的限制；候选回跳来源不代表已完成登录兼容性验证。
- 用户确认 ID 正常并批准本地提交，Issue、Commit 记录和工作台按批准同步完结；登录工作项仍保持排队。

## 验证与限制

- 首次 pnpm --filter @exts/extension test 因工具环境 spawn EPERM 无法启动 forks worker，未运行测试，已结束该进程。允许在受限环境外以单 worker 重试后，pnpm --filter @exts/extension test --maxWorkers=1 --no-file-parallelism 通过：15 个文件、80 项测试。
- pnpm --filter @exts/extension typecheck 通过。
- pnpm ext:build 通过，生成根 dist/build/chrome-mv3；保留既有 theme-init.js 非 module 警告和大于 500 kB 的 chunk 警告，未为此修改无关代码。
- Node 使用 createPublicKey 解析正式产物的公钥，确认 RSA-2048 SPKI；产物 key 与配置一致，按 Chromium ID 算法计算 SHA-256 前 128 位并映射为 a–p，结果为 gclkjdfiiibgahheiejgbmkglebbbgeh。
- 代理未启动开发服务器或重新发布稳定开发目录，也未执行浏览器加载、换目录、重启或视觉交互验收。用户最初报告旧 ID；只读检查确认正式产物含固定 key，而稳定开发目录及开发缓存均无 key，随后提供重新启动开发构建或加载正式产物的步骤。用户反馈“可以了”，未说明采用哪条路径，不将路径或各浏览器检查记为已验证。Neon 回跳、请求来源及会话兼容性仍待登录工作项验证。
- 未申请商店 ID、迁移本地存储或修改云端配置；按用户指令仅本地提交，不推送。提交时沿用已有验证结果，不追加测试、类型检查或构建。

## 用户验收

用户于 2026-11-04 在收到旧开发产物的排查结果及更新步骤后反馈“可以了”，确认 ID 正常，随后明确要求“commit”，批准本地提交完结。用户未逐项确认换目录、跨机器、Chrome/Edge 分别加载或重启，保留这些限制。

保留以下可复现验收步骤：

1. 在 Chrome/Edge 的扩展管理页开启开发者模式，保留旧扩展，不删除其本地数据。
2. 加载 D:\GitHub\exts\dist\build\chrome-mv3，确认显示的 ID 为 gclkjdfiiibgahheiejgbmkglebbbgeh；新 ID 下的设置和下载记录可能为空，不自动迁移旧存储。
3. 可将构建目录复制到另一个本地路径，再从该路径加载，确认显示同一 ID；同一浏览器配置文件可能将相同 ID 的加载识别为更新。
4. 再次构建并重新加载后，ID 应保持一致；Chrome/Edge 均需由用户实际确认。不同机器保留同一 key 的未打包产物应使用同一 ID，代理未实机验证。

## 提交方案

### 代码提交

- 文件：apps/extension/wxt.config.ts。
- diff 摘要：在共用 Manifest 配置中添加固定公钥，不更改功能或权限。

```text
chore(extension): 固定本地加载的扩展标识

- 在开发与正式构建中共用固定 Manifest 公钥
```

### 文档提交

- 文件：apps/extension/README.md、当前 Issue、当前 Commit 记录、docs/changes/README.md。
- diff 摘要：记录固定 ID、公钥用途、验证结果、存储与商店边界及用户验收步骤。
- 随本地提交执行的已批准终态更新：Issue 状态和工作台索引改为已完成，记录用户确认 ID 正常，最终提交批准改为已批准。

```text
docs(extension): 记录固定标识与加载验收说明

- 补充固定公钥和扩展 ID 的使用边界
- 记录构建验证结果及浏览器待验收事项
```

## 最终提交批准

已批准。用户于 2026-11-04 明确要求“commit”，批准已展示范围内的代码、文档两笔本地提交及终态更新；不包含推送或登录实施。
