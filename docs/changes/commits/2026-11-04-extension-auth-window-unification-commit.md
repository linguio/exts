# 统一 Exts 登录、授权与退出窗口：交付记录

## 对应工作项

- [Issue](../issues/2026-11-04-extension-auth-window-unification-issue.md)

## 预期交付边界

统一 Exts 自有的登录、授权、退出页面及可控认证窗口，Google/GitHub 共用紧凑 shadcn 体验；不修改第三方页面。先验证浏览器窗口可行性和当前退出失败原因。

## 实际交付

官网三页已共用紧凑布局、标题说明区、可滚动内容区和固定操作区，Google/GitHub 复用同一页面结构。浏览器外框与退出失败排查仍在进行，未完成交付。

## 验证与限制

官网 TypeScript 类型检查通过。生产构建受 Windows 环境的 Tailwind 原生模块加载错误及 Vite `spawn EPERM` 阻塞，尚未验证产物。Chrome 官方 Identity API 的 `WebAuthFlowDetails` 无宽高/位置参数；自管窗口方案待用户确认。真实退出此前返回“退出未完成，请重试”，当前未能访问线上注销页面，尚未确认失败位置。

## 用户验收

用户要求本地提交当前改动；未提供 Chrome/Edge 视觉与交互验收结果。

## 提交方案与批准

用户已明确批准本地提交。代码文件：`apps/website/src/pages/auth/index.tsx`。文档文件：本记录、对应 Issue、`docs/changes/README.md`。不推送、不部署。

代码 Commit message：

```text
feat(website): 统一认证页面的紧凑布局

- 统一登录、授权和退出页面的标题与内容容器
- 长授权信息使用可滚动区域并保留固定操作区
```

文档 Commit message：

```text
docs(extension): 记录认证页面阶段交付与限制

- 记录页面实现、类型检查及构建环境错误
- 标明弹窗外框和退出故障尚未解决
```
