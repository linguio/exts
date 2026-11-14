# 调整计时卡片与表格操作

## 元信息
- 工作项：2026-11-14-extension-timer-digit-scale
- 状态：已完成
- 规模：小型
- 批准依据：用户要求将数字纵向比例从2.8改成2.5试用。

## 背景与目标
减少数字文字的纵向拉伸，供用户比较效果。

## 范围
将timer.css文字层scaleY改为2.5；按用户补充要求，Timer Sound仅保留Brown Noise、Metronome，Completion Sound仅保留当前前两项Harp、Glass Chime，删除被替代音色代码并同步本地偏好回退和UI规范。默认计时音Metronome，默认完成音Harp，已有静音null偏好保留。

- 用户明确批准将表格调整合并本Issue，不另建工作项：修复共用DataTable的Actions表头固定，将Edit收进更多菜单（Edit增加与现有编辑Sheet一致的SquarePen图标），分页增加10，默认20不变。
- 行操作仍由可编辑字段和updateFn/previewEdits配置决定；只落地Edit，不预建Delete或新的操作配置体系。

## 排除项
不改变卡片尺寸、字号、留白、翻页或计时逻辑，不修改历史交付记录。

## Todo
- [x] 调整比例并同步UI规范。
- [x] 恢复缺失依赖后完成类型检查、构建并核对diff。
- [x] 交付用户验收。

- [x] 精简两组声音并处理旧偏好回退，保留既有静音行为。

- [x] 修正Actions固定、接入官方更多菜单并增加10条分页选项。
- [x] 按依赖可用性完成必要检查并记录限制。

## 验收标准
- scaleY为2.5，其他样式保持原样；声音两组各两项，旧偏好与静音正确回退或保留。
- 用户确认时钟/倒计时的文字比例及翻页显示合适。
- Daily横纵滚动时Actions表头固定在右上角，行Actions固定在右侧；更多菜单仅有Edit并继续打开原编辑Sheet。分页10/20/50/100，初始20不变。

## 关联文档
- [Commit记录](../commits/2026-11-14-extension-timer-digit-scale-commit.md)

## 唯一下一步
无；用户验收通过并批准本地提交，计时与表格代码已分别提交，随文档提交完结。
