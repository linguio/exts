# 集中维护扩展 API

## 元信息

- 工作项：2026-11-08-extension-api-directory
- 状态：已完成
- 当前阶段：用户已验收并批准本地提交，代码与文档分别完结
- 已批准范围依据：用户批准统一使用 src/api 维护请求客户端与业务接口；随后批准将 Account 后台入口统一命名为 background.ts。
- 任务规模：小型目录整理，不改变公共 API、数据模型或权限。

## 背景与目标

现有共用请求位于 src/lib/api，Activity 与 Settings 的 HTTP 路径分散在后台模块。统一到 src/api，方便查找和维护全部业务 HTTP 接口。

## 范围与排除项

- 范围：统一 Account 后台文件命名并更新引用；迁移 client.ts/config.ts，集中 Activity 与 Settings HTTP 调用，调整引用、既有测试路径和现行文档。
- 排除项：不改变 HTTP 契约、鉴权、取消、设置保存或页面行为；不迁移 Chrome 消息通信、缓存、会话管理、OIDC 与第三方下载请求；不增加依赖或预建接口。

## Todo

- [x] 将 account-background.ts 改为 background.ts 并验证引用。

- [x] 迁移共用客户端并集中现有业务接口。
- [x] 更新引用、保留既有行为测试并同步现行文档。
- [x] 执行扩展测试、类型检查与构建，交付用户验收。

## 验收标准

- src/api 集中维护客户端、地址配置以及 Activity、Settings 接口，src/lib/api 不再保留重复实现。
- 页面与后台通信、会话检查和本地状态继续归所属 feature；接口地址、JSON 参数与响应处理保持原行为。
- 既有扩展逻辑测试、类型检查和构建通过；用户加载根 dist/build/chrome-mv3 验证 Activity 加载、设置保存与未登录默认行为。

## 关联文档

- [交付记录](../commits/2026-11-08-extension-api-directory-commit.md)

## 唯一下一步

无。本工作项已按用户批准完成本地提交，不推送或发布。
