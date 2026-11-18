# 建立 exts-ui 包并迁入完整 Toast 能力

## 元信息

- 工作项：2026-11-18-exts-ui-toast-package
- 状态：已完成
- 当前阶段：用户验收通过并批准本地提交，代码与文档分两笔完结，未推送或发布npm
- 批准依据：用户确认首版方案及Radix协作修复，最终明确表示“验收通过 commit”，批准代码与文档本地提交，不包含推送或npm发布。
- 规模：跨应用公共包及构建发布接入；一个首版交付，串行执行，不启动子代理。

## 背景与目标

应用ui目录混入项目Toast复制及环境适配，Toast与Sheet同层导致遮挡。建立可本地Workspace消费、可真实打包安装的首版组件包，以Toast验证基础与增强分层，不批量迁移其他增强组件。

## 范围

- 包名 `@linguio/exts-ui`，版本0.1.0独立维护；npm dist-tag为latest，不增加包专属Git tag或GitHub Release。包内CHANGELOG为包更新记录唯一来源，当前不上传npm。
- `ui/*` 固定来源shadcn基础组件，保持官方命名；`plus/toast`提供ExtsToaster、toast及公共声音能力。只引入Toast真正需要的基础依赖，ui不反向引用plus或应用。
- 提供ESM、类型、预编译CSS和明确主题契约；本地通过精确workspace引用，应用不扫描包源码生成其样式。所有构建、声明、tarball和验证fixture位于根dist。
- plus保留既有外观、类型、复制完整内容及关闭堆叠；公开Toast层级Token默认高于现有普通浮层，复制Tooltip处于对应上下文。提供Portal容器接入，保留Telegram Shadow DOM。
- 验收补充：用户已批准在plus Toast视口及复制Tooltip接入Radix官方DismissableLayer Branch，复用现有传递版本1.1.19作为直接依赖，并检查与项目Dialog使用同一模块；清理被替代的复制按钮传播拦截。不修改基础ui、Sheet或业务页面，真正外部点击仍走原关闭/放弃确认。
- 声音逻辑及错误音合成迁入包：默认关闭，仅error自动发声，1秒节流，关闭立即停止，重挂载/页面恢复不重播旧通知，试听及状态提供公开接入。Chrome设置与桥接留在应用，倒计时声音不迁移。
- Newtab/Studio及Telegram切换包入口，删除被替代的本地Toast/复制/通知声音实现，保留必要设置适配；迁移既有纯逻辑测试，不删除行为覆盖。
- 复用npm-release-tools与NPM Publish工作流，加入新包选择，声明串行验证入口；保留既有公开包发布能力，真实tgz验证公开入口、类型、CSS及独立消费构建。
- 更新根/应用规范与来源差异文档，记录基础层只允许导入/框架等明确必要适配，项目组合与业务不得混入。

## 排除项

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

## 关联文档

- [Commit记录](../commits/2026-11-18-exts-ui-toast-package-commit.md)
- [设计](../../superpowers/specs/2026-11-18-exts-ui-toast-package-design.md)
- [计划](../../superpowers/plans/2026-11-18-exts-ui-toast-package.md)
- [npm现有流程](../../npm-release.md)

## 唯一下一步

无；用户已验收通过并批准本地提交。未批准推送或npm发布，已有警告及未执行检查保留在Commit记录。
