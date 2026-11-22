# 统一自维护 Skill 命名与交付文档目录交付记录

## 对应工作项

- [Issue](../issues/2026-11-22-repo-ohmy-delivery-naming-issue.md)

## 预期交付边界

用户已批准实施，交付范围为自维护 Skill 命名规范、交付 Skill 改名和交付文档目录迁移。

## 实际交付

统一自维护 Skill 命名，迁移 `ohmy-delivery` 工作台、Issue 和交付记录。旧工作台指引经用户要求删除。

## 验证与限制

静态入口及链接检查、`git diff --check` 通过。迁移核对 1,070 条链接，保留 3 条原有的 todo.md 缺失引用。已用显式 Skill 调用读取新工作台和当前 Issue。本次复用已有验证；已分享的旧路径需更新。

## 用户验收

用户试用新入口，确认删除旧目录并明确批准本地提交。按仓库规则完结。

## 提交方案

第一笔为 Skill 及现行规范引用。

```text
refactor(repo): 统一自维护 Skill 命名

- 将开发交付 Skill 改为 ohmy-delivery
- 更新命名规范、调用入口和现行引用
```

第二笔为文档、链接及工作项终态。

```text
docs(repo): 迁移开发交付文档并完结工作项

- 将工作台、Issue 和交付记录迁到 ohmy-delivery
- 更新仓库链接并记录验证与提交结果
```

## 最终提交批准

用户明确批准本地提交。
