---
date: "2026-11-20"
scope: [packages, extension]
status: completed
type: task
---

# 准备公共包新版本并统一消费来源

## 当前阶段

已完成。

## 目标与范围

### 背景与目标

仓库包版本目前为WXT工具1.0.3、UI 0.3.0。此前未提交的扩展消费升级已安装线上1.0.3，UI仍为workspace:0.3.0。用户现改为准备WXT 1.1.0与UI 0.4.0，并要求扩展最终使用线上WXT、本地UI。

2026-11-20只读查询registry：@linguio/wxt-stable-output@1.1.0返回404，尚不能直接安装；需先完成包准备及用户手动批准npm正式发布。已完成的1.0.3检查只对应原输入，不代替新目标验证。

### 范围与排除项

- 按用户指定版本准备两包package.json与中文CHANGELOG；先展示正文草稿供用户审定，不能把建档当作版本写入或发布批准。
- exts-ui homepage指向https://github.com/linguio/exts/tree/main/packages/exts-ui；keywords为shadcn-ui、ui、components。
- WXT homepage指向https://github.com/linguio/exts/tree/main/packages/wxt-stable-output；keywords为wxt、chrome、extension。
- 两包repository.url保留有效Git仓库地址，repository.directory保留对应包目录，不使用tree网页地址替换Git URL。README、bugs及功能/API不因本任务改变。
- UI包升为0.4.0时，扩展workspace精确引用与锁文件必须同一次同步，避免再次发生包版本与消费方/锁文件不一致；UI不切到线上。
- WXT 1.1.0未正式发布时保留当前可安装的1.0.3引用，不提前写入无法解析的registry版本。正式包可查询后再更新扩展为精确1.1.0、锁文件及必要精确发布年龄例外。
- 复用现有main版本检测、验证与npm暂存流程，正式发布由用户手动批准；不接入OIDC，不新增tag/GitHub Release，不升级根产品2.5.0或其他依赖。
- 前述主页/关键词队列项归并本工作项，不作为第二个活动Issue。用户已批准实施版本及元数据准备；未批准Git提交、推送、上传或正式发布。

## Todo

- [x] 审定双包中文Changelog及发布顺序，核对包版本与扩展精确引用联动。
- [x] 写入已审定版本与展示字段；UI同步workspace:0.4.0及锁文件，完成包元数据、类型、逻辑、真实tarball和消费验证。
- [ ] 获准提交/推送后验证现有NPM暂存；用户手动正式发布WXT 1.1.0，并只读确认registry可用。
- [ ] 将扩展WXT依赖切到线上精确1.1.0、同步锁文件及消费说明，冻结安装、来源核验与扩展构建后交付验收。

## 验收标准

- 两包实际元数据/编译tarball包含各自主页与精简关键词，正确Git仓库和目录信息保留。
- 扩展精确引用与锁文件一致；最终WXT实际路径为npm registry 1.1.0，UI实际路径为packages/exts-ui 0.4.0。
- WXT尚未公开时不提交会导致安装失败的1.1.0依赖；保留已验证可用的中间消费状态，清楚标注目标尚未完成。
- 安装（含frozen-lockfile）、直接受影响的工具/包检查和扩展构建通过；不因仅改元数据就省略必要发布验证，也不把旧1.0.3结果冒充1.1.0验证。
- 用户重启ext:dev后仍在既有稳定目录正常加载与更新；浏览器和macOS实机未执行的检查如实记录。npm正式版本与暂存成功分开验证。

## 唯一下一步

无。

## 交付记录

### 发布前准备结果与阶段验收

