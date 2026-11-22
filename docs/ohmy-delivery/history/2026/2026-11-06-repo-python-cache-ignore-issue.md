---
date: "2026-11-06"
scope: repo
status: completed
type: task
---

# 忽略 Python 运行缓存

## 当前阶段

已完成。

## 目标与范围

### 背景与目标

API 运行产生的 Python 缓存出现在 Git 未跟踪列表中，在根 .gitignore 统一排除。

### 范围与排除项

- 只添加 __pycache__/ 和 *.pyc 两条规则，并维护本工作项记录。
- 不删除本地缓存，不修改业务代码、依赖或其他忽略规则，不推送。

## Todo

- [x] 添加 Python 缓存忽略规则。
- [x] 核对忽略范围，按代码/文档两笔本地提交。

## 验收标准

- 各级 __pycache__ 目录和 .pyc 文件不再列为待提交文件。
- Python 源码及数据库迁移仍正常受 Git 管理。

## 唯一下一步

无。

## 交付记录

### 历史交付记录

#### 对应工作项

- [Issue](2026-11-06-repo-python-cache-ignore-issue.md)

#### 预期交付边界

根 .gitignore 增加 __pycache__/、*.pyc；不删除实际缓存，不修改业务代码。

#### 实际交付与验证

已增加两条规则；git check-ignore 确认各级 __pycache__ 和 .pyc 被忽略，Python 源码与数据库迁移不命中规则。未删除本地缓存，未运行业务测试或构建。用户已批准两笔本地提交，本工作项已完成，未推送。

#### 提交方案

代码文件：.gitignore，新增两条 Python 缓存规则。

```text
chore(repo): 忽略 Python 运行缓存

- 排除各级 __pycache__ 目录和 pyc 文件
```

文档文件：本 Issue、Commit 记录与 docs/ohmy-delivery/readme.md。

```text
docs(repo): 记录 Python 缓存忽略规则

- 记录忽略范围与本地提交结果
```

#### 最终提交批准

已批准：用户明确要求添加规则后 commit，按代码/文档两笔提交并同步工作项完成状态，不推送。

## 关联文档

无独立关联文档。

## 历史补充

### 元信息

- 当前阶段：用户已批准，两笔本地提交完结
- 批准依据：用户明确要求「加进去 然后commit」。

### 历史后续事项

无；按用户要求本地提交完结，未推送。
