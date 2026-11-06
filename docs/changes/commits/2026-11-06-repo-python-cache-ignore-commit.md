# 忽略 Python 运行缓存：交付记录

## 对应工作项

- [Issue](../issues/2026-11-06-repo-python-cache-ignore-issue.md)

## 预期交付边界

根 .gitignore 增加 __pycache__/、*.pyc；不删除实际缓存，不修改业务代码。

## 实际交付与验证

已增加两条规则；git check-ignore 确认各级 __pycache__ 和 .pyc 被忽略，Python 源码与数据库迁移不命中规则。未删除本地缓存，未运行业务测试或构建。用户已批准两笔本地提交，本工作项已完成，未推送。

## 提交方案

代码文件：.gitignore，新增两条 Python 缓存规则。

```text
chore(repo): 忽略 Python 运行缓存

- 排除各级 __pycache__ 目录和 pyc 文件
```

文档文件：本 Issue、Commit 记录与 docs/changes/README.md。

```text
docs(repo): 记录 Python 缓存忽略规则

- 记录忽略范围与本地提交结果
```

## 最终提交批准

已批准：用户明确要求添加规则后 commit，按代码/文档两笔提交并同步工作项完成状态，不推送。
