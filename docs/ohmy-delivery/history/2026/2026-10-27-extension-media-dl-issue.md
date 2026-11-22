---
date: "2026-10-27"
scope: extension
status: completed
type: task
---

# 整合媒体下载模块与记录抽屉

## 当前阶段

已完成。

## 目标与范围

### 背景与目标

将原 tg-download、downloads 及 Newtab 下载列表整合为 media-download 模块，保留 TG 行为与数据，Dock 只提供一级入口。设置展示和全局状态反馈属于独立设置 Issue。

### 范围

- 统一 media-download/tg-download/download，保留网页菜单、流式保存、目录授权和文件命名行为。
- records 持有公共记录、后台写入、列表与 Media Download Sheet，复用现有官方 Sheet。
- 公共 Settings 格式升级为 version 2，将旧 TG 开关迁为 mediaDownload 总开关，保留旧选择、主题、历史清理及 downloads 记录。
- 提供配置读写／订阅，基础设置视图归 Newtab；关闭仅屏蔽新任务，进行中下载继续。
- 同步扩展入口及原有行为测试。

### 排除项

- Settings 分组、折叠、Toast 和 StatusIcon，由关联的设置 Issue 交付。
- 不接入 X／Helper，不预建空目录，不修改桌面协议或删除归档，不增加恢复／重试／补发。
- 不改活动卡片，不推送远端。

## Todo

- [x] 迁移下载源码、入口及原有行为测试。
- [x] 将记录列表与 Sheet 归入 records，保留 Dock 入口。
- [x] 迁移总开关并验证数据保留。
- [x] 记录验证与用户验收，按独立工作项准备提交。

## 验收标准

### 验收标准与结果

- 原 TG 保存、成功记录、筛选与清空保持；Dock 打开 Media Download，旧数据不重置。
- 关闭总开关只屏蔽新任务，进行中保存继续。
- 用户于 2026-10-28 明确「我已经看完没问题了」；此前保存失败重启后恢复，未猜测修改业务。
- 拆分前最终工作树 76 项逻辑测试、类型检查、生产构建通过；既有 theme-init.js 提示未阻塞。
- 本次仅拆分提交，不重复测试中间暂存快照，验证结果对应完整交付。浏览器由用户验收，代理未进行视觉／交互或 macOS 验证。
- 产物为 dist/build/chrome-mv3；重载后刷新 TG 页面，检查下载、记录、Dock 抽屉及进行中关闭开关。

## 唯一下一步

无。

## 交付记录

### 历史交付记录

#### 对应工作项

- [Issue](2026-10-27-extension-media-dl-issue.md)

#### 实际交付

统一 media-download/tg-download/download 与 records，保留 TG 执行和网页菜单；records 持有列表与 Sheet，Dock 只提供入口。迁移 Settings version 2 与 mediaDownload 总开关，保留旧配置和记录，迁移原行为测试。

基础设置视图归 Newtab；分组、折叠、Toast 与 StatusIcon 属于独立设置 Issue。X／Helper 未接入，不修改桌面协议或归档。

#### 验证与用户验收

拆分前最终工作树 76 项逻辑测试、类型检查、生产构建通过；既有 theme-init.js 提示不阻塞。用户明确验收通过，保存失败重启后恢复。代理未执行浏览器视觉／交互或 macOS 验证。

本次仅拆分既有成果，不重复验证中间暂存快照；以上验证对应完整交付。

#### 文件边界

- 代码：三个扩展入口；原 TG／downloads／Newtab 记录迁入 media-download；Dock 下载入口；基础媒体设置视图与 Dock 设置引用；公共 settings schema/store、迁移测试与下载测试。
- 文档：本 Issue／记录、工作台、下载归属相关的应用 AGENTS、功能／UI／组件来源文档。
- 跨工作项文件按职责分段暂存；下载提交不引入尚未提交的 Settings 组件依赖，最终工作区代码不回退。

#### 完整 Commit message

##### 代码

```text
refactor(media-download): 整合媒体下载模块与记录抽屉

- 统一 Telegram 下载及公共记录目录
- 迁移记录抽屉并保留 Dock 一级入口
- 迁移媒体下载总开关并保留已有数据
```

##### 文档

```text
docs(media-download): 完结媒体下载模块整合记录

- 记录模块边界与配置迁移结果
- 同步验证验收与后续设置工作项
```

#### 最终提交批准

用户于 2026-10-28 明确要求两个 Issue 分别本地提交；先代码后文档。随文档提交将本 Issue／记录／工作台改为已完成，随后启动设置提交；不推送。

#### 提交状态

已完成；代码与文档按用户批准依次本地提交，不推送。

## 关联文档

- [设置独立工作项](2026-10-28-extension-settings-ui-issue.md)
- [工作台](../../readme.md)

## 历史补充

### 元信息

- 当前阶段：用户验收通过，按用户要求从设置改造中独立拆出并本地提交。
- 批准依据：用户批准实施并确认没有问题，随后要求拆为「下载模块」「setting 模块（全局 statusIcon）」两个 Issue，分别提交。
- 任务规模：中型，整合现有下载的目录、记录与配置边界。

### 历史后续事项

本工作项完成；后续按已批准的独立设置 Issue 提交，不接入 X／Helper。
