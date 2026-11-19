# 在官网产品介绍补充 exts-ui

## 元信息

- 工作项：2026-11-19-website-exts-ui-package
- 状态：已完成
- 当前阶段：用户验收通过并批准代码/文档提交及push；本地提交完结，额外已有版本提交待确认是否一并推送
- 批准依据：用户指出官网/features/#packages未补充exts-ui npm入口。
- 规模：小型产品内容补充，复用现有模块渲染。

## 背景与目标

exts-ui已建立npm包，官网产品介绍Packages目前只列WXT稳定产物工具。补齐简短介绍、安装命令、npm与源码链接，让访客能发现该公共组件包。

## 范围与排除项

- 在既有productCategories的Packages.modules添加exts-ui，沿用现有模块结构与渲染，不新建组件或修改样式。
- 介绍定位为基于shadcn/ui的React公共组件库，提供基础与通用增强能力；提供npm及源码链接，按用户最新要求，安装命令与WXT模块同格式，不带版本号。
- 不修改其他分类、WXT现有内容、根/包版本、Changelog、依赖或发布流程；不自动commit/push/部署。

## Todo

- [x] 补充Packages数据项、简短介绍及有效入口。
- [x] 执行官网类型检查与构建，不增加数据镜像测试或运行扩展测试。
- [x] 记录结果，提供/features/#packages验收步骤并停在用户验收。

## 实际结果与验收

- 按用户反馈，模块标题为“Exts UI 公共组件库”，与“WXT 稳定构建产物工具”使用名称加用途的描述方式；安装命令不带-D，因为组件属于应用运行时依赖，WXT工具属于开发依赖。
- registry只读确认exts-ui latest=0.2.0，新增安装命令pnpm add @linguio/exts-ui及npm/源码入口。
- 仅修改categories.ts的Packages.modules数据，保留原WXT模块，未新增组件或修改样式。
- 官网typecheck与web:build通过，产物dist/build/exts-web。纯内容补充不运行扩展181项或整仓测试，无新增数据镜像测试。
- 用户通过既有官网本地预览打开/features/#packages，确认WXT模块与exts-ui模块都在，简介与安装命令正确，两个链接分别指向npm和源码。布局与点击由用户验收，代理未执行浏览器验证。
- 线上页面读取受限；本次未提交、推送或部署，不把本地构建通过称为线上已更新。

## 验收标准

- Packages保留WXT工具模块并展示exts-ui介绍，样式、导航和安装命令展示复用原结构。
- npm链接为https://www.npmjs.com/package/@linguio/exts-ui，源码指向仓库packages/exts-ui；安装命令不带版本号，格式与WXT模块一致。
- 官网类型/构建通过，用户确认实际展示及链接；本地通过不等于线上已部署。

## 关联文档

- [Commit记录](../commits/2026-11-19-website-exts-ui-package-commit.md)

## 唯一下一步

确认是否随本次推送携带main上既有f3c2010版本提交（exts-ui 0.3.0、wxt-stable-output 1.0.3）；当前仅官网交付已验收并本地提交，不自动推送额外范围。
