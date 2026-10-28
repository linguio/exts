# 整合媒体下载模块与记录抽屉：交付记录

## 对应工作项

- [Issue](../issues/2026-10-27-extension-media-dl-issue.md)

## 实际交付

统一 media-download/tg-download/download 与 records，保留 TG 执行和网页菜单；records 持有列表与 Sheet，Dock 只提供入口。迁移 Settings version 2 与 mediaDownload 总开关，保留旧配置和记录，迁移原行为测试。

基础设置视图归 Newtab；分组、折叠、Toast 与 StatusIcon 属于独立设置 Issue。X／Helper 未接入，不修改桌面协议或归档。

## 验证与用户验收

拆分前最终工作树 76 项逻辑测试、类型检查、生产构建通过；既有 theme-init.js 提示不阻塞。用户明确验收通过，保存失败重启后恢复。代理未执行浏览器视觉／交互或 macOS 验证。

本次仅拆分既有成果，不重复验证中间暂存快照；以上验证对应完整交付。

## 文件边界

- 代码：三个扩展入口；原 TG／downloads／Newtab 记录迁入 media-download；Dock 下载入口；基础媒体设置视图与 Dock 设置引用；公共 settings schema/store、迁移测试与下载测试。
- 文档：本 Issue／记录、工作台、下载归属相关的应用 AGENTS、功能／UI／组件来源文档。
- 跨工作项文件按职责分段暂存；下载提交不引入尚未提交的 Settings 组件依赖，最终工作区代码不回退。

## 完整 Commit message

### 代码

```text
refactor(media-download): 整合媒体下载模块与记录抽屉

- 统一 Telegram 下载及公共记录目录
- 迁移记录抽屉并保留 Dock 一级入口
- 迁移媒体下载总开关并保留已有数据
```

### 文档

```text
docs(media-download): 完结媒体下载模块整合记录

- 记录模块边界与配置迁移结果
- 同步验证验收与后续设置工作项
```

## 最终提交批准

用户于 2026-10-28 明确要求两个 Issue 分别本地提交；先代码后文档。随文档提交将本 Issue／记录／工作台改为已完成，随后启动设置提交；不推送。

## 提交状态

已完成；代码与文档按用户批准依次本地提交，不推送。
