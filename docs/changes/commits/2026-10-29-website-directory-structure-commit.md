# 整理官网入口页面与共享目录：交付记录

## 对应工作项

- [Issue](../issues/2026-10-29-website-directory-structure-issue.md)

## 预期交付边界

基于远端最新 main，仅整理官网目录、必要引用、构建入口路径、测试与现行说明；保留已完成的品牌资源整理，不恢复旧本地提交，不改变业务与外观。代码与文档最终分别展示，不自动提交。

## 实际交付

- 追加批准：Extension 仅将 components.json 的 components 别名从 Newtab 改为 @/shared，不迁移模块；该配置修正单独提交。JSON 解析、四项别名和目标路径、主题 CSS 存在性检查通过，diff 确认仅一行配置改变。最初检查脚本因子进程权限限制无法调用 Git，改为直接检查配置并用独立 Git diff 核对后通过；未执行组件生成或扩展构建。

该追加修正的待审核提交消息：

```text
chore(extension): 修正通用组件生成目录别名

- 将通用组件生成位置从 Newtab 调整为 shared
```
- 基于已同步远端的最新 main 迁移 32 个路径：entrypoints 统一启动、pages 持有专用内容、shared 归置跨页能力，移除纯 App 转发。
- styles 按原声明拆分，Vite 与组件生成路径作必要适配，原测试迁移保持覆盖；根产物／缓存及三页 URL 不变。
- 品牌 SVG 与 public 保持最新 main 原样，未恢复旧本地改造或复制已清理资源。
- 更新应用 README／AGENTS 与现行路径文档，不修改其他应用、功能文案、样式声明、依赖或产品版本。

## 验证与限制

- 10 项官网逻辑测试通过：node --experimental-strip-types --test --test-isolation=none apps/website/tests/pages/home/showcase/card-pool.test.ts apps/website/tests/shared/products/categories.test.ts。
- 19 项根构建边界通过：node --test --test-isolation=none tests/build-release.test.mjs。
- 官网目录执行 node node_modules/typescript/bin/tsc --noEmit 和 node node_modules/vite/bin/vite.js build，通过；git diff --check 通过。
- 32 个迁移文件正文等价，CSS 原声明顺序无损；两份生成 CSS 与最新 main 基准字节一致，三页 HTML 正文和 SEO 等价（忽略换行与生成资源标签），23 处资源引用存在。
- 品牌／public 源码和 public 产物指纹一致；Extension、品牌、public、package.json、锁文件无变更。
- 基准及最终构建、根测试在已确认可用环境执行，无依赖重装；真实浏览器视觉、导航、动画和下载待用户验收，未提交、推送或部署。

## 用户验收

待验收。

## 文件边界与完整 Commit message

- 代码：官网 src 的入口／页面／共享／样式目录迁移、三个 HTML、Vite 和 components.json 配置适配、两份原有测试迁移。品牌、public、依赖和其他应用不在修改范围。
- 文档：apps/website/README.md、apps/website/AGENTS.md、docs/website/README.md、docs/website/ui.md、docs/web-ui-sources.md、本 Issue、Commit 记录及工作台。
- 以下完整消息为待审核方案，不表示已经批准 Git 提交。

```text
refactor(website): 基于最新主线整理官网目录职责

- 集中三页入口并归位页面专用与共享内容
- 原样分离主题布局并调整构建和测试路径
- 保留品牌资源与现有访问地址和页面行为
```

```text
docs(website): 同步官网目录与等价验证记录

- 更新入口页面共享能力的职责与路径说明
- 记录最新主线上的迁移结果及验收边界
```

## 最终提交批准

未批准本轮 Git 提交，不自动提交或推送。
