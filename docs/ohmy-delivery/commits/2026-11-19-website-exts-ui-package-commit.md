# 在官网产品介绍补充 exts-ui：交付记录

## 对应工作项

- [Issue](../issues/2026-11-19-website-exts-ui-package-issue.md)

## 预期交付边界

仅补充官网Packages数据与入口，复用现有组件，不升级依赖或版本，不自动部署。

## 实际交付

- 按用户反馈统一标题为“Exts UI 公共组件库”，与WXT模块的名称加用途风格一致；组件运行时依赖使用pnpm add，不加-D。
categories.ts的Packages.modules新增exts-ui简介、不带版本号的安装命令和npm/源码链接，原WXT内容保留，复用现有渲染组件，无布局、样式、版本或依赖变化。

## 验证与限制

registry只读确认公开latest=0.2.0；pnpm --filter @exts/website typecheck及pnpm web:build通过，产物dist/build/exts-web。未运行无关扩展/全仓测试或新增数据镜像测试。线上页面读取受限，视觉及链接点击由用户验收，未启动浏览器或开发服务，未部署。

## 用户验收

2026-11-19用户明确“验收通过 push”，确认模块标题、无版本号/无-D安装命令及链接，批准官网内容与文档两笔提交。线上尚未更新。

## 提交方案

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

## 最终提交批准

已批准：2026-11-19用户“验收通过 push”。官网两笔本地提交按展示范围执行，复用已有验证；推送前发现main上额外既有f3c2010将exts-ui从0.2.0升为0.3.0、wxt-stable-output从1.0.2升为1.0.3，远端main仍为40f7cd6。它会随普通push触发双包自动暂存，需用户确认是否包含该额外范围。当前未推送，未部署，不撤销或重写该既有提交。
