import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { createServer } from 'wxt';
import { createStableDevelopmentHooks } from '@linguio/wxt-stable-output';

const root = process.argv[2];
const target = join(root, 'stable');
const background = join(root, 'entrypoints/background.ts');
await mkdir(join(root, 'entrypoints'), { recursive: true });
await mkdir(join(root, 'public'), { recursive: true });
await writeFile(join(root, 'public/marker.txt'), 'initial-asset');
await writeFile(join(root, 'package.json'), JSON.stringify({ name: 'wxt-integration', version: '1.0.0', private: true, type: 'module' }));
// 保留可手动启动的独立 fixture，用户可在浏览器验收而不用修改业务源码。
await writeFile(join(root, 'wxt.config.ts'), `import { defineConfig } from 'wxt';\nimport { fileURLToPath } from 'node:url';\nimport { createStableDevelopmentHooks } from '@linguio/wxt-stable-output';\nexport default defineConfig({ outDir: 'output', imports: false, webExt: { disabled: true }, manifest: { name: 'Lifecycle fixture', version: '1.0.0' }, hooks: createStableDevelopmentHooks({ targetDir: fileURLToPath(new URL('./stable', import.meta.url)) }) });\n`);
const source = marker => `export default defineBackground(() => { console.log('${marker}'); });\n`;
await writeFile(background, source('initial-marker'));
const logs = [];
const hooks = createStableDevelopmentHooks({ targetDir: target });
const server = await createServer({
  root, configFile: false, outDir: join(root, 'output'), wxtDir: join(root, '.wxt'),
  imports: false, webExt: { disabled: true },
  manifest: { name: 'Lifecycle fixture', version: '1.0.0' },
  hooks,
});

// 只观察构建通知，不启动浏览器或进行页面交互。
const send = server.ws.send.bind(server.ws);
server.ws.send = (...args) => { logs.push(args[0]); return send(...args); };
const watchdog = setTimeout(() => { console.error('真实 WXT 验证超过 60 秒，终止'); process.exit(1); }, 60000);
try {
  // 禁用自动导入时显式使用 WXT 的公开入口。
  const prefix = "import { defineBackground } from 'wxt/utils/define-background';\n";
  await writeFile(background, prefix + source('initial-marker'));
  await server.start();
  assert((await readFile(join(target, 'background.js'), 'utf8')).includes('initial-marker'));
  await waitFor(() => Object.keys(server.watcher.getWatched()).length > 0, 'WXT watcher 就绪');
  await writeFile(background, prefix + source('incremental-marker'));
  await waitFor(async () => (await readFile(join(target, 'background.js'), 'utf8')).includes('incremental-marker'), '增量脚本同步');
  await waitFor(() => logs.includes('wxt:reload-extension'), '同步后转发重载');
  const assetNotifyCount = logs.filter(event => event === 'wxt:reload-extension').length;
  await writeFile(join(root, 'public/marker.txt'), 'incremental-asset');
  await waitFor(async () => (await readFile(join(target, 'marker.txt'), 'utf8')) === 'incremental-asset', '增量静态资源同步');
  await waitFor(() => logs.filter(event => event === 'wxt:reload-extension').length > assetNotifyCount, '静态资源重载通知');
  const beforeFailure = await readFile(join(target, 'background.js'), 'utf8');
  const beforeOutput = server.currentOutput;
  const notifyCount = logs.filter(event => event === 'wxt:reload-extension').length;
  await writeFile(background, prefix + "export default defineBackground(() => { void import('../missing-dependency'); });");
  await new Promise(resolve => setTimeout(resolve, 2200));
  assert.equal(server.currentOutput, beforeOutput, '失败构建不应替换成功报告');
  assert.equal(await readFile(join(target, 'background.js'), 'utf8'), beforeFailure);
  assert.equal(logs.filter(event => event === 'wxt:reload-extension').length, notifyCount);
  await writeFile(background, prefix + source('recovered-marker'));
  await waitFor(async () => (await readFile(join(target, 'background.js'), 'utf8')).includes('recovered-marker'), '失败后恢复同步');
  await server.restart();
  assert((await readFile(join(target, 'background.js'), 'utf8')).includes('recovered-marker'));
  console.log('真实 WXT：首次构建、增量脚本与静态资源同步、失败保留、恢复及完整重启通过');
} finally {
  await server.stop();
  clearTimeout(watchdog);
}

async function waitFor(check, label) {
  const deadline = Date.now() + 15000;
  while (Date.now() < deadline) {
    try {
      if (await check()) return;
    } catch (error) {
      // 两次 rename 间允许短暂缺失；只重试这一已声明的目录切换窗口。
      if (error.code !== 'ENOENT') throw error;
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw new Error(`${label} 超时`);
}
