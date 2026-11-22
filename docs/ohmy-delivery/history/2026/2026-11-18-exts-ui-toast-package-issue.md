---
date: "2026-11-18"
scope: packages
status: completed
type: task
---

# 建立 exts-ui 包并迁入完整 Toast 能力

## 当前阶段

已完成。

## 目标与范围

### 背景与目标

应用ui目录混入项目Toast复制及环境适配，Toast与Sheet同层导致遮挡。建立可本地Workspace消费、可真实打包安装的首版组件包，以Toast验证基础与增强分层，不批量迁移其他增强组件。

### 范围

- 包名 `@linguio/exts-ui`，版本0.1.0独立维护；npm dist-tag为latest，不增加包专属Git tag或GitHub Release。包内CHANGELOG为包更新记录唯一来源，当前不上传npm。
- `ui/*` 固定来源shadcn基础组件，保持官方命名；`plus/toast`提供ExtsToaster、toast及公共声音能力。只引入Toast真正需要的基础依赖，ui不反向引用plus或应用。
- 提供ESM、类型、预编译CSS和明确主题契约；本地通过精确workspace引用，应用不扫描包源码生成其样式。所有构建、声明、tarball和验证fixture位于根dist。
- plus保留既有外观、类型、复制完整内容及关闭堆叠；公开Toast层级Token默认高于现有普通浮层，复制Tooltip处于对应上下文。提供Portal容器接入，保留Telegram Shadow DOM。
- 验收补充：用户已批准在plus Toast视口及复制Tooltip接入Radix官方DismissableLayer Branch，复用现有传递版本1.1.19作为直接依赖，并检查与项目Dialog使用同一模块；清理被替代的复制按钮传播拦截。不修改基础ui、Sheet或业务页面，真正外部点击仍走原关闭/放弃确认。
- 声音逻辑及错误音合成迁入包：默认关闭，仅error自动发声，1秒节流，关闭立即停止，重挂载/页面恢复不重播旧通知，试听及状态提供公开接入。Chrome设置与桥接留在应用，倒计时声音不迁移。
- Newtab/Studio及Telegram切换包入口，删除被替代的本地Toast/复制/通知声音实现，保留必要设置适配；迁移既有纯逻辑测试，不删除行为覆盖。
- 复用npm-release-tools与NPM Publish工作流，加入新包选择，声明串行验证入口；保留既有公开包发布能力，真实tgz验证公开入口、类型、CSS及独立消费构建。
- 更新根/应用规范与来源差异文档，记录基础层只允许导入/框架等明确必要适配，项目组合与业务不得混入。

### 排除项

- 不迁移其他plus组件，不批量重构应用基础组件，不重新设计外观或新增音效等级。
- 不修改业务接口、权限、产品版本或数据库，不升级已有依赖版本；新增包只复用现有精确工具与库版本。
- 不执行浏览器视觉、交互或听感验收，不新增假DOM或布局/焦点测试；这些由用户Chrome/Edge验收。
- 不自动提交、推送、修改外部Token/Secret、上传npm或批准正式发布。

## Todo

- [x] 建立独立包、官方基础及构建/样式/类型出口。
- [x] 迁入plus Toast复制、声音、层级与Portal，接入应用并移除旧实现；实际交互及听感待用户验收。
- [x] 迁移必要逻辑测试，验证本地Workspace与真实tgz外部消费者。
- [x] 接入现有npm暂存准备工作流，更新规范、来源、README及本包Changelog；远端未运行。
- [x] 串行完成包及受影响应用/发布工具检查，交付产物与浏览器验收步骤，停在用户验收。
- [x] 按用户验收反馈接入plus官方Branch并清理旧拦截，检查Workspace与tgz中的Radix上下文，重建产物；实际关闭/复制/焦点行为待复验。

## 验收标准

- 应用从 `@linguio/exts-ui/plus/toast` 导入，ui基础不依赖应用或plus，公开ui入口可独立导入。
- Sheet/AlertDialog打开时Toast可见，复制Tooltip与关闭/复制可用，不通过业务局部事件补丁解决层级。
- 复制、英文文案、类型与声音保持既有行为；关闭声音及error节流/页面恢复正确；Telegram依旧隔离主题与Portal，不读取MAIN中的Chrome设置。
- 新包0.1.0、latest及独立CHANGELOG明确；ESM/类型/CSS包清单完整，独立消费者无需仓库私有路径即可安装并构建。
- 现有NPM Publish允许选择两包且仍只暂存所选包，已有包验证与发布工具测试不回退；没有远端发布操作。
- 包与应用类型/构建及必要逻辑检查有实际结果；用户在Chrome/Edge加载根dist新产物验收层级、复制、声音和Telegram，自动化不代表用户验收通过。

## 唯一下一步

无。

## 交付记录

### 历史交付记录

#### 对应工作项

- [Issue](2026-11-18-exts-ui-toast-package-issue.md)

#### 预期交付边界

独立@linguio/exts-ui@0.1.0，ui基础与plus Toast分层，迁入复制/声音并修复层级，本地Workspace及真实tgz验证，复用npm暂存准备流程，不执行发布。

#### 实际交付

