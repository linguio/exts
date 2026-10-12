# @linguio/wxt-stable-output

[English](./README.md)

为 WXT 开发模式维护稳定的扩展加载目录，保留上一份校验完整的成功产物。

## 解决的问题

WXT 完整启动或重启开发服务器时，会先清空工作产物目录。浏览器直接加载该目录时，如果恰好读取文件，可能出现 Manifest、页面或脚本缺失。工具将完整产物发布到另一份稳定目录，失败时保留旧产物。

普通页面热更新仍由 WXT/Vite 负责。当前新标签页 HTML 从 localhost 加载页面代码，不需要每次 HMR 都复制目录。稳定产物不是离线运行包，也不消除重载导致的上下文失效。

## 支持范围与接入

首版验证 WXT 0.21.4、Node.js 24.16.0，面向 Chrome/Edge 已解压扩展。WXT 使用精确 peer dependency，未验证版本不宣称兼容。

~~~sh
npm install --save-dev --save-exact @linguio/wxt-stable-output@1.0.0 wxt@0.21.4
~~~

~~~ts
import { defineConfig } from 'wxt';
import { createStableDevelopmentHooks } from '@linguio/wxt-stable-output';

export default defineConfig({
  hooks: {
    ...createStableDevelopmentHooks(),
  },
});
~~~

继续运行原开发命令，首次成功后加载 .output/chrome-mv3-dev-stable；自定义 outDir 时默认使用实际开发输出目录加 -stable。

本仓库只加载根 dist/dev/chrome-mv3-dev-stable，临时产物位于根 dist/.cache/extension/chrome-mv3-dev。正式构建不生成稳定副本。页面及 HMR 仍依赖运行中的开发服务器。

## 更新方式

- 完整构建在 build:done 发布。
- 增量磁盘构建成功后，在 WXT 发出扩展、页面或 content script 重载通知前同步。
- 通知参数与上下文保留，仍返回 void；同步期间通知延迟。同一成功报告不重复复制。
- 校验或替换失败记录错误并取消这次重载，保留旧产物；后续成功构建可以恢复。
- 关闭或重启使旧通知失效；页面模块 HMR 不被拦截。

接入后不要自行替换 reloadExtension、reloadPage、reloadContentScript。组合其他 hook 时保留全部 hooks；覆盖 build:done 时委托原 hook：

~~~ts
const stable = createStableDevelopmentHooks({ targetDir: '/absolute/path/to/stable' });
export default defineConfig({
  hooks: {
    ...stable,
    'build:done': async (wxt, output) => {
      await stable['build:done'](wxt, output);
    },
  },
});
~~~

也可设置 suffix: '-browser'。源与目标不能相同或互为父子目录。不同浏览器/Manifest 使用不同目标，每个目标只运行一个 WXT 进程。

## 直接发布完整产物

~~~ts
import { publishStableBuild } from '@linguio/wxt-stable-output';
const result = await publishStableBuild({
  sourceDir: '/absolute/path/to/complete-build',
  targetDir: '/absolute/path/to/stable',
  requiredFiles: ['background.js'],
});
~~~

始终校验 manifest.json；其他必需路径必须在源目录内，不得包含绝对路径或 ..。返回 targetDir，旧目录清理失败时还有 backupDir。StableDevelopmentError.code 在有底层文件系统错误码时提供诊断。

## 保证与限制

先校验源与暂存副本，再以同级备份和 rename 替换；失败尝试恢复，恢复失败报告备份路径。两次 rename 间目标存在短暂缺失，不是绝对无间断的原子交换。

校验 Manifest 字段与构建报告文件存在，不代表逻辑正确。复制期间存在并发写入时，不保证逐字节快照；每个目标只运行一个 WXT 进程。

## 验证与维护

~~~sh
pnpm --filter @linguio/wxt-stable-output test
pnpm --filter @linguio/wxt-stable-output typecheck
pnpm --filter @linguio/wxt-stable-output verify:integration
~~~

验证器安装真实 tarball 到独立消费者，复用本地精确版本 peer 缓存，检查公开类型及真实 WXT 首次构建、增量 background 更新、失败保留、恢复和重启，不启动浏览器。Chrome/Edge 实际使用由用户验收。

仓库内继续使用本地 workspace，外部使用 npm 版本；包版本独立于产品版本。发布维护见仓库 docs/npm-release.md。MIT 许可证见 [LICENSE](./LICENSE)。
