# exts 品牌图标

唯一正式源稿为 [exts.svg](./exts.svg)，使用用户于 2026-10-09 确认的参考风格细修与放大 v3。各平台共用同一主体，固定黑底白色，不随主题切换；平台只处理外层容器、留白和格式。

详细官方依据、品质要求、生成命令、工具版本与验收步骤维护在 [独立插头 Logo 规范](../../docs/exts-logo.md)。普通个性化图标使用独立的 [OhMy Icon System V3](../../docs/ohmy-icon-system.md)。

## 资源

| 场景 | 资源 |
| --- | --- |
| macOS 正式工程 | macos/exts.icon，同步到 apps/desktop/src/resources/exts.icon；最终圆角由 Apple 编译管线生成 |
| macOS 图层输入 | macos/composer-layers/foreground.svg，透明的同源主体 |
| 扩展 | extension/exts-16.png、exts-32.png、exts-48.png、exts-128.png，同步到扩展活动资源 |
| 网站 | website/exts.svg 及 16／32／180／192／512px PNG，同步到网站 public |
| 扩展界面 Logo | [轻量圆角矢量 SVG](../../apps/extension/src/assets/brand/exts.svg)，用于 Newtab 与 Studio；与应用 PNG 图标分开维护其已批准展示差异 |
| 参考与批准预览 | exts-approved-reference.png、previews 中的 v2 PNG，仅供对照，不作为第二源稿 |

## 生成与验收状态

唯一 SVG 提供主体输入，macOS 使用实际 Icon Composer 工程生成正式 PNG；[生成脚本](./scripts/generate-icons.mjs) 校验源稿与正式导出的哈希，再从正式 PNG 生成各尺寸图标和网站展示 SVG。网站展示 SVG 是位图封装，扩展界面已单独采用批准的轻量圆角矢量版；不以图层素材冒充工程，不覆盖该已批准差异。具体生成边界以 [Logo 规范](../../docs/exts-logo.md) 为准。

已完成配置与构建验证；用户于 2026-10-10 批准本地提交并要求结项。实际交付记录在 [已完成 Issue](../../docs/changes/issues/2026-10-09-repo-unify-platform-icons-issue.md)。
