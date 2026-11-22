---
date: "2026-11-19"
scope: website
status: completed
type: task
---

# 在官网产品介绍补充 exts-ui

## 当前阶段

已完成。

## 目标与范围

### 背景与目标

exts-ui已建立npm包，官网产品介绍Packages目前只列WXT稳定产物工具。补齐简短介绍、安装命令、npm与源码链接，让访客能发现该公共组件包。

### 范围与排除项

- 在既有productCategories的Packages.modules添加exts-ui，沿用现有模块结构与渲染，不新建组件或修改样式。
- 介绍定位为基于shadcn/ui的React公共组件库，提供基础与通用增强能力；提供npm及源码链接，按用户最新要求，安装命令与WXT模块同格式，不带版本号。
- 不修改其他分类、WXT现有内容、根/包版本、Changelog、依赖或发布流程；不自动commit/push/部署。

## Todo

- [x] 补充Packages数据项、简短介绍及有效入口。
- [x] 执行官网类型检查与构建，不增加数据镜像测试或运行扩展测试。
- [x] 记录结果，提供/features/#packages验收步骤并停在用户验收。

## 验收标准

- Packages保留WXT工具模块并展示exts-ui介绍，样式、导航和安装命令展示复用原结构。
- npm链接为https://www.npmjs.com/package/@linguio/exts-ui，源码指向仓库packages/exts-ui；安装命令不带版本号，格式与WXT模块一致。
- 官网类型/构建通过，用户确认实际展示及链接；本地通过不等于线上已部署。

## 唯一下一步

无。

## 交付记录

### 实际结果与验收

- 按用户反馈，模块标题为“Exts UI 公共组件库”，与“WXT 稳定构建产物工具”使用名称加用途的描述方式；安装命令不带-D，因为组件属于应用运行时依赖，WXT工具属于开发依赖。
- registry只读确认exts-ui latest=0.2.0，新增安装命令pnpm add @linguio/exts-ui及npm/源码入口。
- 仅修改categories.ts的Packages.modules数据，保留原WXT模块，未新增组件或修改样式。
- 官网typecheck与web:build通过，产物dist/build/exts-web。纯内容补充不运行扩展181项或整仓测试，无新增数据镜像测试。
- 用户通过既有官网本地预览打开/features/#packages，确认WXT模块与exts-ui模块都在，简介与安装命令正确，两个链接分别指向npm和源码。布局与点击由用户验收，代理未执行浏览器验证。
- 线上页面读取受限；本次未提交、推送或部署，不把本地构建通过称为线上已更新。

### 历史交付记录

#### 对应工作项

- [Issue](2026-11-19-website-exts-ui-package-issue.md)

#### 预期交付边界

仅补充官网Packages数据与入口，复用现有组件，不升级依赖或版本，不自动部署。

#### 实际交付

- 按用户反馈统一标题为“Exts UI 公共组件库”，与WXT模块的名称加用途风格一致；组件运行时依赖使用pnpm add，不加-D。
categories.ts的Packages.modules新增exts-ui简介、不带版本号的安装命令和npm/源码链接，原WXT内容保留，复用现有渲染组件，无布局、样式、版本或依赖变化。

#### 验证与限制

registry只读确认公开latest=0.2.0；pnpm --filter @exts/website typecheck及pnpm web:build通过，产物dist/build/exts-web。未运行无关扩展/全仓测试或新增数据镜像测试。线上页面读取受限，视觉及链接点击由用户验收，未启动浏览器或开发服务，未部署。

#### 用户验收

2026-11-19用户明确“验收通过 push”，确认模块标题、无版本号/无-D安装命令及链接，批准官网内容与文档两笔提交。线上尚未更新。

#### 提交方案

代码范围：apps/website/src/shared/products/categories.ts。

```text
feat(website): 在产品介绍中补充exts-ui包入口

- 添加公共组件库简介与安装命令
- 沿用Packages模块展示npm与源码链接
```

文档范围：本Issue、本记录及docs/ohmy-delivery/README.md。

```text
docs(website): 记录exts-ui产品介绍补充与验证

- 记录内容范围、官网类型和构建结果
- 提供Packages入口验收步骤及未部署状态
```

按用户批准分别提交上述代码与文档，Issue、工作台和本记录同步验收、提交批准及完成状态。版本提交f3c2010并非本工作项创建，未经确认不一并推送或重写历史。

#### 最终提交批准

已批准：2026-11-19用户“验收通过 push”。官网两笔本地提交按展示范围执行，复用已有验证；推送前发现main上额外既有f3c2010将exts-ui从0.2.0升为0.3.0、wxt-stable-output从1.0.2升为1.0.3，远端main仍为40f7cd6。它会随普通push触发双包自动暂存，需用户确认是否包含该额外范围。当前未推送，未部署，不撤销或重写该既有提交。

## 关联文档

无独立关联文档。

## 历史补充

### 元信息

- 当前阶段：用户验收通过并批准代码/文档提交及push；本地提交完结，额外已有版本提交待确认是否一并推送
- 批准依据：用户指出官网/features/#packages未补充exts-ui npm入口。
- 规模：小型产品内容补充，复用现有模块渲染。

### 历史后续事项

确认是否随本次推送携带main上既有f3c2010版本提交（exts-ui 0.3.0、wxt-stable-output 1.0.3）；当前仅官网交付已验收并本地提交，不自动推送额外范围。
