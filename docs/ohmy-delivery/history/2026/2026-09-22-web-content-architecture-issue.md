---
date: "2026-09-22"
scope: website
status: completed
type: task
---

# 完善 My Extensions 品牌定位与内容入口

## 当前阶段

已完成。

## 目标与范围

### 背景

现有官网将 `My Extensions` 描述为“浏览器扩展的统一官网与文档中心”，无法覆盖仓库未来承载的原生应用、AI Skills 和 npm Packages，也没有表达“将个人想法与能力向外延伸”的品牌含义。当前首页、导航和示例页面仍保留 VitePress 初始化内容，需要建立正式但克制的内容入口。

### 目标

将 `My Extensions` 明确为个人数字能力与实用工具的统一品牌，在同一个官网中区分 Apps、Toolkits 和 Docs，同时保持仓库按技术职责组织，不额外创建 `toolkits` 目录或独立网站项目。

### 范围

- 将首页品牌层级调整为：`My Extensions`、`我的数字能力延伸`，以及说明浏览器扩展、应用、AI Skills 与开发工具的简介。
- 将现有 Markdown Examples 页面替换为 Apps 入口，承载浏览器扩展和应用类产品。
- 将现有 API Examples 页面替换为 Docs 入口，作为各产品和工具文档的统一入口。
- 在网站信息架构中增加 Toolkits 分类，下分 AI Skills 与 npm Packages。
- 保持仓库中的 `apps/` 和 `packages/` 现有层级，在根目录新增 `skills/README.md` 说明 Skills 的定位和收录边界。
- 同步网站导航、站点描述以及受本次目录职责变化影响的仓库说明。

### 排除项

- 不创建实体 `toolkits/` 目录。
- 不把 `apps/extensions`、`apps/helpers` 或 `apps/web` 提升到仓库根目录。
- 不创建第二个官网、独立文档站或新的部署项目。
- 不在本次创建具体 AI Skill 或新的 npm Package。
- 不自定义 VitePress 主题、Logo、插画或额外视觉效果。
- 不配置搜索、统计、域名、CI 或部署。

## Todo

- [x] 更新首页品牌文案和入口按钮。
- [x] 将两个 VitePress 示例页面改为 Apps 与 Docs 正式入口。
- [x] 配置 Apps、Toolkits、Docs 的导航关系和基础内容层级。
- [x] 新增根目录 `skills/README.md`，说明 AI Skills 的职责与收录方式。
- [x] 同步站点描述及相关仓库结构文档。
- [x] 完成构建验证并交由用户进行页面内容与导航验收。

## 验收标准

- 首页能够清楚表达 `My Extensions` 不只代表浏览器扩展，也代表个人数字能力的延伸。
- 首页提供可识别的应用入口和文档入口，不再出现 VitePress 的 Markdown/API 示例文案。
- 网站能够区分 Apps、Toolkits 和 Docs；Toolkits 下明确包含 AI Skills 与 npm Packages。
- 仓库继续使用根目录 `apps/`、`packages/`、`skills/`，不存在 `toolkits/` 目录。
- `skills/README.md` 能说明该目录收录什么、不收录什么，以及它与 `packages/` 的区别。
- VitePress 生产构建成功，页面不存在失效的内部导航链接。
- 用户在浏览器中确认首页文案、入口关系和导航层级符合预期。

## 唯一下一步

无。

## 交付记录

### 历史交付记录

#### 元信息

- 工作项：`2026-09-22-web-content-architecture`
- 对应 Issue：[完善 My Extensions 品牌定位与内容入口](2026-09-22-web-content-architecture-issue.md)
- 状态：已完成
- 用户验收：已通过
- 最终提交批准：已获得
- 创建日期：2026-09-22
- 最近更新：2026-09-22

#### 预期交付边界

- 官网使用新的品牌解释和简介，覆盖浏览器扩展、应用、AI Skills 与开发工具。
- 建立 Apps、Toolkits、Docs 三类用户侧内容入口，并移除 VitePress 初始化示例内容。
- 仓库保持 `apps/`、`packages/`、`skills/` 同级，不创建 `toolkits/` 目录。
- 新增 `skills/README.md` 说明 AI Skills 的定位和收录边界。

#### 实际完成内容

- 将首页定位更新为“我的数字能力延伸”，并补充浏览器扩展、应用、AI Skills 与开发工具的品牌说明。
- 将 VitePress 初始化页面替换为 `/apps/`、`/toolkits/`、`/docs/` 三个正式入口，并同步导航和侧边栏。
- 保持仓库 `apps/`、`packages/`、`skills/` 同级，新增 `skills/README.md` 说明目录职责和与 npm Packages 的区别。
- 同步根 README 与 `docs/monorepo.md` 的目录说明。

#### 验证结果

- `./apps/web/node_modules/.bin/vitepress build apps/web`：通过，生成首页以及 `apps/`、`toolkits/`、`docs/` 页面产物。
- `git diff --check`：通过。
- 生成产物中的导航和页面入口均指向 `/apps/`、`/toolkits/`、`/docs/`，未保留初始化示例页面。

#### 未验证事项与限制

- `pnpm vitepress:build` 与 `pnpm --filter @my-extensions/web build` 在当前环境中均无输出并持续等待；连 `pnpm --version` 也无法返回，已停止。直接调用官网包内 VitePress 可执行文件构建通过，因此暂将 pnpm 入口视为环境限制。
- 页面视觉、响应式布局和导航点击流程尚未由用户在浏览器中验收。

#### 用户验收

- 结果：通过
- 说明：用户已在浏览器中确认首页文案、Apps、Toolkits、Docs 三个入口及页面内容符合预期。

#### 最终 Commit message

`docs(web): 重塑官网品牌定位与内容入口`

#### 最终提交批准

- 状态：已获得
- 说明：用户已授权提交。

## 关联文档

无独立关联文档。

## 历史补充

### 元信息

- 类型：小型任务
- 当前阶段：实现、构建验证、用户验收和 Git 提交均已完成
- 最近更新：2026-09-22

### 历史后续事项

无。工作项已由提交 `67472d0` 完结。
