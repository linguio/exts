---
date: "2026-10-21"
scope: [website]
status: completed
type: task
---

# 添加 Skills 日志并去重首页分类标题

## 当前阶段

已完成。

## 目标与范围

### 背景与目标

官网已有两份开发 Skill 的产品介绍，但更新日志缺少对应发布说明；首页拼接相同的 name 与 label，导致分类卡片标题重复。本次补充发布说明并修正首页标题。

### 范围与排除项

- 范围：新增 Skills 日志标签与一条 2026-10-20 日志；介绍 workflow-change 和 workflow-observer；快速开始改为 2026-10-21 并补充 Skills 产品说明分类描述；首页四张卡片分别只显示 Extension、Desktop、Packages、Skills；Newtab 展示卡片在扳手图标右侧追加 Settings 齿轮，沿用 Dock 样式。
- 范围补充：Observer 在日志、产品说明、Skill 正文简介与选择器简短描述统一使用“观察并记录开发习惯，通过复盘总结改进方向，优化自己的工作流。”。
- 排除项：修改其他既有日志、其他产品说明或分类数据、Skill 触发与行为规则、视觉重设计、安装 Skill、升级依赖、提交、推送及部署。

## Todo

- [x] 添加 Skills 分类与已确认文案。
- [x] 首页标题只渲染一次分类名称，保留描述和链接。
- [x] Newtab 展示卡片 Dock 最右侧追加 Settings 图标。
- [x] 统一 Observer 的四处用途简介，保留触发与行为规则。
- [x] 完成官网既有逻辑测试、类型检查、生产构建与 diff 检查。
- [x] 展示验收步骤与提交方案，停在用户验收。

## 验收标准

- 更新日志顶部显示 2026-10-21“新增快速开始”，包含 Skills 产品说明分类描述；第二条显示 2026-10-20“推出开发工作流 Skills”，标签为 Skills，Observer 描述为观察记录开发习惯并总结优化工作流。
- 其他既有更新日志的内容和相对顺序保持原样。
- 首页分类卡片标题只显示一次名称，图标、描述与跳转目标保持原样。
- Newtab 展示卡片 Dock 最右侧显示 Settings 齿轮，位于扳手图标之后，作为装饰展示不增加交互。
- Observer 四处用途简介一致；Skill 的触发条件、默认提示、禁止隐式调用及审批规则保留。
- 自动化验证结果如实记录，视觉及交互由用户在 Chrome 或 Edge 中验收。

## 唯一下一步

无。

## 交付记录

### 历史交付记录

#### 对应工作项

- [Issue](2026-10-21-website-skills-changelog-issue.md)

#### 预期交付边界

官网新增 2026-10-20 Skills 发布说明，介绍两份开发 Skill；快速开始归 2026-10-21 并补充 Skills 产品说明分类描述；首页四张分类卡片名称各显示一次，Newtab 展示 Dock 最右侧追加 Settings 图标。保持其他日志、卡片描述及链接。

#### 实际交付

- ChangelogPlatform 增加 Skills；新增“推出开发工作流 Skills”，按用户最新要求归 2026-10-20；Observer 文案为“新增 workflow-observer，观察并记录开发习惯，通过复盘总结改进方向，优化自己的工作流。”。
- “新增快速开始”归 2026-10-21，位于顶部，补充“新增 Skills 产品说明分类，介绍开发工作流 Skill 的用途与源码入口。”。
- 首页四张分类卡片仅渲染 category.name，移除重复的分隔符与 label；图标、描述、链接及样式保留。
- Newtab 展示卡片在 Wrench 之后追加 lucide Settings，复用 showcase-dock-icon 与原 aria-hidden 装饰结构，不增加交互。
- Observer 在产品说明、Skill 正文简介与选择器简短描述中同步使用“观察并记录开发习惯，通过复盘总结改进方向，优化自己的工作流。”；其他日志、分类数据和 Skill 行为规则保留。

#### 验证与限制

- Node.js 24.16.0、pnpm 12.4.2。
- node --test apps/website/tests/products/categories.test.ts apps/website/tests/showcase/card-pool.test.ts：10 项通过。
- pnpm --filter @exts/website typecheck：通过。
- pnpm web:build：通过，产物位于 dist/build/exts-web；新日志文案在生成的 changelog JS 中核对存在。
- 本轮日期与文案修正后重新执行类型检查、生产构建并通过；纯内容调整未重复执行无关逻辑测试。
- Settings 补充后，类型检查与生产构建通过；按 React 最佳实践核对本次两个 TSX diff，未新增状态、事件或组件封装，图标保留装饰语义。
- 四处描述统一后，类型检查、生产构建及内容一致性核对通过；与 HEAD 比较确认 Skill 仅正文简介和 short_description 变化，触发元信息、默认提示、调用策略及完整规则保留；项目链接读取到最新源稿。未执行代理压力评测，不宣称长期效果已验证。
- git diff --check：通过；代码 diff 涉及日志类型、新增条目、快速开始日期与补充描述及首页标题表达式，其他条目保留。
- 本次为简单文案与展示修正，不新增实现细节或视觉交互测试，不启动浏览器验收。未推送或部署，未实际验收页面视觉、交互及线上结果。

验收步骤：本地运行既有 pnpm web:dev 后由用户在 Chrome 或 Edge 打开首页，检查 Extension、Desktop、Packages、Skills 各显示一次，描述与跳转仍正常；查看 Newtab 展示卡片，Dock 的扳手右侧应出现 Settings 齿轮，原图标顺序保留；打开 /changelog/，确认顶部 2026-10-21 为“新增快速开始”，带 Skills 产品说明分类描述；第二条 2026-10-20 为“推出开发工作流 Skills”，标签为 Skills，Observer 描述为观察记录开发习惯与优化工作流。其他原有条目顺序和内容保持原样。关闭开发服务后再决定是否提交。

#### 用户验收

用户查看最终交付与验证限制后，于 2026-10-21 明确要求“提交”，表示验收通过并批准本地提交；代理未独立执行浏览器或线上验收。

#### 提交方案

待提交共 9 个文件：changelog-data.ts、categories.ts、home-page.tsx、showcase-cards.tsx、Observer 的 SKILL.md 与 agents/openai.yaml、对应 Issue、本文及工作台。diff 为日志分类、条目与日期文案、首页分类标题去重、Dock Settings 图标、Observer 四处简介统一和工作项记录。

拟用完整消息：

```text
fix(website): 完善日志与首页展示内容

- 添加 Skills 日志并调整快速开始日期与说明
- 首页分类标题去重并补充 Newtab 设置图标
- 统一 Observer 的官网与 Skill 简介
```

用户批准本地提交，按已展示方案机械更新：Issue 改为已完成、阶段改为交付完成、唯一下一步改为无；本文记录验收通过与提交批准；工作台清空当前项并移入已完成索引。提交失败时恢复待提交与待批准状态。

#### 最终提交批准

已批准。用户于 2026-10-21 明确要求“提交”；范围为已展示的 9 个文件及机械性终态更新，不推送或部署。

## 关联文档

无独立关联文档。

## 历史补充

### 元信息

- 当前阶段：交付完成
- 已批准范围依据：用户批准官网日志与标题去重后，要求交换 20 与 21 日内容、补充 Skills 产品说明分类、调整 Observer 文案并给首页 Newtab 展示 Dock 增加 Settings；最新批准统一 Observer 的相关用途简介，保留内部规则边界。
