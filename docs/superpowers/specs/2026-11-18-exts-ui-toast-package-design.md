# exts-ui首版Toast设计

- 对应[Issue](../../ohmy-delivery/history/2026/2026-11-18-exts-ui-toast-package-issue.md)，方案已由用户确认并批准实施。
- ui层只保留固定来源shadcn源码及导入/客户端框架适配；plus层组合基础原语，Exts前缀只用于公共增强React组件，业务仍在应用。首版只迁入Toast所需基础组件，不升级基线。
- 正式入口为 `@linguio/exts-ui/ui/toast`、`ui/button` 等必要基础入口，以及 `@linguio/exts-ui/plus/toast`、`styles.css`。公开类型与ESM一同构建，React保持peer防止多实例；依赖使用现有精确版本。
- plus导出统一toast管理器与ExtsToaster，声音按每个展示宿主持有播放器，应用传soundEnabled；应用设置页通过公开试听/状态能力接入同一宿主，不让设置或Chrome API进入包。
- 默认只error自动发声，保留错误音参数及节流/恢复规则。音频合成仅迁入Toast需要部分，倒计时及其播放器留在应用，不复制共享通知策略。
- plus通过统一CSS Token控制Toast视口层级，高于当前Sheet50/AlertDialog70；不宣称能覆盖浏览器原生top layer或任意宿主高层级。Portal容器允许Shadow DOM；复制Tooltip与Toast共享可控浮层上下文。
- 样式预编译，提供默认主题变量及宿主覆盖契约，不把全局reset强加给消费者，不要求Tailwind扫描源码。默认主题与现有应用视觉兼容，字体继承。
- 包构建/声明/打包/fixture在根dist，不在源码包内生成dist。公开路径保持一致：Workspace从源码出口消费TS方便逻辑联调，样式入口指向根dist预编译CSS；真正tarball从编译ESM/声明/CSS出口消费，独立安装验证防止源码依赖泄漏。应用dev/build命令先构建包；包内样式变更后手动build更新，不新启长期watch。
- 版本唯一来源为包package.json，0.1.0与latest已批准，CHANGELOG仅记录实际交付。复用现有npmRelease.verify及prepare/stage流程，只新增包选项及必要构建接入；暂不上传或创建Git tag/Release。
