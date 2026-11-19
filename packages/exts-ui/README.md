# @linguio/exts-ui

[English](./README.en.md)

[源码目录](https://github.com/linguio/exts/tree/main/packages/exts-ui) · [npm 包](https://www.npmjs.com/package/@linguio/exts-ui)

基于固定版本 shadcn/ui 源码的基础组件与 Exts 公共增强组件。基础组件保持官方名称，增强组件通过组合提供复制、声音和浮层等通用能力，业务数据与权限留在应用。

## 使用要求

- React 与 React DOM **19.3.0**：使用方需要提供，与本包的精确 peerDependencies 一致。
- 支持 ESM、React 和 CSS 导入的构建环境。
- 通知声音需要浏览器 Web Audio 能力，仍受浏览器自动播放策略约束。

Tailwind 是本包的构建工具。使用方不需要扫描本包源码，也不必为了本包额外安装 Tailwind。

## 快速开始

安装 npm 中已批准发布的精确版本；版本与变更见[更新记录](./CHANGELOG.md)。

```sh
npm install --save-exact @linguio/exts-ui@0.2.0 react@19.3.0 react-dom@19.3.0
```

在应用入口引入样式，并挂载通知宿主：

```tsx
import '@linguio/exts-ui/styles.css';
import { Button } from '@linguio/exts-ui/ui/button';
import { ExtsToaster, toast } from '@linguio/exts-ui/plus/toast';

export function Application() {
  return (
    <ExtsToaster soundEnabled={false}>
      <Button onClick={() => toast.add({ type: 'error', title: '保存失败' })}>
        显示提示
      </Button>
    </ExtsToaster>
  );
}
```

## 公开入口

| 入口 | 用途 |
| --- | --- |
| `@linguio/exts-ui/ui/button` | shadcn 基础按钮 |
| `@linguio/exts-ui/ui/tooltip` | shadcn 基础提示 |
| `@linguio/exts-ui/ui/toast` | shadcn 基础 Toast |
| `@linguio/exts-ui/plus/toast` | ExtsToaster、toast、createToastManager、useExtsToastSound |
| `@linguio/exts-ui/styles.css` | 预编译样式 |

`ui/*` 保留基础能力，`plus/*` 组合增强交互；React 增强组件统一使用 Exts 前缀。官方固定来源及适配差异见 [SOURCES](./SOURCES.md)。

## 通知、复制与声音

- 业务通过 `toast.add` 提供类型、标题和描述；`ExtsToaster` 提供完整文案复制，不改写业务提示。
- 声音默认关闭；启用后只有新 error 提示自动发声，1 秒内限流，不排队或补播。应用负责偏好存储，本包不读取 Chrome API、权限或业务状态。
- `useExtsToastSound()` 需在 `ExtsToaster` 内使用，提供 `preview()`、`setEnabled()`、`subscribe()` 和 `getStatus()`；状态为 idle、ready、paused、unavailable。可用性与试听结果仍受浏览器策略影响。
- 默认 `toast` 与 `ExtsToaster` 使用同一官方管理器。独立通知根可传入 `createToastManager()` 的实例，并向该实例发送通知；同一文档不要为同一管理器重复挂载宿主。
- `portalContainer` 接受 HTMLElement 或 ShadowRoot。Shadow DOM 使用方需把样式注入同一 Shadow DOM，并传入具有主题变量的挂载容器。

## 样式与层级

显式引入 `styles.css`。组件使用 shadcn 语义变量，如 `--background`、`--foreground`、`--popover`、`--border` 和 `--accent`；缺失时采用基础回退。字体继承宿主，不打包字体或全局 reset。

Toast 默认 `--exts-z-toast: 80`，复制 Tooltip 为该值加 1。使用方可在根主题或 Shadow 宿主覆盖变量，以匹配自己的 Sheet、Dialog 层级；不保证覆盖任意第三方浮层或浏览器原生 top layer。关闭、复制与模态浮层的组合需在真实浏览器验收。

## 本地维护与分发

仓库内使用精确 Workspace 引用，扩展 dev/build 先构建本包。组件逻辑通过源码联调；样式或工具类变化后重新运行包 build，当前不维护独立的长期 watch。

```sh
pnpm --filter @linguio/exts-ui build
pnpm --filter @linguio/exts-ui verify:npm
```

构建生成根 `dist/build/npm/exts-ui` 的 ESM、类型声明与 CSS；verify:npm 串行执行类型、逻辑、构建和真实 tarball 独立消费验证。包版本独立维护，CHANGELOG 为包更新来源。

NPM Publish 在 main 推送包含包版本变化时自动验证并上传 npm 暂存区，正式发布由维护者手动批准；保留手动重试，不使用 OIDC，不创建额外 Git tag 或 GitHub Release。

[MIT](./LICENSE) · [第三方许可](./THIRD_PARTY_NOTICES.md) · [更新记录](./CHANGELOG.md)
