# @linguio/exts-ui

基于固定版本 shadcn/ui 的基础组件与 Exts 公共增强组件，首版为 `0.1.0`，npm dist-tag 为 `latest`。尚未正式发布。

```tsx
import '@linguio/exts-ui/styles.css';
import { Button } from '@linguio/exts-ui/ui/button';
import { ExtsToaster, toast } from '@linguio/exts-ui/plus/toast';

function Application() {
  return <ExtsToaster soundEnabled={false}>
    <Button onClick={() => toast.add({ type: 'error', title: 'Save failed.' })}>Notify</Button>
  </ExtsToaster>;
}
```

## 边界

- `ui/*` 保留 shadcn 官方名称和基础能力；项目能力由 `plus/*` 组合，公共增强组件使用 Exts 前缀。来源见 [SOURCES](./SOURCES.md)。
- 应用负责业务文案、权限、偏好存储和 Chrome API。库不读取这些设置；`soundEnabled` 默认 false，仅新 error 自动发声，1秒内不排队，不重播旧通知。
- `useExtsToastSound()` 只能在 ExtsToaster 内使用，返回当前宿主的 `preview()`、`setEnabled()`、`subscribe()`、`getStatus()` 能力，供应用试听和提示音状态接入。状态为 idle/ready/paused/unavailable。浏览器音频自动播放限制仍然适用。
- 默认 `toast` 与 ExtsToaster 使用相同官方管理器。独立根可以传入 `createToastManager()` 返回的实例并向该实例发送通知；不要在同一文档给同一管理器重复挂载多个宿主。
- `portalContainer` 接受 HTMLElement/ShadowRoot，Telegram 等宿主必须传入其主题容器；CSS须注入同一Shadow DOM。

## 样式与层级

必须显式引入 `styles.css`，无需Tailwind扫描包源码。语义颜色沿用 shadcn `--background`、`--foreground`、`--popover`、`--border`、`--accent` 等变量，缺失时采用基础回退；字体继承宿主，不打包字体或全局reset。

Toast 默认 `--exts-z-toast: 80`，高于当前应用Sheet50及AlertDialog70；复制Tooltip为该值加1。消费者可在根主题或Shadow宿主覆盖Token。它不保证覆盖任意第三方浮层或浏览器原生top layer；模态打开时的可见性与复制/关闭需由应用在真实浏览器验收。

## 本地维护与分发

- 源码在 packages/exts-ui；本地Workspace引用精确 `workspace:0.1.0`，Vite直接消费TS源码。先运行包build生成根dist中的CSS；应用原dev/build入口会先构建包。
- 修改包内组件逻辑沿用应用源码联调；修改样式或新增工具类后重新运行包build，应用监听编译CSS更新。首版不增加独立的长期watch进程。
- `pnpm --filter @linguio/exts-ui build`：生成根 `dist/build/npm/exts-ui` 的ESM、声明、CSS及发布元数据；不在源码包内生成dist。
- `pnpm --filter @linguio/exts-ui verify:npm`：串行类型、逻辑、构建和真实tarball独立消费验证，产物位于根dist。
- 版本由本包package.json单独维护，CHANGELOG为更新唯一来源。首版latest；不创建额外Git tag/Release。正式发布复用仓库NPM Publish，先暂存再人工批准，不自动发布。

React/React DOM peer均为已验证的精确19.3.0，消费方须提供。包为ESM。Tailwind属于本包构建工具，应用不需要安装或扫描Tailwind才能使用预编译样式。
