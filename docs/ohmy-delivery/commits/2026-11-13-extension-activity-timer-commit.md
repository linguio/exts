# 活动翻页倒计时交付记录

- 对应 [Issue](../issues/2026-11-13-extension-activity-timer-issue.md)
- 状态：已完成
- 用户验收：已通过
- 提交批准：已批准；代码与文档分开本地提交

## 预期交付边界
日历上方左列倒计时卡片、官方 Base Slider、精确依赖、音频、时钟、右键音色选择、本地偏好与到时Toast；不改变活动数据。

## 实际交付
- 最新菜单顺序：Pink Noise、Brown Noise置顶，其后Metronome、Quartz Clock；仅顺序调整，重建通过，复用已有逻辑检查结果。
- 模式按钮Tooltip与aria-label统一为单词Time/Countdown，表示点击后的目标模式。
- TimerCard 位于首页卡片区日历上方左对齐，宽高复用178px文件夹尺寸；内边距、圆角、外框、背景和卡片间距沿用既有组合，日历原尺寸不变。
- 顶行官方Base Slider与右侧模式图标；手动0–60分、5分步进，提交即开始，再拖动重设，0取消。不再展示右侧分钟数，分秒翻页与滑块按同一截止时间更新。
- 时钟HH:mm与倒计时MM:ss共用两张等大双位卡：各63px宽、约74px高，字号32cqw，中间6px冒号及两侧6px间隔；保留450ms两阶段翻页及1px分缝，主题自动复用扩展偏好。
- timer/use-countdown.ts 由 TimerCard 调用，React state/ref 持有单标签页内存状态；调度由用户提交启动，不因 React Activity 隐藏清理 Effect 而停止；真正卸载和pagehide释放，不持久化。
- audio.ts本地合成用户选定的四种计时音与三种完成音，重设/取消释放旧音频；completion.ts归零仅复用英文Sonner，不发送系统通知。
- 用户后续取消系统通知，已删除通知API及权限请求，Manifest不再声明notifications；不撤销浏览器中用户既往手动授予的权限。
- 新增 @base-ui/react 1.9.0 精确依赖及锁文件；Slider沿用官方base-nova源码和样式，仅适配cn导入及Thumb无障碍标签，来源快照与差异已登记。
- 更新应用规范和UI文档，不改日历数据请求、不新增Studio页、不写Activity记录。


- 用户最新验收修正：Slider右侧移除分钟数，使用官方Button/Tooltip及静态Lucide Clock/Timer图标；切换清空倒计时及音频，时钟显示本地HH:mm，不展示秒；再次点击自动从25:00开始倒计时，拖动自动切回倒计时。时钟按分钟边界刷新，恢复可见时校准，不增加存储。倒计时分秒变化节奏与两阶段翻页时序保持原样。

- 用户最新确认：初始默认展示本地HH:mm，拖动Slider自动进入倒计时；仅改变初始模式，其他切换行为保持不变。

- 图标从时钟切入倒计时时按最新要求直接start(25)，不再等待拖动；切回时钟仍清空并停止音频。用户随后批准倒计时与时钟统一使用两张等大双位卡，现已复用同一渲染结构与样式。

- 时钟/倒计时复用一套双位卡片渲染结构，删除旧分钟/秒钟大小分组样式，避免维护两套布局。

- 接入指定官方Base Context Menu实际所需组合及默认勾选，英文Timer Sound/Completion Sound；Pink Noise→Brown Noise→Metronome→Quartz Clock，Harp→Glass Chime→Soft Three-Tone，默认Quartz Clock＋Glass Chime。
- sound-preference.ts按两个local键分别保存偏好、校验回退，串行写入防止快速选择乱序覆盖；use-countdown在当前卡片内管理加载及storage变化，无云端API或计时持久化。
- audio.ts试听取消旧音源与旧试听，滴答3次/完成音1遍，试听期间暂停原滴答，结束后按运行状态恢复；真正完成时取消试听并只播放选定完成音，截止时间模型未改。
- Newtab仅对计时卡片标记放行右键，交由官方菜单处理；菜单打开时隐藏卡片模式Tooltip。
- 用户要求另建“完善Toast的提示音”，已创建排队Issue与待填写Commit记录并登记队列；未实施全局Toast音效。两份排队文档随当前文档提交范围单独列明，排队工作项本身不标完成。

- 用户新批准：移除Rain Tap，Timer Sound改为Pink Noise/Brown Noise/Metronome/Quartz Clock；默认仍Quartz Clock。Pink/Brown Noise连续循环本地合成缓冲区，试听3秒后恢复当前计时声音，完成音仍三种不变。
- ambient.ts生成8秒连续双声道噪声所需样本，归一化响度与峰值并交叉过渡；不下载音频、不新增依赖。旧rain本地值回退Quartz Clock，完成音偏好保留。

