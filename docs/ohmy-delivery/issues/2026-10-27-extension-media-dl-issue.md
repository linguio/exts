# 整合媒体下载模块与记录抽屉

## 元信息

- 工作项：2026-10-27-extension-media-dl
- 状态：已完成
- 当前阶段：用户验收通过，按用户要求从设置改造中独立拆出并本地提交。
- 批准依据：用户批准实施并确认没有问题，随后要求拆为「下载模块」「setting 模块（全局 statusIcon）」两个 Issue，分别提交。
- 任务规模：中型，整合现有下载的目录、记录与配置边界。

## 背景与目标

将原 tg-download、downloads 及 Newtab 下载列表整合为 media-download 模块，保留 TG 行为与数据，Dock 只提供一级入口。设置展示和全局状态反馈属于独立设置 Issue。

## 范围

- 统一 media-download/tg-download/download，保留网页菜单、流式保存、目录授权和文件命名行为。
- records 持有公共记录、后台写入、列表与 Media Download Sheet，复用现有官方 Sheet。
- 公共 Settings 格式升级为 version 2，将旧 TG 开关迁为 mediaDownload 总开关，保留旧选择、主题、历史清理及 downloads 记录。
- 提供配置读写／订阅，基础设置视图归 Newtab；关闭仅屏蔽新任务，进行中下载继续。
- 同步扩展入口及原有行为测试。

## 排除项

- Settings 分组、折叠、Toast 和 StatusIcon，由关联的设置 Issue 交付。
- 不接入 X／Helper，不预建空目录，不修改桌面协议或删除归档，不增加恢复／重试／补发。
- 不改活动卡片，不推送远端。

## Todo

- [x] 迁移下载源码、入口及原有行为测试。
- [x] 将记录列表与 Sheet 归入 records，保留 Dock 入口。
- [x] 迁移总开关并验证数据保留。
- [x] 记录验证与用户验收，按独立工作项准备提交。

## 验收标准与结果

- 原 TG 保存、成功记录、筛选与清空保持；Dock 打开 Media Download，旧数据不重置。
- 关闭总开关只屏蔽新任务，进行中保存继续。
- 用户于 2026-10-28 明确「我已经看完没问题了」；此前保存失败重启后恢复，未猜测修改业务。
- 拆分前最终工作树 76 项逻辑测试、类型检查、生产构建通过；既有 theme-init.js 提示未阻塞。
- 本次仅拆分提交，不重复测试中间暂存快照，验证结果对应完整交付。浏览器由用户验收，代理未进行视觉／交互或 macOS 验证。
- 产物为 dist/build/chrome-mv3；重载后刷新 TG 页面，检查下载、记录、Dock 抽屉及进行中关闭开关。

## 关联文档

- [Commit 记录](../commits/2026-10-27-extension-media-dl-commit.md)
- [设置独立工作项](./2026-10-28-extension-settings-ui-issue.md)
- [工作台](../README.md)

## 唯一下一步

本工作项完成；后续按已批准的独立设置 Issue 提交，不接入 X／Helper。
