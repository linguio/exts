# 统一 Actions 名称与部署入口：Commit 记录

## 对应 Issue

- [Issue](../issues/2026-10-13-repo-unify-actions-entrypoints-issue.md)

## 预期交付边界

统一 `Exts Deploy` 与 `NPM Publish` 展示名称，产品部署通过 Website、Chrome、Desktop 下拉选择；保留官网与 Chrome 原行为，Desktop 仅提示发布尚未接入，不构建或发布产物；NPM 保持暂存上传和网页人工批准。同步操作指引并移除被替代入口。

## 实际交付

- 新增统一 `.github/workflows/exts-deploy.yml`，Website、Chrome、Desktop 原生下拉选择；原官网构建部署与扩展草稿 Release 步骤保留，各目标条件、权限和并发隔离。
- Desktop 仅输出尚未接入提示，不检出、构建、上传或发布；删除被替代的两份 Deploy workflow。
- NPM workflow 展示名称统一为 `NPM Publish`，命令、包名及暂存流程不变；同步构建发布规范、官网 README 与 NPM 指导。

## 验证结果

- 合并前后迁移比对通过：Website、Chrome 的全部步骤、runner、权限、环境保留。
- 三目标条件、官网 job 依赖、按目标并发、手动触发及 Desktop 无发布权限核对通过。
- UTF-8、活动文档引用及 `git diff --check` 通过；历史 Issue/Commit 的旧入口记录保留。
- 仅修改 CI 配置与文档，无应用源码变化，不重复应用测试或构建。未运行 GitHub Actions 或独立 YAML 解析器。

## 未验证事项与限制

Desktop 构建、安装包、Release、macOS runner 与签名公证明确排除；未运行远程 Actions、部署或发布。

## 用户验收

已通过。用户在看到本阶段交付、配置核对和远程未验证事项后要求“拆分commit状态改为完结”，随后回复“可以”，确认本地验收并批准按已展示范围拆分提交。远程 Actions 未运行，不虚构部署或发布结果。

## 最终提交批准

已批准并按展示边界完成两笔本地提交，本工作项已完成，事实以两笔 Git Commit 成功为准；不推送或发布。用户明确要求拆分，作为本 Issue 通常一笔交付 Commit 的例外；不新增工作项。

## 最终 Commit message

第一笔范围：三份原 workflow 的合并、替换与展示名称，以及官网 README、构建规范和 NPM 操作指导。

```text
ci(repo): 统一部署入口与发布展示名称

- 合并官网与扩展部署并提供 Desktop 未接入提示
- 统一 Exts Deploy 和 NPM Publish 入口及操作说明
```

第二笔范围：本 Issue、本 Commit 记录和工作台验收、提交批准及完成状态。

```text
docs(repo): 完结 Actions 入口统一工作项

- 记录部署入口合并的交付与配置核对结果
- 按用户验收确认同步 Issue 与工作台完成状态
```

## 批准后随提交执行的终态更新

- Issue 改为已完成，最后的验收与提交 Todo 完成，唯一下一步改为无。
- 本记录验收与两笔提交批准为已通过、已批准；完成事实以两笔 Git Commit 成功为准。
- 工作台将本 Issue 从当前移入已完成，当前 Issue 留空；不自动开始队列事项。
- 提交失败时恢复待提交、待批准，保留已成功的第一笔事实，不留下虚假的完成状态。
