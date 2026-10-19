# 配置 DMG 拖拽安装窗口：Commit 记录

## 对应 Issue

- [Issue](../issues/2026-10-20-desktop-dmg-installer-issue.md)

## 预期交付边界

以简洁的左右图标、箭头和说明配置 DMG 拖拽安装窗口；固定附件名、版本 1.2.0 和完整应用签名不变。

## 实际交付

- 恢复应用与“应用程序”拖放目标，移除未提交的 PKG 方案。
- 通过 AppKit 绘制简洁背景，由 Finder 将窗口大小、图标视图、图标位置与背景写入可写镜像，再压缩为最终 DMG。
- 布局未保存或配置失败时停止发布并保留旧包；推出失败时保留暂存镜像与挂载点以便诊断。
- 更新打包行为测试与安装说明，不添加视觉、像素或交互测试。

## 验证结果

- 更新的回归测试先失败，修复后相关 29 项逻辑测试通过。
- 使用已构建的 1.2.0 生产应用进行真实打包，AppKit 背景生成、Finder 配置写入、镜像推出、压缩与完整性校验通过。
- 最终镜像含应用、安装目标和已保存的背景及 Finder 配置，不含 PKG；包内应用严格签名校验通过。
- 已打开独立本地预览；未安装或启动应用。

## 未验证事项与限制

用户已确认本地窗口效果；代理未独立验证视觉、拖拽安装和 Photos 启动。远程 runner 的 Finder 会话及 GitHub 下载安全检查仍待验证；临时签名不提供公证信任。未推送或发布。

## 用户验收

本地窗口效果已通过：用户于 2026-10-20 明确表示“没问题，效果很好”，随后要求拆分 Commit。实际远程发布验证不在本地效果验收结论内。

## 最终提交批准

已批准：用户于 2026-10-20 审阅两笔范围与完整 Commit message 后明确要求“提交到本地”；同步 Issue、Commit 记录和工作台完成终态，不推送。

## 最终 Commit message

用户要求按以下两笔拆分本工作项；第一笔提交打包实现与相应测试，第二笔提交安装说明和本工作项终态。第一笔成功后仍不开始下一个 Issue，第二笔成功后才完成本工作项。

### 第一笔：打包实现

文件范围：scripts/release.mjs、apps/desktop/scripts/dmg-background.swift、apps/desktop/scripts/dmg-layout.applescript、tests/build-release.test.mjs。

```text
build(desktop): 配置 DMG 拖拽安装窗口

- 添加简洁背景、拖拽说明和固定图标窗口
- 保留完整应用签名并在窗口配置失败时停止发布
```

### 第二笔：说明与工作记录

文件范围：.github/workflows/exts-deploy.yml（仅 Release 安装说明）、apps/desktop/README.md、docs/build-release.md、docs/changes/README.md，以及本工作项 Issue 与 Commit 记录。

```text
docs(desktop): 同步 DMG 安装说明与验收记录

- 说明拖拽安装流程与 Finder 打包环境要求
- 记录本地验证结果、用户验收及远程验证限制
```