- 建立@linguio/exts-ui@0.1.0，独立package.json/CHANGELOG，publishConfig.tag=latest。本地精确workspace引用，应用统一导入plus/toast；ui/button、ui/tooltip、ui/toast保留固定官方基础与必要导入适配。
- ExtsToaster组合官方原语，承接完整标题/描述复制、Copy提示与反馈、官方类别展示、关闭/堆叠；plus通过--exts-z-toast默认80控制视口，复制Tooltip81，不修改应用Sheet/AlertDialog。
- 包按宿主持有错误音播放器，默认关闭、仅error、原频率/包络/响度、1秒节流、停止/恢复/试听规则保持。公开useExtsToastSound供Settings连接；应用notification-toaster仅读取偏好，Telegram传Shadow容器和布尔开关，倒计时仍用原播放器。
- 删除应用旧Toast/复制/通知声音实现，迁移3份6项既有纯逻辑测试到包，补充1项释放恢复不重播测试；原倒计时error预设已无调用并移除，不改变其余音色。
- 构建生成根dist/build/npm/exts-ui的ESM、声明、CSS及正式元数据；CSS有公开类型声明、预编译工具类与宿主主题契约，保留MIT及shadcn第三方许可。Workspace逻辑使用源码，CSS消费编译产物；扩展原dev/build命令先构建包，样式改动需手动重建包，不新增watch进程。
- 现有NPM Publish增加新包选项；npm-release-tools新增受限编译目录接入，核对真实路径、包身份和版本，旧源码包默认逻辑不变。新增编译目录/身份回归测试，不创建第二套发布机制。
- 根及扩展规范、npm与构建说明、Toast层级及来源差异记录同步；其他增强组件不在本次迁移范围。
- 验收反馈修正：Toast视口及复制Tooltip在plus层组合官方Radix DismissableLayer Branch，直接引用已有1.1.19精确版本；清理复制按钮旧stopPropagation，不改基础UI、项目Sheet或业务外部点击处理。共享该Radix模块的浮层都将Toast识别为允许交互区，不再由关闭Toast触发Sheet外部关闭。

#### 验证与限制

- `pnpm install --no-frozen-lockfile` 安装新增Workspace，复用全部既有精确依赖；随后 `pnpm install --frozen-lockfile` 通过。pnpm-lock只增加Workspace引用及新包importer，未升级旧依赖。环境Node24.16.0、pnpm12.21.0。
- `pnpm --filter @linguio/exts-ui typecheck`、`test`、`build`：通过；3个测试文件7项。原6项覆盖随迁移保留，新增宿主恢复不重播覆盖。
- `pnpm --filter @exts/extension typecheck`、`test`、`pnpm ext:build`：通过，43个文件181项；原6项已迁至包，不是删除覆盖。Newtab和Telegram正式产物位于dist/build/chrome-mv3。
- `pnpm --filter @exts/website typecheck`、`pnpm web:build`：通过，未把官网接入Toast或修改其业务。
- 根构建/扩展打包/Release说明、官网纯逻辑及npm发布工具串行Node测试：56项通过；包含新增的编译目录/包身份边界及旧源码包回归。`pnpm --filter @linguio/wxt-stable-output test`：10项通过。测试中的暂存输出为mock，不是实际上传。
- `pnpm --filter @linguio/exts-ui verify:package` 最终通过：真正打包tgz、在独立消费者npm安装，不链接仓库源码，类型检查、无Tailwind消费者Vite构建、公开ESM入口、基础/plus共享管理器及单一React实例均通过。
- 最终复用现有工具执行 `node packages/npm-release-tools/publish.mjs prepare @linguio/exts-ui`：通过，完整串行调用verify:npm并从编译目录打包，生成release.json校验凭据；不stage、不发布。
- 当前准备产物目录：`dist/.cache/npm-release/exts-ui-45208618-99dd-4670-b3e6-a585d88c6731`，包含 `linguio-exts-ui-0.1.0.tgz` 与release.json。独立消费者保留在 `dist/.cache/exts-ui-verify/c4677348-7fb6-49c2-a5a1-9cc7c274da02`，验证tarball与准备tarball SHA-512一致。旧首次准备目录保留但不再用于修正验收；没有启动浏览器或长期服务。
- Branch修正后重新完成包及扩展类型、包7项与扩展181项逻辑测试、扩展正式构建、本地prepare。Workspace模块路径检查以及独立tgz新增Radix上下文一致性检查通过，React单实例和管理器检查仍通过；其余未变化的官网/发布工具/既有包结果复用。
- 实施中修复了严格元组推导、独立消费者发现的CSS入口声明缺失；最后单React探针曾误用CommonJS解析仅ESM出口，修正为import.meta.resolve后完整流程重试通过，没有为测试增加require出口。
- 保留扩展theme-init非module及大chunk警告。独立消费构建曾提示第三方use client指令警告，属于Vite客户端场景；不据此声称支持Next/RSC。pnpm peers check报告官网原有better-fetch1.3.2与1.3.3要求差异，锁文件既有依赖未变，本次不升级或修复。
- npm只读查询及本地prepare版本查询返回404，确认当前包尚未发布；验证阶段只运行本地prepare，没有stage、发布批准、推送或远端Actions，本地提交随后按最终批准执行。macOS原生/远端CI及代理浏览器层级/复制/Modal交互、声音与自动播放恢复、Telegram联调均未执行；用户后续已明确验收通过，不据此虚构代理验证结果。

