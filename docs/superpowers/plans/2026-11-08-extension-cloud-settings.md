# 扩展账号设置实施计划

**目标：** Theme、Media Download 与 Clear History 由独立业务接口持久化；扩展仅保存绑定当前账号的副本供即时读取。

**依据：** [当前 Issue](../../changes/issues/2026-11-08-extension-cloud-settings-issue.md)；本计划不增加功能或验收范围。

**约束：** 串行实施；不开子代理；不在开发阶段进行浏览器视觉或交互验收；未获本地提交或部署批准前不执行这些操作。

## 影响边界

- `apps/api/migrations/0002_user_settings.sql`：每用户一行及字段约束。
- `apps/api/modules/settings/{schemas,repository,service,router}.py` 与 `app.py`：独立读取、更新，沿用公共认证与响应。
- `apps/extension/src/features/settings/{schema,store,background,index,theme}.ts`：账号副本、后台 API 读写和主题生效顺序。
- `apps/extension/src/features/history-cleaner`、`apps/extension/src/features/media-download`、`apps/extension/src/pages/settings`：权限、后台事件、Telegram 订阅及设置界面。
- `docs/api-conventions.md`、`apps/api/README.md` 和实际行为测试：契约与验证。

## 顺序

1. [x] 新增独立表迁移与 API 模型。读取无行返回默认值，更新单字段并返回完整设置；身份来自 JWT，不接收客户端用户 ID。验证认证、输入校验及单字段互不覆盖。
2. [x] 保留现有 `settings` 本地键的三个业务字段，加入 `userId`、移除 `version`；登录后线上读取并刷新当前账号副本，多个调用方共享请求，保存成功后才更新本地。验证账号隔离和失败不回写。
3. [x] 设置页在未登录时显示登录入口，已登录时按统一保存状态展示与提示；Theme 成功后生效，Clear History 权限请求仍在点击手势内完成。验证权限拒绝、401 和账号切换期间迟到响应。
4. [x] History Cleaner 启动与关窗事件只读取当前账号副本，另行刷新线上值；Telegram 使用相同副本与现有订阅。验证无副本不执行、同账号离线沿用、不同账号不沿用。
5. [x] 同步 API 契约及运行说明，按 `docs/verification.md` 选择必要的 API 和扩展逻辑检查；记录未做的真实浏览器与生产数据库验证，停在用户验收。

## 停止点

生产迁移只准备文件和只读预览，不应用真实库；不推送、不部署、不创建 Git Commit。浏览器视觉与交互由用户在开发稳定产物中验收。