- 两包package.json已为1.1.0/0.4.0，主页与精简关键词写入，repository的Git URL及directory保持；中文Changelog按审定草稿新增元数据条目。README与根产品2.5.0不变。
- 扩展为workspace:0.4.0与线上WXT 1.0.3，锁文件一致，安装及frozen-lockfile通过；发布年龄例外仅已消费的精确1.0.3，无宽泛规则。
- 本轮exts-ui verify:npm通过：7项、类型、ESM/CSS、真实tarball独立消费者；fixture为dist/.cache/exts-ui-verify/c3ae6602-6e64-44ff-b2dc-4d09bc700686。
- 本轮WXT verify:npm通过：10项、类型、真实tarball及首次/增量/失败保留/恢复/重启；fixture为dist/.cache/npm-verify/wxt-stable-output-2AedsS。扩展typecheck与ext:build通过，产物dist/build/chrome-mv3。
- 直接读取两份真实tarball独立安装后的package.json，版本、主页、关键词及Git目录均与目标一致。未只核对源码字段。必要覆盖沿用已有声音/消息/工具恢复及打包消费者检查，无新增数据镜像测试或无关181项业务测试。
- registry复核0.4.0、1.1.0均为404，未上传或发布。最终线上1.1.0消费步骤未完成，不能把中间状态当最终目标已实现。
- 既有peer提示、theme-init非module与大chunk提示保留；无浏览器或macOS实机验收，不声称通过。未提交、推送或部署。

阶段验收：审阅两包版本、中文Changelog及实际package.json主页/关键词；确认扩展UI引用与锁文件均为workspace:0.4.0。需要检查扩展时加载dist/build/chrome-mv3，或重启ext:dev使用原dist/dev/chrome-mv3-dev-stable，验证UI和既有稳定目录行为。npm主页及Keywords当前不会随本地改动立即更新，等待获准上传并由用户批准正式发布。

### 历史交付记录

#### 对应工作项

- [Issue](2026-11-20-extension-stable-output-103-issue.md)

#### 本阶段实际交付

- exts-ui本地包0.4.0、主页直达packages/exts-ui、keywords为shadcn-ui/ui/components；扩展同步workspace:0.4.0与锁文件。
- WXT源码包准备1.1.0、主页直达packages/wxt-stable-output、keywords为wxt/chrome/extension。两包Git URL及repository.directory保留，中文Changelog写入审定的元数据更新，不修改README或根产品版本。
- 扩展仍消费线上WXT 1.0.3：1.1.0尚未正式发布，不能提前引用。相对HEAD的1.0.1消费升级至1.0.3及目标精确发布年龄例外属于此前已验证的中间状态，本阶段保留。
- 更新消费/发布说明，元数据队列已并入本Issue。最终目标“线上WXT 1.1.0 + 本地UI 0.4.0”尚未全部完成。

#### 本轮验证与限制

- pnpm install --no-frozen-lockfile及pnpm install --frozen-lockfile通过。
- UI verify:npm：7项逻辑、类型、ESM/CSS、真实tarball独立类型/消费者构建通过；fixture：dist/.cache/exts-ui-verify/c3ae6602-6e64-44ff-b2dc-4d09bc700686。
- WXT verify:npm：10项、类型、真实tarball独立安装、WXT首次/增量/失败保留/恢复/完整重启通过；fixture：dist/.cache/npm-verify/wxt-stable-output-2AedsS。
- 两个真实tarball独立安装后的package.json已逐项核对版本、homepage、keywords、repository.url/directory，字段未丢失。
- 扩展typecheck及ext:build通过，产物dist/build/chrome-mv3。实际解析：UI指向packages/exts-ui 0.4.0；WXT为.pnpm的线上1.0.3。未跑无关181项业务测试，未引入新框架或数据镜像测试。
- registry复核UI 0.4.0与WXT 1.1.0均404，没有上传/正式发布。既有peer、theme-init及大chunk提示保留。浏览器与macOS实机未验证，不称为完成验收。

#### 用户验收

2026-11-20用户明确“验收通过 push”，批准发布前阶段交付、代码/文档两笔提交及推送。复用既有验证，不追加检查。只有正式发布后npm展示字段才会更新，WXT 1.1.0最终消费切换尚未完成。

#### WXT 1.1.0 消费切换

