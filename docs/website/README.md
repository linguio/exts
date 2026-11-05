# 产品官网

Exts 官网展示产品介绍、下载入口与更新日志。公开内容包含首页、产品介绍和更新日志三页，另有扩展登录、授权与退出托管页；API 文档由独立 API 服务提供。

## 页面与功能索引

| 页面 | 用途 |
| --- | --- |
| 首页 / | 产品介绍、Newtab/Photos 示意、分类与下载入口 |
| 产品介绍 /features/ | Quick Start、四类产品及 API 说明，支持分类 hash 链接 |
| 更新日志 /changelog/ | 按年份与日期展示交付和发布记录 |
| 认证 /auth/sign-in/、/auth/consent/、/auth/sign-out/ | 扩展认证与同源注销托管入口，不作为普通产品页面 |

## 文档入口

- [官网界面规范](./ui.md)：主题、排版、布局和组件规则。
- [应用 README](../../apps/website/README.md)：开发、构建、工程组织与部署入口。
- [构建与分发](../build-release.md)：版本与产物目录。
- [API 开发文档](../../apps/api/README.md)：FastAPI 服务与 Scalar 文档；[在线 API 文档](https://api.exts.linguio.dev/docs)。

功能说明统一在本页维护；内容增加后再按独立功能拆文档，不按组件创建重复 README。

## 首页模块展示

正式卡片池只包含 Newtab、Photos，不保留示例卡。最多展示连续三张，少于三张时不重复补卡。自动轮播每次推进池起点，补入下一张，整池循环；点击只临时将当前可见卡片置前，自动下一组仍按原池顺序推进。十张卡片的补位与循环规则通过纯逻辑测试覆盖，无需将假模块加入正式页面。

右侧为独立 Newtab／Media 示意，不是真实截图或业务入口。Newtab 只显示书签 SVG 与底部 Dock；Media 只显示图片和视频占位、月份、“已选 2”和文字“下载”。点击卡片仅置前，不下载媒体。点击与自动切换共用过渡，鼠标点击焦点不会阻止移开后继续轮换。

默认 Newtab 在前，每 3 秒自动轮换；鼠标悬停或键盘焦点进入展示区时暂停，离开后重新计时。两张卡片为原生按钮，可用 Enter/Space 置前；没有底部切换栏。页面隐藏时暂停，减少动态效果时只手动切换，组件卸载清理定时器和监听。窄展示区自动收紧图标与 Dock 尺寸，实际布局由用户验收。

卡片池规则检查：node --test apps/website/tests/pages/home/showcase/card-pool.test.ts。测试覆盖十张池两轮循环、末尾补位、点击临时置前与小池场景；不覆盖浏览器动画、焦点或布局。

## 更新日志

页头 FileClock 图标以“更新日志”为提示，链接到 /changelog/，点击 Exts 返回首页。src/entrypoints 中的 index.html、changelog/index.html 和 features/index.html 是独立 Vite HTML 入口，共享页头、页脚和样式；正式产物包含三个页面，支持 GitHub Pages 直接访问与刷新，不依赖 SPA 回退或额外路由库。

日志维护在 src/pages/changelog/data.ts，产品条目默认按实际公开发布日期、官网条目按上线或代码交付日期倒序，日期统一转换为北京时间。按年份分组，桌面年份位于最左侧且每组仅显示一次，日期仅显示月日；手机端年份置于该组记录上方。年份可点击返回该年第一条，使用现有 shadcn Button 和原生锚点。每条包含事件标题、平台标签和无序列表，无单独版本号或副标题。分类为 Website、Extension、Desktop、Packages，使用黑底白字 Badge；不重复添加最新下载按钮。

标题使用“动作 + 本次主要变化”：推出用于产品或模块首次交付，新增用于增加能力，优化或完善用于改善已有体验，修复用于解决具体问题；官网首次上线可用“上线”。不反复使用“发布扩展”或“发布 Exts”，平台放标签，版本放安装包或工具包版本链接。正文使用“新增、优化”等动作描述用户获得的能力，避免“功能名：说明”的冒号句式及过细的实现过程。

链接只在有与该条变化直接对应、能让读者进一步获取内容的具体目标时添加，不按平台强制填充。Extension、Desktop 有对应发布附件时，标注文件名和固定版本，直接链接该版本的安装包；Packages 有独立发布版本时，链接对应版本的包页面。首次推出仓库内 Skill 时，链接各 Skill 的源码目录；Skill 未独立发布版本时不标产品版本号。后续开发流程、构建或官网内容调整，只有出现新的、与该条变化直接对应的页面或文档入口时才加链接；没有这样的入口或只会重复上一条源码链接时不加，不用仓库首页凑数。文件名标注下载的链接不得指向 Release 介绍页；确需链接 Release 页面时应标为“查看 vX Release”。

用户明确批准时，可先按交付日期加入版本条目和固定版本下载直链，接受 Release 公开前暂时 404；不使用 latest 代替该版本地址。同一产品版本的改动合并为一条日志，只列有实际功能变化的产品分类；没有功能变化的端不单列纯版本同步说明，只附条目实际涉及端的安装包链接，不为纯版本同步附上其他端的包。不把纯版本号变化另拆一条。

官网日志在 data.ts 手动维护，不从 Git 或 GitHub 自动生成；推送 main 后由官网工作流部署，不要求每次日志修改都提升根产品版本。Release 草稿读取最新日志的更新点并转换为无序列表，普通官网部署不会创建 Release。

Packages 首次公开发布记录为 2026-10-14，依据 npm 官方 registry 的 1.0.0 发布时间转换北京时间；链接指向该历史版本。1.0.1 文档修订保留在包自己的更新记录，不单列官网事件。

## 产品介绍

页头产品介绍入口链接到 /features/，API 文档入口打开独立服务的 /docs。产品介绍左侧包含 Quick Start、Extension、Desktop、Packages、Skills 和 API；默认 Quick Start，空或无效 hash 也回到 Quick Start，分类切换保留原生 hash 行为，不新增路由依赖。

产品数据包含 Newtab、History Cleaner、Telegram Web Download、Photos、wxt-stable-output，以及 workflow-change、workflow-observer、workflow-tests 三个 Skill；Skill 源码统一位于 .agents/skills。模块文案与源码入口维护在 src/shared/products/categories.ts，Quick Start 和 API 说明由 products 页面内的专用内容提供，不请求外部产品数据。

## 下载行为

构建通过 scripts/version.mjs 校验根产品版本，但不向下载链接注入版本。Chrome 与 macOS 分别使用 https://github.com/linguio/exts/releases/latest/download/exts-chrome.zip、https://github.com/linguio/exts/releases/latest/download/exts-mac.dmg，正式 Release 为 Latest 且包含同名附件时直接转向对应包。

下载入口不查询 API、不检查文件存在、不判断下载结果，不添加加载状态或成功/失败提示。后续产品版本发布不需要为下载链接重新构建官网；缺少对应附件时不自动回退旧包，草稿附件不属于公开 latest 下载。源码入口为 https://github.com/linguio/exts。

扩展 ZIP 需解压后在 Chrome 扩展管理页开启开发者模式并选择“加载已解压的扩展程序”，不是 Chrome 商店安装包。此版官网仅标注 Chrome，未宣称 Edge 已通过验收。

