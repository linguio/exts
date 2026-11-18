# 更新记录

## 0.1.0

### 新增

- 提供 ui 基础与 plus 增强组件公开入口、ESM、类型声明和预编译样式。
- 提供 ExtsToaster、完整文案复制、官方提示类型及独立错误声音控制。

### 修复

- 为增强 Toast 提供统一层级 Token，默认高于现有应用 Sheet 和 AlertDialog。

### 接入说明

- 显式引入 styles.css；声音默认关闭，由应用传入偏好。
- 本地使用 Workspace，正式 npm 上传及发布需单独批准。
