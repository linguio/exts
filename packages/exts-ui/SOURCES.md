# 基础来源及本地差异

- shadcn/ui，MIT。Toast为2026-11-17 Base Nova官方注册表快照，源码SHA-256 `6d85d6762db4d66461a06db4f531a606357a2d8a554f1f094cda4662db7e85bf`，2026-11-18重新取得并确认哈希相同。
- Button/Tooltip为固定提交 `c257f688cf4de7ec10cc1be84cad29cd4631182c` 的 `apps/v4/registry/new-york-v4/ui`；原始SHA-256分别为 `79dd6f75f8136394442202d6b8b922fb269eaad0a5dba579397c9d5b41f893bb`、`611e4305879b2773eafe76bf3c5caa69d8e47367fd97887a71634a27828f4433`。
- ui必要适配仅移除Next客户端指令、cn/Button本地导入、官方IconPlaceholder按其lucide声明静态替换及中文来源注释；不添加应用/plus依赖或项目行为。
- plus承接项目复制按钮、既有Tooltip反馈、错误音参数、节流/页面生命周期、可配置Portal及层级；应用主题通过CSS契约继承，未声称与shadcn官网默认主题视觉一致。
- 依赖维持现有精确版本。普通Button和Tooltip的其他应用定制留在应用，本次不批量迁移。
