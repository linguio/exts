import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { runNpm, validatePack } from '../../npm-release-tools/publish.mjs';

const source = fileURLToPath(new URL('../', import.meta.url));
const compiled = fileURLToPath(new URL('../../../dist/build/npm/exts-ui/', import.meta.url));
const fixture = fileURLToPath(new URL(`../../../dist/.cache/exts-ui-verify/${randomUUID()}/`, import.meta.url));
await mkdir(fixture, { recursive: true });
const metadata = JSON.parse(await readFile(join(source, 'package.json'), 'utf8'));
const [pack] = JSON.parse(await runNpm(['pack', '--json', '--ignore-scripts', '--pack-destination', fixture], { cwd: compiled, quiet: true }));
validatePack(pack, metadata);
const names = new Set(pack.files.map(file => file.path));
for (const name of ['styles.css', 'styles.css.d.ts', 'plus/toast/index.js', 'plus/toast/index.d.ts', 'ui/toast.js', 'ui/button.js', 'ui/tooltip.js', 'README.md', 'README.en.md', 'LICENSE', 'THIRD_PARTY_NOTICES.md']) {
  if (!names.has(name)) throw new Error(`发布包缺少 ${name}`);
}
if ([...names].some(name => /^(src|scripts|tests)\//.test(name))) throw new Error('发布包包含维护源码或测试');
const tarball = join(fixture, pack.filename);
await writeFile(join(fixture, 'package.json'), JSON.stringify({
  name: 'exts-ui-independent-consumer', private: true, type: 'module',
  dependencies: { '@linguio/exts-ui': `file:${tarball.replaceAll('\\', '/')}`, react: '19.3.0', 'react-dom': '19.3.0' },
  devDependencies: { '@types/react': '19.3.0', '@types/react-dom': '19.3.0', typescript: '7.0.2', vite: '8.3.0' },
}, null, 2));
// 使用真正安装的 tarball，不链接应用源码、根 node_modules 或私有路径。
await runNpm(['install', '--ignore-scripts', '--no-audit', '--no-fund', '--package-lock=false'], { cwd: fixture, quiet: true, timeout: 180000 });
await writeFile(join(fixture, 'main.tsx'), `import React from 'react';
import { createRoot } from 'react-dom/client';
import { Button } from '@linguio/exts-ui/ui/button';
import { ExtsToaster, toast } from '@linguio/exts-ui/plus/toast';
import '@linguio/exts-ui/styles.css';
createRoot(document.getElementById('root')!).render(<ExtsToaster soundEnabled={false}><Button onClick={() => toast.add({ type: 'error', title: 'Fixture' })}>Notify</Button></ExtsToaster>);
`);
await writeFile(join(fixture, 'index.html'), '<!doctype html><html><head><title>Exts UI consumer</title></head><body><div id="root"></div><script type="module" src="/main.tsx"></script></body></html>');
await writeFile(join(fixture, 'tsconfig.json'), JSON.stringify({ compilerOptions: { target: 'ES2022', module: 'ESNext', moduleResolution: 'Bundler', jsx: 'react-jsx', strict: true, skipLibCheck: true, noEmit: true }, include: ['main.tsx'] }));
function run(tool, args) {
  const result = spawnSync(process.execPath, [join(fixture, 'node_modules', tool), ...args], { cwd: fixture, stdio: 'inherit', timeout: 60000 });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`独立消费者失败：${tool}`);
}
run('typescript/bin/tsc', ['--noEmit']);
run('vite/bin/vite.js', ['build', '--outDir', 'build', '--logLevel', 'error']);
const probe = `import { ExtsToaster, toast, createToastManager } from '@linguio/exts-ui/plus/toast';
import { Button } from '@linguio/exts-ui/ui/button';
import { Toaster, toast as baseToast } from '@linguio/exts-ui/ui/toast';
import { createRequire } from 'node:module';
if (typeof ExtsToaster !== 'function' || typeof Button !== 'function' || typeof Toaster !== 'function' || typeof toast.add !== 'function' || typeof createToastManager !== 'function' || baseToast !== toast) throw Error('公开运行时入口或统一管理器无效');
const host = createRequire(new URL('./package.json', import.meta.url));
const component = createRequire(import.meta.resolve('@linguio/exts-ui/plus/toast'));
if (host.resolve('react') !== component.resolve('react')) throw Error('消费者与组件包使用了不同React实例');
const radix = createRequire(component.resolve('radix-ui'));
const dialog = createRequire(radix.resolve('@radix-ui/react-dialog'));
if (component.resolve('@radix-ui/react-dismissable-layer') !== dialog.resolve('@radix-ui/react-dismissable-layer')) throw Error('Toast与Dialog使用了不同Radix分支上下文');`;
const result = spawnSync(process.execPath, ['--input-type=module', '-e', probe], { cwd: fixture, stdio: 'inherit', timeout: 30000 });
if (result.error || result.status !== 0) throw result.error ?? new Error('公开ESM入口导入失败');
console.log(`真实tarball独立类型与构建验证通过：${fixture}\n包：${tarball}\n尚未上传或发布`);