## 验证与限制
- 提交前用户反馈声音会断：代码检查确认白噪声试听3秒后会停止并重新生成运行音源，可能产生短暂间断；是否还存在周期性断音尚未确认，用户随后要求验收完结并提交，本次未实施衔接优化。
- 等大卡片统一后重新执行类型检查与构建，通过；本次纯布局组合变化，不重复计时逻辑测试，视觉由用户验收。
- 默认25分钟图标启动修改后，类型检查与构建通过。
- 默认时钟修正后重新执行类型检查与构建，均通过；不重复运行未改变的计时逻辑测试。
- 最新模式切换修正后，计时与配置两个测试文件共8项通过，扩展类型检查、构建通过；不重复执行已确认旧导航断言失败的全量测试。
- 本轮14项计时/偏好/噪声样本/配置测试通过；覆盖两种噪声有限样本和幅度范围、旧rain偏好回退。类型检查首次遇到Float32Array默认ArrayBufferLike不匹配AudioBuffer参数，明确为实际分配的ArrayBuffer后重试通过；构建通过。未做音频听感验收。
- 用户调整选项短到长顺序后已重新构建成功，音色默认值和持久化值不变。
- 声音偏好新测试先确认缺少实现而失败，再实现后3项通过；计时/偏好/Manifest合计3文件11项通过，类型检查及构建通过。未重跑已确认4项旧导航断言失败的全量测试。
- 精确依赖安装成功，WXT prepare完成；未升级现有直接依赖。
- 新增纯逻辑用例先确认实现不存在导致失败，再实现通过；5项覆盖5分钟吸附/范围、截止时间、迟到采样、一次归零、重设和0取消。
- `pnpm --filter @exts/extension test`：41文件，165项通过、5项失败。
- 首轮测试的1项Manifest失败由当时新增可选通知权限引起；用户随后取消系统通知，配置及断言均已恢复原有权限列表，最新配置3项通过。
- 剩余4项在 tests/app/view-preference.test.ts（3项）与 tests/features/account/account-reset.test.ts（1项），仍断言旧local.ui保留，与当前session.ui-session及local清空规则冲突；这些测试及实现均未在本次修改，记录限制，不循环重跑全量或修改业务迎合旧测试。
- `pnpm --filter @exts/extension typecheck`：通过。
- `pnpm --filter @exts/extension build`：通过，产物 dist/build/chrome-mv3；仍有theme-init.js非module和chunk超过500kB警告。
- 分钟一致性修正后重新执行扩展类型检查与构建，均通过；计时与Slider回缩算法未改。
- 最新构建Manifest可解析，notifications已不在必需或可选权限中；git diff --check通过。
- 未执行浏览器视觉/交互、音频听感、菜单/Tooltip及隐藏页面真实运行验收；未增加假DOM或视觉交互测试。休眠、页面冻结可影响提醒时机，不保证系统级闹钟。
- 用户验收通过并批准本地提交；代码已提交，文档随本笔提交完结，未推送或发布。

## 用户验收步骤
1. Chrome/Edge重新加载dist/build/chrome-mv3，打开新标签页；确认Slider右侧不再显示分钟数字，仅有Clock模式按钮，默认展示本地HH:mm。
2. 拖动选择5分钟并松开，检查原分秒翻页、Slider缩回与滴答不变；到时仅一次Toast和所选完成音，不出现权限请求或系统通知。
3. 计时中点击图标，预期旧倒计时和声音立刻清空，图标变Clock，显示系统本地HH:mm，无秒数；跨分钟数字变化才翻页。
4. 时钟模式点击图标，预期从25:00自动开始倒计时、Slider从25分钟缩回，不恢复旧计时；时钟模式直接拖动Slider并松开也能进入倒计时。
5. 检查Home/Studio切换保留倒计时，时钟恢复可见时校准；刷新/关闭清空，多Newtab各自独立。核对明暗主题与Tooltip，声音和交互由用户验收。

6. 在卡片上右键，检查两组英文选项按名称从短到长排列，勾选默认Quartz Clock与Glass Chime；依次选择七种声音，滴答试听3次、连续噪声3秒、结束音完整1遍。
7. 计时中换音色，确认时间不重置；快速连续换音色，确认上段试听停止不叠加，结束后恢复滴答。试听期间自然归零时，仅保留所选结束音和完成Toast。
8. 刷新、重开Newtab确认声音选择保留但倒计时清空；另开Newtab检查偏好共享。菜单打开时模式按钮Tooltip不残留，其他首页区域仍不出现浏览器原生右键菜单。

## 提交边界与完整消息
代码：timer功能文件、官方Slider与ContextMenu、NewtabCards组合及局部右键边界、扩展依赖与锁文件、配置和对应测试。
文档：Issue、Commit记录、Plan、工作台、应用AGENTS、UI规范与官方来源记录；另含排队的Toast提示音Issue/Commit建档文件。用户已批准两笔本地提交。

代码消息：
```text
feat(extension): 在活动日历上方加入翻页倒计时

- 通过官方 Slider 设置时长并自动倒计时，复用卡片主题
- 支持时钟切换、右键音色试听及本地偏好，计时保持单标签页内存状态
```

文档消息：
```text
docs(extension): 记录活动倒计时布局与验收边界

- 记录组件来源、卡片布局与声音提示与时钟切换规则
- 同步实际验证结果及未验证限制
```
