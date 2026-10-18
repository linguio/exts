# desktop 专属规范

遵守根 AGENTS.md。统一产品名和工程名为 exts；正式 Bundle Identifier 为 `dev.linguio.exts`，开发为 `dev.linguio.exts.dev`，Organization Identifier 为 `dev.linguio`。

- src/app 只负责应用生命周期和模块组合；设备媒体业务位于 src/modules/media。
- 只将实际跨模块复用的能力放入 shared，不建未来功能占位或抽象层。
- 测试按 tests/modules 与 tests/scripts 组织，不执行视觉、布局或交互自动化验收。
- 默认下载按用户批准的 `~/Downloads/Exts Downloads/<功能名>/` 规则组织；Photos 的开发与正式版共用 `Photos` 子目录，不清理或迁移历史下载文件。缓存保留原有身份隔离：正式为 OhMy Photos，开发为 Exts Dev。配置身份由 project.yml 维护，工程通过 XcodeGen 生成。
- 产品版本只从根 package.json 的 version 获取，经根 scripts/version.mjs 校验；不维护独立桌面版本。应用输出到根 dist/dev/exts-dev.app 或 dist/build/exts.app。
- 图标派生自根 assets/brand 的唯一源稿，不自行重绘。
- UI 选型遵循根 AGENTS 的原生优先原则：尽可能使用 SwiftUI／平台原生组件与材质；与官网、Extension 共享品牌和基础原则，不套用 shadcn 或 Web 样式参数。
