# @linguio/wxt-stable-output

[English](./README.md)

[源码目录](https://github.com/linguio/exts/tree/main/packages/wxt-stable-output) · [npm 包](https://www.npmjs.com/package/@linguio/wxt-stable-output)

为 WXT 开发模式提供稳定的扩展加载目录。WXT 重建时，临时输出目录可能被清空，或尚未完整生成。如果 Chrome/Edge 直接加载这个目录，在此期间重载扩展或打开新标签页，可能因 Manifest 或页面资源缺失而加载失败；构建失败后，临时目录也可能没有可用产物。

浏览器改为加载稳定目录后，只有构建成功且产物校验通过时才更新，构建失败则保留上一份成功产物。增量磁盘构建也会在发送重载通知前同步。它保护的是磁盘上的构建产物，不修复代码错误，也不替代 WXT/Vite 开发服务器。

## 使用要求

- WXT **0.21.4**：已通过 `peerDependencies` 声明，使用方项目需要提供。
- Node.js **24.16.0**：已通过 `engines` 声明。
- 扩展加载流程面向 Chrome 和 Edge。

本包的 `devDependencies` 是维护、类型检查和测试本包所用的工具，不能代替上面的使用要求。

## 快速开始

```sh
npm install --save-dev --save-exact @linguio/wxt-stable-output@1.0.1 wxt@0.21.4
```

在 `wxt.config.ts` 中接入：

```ts
import { defineConfig } from 'wxt';
import { createStableDevelopmentHooks } from '@linguio/wxt-stable-output';

export default defineConfig({
  hooks: {
    ...createStableDevelopmentHooks(),
  },
});
```

运行原有 WXT 开发命令，首次构建成功后，将 `.output/chrome-mv3-dev-stable` 作为已解压扩展加载。自定义 `outDir` 时，稳定目录默认为实际开发输出路径加 `-stable`。

完整构建和增量磁盘构建会在 WXT 发出重载通知前同步稳定目录。页面热更新仍由 WXT/Vite 提供，正式构建不生成稳定副本。

## 配置

```ts
createStableDevelopmentHooks({ suffix: '-stable' });
createStableDevelopmentHooks({ targetDir: '/absolute/path/to/stable-extension' });
```

- `suffix`：目录后缀，默认为 `-stable`。
- `targetDir`：自定义稳定目录，设置后不再使用后缀推导路径。

保留返回的全部 hooks；覆盖某个 hook 时，也要调用原 hook。接入后不要替换 WXT 的 `reloadExtension`、`reloadPage` 或 `reloadContentScript` 方法。

## 直接发布构建产物

```ts
import { publishStableBuild } from '@linguio/wxt-stable-output';

await publishStableBuild({
  sourceDir: '/absolute/path/to/build',
  targetDir: '/absolute/path/to/stable-extension',
  requiredFiles: ['background.js'],
});
```

始终要求 `manifest.json` 存在。其他必需文件使用源目录内的相对路径，不得含 `..`。返回值包含 `targetDir`；备份清理失败时还包含 `backupDir`。`StableDevelopmentError.code` 在可用时提供文件系统错误码。

## 使用限制

- 保持开发服务器运行，页面可能依赖 localhost 资源。
- 每个目标只运行一个 WXT 进程，源目录与目标目录不能重叠。
- 目录替换存在短暂间隙。失败时尝试恢复旧目录；恢复失败时，错误会提供备份路径。
- 校验范围为 Manifest 字段和文件存在性，不验证代码逻辑；并发写入时不保证一致快照。

[MIT](./LICENSE) · [更新记录](./CHANGELOG.md)
