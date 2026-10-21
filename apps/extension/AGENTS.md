# 子项目规范

## 界面样式

- 扩展界面样式规范维护在 [docs/extension/ui.md](../../docs/extension/ui.md)；主题 Token 与共用语义样式由 `src/styles/index.css` 实现，组件按用途引用，禁止复制一套相同参数自行维护。

## 网站图标

- 网站图标的原始参考优先使用 [Simple Icons](https://simpleicons.org/)。
- 图标资源仓库为 [simple-icons/simple-icons](https://github.com/simple-icons/simple-icons)。
- `src/modules/newtab/assets/brand/` 中的书签图标优先从 Simple Icons 查找参考；允许按用户确认的范围参考原图手绘、调整大小与绘制细节，形成统一风格。有现成图标不限制手绘；没有对应资源时使用用户提供的参考。不直接嵌入或引用位图。
- 是否带框由用户逐图确认，不按品牌身份决定；带框时复用共同外框，无框时不添加。手绘源稿及登记规则见 [V3 图标规范](../../docs/ohmy-icon-system.md)；未确认的图标不得擅自重绘、加框、去框或替换。
- 本轮统一风格的正式 SVG 使用 `viewBox="0 0 1024 1024"`，不写固定 `width`、`height`；包含 `role="img"`、可访问的 `<title>` 与一个或多个 `<path>`。每个图标只维护一份正式 SVG，不另生成 24×24 接入版，实际显示大小与渲染适配由使用方负责；未调整的既有资源不自动转换。
- 本轮正式 SVG 采用透明背景、单色 `currentColor`，不维护独立黑色、深浅主题或上传版本；不得添加渐变、阴影、纹理或透明度效果，并保留小尺寸下可辨识的核心特征。未调整的既有黑色资源不在本次文档工作中改色。
- 文字类书签 SVG 统一命名为 `text-<书签 id>.svg`（例如 `text-pmi.svg`）；本轮统一风格的新正式源稿同样使用透明 `1024×1024` 坐标画布，按视觉重量居中并保留安全边距，不另设一套交付尺寸。未调整的既有文字资源保持原状。

## 通用 UI 与组合

- 官网与扩展全部 Web UI 的选型、来源和风格维护原则遵循根 [AGENTS.md](../../AGENTS.md#web-ui-选型与风格)，不维护组件白名单。
- `src/shared/ui/` 持有通用组件，不包含书签、Dock、Chrome API 或模块状态；各功能在自己的 `src/modules/<功能>/` 中组合，Newtab 也遵循此边界。
- 扩展主题由 `src/shared/theme/` 解析 Light/Dark/System，默认跟随系统；实际明暗通过根 `data-theme` 应用，Portal 继承根 Token，不直接依赖 `.dark` 类。偏好保存、同步与首屏初始化不得放进通用 UI。官方源码接入和必要差异见 [Web UI 来源](../../docs/web-ui-sources.md)。
- 应用根只创建一个 `TooltipProvider`。Tooltip 只提供简短名称或帮助说明，不含可交互内容；菜单或 Sheet 打开时其入口不得残留 Tooltip，Sheet 内的主题名称和帮助提示可正常显示。
- Tooltip、菜单、Sheet、Button 与链接通过 `asChild` 等方式共享唯一真实交互元素，禁止嵌套交互控件。

## 图标职责

- `UiIcon` 只适配 Lucide 通用 UI 图标，统一使用 `currentColor`、已批准的尺寸和线宽；只能显式静态导入实际使用的图标。
- 禁止 `import * as Icons from 'lucide-react'`、完整图标注册表、根据任意字符串动态访问 Lucide 全量导出或其他可能将整套图标打入产物的方式。
- `BookmarkIcon` 只管理品牌、网站书签、文字 Logo 和既有 SVG/PNG 资源，并继续遵守原色与自适应单色规则；不得使用 Lucide 重绘或替换品牌 Logo。
- 被 Lucide 替代的通用功能 SVG 在完成迁移和验收后必须删除，不得长期保留两套等价资源或运行时实现。

## Dock 交互

- Dock 网页入口使用真实链接语义；工具分组使用真实按钮打开 `DropdownMenu`；已批准的 Settings 使用真实按钮打开 `Sheet`。各入口按已批准职责组合，不维护第二套交互实现。
- Dock 入口 Hover 或键盘 Focus 时只显示 Tooltip；不得通过 Hover 直接展开 DropdownMenu，也不得让同一个弹层同时承担 Tooltip 和菜单职责。
- DropdownMenu 中的网页入口优先使用真实 `<a>`；仅在需要调用 Chrome API、创建标签组或执行非导航操作时使用命令型菜单项。
- Dock 位于视口底部，DropdownMenu 默认从上方弹出并支持碰撞调整；由用户验证菜单在 `1280×720`、缩放后 CSS 视口 `640×360` 以及 100%、125%、150%、200% 缩放下不被裁剪或移出视口。
- 用户验收 DropdownMenu 应覆盖 Enter、Space 或 ArrowDown 打开、方向键移动、Enter 激活、Esc 关闭并恢复触发器焦点、外部点击关闭等行为；Portal 必须正确继承明暗主题 Token 和层级。
- 已废弃的自定义 Popover 不得重新引入；DropdownMenu 与 Tooltip 分别承担菜单和提示职责，不维护双轨实现。
- Settings 包含 General/Features：General 组合主题选择，Features 组合历史清理与 Telegram Download 的开关和帮助。主题偏好由共用主题模块持有；各功能持有自己的配置和业务。Newtab 只组合入口，新增功能按本地 Issue 流程确认范围。

## Telegram Download 与记录边界

- `src/modules/tg-download/` 只处理 Telegram Web 下载，默认开启；内部按业务组件、设置视图、download-core 和页面接入划分职责。配置关闭立即禁止新下载，正在写入的任务继续。
- 不提供 Popup 或公共下载记录层；完成 Toast 使用 shared/ui 中的官方 Sonner 样式组件，文案与触发由 TG 模块负责。只在文件关闭成功后显示“下载完成”和文件名；不提示开始、进度、失败或取消，不修改现有文件名生成规则。
- 保留 MAIN world 页面取流及用户手势内的系统另存为，不把媒体流交给 desktop。统一主题 Token 位于 `src/styles/theme.css`，网页菜单与扩展页面共用。

## 历史清理边界

- 后台入口只注册独立模块，不导入 React 或 Newtab；注册、普通 worker 唤醒、安装或更新不能主动清理。
- 历史清理默认关闭，只在配置开启且获得 `browsingData` 可选权限时调用 `removeHistory`；配置使用 `storage.local`，不得扩大到其他浏览数据或站点权限。
- 开启操作申请权限并保存配置，不立即清理；浏览器真实启动、最后窗口关闭、授权和界面效果由用户在专用 Chrome/Edge 配置文件验收，代理测试不得删除真实历史。

## exts 新标签页模块 验收

- 自动化测试覆盖不依赖真实浏览器布局与焦点环境的配置、数据处理、链接安全属性和必要架构边界；不得用假 DOM 模拟 Tooltip、菜单、键盘、焦点或指针交互。
- 架构测试只用于防止高风险边界回退，例如旧 Popover、Lucide 全量导入或业务逻辑进入 `src/shared/ui/`；不得大量断言源码文本和内部实现形式。
- 每个阶段按根规范完成必要的逻辑测试、类型检查和生产构建。
- 功能阶段完成后由用户在 Chrome 或 Edge 实际加载稳定开发目录，验证明暗主题、Tooltip、菜单、键盘、焦点恢复和约定缩放场景；用户未明确验收通过前不得进入最终提交准备。