#### 用户验收

2026-11-18用户明确表示“验收通过 commit”，确认当前交付验收通过并批准本地提交。浏览器具体操作未逐项提供，不据此声称代理执行过交互验收；以下保留可复现步骤。

1. Chrome/Edge扩展管理页重新加载根 `dist/build/chrome-mv3`，打开Home；或按原 `pnpm ext:dev` 用法启动，浏览器仅加载 `dist/dev/chrome-mv3-dev-stable`，不加载缓存目录。
2. 已登录点击Actions → Edit Daily，保持Sheet打开，不修改记录直接Save，触发现有“No changes to save.” error Toast；确认在Sheet上方可见，Copy Tooltip也可见、复制完整文案、反馈Check及关闭可用，不能因层级可见就认定交互通过。
   - 关闭Toast、点击正文或复制后Sheet保持打开；已有修改时操作Toast不得触发放弃确认，真正点击Sheet外部仍按原规则确认。复验Tooltip、键盘和滑动关闭，不将公共Branch路径检查当作已验收。
3. 提示存续期间检查Dialog/AlertDialog遮罩场景，确认未被普通模态层遮挡；提示到期按官方规则关闭是正常行为。必要时通过现有设置失败触发提示，不为验收修改业务源码。
4. Settings → Notification sounds：默认关闭、Preview仍可试听；开启后error发声，其余类型静音；快速错误不叠加，关闭立即停止。刷新/切回页面不重播旧提示，暂停/不可用状态反馈保留；试听与倒计时互不停止。
5. 在既有Telegram页面刷新扩展注入入口，检查菜单和Toast主题隔离、复制提示、保存完成提示及声音开关传递；MAIN仍不读取Chrome设置。真实下载由用户操作，代理未执行。
6. 独立消费者及tgz保留在上面目录，可检查node_modules内包的ui/plus入口、ESM/类型/CSS及许可文件；自动化已验证安装与构建，若需运行页面由用户自行启动浏览器环境。

#### 提交方案

##### 代码提交

- 新包：packages/exts-ui的package.json、tsconfig.json、vite.styles.config.ts、styles.css、src、scripts、tests，以及LICENSE与THIRD_PARTY_NOTICES.md许可资源。
- 应用：apps/extension/package.json及本工作项src/tests变更，包含Toast入口迁移、Settings适配、Telegram样式/Portal、旧Toast/声音文件及对应测试迁移。
- 发布接入：packages/npm-release-tools/publish.mjs及tests/publish.test.mjs、.github/workflows/npm-packages-publish.yml、pnpm-lock.yaml。
- 摘要：建立独立公共包，迁入Toast完整能力并修复层级及Radix分支协作，保留既有业务与发布机制。稳定开发目录EPERM只做排查，没有修改稳定产物工具。

```text
feat(exts-ui): 建立公共组件包并接入 Toast 增强能力

- 建立 ui 与 plus 分层及独立构建、样式和类型入口
- 迁移 Toast 复制与声音并修复 Radix 浮层协作
- 接入 Workspace 和既有 npm 暂存发布流程
```

##### 文档提交

- AGENTS.md、apps/extension/AGENTS.md、docs/build-release.md、docs/npm-release.md、docs/extension/ui.md、docs/web-ui-sources.md。
- packages/exts-ui/README.md、CHANGELOG.md、SOURCES.md。
- 本工作项Issue、Commit记录、Spec、Plan及docs/ohmy-delivery/README.md工作台。
- 机械性终态：用户验收通过，最终提交批准已批准，Issue/工作台已完成，当前Issue清空，唯一下一步无。未执行的检查及已有警告保留，不把npm包写成已发布。

```text
docs(repo): 记录 exts-ui 首版交付与验收

- 明确公共组件分层及独立包版本发布约定
- 记录验证限制与用户验收并完结工作项
```

#### 最终提交批准

已批准。2026-11-18用户明确要求“验收通过 commit”，批准以上代码、文档两笔本地提交及列明的机械性终态更新；不包含推送、stage或npm正式发布。

## 关联文档

- [设计](../../../superpowers/specs/2026-11-18-exts-ui-toast-package-design.md)
- [计划](../../../superpowers/plans/2026-11-18-exts-ui-toast-package.md)
- [npm现有流程](../../../npm-release.md)

## 历史补充

### 元信息

- 当前阶段：用户验收通过并批准本地提交，代码与文档分两笔完结，未推送或发布npm
- 批准依据：用户确认首版方案及Radix协作修复，最终明确表示“验收通过 commit”，批准代码与文档本地提交，不包含推送或npm发布。
- 规模：跨应用公共包及构建发布接入；一个首版交付，串行执行，不启动子代理。

### 历史后续事项

无；用户已验收通过并批准本地提交。未批准推送或npm发布，已有警告及未执行检查保留在Commit记录。
