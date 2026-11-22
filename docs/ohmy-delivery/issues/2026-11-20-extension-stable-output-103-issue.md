# 准备公共包新版本并统一消费来源

## 元信息

- 工作项：2026-11-20-extension-stable-output-103（沿用当前Issue及配套记录，标识保留历史来源）
- 状态：已完成
- 当前阶段：扩展已切换线上 WXT 1.1.0，用户验收通过并批准本地提交
- 批准依据：用户要求“wxt-stable-output版本号1.1.0，npm用线上的；exts-ui版本号0.4.0，npm用本地仓库的；整理个issue出来”。此前已审定主页和关键词，本次一并纳入新版本准备。
- 规模：双包版本及消费配置准备；现有NPM暂存流程保持，不修改公共API或业务。

## 背景与目标

仓库包版本目前为WXT工具1.0.3、UI 0.3.0。此前未提交的扩展消费升级已安装线上1.0.3，UI仍为workspace:0.3.0。用户现改为准备WXT 1.1.0与UI 0.4.0，并要求扩展最终使用线上WXT、本地UI。

2026-11-20只读查询registry：@linguio/wxt-stable-output@1.1.0返回404，尚不能直接安装；需先完成包准备及用户手动批准npm正式发布。已完成的1.0.3检查只对应原输入，不代替新目标验证。

## 最终目标

| 包 | 包版本 | 扩展引用 | 来源 |
| --- | --- | --- | --- |
| @linguio/wxt-stable-output | 1.1.0 | 1.1.0 | npm官方registry正式包 |
| @linguio/exts-ui | 0.4.0 | workspace:0.4.0 | packages/exts-ui本地源码 |

## 范围与排除项

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

## 已审定中文Changelog

exts-ui 0.4.0 · 分类“元数据”：

- 主页指向组件包源码目录，完善npm包访问入口。
- 关键词统一为shadcn-ui、ui、components。

wxt-stable-output 1.1.0 · 分类“元数据”：

- 主页指向工具包源码目录，统一npm包访问入口。
- 关键词统一为wxt、chrome、extension。
- 功能、API和依赖要求保持不变。

版本号按用户指定，不将展示字段变更描述为新增组件或功能。

## 验收标准

- 两包实际元数据/编译tarball包含各自主页与精简关键词，正确Git仓库和目录信息保留。
- 扩展精确引用与锁文件一致；最终WXT实际路径为npm registry 1.1.0，UI实际路径为packages/exts-ui 0.4.0。
- WXT尚未公开时不提交会导致安装失败的1.1.0依赖；保留已验证可用的中间消费状态，清楚标注目标尚未完成。
- 安装（含frozen-lockfile）、直接受影响的工具/包检查和扩展构建通过；不因仅改元数据就省略必要发布验证，也不把旧1.0.3结果冒充1.1.0验证。
- 用户重启ext:dev后仍在既有稳定目录正常加载与更新；浏览器和macOS实机未执行的检查如实记录。npm正式版本与暂存成功分开验证。

## 发布前准备结果与阶段验收

- 两包package.json已为1.1.0/0.4.0，主页与精简关键词写入，repository的Git URL及directory保持；中文Changelog按审定草稿新增元数据条目。README与根产品2.5.0不变。
- 扩展为workspace:0.4.0与线上WXT 1.0.3，锁文件一致，安装及frozen-lockfile通过；发布年龄例外仅已消费的精确1.0.3，无宽泛规则。
- 本轮exts-ui verify:npm通过：7项、类型、ESM/CSS、真实tarball独立消费者；fixture为dist/.cache/exts-ui-verify/c3ae6602-6e64-44ff-b2dc-4d09bc700686。
- 本轮WXT verify:npm通过：10项、类型、真实tarball及首次/增量/失败保留/恢复/重启；fixture为dist/.cache/npm-verify/wxt-stable-output-2AedsS。扩展typecheck与ext:build通过，产物dist/build/chrome-mv3。
- 直接读取两份真实tarball独立安装后的package.json，版本、主页、关键词及Git目录均与目标一致。未只核对源码字段。必要覆盖沿用已有声音/消息/工具恢复及打包消费者检查，无新增数据镜像测试或无关181项业务测试。
- registry复核0.4.0、1.1.0均为404，未上传或发布。最终线上1.1.0消费步骤未完成，不能把中间状态当最终目标已实现。
- 既有peer提示、theme-init非module与大chunk提示保留；无浏览器或macOS实机验收，不声称通过。未提交、推送或部署。

阶段验收：审阅两包版本、中文Changelog及实际package.json主页/关键词；确认扩展UI引用与锁文件均为workspace:0.4.0。需要检查扩展时加载dist/build/chrome-mv3，或重启ext:dev使用原dist/dev/chrome-mv3-dev-stable，验证UI和既有稳定目录行为。npm主页及Keywords当前不会随本地改动立即更新，等待获准上传并由用户批准正式发布。

## 关联文档

- [Commit记录](../commits/2026-11-20-extension-stable-output-103-commit.md)
- [已并入的主页与关键词记录](2026-11-20-packages-links-keywords-issue.md)
- [NPM发布规范](../../npm-release.md)

## 唯一下一步

本工作项已完结。用户确认验收通过，未提供浏览器验收细节。
