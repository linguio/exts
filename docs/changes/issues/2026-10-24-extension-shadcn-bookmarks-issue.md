# 添加 shadcn 网站书签

## 元信息
- 状态：已完成
- 完成日期：2026-10-24
- 创建日期：2026-10-24
- 项目：extension

## 背景与目标
按用户指定位置添加 shadcn/ui 官方网站与 shadcn.io，使用用户已提供的 SVG。

## 范围
- DevOps 文件夹第一项添加 shadcn/ui，网址为 https://ui.shadcn.com/。
- Dock 的 Components 第二项添加 shadcn.io，网址为 https://www.shadcn.io/。
- 注册两份 SVG 构建资源，更新已有书签配置测试。

## 排除项
不重绘 SVG，不调整其他书签相对顺序、样式或交互，不提交或推送。

## Todo
- [x] 添加两个书签并注册用户提供的资源。
- [x] 更新已有配置测试，执行测试、类型检查和生产构建。
- [x] 记录结果并交由用户验收。

## 验收标准
- DevOps 第一项为 shadcn/ui，Components 第二项为 shadcn.io，网址正确。
- 构建产物包含两份 SVG，其他书签相对顺序保持不变。
- 用户在 Chrome 或 Edge 验证图标显示与链接打开结果。

## 关联文档
- [Commit 记录](../commits/2026-10-24-extension-shadcn-bookmarks-commit.md)

## 唯一下一步
用户明确要求本地提交并完结；本工作项无后续实施步骤。
