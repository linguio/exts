# 整理官网更新日志并准备产品版本：交付记录

## 对应工作项

- [Issue](../issues/2026-11-19-repo-release-next-issue.md)

## 实际交付

用户提供五条最终正文后，沿用已拟定2.5.0与“新增 Daily 快捷编辑，完善通知体验”。根package.json为2.5.0；官网data.ts新增2026-11-19条目，Extension三条、Packages两条。旧条目保持，包名按官网既有纯文本展示，Release提取五条且顺序一致。

不修改官网布局、业务、依赖、测试、CI或独立npm版本，不重新发布npm包。v2.4.0为远端基线，区间全部提交已核对。

## 验证与限制

本轮串行新执行，不借用其他工作项局部结果：

- node --test --test-concurrency=1：tests/build-release.test.mjs、extension-release.test.mjs、release-notes.test.mjs、桌面desk/API dev启动、官网auth/categories/card-pool、npm发布工具，共74通过。
- pnpm --filter @exts/extension test --maxWorkers 1：43文件181通过；扩展及官网typecheck通过。
- pnpm --filter @linguio/exts-ui verify:npm：7项逻辑、类型、ESM/CSS、真实tarball及独立消费者通过；产物目录dist/.cache/exts-ui-verify/b2eec492-97c9-42f5-ae59-bca8a4e3d808。
- pnpm --filter @linguio/wxt-stable-output verify:npm：10项、类型、真实tarball及WXT首次/增量/失败保留/恢复/重启通过；目录dist/.cache/npm-verify/wxt-stable-output-oEBbHl。
- API原虚拟环境unittest discover：65项，57通过、8无隔离库跳过；显式API_TEST_DATABASE_URL为空。首次uv trampoline权限拒绝后提升权限重试成功，不访问生产库。
- pnpm web:build、pnpm ext:release通过；dist/build/exts-web官网、dist/build/chrome-mv3扩展与dist/release/exts-chrome.zip生成。ZIP 713123字节，Manifest及根版本2.5.0。node scripts/release-notes.mjs输出精选五条。
- 测试适用性及入口审查见Issue：保留最新Daily/登录会话、声音/复制/消息、发布产物回滚与凭据、官网轮换纯逻辑；无须新增、更新、合并或删除。未自动运行视觉/交互测试，未引入假DOM。
- 现有theme-init非module与大chunk提示保留。Windows不能执行macOS XCTest、原生构建和DMG/双端打包；8项隔离库验证缺环境。本轮未运行远端CI，现有Release job不等于当前版本已验证。

结论：本机可运行检查通过，完整发布验证未完成。未提交、推送、打tag、部署或发布。

## 用户验收

用户明确“前面的验收通过了，先提交到本地”，批准2.5.0与官网五条日志交付及两笔本地提交。复用已有结果，不追加验证；macOS与隔离库缺口仍须另补，不把未执行写为通过。API解释器查找问题不纳入本次提交。

## 提交方案

代码提交已成功，文档随本记录提交。代码范围：package.json、apps/website/src/pages/changelog/data.ts。

```text
chore(repo): 更新产品版本至2.5.0并整理官网日志

- 写入 Daily 快捷编辑、通知与公共包五条发布说明
- 保持历史日志与独立 npm 包版本不变
```

文档范围：本Issue、本记录、docs/ohmy-delivery/README.md。

```text
docs(repo): 记录2.5.0版本准备与发布验证结果

- 记录审定的五条日志和本机验证结果
- 保留 macOS 与隔离数据库待验证事项
```

最终提交前展示实际文件范围、消息、验证及限制；明确批准本地提交时仅同步Issue/本记录/工作台的完成、验收与提交批准状态，并保留发布验证未完成，不追加检查。不自动推送或发布。

## 最终提交批准

已批准：2026-11-19用户明确验收通过并要求先提交到本地。按已展示文件与消息分别提交代码和文档，同步Issue、工作台及批准状态为已完成；完整发布验证未完成的限制保留，不推送、打tag、部署或发布。
