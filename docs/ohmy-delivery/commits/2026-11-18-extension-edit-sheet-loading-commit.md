# 完善快捷编辑加载态并升级 pnpm：交付记录

## 对应工作项

- [Issue](../issues/2026-11-18-extension-edit-sheet-loading-issue.md)

## 预期交付边界

为公共 DataTableEditSheet 增加默认关闭的可选 loading 能力，DailyQuickEdit 点击后先打开 Sheet 再加载记录；复用现有表单与接口，保留表格行编辑默认行为，处理加载关闭、迟到响应、账号边界和草稿初始化。查询失败或无记录沿用现有官方 Toast 并关闭 Sheet。

用户追加批准将 pnpm 精确升级到12.21.0并合并当前Issue，同步根配置、CI、包管理器锁定信息与现行文档；不升级Node.js、业务依赖或产品版本。

用户已明确要求“开始吧”，批准按 Issue 实施；未批准 Git 提交。

## 实际交付

- 公共 DataTableEditSheet 增加可选 loading（默认 false），加载和草稿尚未对应当前记录时显示官方 Spinner，保留标题、关闭与页脚，禁止保存；仅当前草稿就绪后展示字段和判断未保存修改。
- DailyQuickEdit 不再等查询成功才打开 Sheet，账号确认或核验中先展示加载态；继续沿用现有查询取消、账号隔离、错误与空记录反馈，无需改 QueryDataTable 或业务接口。
- 表格规范及扩展表格说明同步公共加载能力和业务边界。
- 根 packageManager 与 volta.pnpm、两份GitHub Actions内三处版本及根README、官网README、构建和npm发布说明统一到12.21.0；历史工作项保留当时版本。pnpm-lock.yaml仅包管理器专用段及pnpm自身平台包更新，业务依赖段无变化。

## 验证与限制

- 初次检查因依赖目录权限及WXT缺少传递依赖受阻；按用户批准冻结安装后恢复。升级pnpm时使用 `pnpm self-update 12.21.0 --yes` 更新包管理器锁定段；新版本执行 `pnpm install --frozen-lockfile` 成功。
- 沙箱普通调用无法创建包管理器临时目录，会警告并回退12.4.2；获准权限下 `pnpm --version` 确认12.21.0。以下升级后检查均在该权限下使用新版本执行；未改变本机全局Volta默认配置。
- `pnpm --filter @exts/extension test`：46个文件187项通过；Extension与Website各自 `typecheck` 均通过。
- `pnpm ext:build`、`pnpm web:build`：通过，产物分别为 `dist/build/chrome-mv3`、`dist/build/exts-web`。扩展保留 theme-init.js 非module脚本及大于500kB chunk警告。
- `pnpm exec node --test --test-isolation=none tests/build-release.test.mjs tests/extension-release.test.mjs tests/release-notes.test.mjs apps/website/tests/auth-requests.test.mjs apps/website/tests/shared/products/categories.test.ts apps/website/tests/pages/home/showcase/card-pool.test.ts packages/npm-release-tools/tests/publish.test.mjs`：55项通过，没有执行实际发布。
- `pnpm --filter @linguio/wxt-stable-output test`：10项通过；该工具 `typecheck` 通过。
- 执行环境Node为24.18.0，与仓库固定24.16.0不同并产生engine警告；本次未更改Node版本配置。不把这些结果表述为固定Node版本下完整验证通过。macOS原生构建及远端CI未执行。
- 未新增假DOM或视觉/交互测试；浏览器加载关闭、草稿切换、焦点及原表格Edit待用户验收，不把自动化通过记为用户验收。

## 用户验收

2026-11-18 用户明确表示“现有的验收通过 先commit”，确认当前交付验收通过并批准本地提交。以下保留复现步骤，不代表代理执行过浏览器验收；Toast层级问题尚未实施，不纳入此次交付。

1. 已登录点击 Home Actions → Edit Daily，在首次慢请求或浏览器网络限速时确认 Sheet 立即打开、内容区显示 Spinner，标题与关闭入口可见，Save 禁用。
2. 数据返回后确认同一 Sheet 显示最新记录；未编辑直接关闭不误弹放弃确认。编辑后取消仍弹放弃确认，合法保存与非法值校验保持原有行为。
3. 加载期间使用关闭或 Cancel，确认立即结束且无放弃确认；等待请求返回不重新弹出。重新打开再次查询，不展示上次草稿。
4. 查询失败、无记录或未登录时确认现有 Toast 提示且 Sheet 关闭；退出或切换账号不出现旧账号记录。
5. 进入 Studio Daily，通过行 Edit 检查已有记录回填、校验、放弃确认、保存反馈和刷新，无额外业务查询阶段。
6. 在仓库根目录正常终端执行 `pnpm --version` 确认12.21.0；检查根packageManager与Volta、CI精确版本一致，业务依赖没有升级。代理沙箱回退问题及固定Node版本的验证限制见上文。

## 提交方案

按功能修复、工具升级与文档分三笔提交，分别记录不同类型的实际结果。

### 加载态代码

- 文件：`apps/extension/src/components/custom/data-table/data-table-edit-sheet.tsx`、`apps/extension/src/features/activity/daily/daily-quick-edit.tsx`。
- 摘要：公共Sheet加载展示、草稿就绪保护及Daily先打开再查询。

```text
fix(extension): 快捷编辑先打开抽屉再加载记录

- 为公共编辑 Sheet 增加加载态与保存保护
- Daily 快捷入口在查询前打开并保留取消与账号隔离
```

### 工具配置

- 文件：根`package.json`、`pnpm-lock.yaml`、`.github/workflows/exts-deploy.yml`、`.github/workflows/npm-packages-publish.yml`。
- 摘要：pnpm精确升级12.21.0并同步锁定平台包及CI。

```text
chore(repo): 将 pnpm 固定升级至12.21.0

- 同步根包管理器配置与锁定信息
- 统一部署和 npm 发布工作流版本
```

### 文档

- 文件：`README.md`、`apps/website/README.md`、`docs/build-release.md`、`docs/npm-release.md`、`docs/table-conventions.md`、`docs/extension/data-table.md`、`docs/ohmy-delivery/README.md`、本Commit记录与对应Issue。
- 摘要：同步版本说明、公共加载规则及实际交付。机械性终态更新包括用户验收通过、提交批准已批准、Issue与工作台已完成及唯一下一步无。

```text
docs(repo): 完结编辑加载态与 pnpm 升级工作项

- 记录实际交付、验证限制与用户验收结果
- 同步使用说明并将 Issue 和工作台更新为已完成
```

## 最终提交批准

已批准。2026-11-18用户明确要求本地commit；范围为以上三笔提交及机械性终态更新，不包含Toast层级修改、推送或发布。
