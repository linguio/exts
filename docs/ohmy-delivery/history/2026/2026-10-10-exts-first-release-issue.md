---
date: "2026-10-10"
scope: repo
status: completed
type: task
---

# 建立扩展发布并验证首版打包

## 当前阶段

已完成。

## 目标与范围

### 背景

首版只发布统一扩展，官网替换另开后续 Issue。旧 OhMy DL workflow 已归档，根 release 强制构建三端，无法独立交付扩展。

### 目标

交付可独立运行的扩展构建与打包入口，建立 GitHub Actions，并最终获得 v1.0.0 Tag、首版 ZIP 和经过实际核实的公开下载地址。

### 范围

- 根发布脚本、命令、相应行为测试和构建规范。
- .github/workflows 下的手动扩展发布流程；版本只读取根 package.json。
- 先验证再创建指向实际构建提交的 v<版本> Tag 与 Release 草稿，上传 exts-chrome-<版本>.zip。
- 现有完整发布入口的附件名同步为 exts-chrome / exts-mac，不改变桌面构建行为。
- 用户验收与提交批准后推送、运行 Action；核实草稿包，公开首版并核实下载地址。

### 排除项

- 不修改扩展功能、图标、依赖版本、官网或桌面功能，不发布 DMG。
- 不发布 Chrome / Edge 商店，不改写已有 Tag，不覆盖正式 Release 附件。
- 不执行代理浏览器视觉和交互验收，不自动提交或推送。

## Todo

- [x] 增加独立扩展打包入口并覆盖真实 ZIP、版本校验及冲突保护。
- [x] 配置手动 Action，完成扩展检查、打包及 Tag / 草稿保护；远程行为由用户确认结项，本轮未重新核验。
- [x] 执行一次完整本地验证，记录 ZIP、结果和限制，交付用户验收。
- [x] 本地实现已提交；后续发布流程由用户确认已完结。
- [x] 用户确认首版发布工作项已完结；Action ZIP、Tag 和下载地址本轮未重新核验。

## 验收标准

- pnpm ext:release 在 Windows 本地及 Linux CI 只构建扩展；ZIP 根层包含 manifest.json，版本与根版本相同。
- 无效产物和同版本冲突拒绝发布；失败不覆盖已有文件。
- Action 测试、类型检查、构建和体积检查通过后才创建 Tag / 草稿。
- v1.0.0 指向实际构建提交；失败不报告正式发布成功，正式 Release 不允许覆盖。
- 用户下载 Action ZIP，解压加载到 Chrome / Edge；新标签页、书签、Dock、标签组行为符合现有功能。
- 公开后实际下载 exts-chrome-1.0.0.zip 成功；源码 ZIP 不作为扩展安装包。

## 唯一下一步

无。

## 交付记录

### 历史交付记录

#### 对应 Issue

- [Issue](2026-10-10-exts-first-release-issue.md)

#### 预期交付边界

独立扩展打包、手动 GitHub Actions、平台附件命名、必要行为测试与规范。官网和桌面功能不变。

#### 实际交付

- 增加 pnpm ext:release，Windows 本地与 Linux/macOS 独立构建、校验并打包 Chrome 扩展，拒绝覆盖同版本附件。
- 新增 main 分支手动发布 workflow；检查通过后创建指向构建提交的 Tag 和只含 Chrome ZIP 的 Release 草稿，禁止移动冲突 Tag 或覆盖已有 Release。
- 同步 exts-chrome / exts-mac 附件命名、根与扩展入口文档、必要打包行为测试；本次只生成 Chrome ZIP。

#### 验证结果

- 发布脚本测试 15/15，稳定发布工具测试 8/8，扩展测试 15/15，类型检查通过。
- pnpm ext:release 实际构建与 ZIP 校验成功：dist/release/exts-chrome-1.0.0.zip，223966 字节，根 Manifest 为 Exts / MV3 / 1.0.0。
- ZIP SHA256：6e58a44fc969e5377b89dd773cf728c3d45940295f89cb07d1c9be17f364d353。
- 体积预算通过：JS gzip 112316 字节、CSS gzip 4796 字节、字体 69652 字节，构建文件合计 509274 字节，无 source map。
- 构建首次通过但打包校验发现 Manifest 前导斜杠按磁盘根路径处理；修复为扩展根路径并增加真实 ZIP 回归覆盖，唯一修复重试成功。
- diff 空白检查通过；workflow 人工核对，尚未在 GitHub Runner 实际执行。
- pnpm install --frozen-lockfile 通过，锁文件未变；本次 11 个变更文件 UTF-8 校验通过。

#### 未验证事项与限制

实施阶段代理未验证 GitHub Actions 实际运行、Linux ZIP、远程 Tag、公开 Release 和下载地址，当时 GitHub CLI keyring 凭据失效。用户于 2026-10-10 明确确认本工作项已完结；本轮按用户确认结项，未重新核验上述远程结果或 Chrome/Edge 实际交互。未构建或发布 desktop，未验证 macOS DMG。

#### 可复现验收

1. 将 dist/release/exts-chrome-1.0.0.zip 解压到独立目录，确认 manifest.json 在该目录根层，版本为 1.0.0。
2. Chrome 打开 chrome://extensions（Edge 打开 edge://extensions），开启开发者模式，加载解压目录；显示 Exts 1.0.0，无资源缺失错误。
3. 新建标签页，确认书签与 Dock 正常显示，链接可打开；标签组入口按既有行为打开网页并创建标签组。空白处或 Esc 关闭菜单，不残留弹层。
4. 检查明暗主题及窗口缩放后的现有功能；没有 desktop 安装包、桌面启动或新增功能。
5. Action 运行后重复下载其草稿 ZIP 验收，核实 Tag 指向运行提交；公开后再核实真实附件下载地址。

#### 用户验收

本地阶段已通过：用户于 2026-10-10 在看到交付材料后明确要求本地提交，并确认使用一个 Commit。用户随后于 2026-10-10 明确确认整个工作项已完结，并要求同步结项状态。

#### 最终提交批准

本地实现提交已批准：使用已展示的 11 个文件范围和下列 message，同步验收、批准与当前阶段字段。发布实现已完成本地提交。用户随后明确批准把 Issue 和工作台同步为已完成，并创建下一工作项；本轮状态同步未执行新的 Git 提交。

#### 最终 Commit message

```text
build(exts): 建立 Chrome 扩展独立打包与首版发布流程

- 增加独立扩展打包和版本冲突保护
- 配置手动 Action 生成版本标签与发布草稿
- 统一平台附件命名并记录本地验证结果
```

## 关联文档

- [构建与分发规范](../../../build-release.md)

## 历史补充

### 元信息

- 用户批准：用户批准附件命名为 exts-chrome-<版本>.zip、exts-mac-<版本>.dmg，创建本 Issue 并开始构建、打包与首个 Tag 流程。
- 当前阶段：本地实现已提交；用户于 2026-10-10 明确确认本工作项已完结，并要求同步结项状态。远程结果以用户确认作为结项依据，本轮未重新核验。

### 历史后续事项

无；用户已确认本工作项完结，并批准同步状态后创建新的书签 Issue。
