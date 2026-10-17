# 产品官网

Exts 官网展示产品介绍、下载入口与更新日志。当前包含首页、产品介绍和更新日志三个页面。

## 页面与功能索引

| 页面 | 用途 |
| --- | --- |
| 首页 / | 产品介绍、Newtab/Photos 示意、分类与下载入口 |
| 产品介绍 /features/ | 按浏览器扩展、桌面应用、开发工具包、AI 工作流分类展示内容 |
| 更新日志 /changelog/ | 按年份与日期展示交付和发布记录 |

## 文档入口

- [官网界面规范](./ui.md)：主题、排版、布局和组件规则。
- [应用 README](../../apps/website/README.md)：开发、构建、工程组织与部署入口。
- [构建与分发](../build-release.md)：版本与产物目录。

功能说明统一在本页维护；内容增加后再按独立功能拆文档，不按组件创建重复 README。

## 首页模块展示

正式卡片池只包含 Newtab、Photos，不保留示例卡。最多展示连续三张，少于三张时不重复补卡。自动轮播每次推进池起点，补入下一张，整池循环；点击只临时将当前可见卡片置前，自动下一组仍按原池顺序推进。十张卡片的补位与循环规则通过纯逻辑测试覆盖，无需将假模块加入正式页面。

右侧为独立 Newtab／Media 示意，不是真实截图或业务入口。Newtab 只显示书签 SVG 与底部 Dock；Media 只显示图片和视频占位、月份、“已选 2”和文字“下载”。点击卡片仅置前，不下载媒体。点击与自动切换共用过渡，鼠标点击焦点不会阻止移开后继续轮换。

默认 Newtab 在前，每 3 秒自动轮换；鼠标悬停或键盘焦点进入展示区时暂停，离开后重新计时。两张卡片为原生按钮，可用 Enter/Space 置前；没有底部切换栏。页面隐藏时暂停，减少动态效果时只手动切换，组件卸载清理定时器和监听。窄展示区自动收紧图标与 Dock 尺寸，实际布局由用户验收。

卡片池规则检查：node --test apps/website/tests/showcase/card-pool.test.ts。测试覆盖十张池两轮循环、末尾补位、点击临时置前与小池场景；不覆盖浏览器动画、焦点或布局。

## 更新日志

页头 FileClock 图标以“更新日志”为提示，链接到 /changelog/，点击 Exts 返回首页。首页、changelog/index.html 和 features/index.html 是独立 Vite HTML 入口，共享页头、页脚和样式；正式产物包含三个页面，支持 GitHub Pages 直接访问与刷新，不依赖 SPA 回退或额外路由库。

日志维护在 src/features/changelog/changelog-data.ts，按实际发布或代码交付时间倒序，日期统一转换为北京时间。按年份分组，桌面年份位于最左侧且每组仅显示一次，日期仅显示月日；手机端年份置于该组记录上方。年份可点击返回该年第一条，使用现有 shadcn Button 和原生锚点。每条包含事件标题、平台标签和无序列表，无单独版本号或副标题，可附对应历史版本链接。分类为 Website、Chrome、macOS、Packages，使用黑底白字 Badge；不重复添加最新下载按钮。

首批记录为“产品官网上线”和“Chrome 插件首次发布”；官网条目合并产品介绍、Latest 下载入口与更新时间线，日期按官网完善后的实际交付 Git 提交北京时间确认。日志不会自动从 Git 或 GitHub 生成；修改日志后需手动部署官网，不要求改根产品版本。

Packages 首次公开发布记录为 2026-10-14，依据 npm 官方 registry 的 1.0.0 发布时间转换北京时间；链接指向该历史版本。1.0.1 文档修订保留在包自己的更新记录，不单列官网事件。

## 产品介绍

页头 BookOpen 图标位于更新日志入口旁，链接到 /features/；提示与页面标题均为“产品介绍”。左侧四类为浏览器扩展、桌面应用、开发工具包、AI 工作流，默认浏览器扩展；原生 hash 链接支持直接打开、刷新与前进/后退，空或无效 hash 回到默认分类，不新增路由依赖。

内容包含 Newtab、History Cleaner、Photos 与 wxt-stable-output，Skills 显示“暂无公开 Skills”，移除原协同分类。模块以标题和一句介绍呈现，工具包附当前 npm 包主页与源码链接；不放截图、卡片、能力标签或详细安装步骤。文案维护在 src/features/products/categories.ts，不请求外部数据。

## 下载行为

构建通过 scripts/version.mjs 校验根产品版本，但不向下载链接注入版本。Chrome 与 macOS 分别使用 https://github.com/linguio/exts/releases/latest/download/exts-chrome.zip、https://github.com/linguio/exts/releases/latest/download/exts-mac.dmg，正式 Release 为 Latest 且包含同名附件时直接转向对应包。

不查询 API、不检查文件存在、不判断下载结果，不添加加载状态或成功/失败提示。用户已知当前 DMG 地址不存在，仍要求开放链接。后续产品版本发布不需要为下载链接重新构建官网；缺少对应附件时不自动回退旧包。源码入口为 https://github.com/linguio/exts。

扩展 ZIP 需解压后在 Chrome 扩展管理页开启开发者模式并选择“加载已解压的扩展程序”，不是 Chrome 商店安装包。此版官网仅标注 Chrome，未宣称 Edge 已通过验收。

