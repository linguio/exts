---
date: "2026-11-25"
scope: [extension]
status: completed
type: task
---

# 更新三个默认书签地址

## 当前阶段

用户验收通过并批准提交和推送。

## 目标与范围

更新扩展内置默认书签的目标地址：

- npm → https://www.npmjs.com/settings/linguio/packages
- Neon → https://console.neon.tech/app/org-wild-hat-06154944/projects
- Namecheap → https://ap.www.namecheap.com/domains/list/

范围仅为这三个默认书签地址。

## Todo

- [x] 更新三个默认地址。
- [x] 核对扩展使用的默认书签及构建产物。

## 验收标准

- 在扩展里打开这三个默认书签，分别导航到指定地址。

## 唯一下一步

无。

## 交付记录

仅修改默认书签地址。3 项书签逻辑测试通过，Chrome 构建成功，构建产物包含三个指定地址。用户确认全部验收通过。

### 提交方案

用户批准本地提交及推送。实现提交只包含默认书签配置，文档提交只包含本 Issue 的验收和归档。

```text
chore(extension): 更新三个默认书签地址

- 将 npm、Neon 和 Namecheap 书签指向指定管理页面
```

```text
docs(extension): 归档默认书签地址更新

- 记录书签地址、构建验证和用户验收
```

## 关联文档

无。