- npm 官方源确认 1.1.0 可安装。扩展精确引用、锁文件及发布年龄例外切换至 1.1.0，安装后的包版本已核实。exts-ui 继续使用本地 Workspace 0.4.0。
- 安装、冻结安装、扩展类型检查及 Chrome 生产构建通过。安装报告 peer 警告，构建报告 theme-init 非 module 与大 chunk 警告。Chrome 或 Edge 的稳定目录加载与更新尚未验证。
- 用户于 2026-11-21 确认本次消费切换验收通过并批准本地提交。浏览器具体验收步骤未提供，macOS 实机未执行。

##### 本次消费切换提交

代码文件为 `apps/extension/package.json`、`pnpm-workspace.yaml`、`pnpm-lock.yaml`。

```text
fix(extension): 切换到正式发布的 WXT 稳定产物工具

- 固定消费 npm 1.1.0 并同步锁文件与精确版本例外
```

文档文件为 `docs/build-release.md`、`docs/npm-release.md`、本 Issue、本记录和工作台中的该 Issue 条目。

```text
docs(repo): 完结公共包依赖切换

- 记录线上 WXT 1.1.0 与本地 exts-ui 0.4.0 的消费结果
- 记录验收与验证结果并归档本地工作项
```

本次批准范围为上述两笔本地提交及 Issue、Commit 记录和工作台终态更新。

#### 当前阶段提交方案

代码7文件：apps/extension/package.json、pnpm-lock.yaml、pnpm-workspace.yaml、两包package.json及各自CHANGELOG.md。

```text
chore(packages): 准备UI0.4.0与稳定产物工具1.1.0

- 统一双包主页、关键词及中文更新记录
- 同步UI本地Workspace引用与锁文件
- WXT消费暂保留已发布的线上1.0.3
```

文档7文件：docs/build-release.md、docs/npm-release.md、docs/ohmy-delivery/readme.md、本Issue/本记录及已并入的主页关键词Issue/Commit记录。

```text
docs(repo): 记录双包发布前准备与线上切换顺序

- 记录包元数据及独立消费者验证结果
- 明确WXT正式发布后的依赖切换步骤
```

若用户批准本阶段提交，先展示最终文件范围及状态更新；记录阶段验收/批准与提交结果，保留未发布及最终依赖尚未切换的事实，不追加无关检查，不自动推送或正式发布。

#### 最终提交批准

已批准：2026-11-20用户“验收通过 push”。按已展示的7个代码/配置文件、7个文档文件及消息分两笔提交，再推送main。授权只覆盖当前阶段及既有自动暂存，npm正式发布仍由用户手动批准，后续线上依赖切换需按实际新diff展示与验收。

## 关联文档

- [已并入的主页与关键词记录](2026-11-20-packages-links-keywords-issue.md)
- [NPM发布规范](../../../npm-release.md)

## 历史补充

### 元信息

- 当前阶段：扩展已切换线上 WXT 1.1.0，用户验收通过并批准本地提交
- 批准依据：用户要求“wxt-stable-output版本号1.1.0，npm用线上的；exts-ui版本号0.4.0，npm用本地仓库的；整理个issue出来”。此前已审定主页和关键词，本次一并纳入新版本准备。
- 规模：双包版本及消费配置准备；现有NPM暂存流程保持，不修改公共API或业务。

### 最终目标

| 包 | 包版本 | 扩展引用 | 来源 |
| --- | --- | --- | --- |
| @linguio/wxt-stable-output | 1.1.0 | 1.1.0 | npm官方registry正式包 |
| @linguio/exts-ui | 0.4.0 | workspace:0.4.0 | packages/exts-ui本地源码 |

### 已审定中文Changelog

exts-ui 0.4.0 · 分类“元数据”：

- 主页指向组件包源码目录，完善npm包访问入口。
- 关键词统一为shadcn-ui、ui、components。

wxt-stable-output 1.1.0 · 分类“元数据”：

- 主页指向工具包源码目录，统一npm包访问入口。
- 关键词统一为wxt、chrome、extension。
- 功能、API和依赖要求保持不变。

版本号按用户指定，不将展示字段变更描述为新增组件或功能。

### 历史后续事项

本工作项已完结。用户确认验收通过，未提供浏览器验收细节。
