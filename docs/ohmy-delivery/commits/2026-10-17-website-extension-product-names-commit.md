# 官网扩展功能命名与介绍交付记录

- 对应 [Issue](../issues/2026-10-17-website-extension-product-names-issue.md)
- 状态：已完成
- 预期交付边界：统一 Newtab 展示名称，新增 History Cleaner 中文介绍，同步官网规范；不改布局、轮换或扩展功能。
- 实际交付：共用产品介绍标题及首页展示标题、无障碍名称改为 Newtab；添加确认的 History Cleaner 中文说明；官网 README 与 UI 规范同步。保留 TabsCard 内部名称与 tabs ID。
- 自动化验证：9 项分类与卡片池既有纯逻辑测试通过，diff 检查通过。
- 验证限制：本地 TypeScript、Vite 依赖缺失，直接类型检查及构建均报 MODULE_NOT_FOUND；尚未完成本次类型检查与生产构建。未修改依赖或锁文件，未执行视觉或浏览器交互验收。
- 用户验收：用户在看到交付及验证限制后明确要求本地提交，按仓库规则视为验收确认；代理未执行浏览器验收。
- 最终提交批准：已批准本次本地提交，不推送、不部署。
- 最终 Commit message：已展示并获用户本地提交批准。

```text
docs(website): 统一 Newtab 命名并补充历史清理介绍

- 统一产品介绍与首页卡片中的 Newtab 展示名称
- 添加 History Cleaner 中文说明并同步官网规范
```
