# exts-ui首版实施计划

对应[Issue](../../ohmy-delivery/history/2026/2026-11-18-exts-ui-toast-package-issue.md)与[设计](../specs/2026-11-18-exts-ui-toast-package-design.md)。用户批准实施；串行、当前checkout、不自动提交。

1. 建立packages/exts-ui元数据、固定官方基础源码、JS/声明/CSS构建与公开exports；所有可配置产物指向根dist。
2. 在plus/toast组合原语并迁入复制与错误声音，提供Portal和层级Token。迁移既有纯逻辑测试，验证error节流、停止及不重播边界，不新增UI假DOM。
3. 扩展通过workspace精确引用包；统一替换Toast入口，设置只适配偏好，Telegram传容器与开关；移除被替代代码，倒计时不受影响。开发/正式命令先构建包，不建立长期后台进程。
4. 建立真实tarball消费者验证，核对导出、类型、CSS、包内容与单一React；消费构建不引用monorepo源码。复用现有npm准备/暂存工具，加入包选项和必要构建步骤，保留旧包规则。
5. 更新规范/来源及README/Changelog；按公共构建影响检查包、扩展、网站和发布工具，复用未失效结果。产物及浏览器验收步骤写入Commit记录，停在用户验收；平台/自动播放/远端CI未验证如实记录。

停止点：缺少固定官方来源无法还原、必须改变已确认外观/业务规则、引入新依赖版本或发布权限时先报告，不绕过批准。
