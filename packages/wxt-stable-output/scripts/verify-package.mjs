import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdir, mkdtemp, readFile, realpath, symlink, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runNpm, validatePack } from '../../npm-release-tools/publish.mjs';

const packageRoot = fileURLToPath(new URL('../', import.meta.url));
const repoRoot = resolve(packageRoot, '../..');
const require = createRequire(import.meta.url);
const cache = join(repoRoot, 'dist/.cache/npm-verify');
await mkdir(cache, { recursive: true });
const root = await mkdtemp(join(cache, 'wxt-stable-output-'));
const consumer = join(root, 'consumer');
await mkdir(consumer);
const metadata = JSON.parse(await readFile(join(packageRoot, 'package.json'), 'utf8'));
const [pack] = JSON.parse(await runNpm(['pack', '--ignore-scripts', '--json', '--pack-destination', root], { cwd: packageRoot, quiet: true }));
validatePack(pack, metadata);
assert(pack.files.every(file => /^(src\/|README(?:\.zh-CN)?\.md$|LICENSE$|CHANGELOG\.md$|package\.json$)/.test(file.path)), '发布包夹带了测试或验证工具');
await writeFile(join(consumer, 'package.json'), JSON.stringify({ name: 'independent-consumer', private: true, type: 'module' }));
await runNpm(['install', join(root, pack.filename), '--offline', '--ignore-scripts', '--legacy-peer-deps', '--no-audit', '--no-fund', '--package-lock=false'], { cwd: consumer, quiet: true });

// 复用精确版本 peer 的已安装缓存；被验证的工具本体必须来自真实 tarball 安装。
await symlink(await realpath(resolve(dirname(fileURLToPath(import.meta.resolve('wxt'))), '..')), join(consumer, 'node_modules/wxt'), process.platform === 'win32' ? 'junction' : 'dir');
await mkdir(join(consumer, 'node_modules/@types'), { recursive: true });
await symlink(await realpath(dirname(require.resolve('@types/node/package.json'))), join(consumer, 'node_modules/@types/node'), process.platform === 'win32' ? 'junction' : 'dir');
const consumerTypes = join(consumer, 'consumer.mts');
await writeFile(consumerTypes, `import { defineConfig } from 'wxt';\nimport { createStableDevelopmentHooks, publishStableBuild } from '@linguio/wxt-stable-output';\ndefineConfig({ hooks: createStableDevelopmentHooks() });\nconst target: string = (await publishStableBuild({ sourceDir: '/tmp/source', targetDir: '/tmp/stable' })).targetDir;\nvoid target;\n`);
await runNode([join(dirname(require.resolve('typescript/package.json')), 'bin/tsc'), '--noEmit', '--strict', '--skipLibCheck', '--module', 'NodeNext', '--moduleResolution', 'NodeNext', '--target', 'ES2022', consumerTypes], 30000);
const program = join(consumer, 'verify-consumer.mjs');
await writeFile(program, await readFile(new URL('./verify-wxt.mjs', import.meta.url), 'utf8'));
await runNode([program, join(consumer, 'fixture')], 90000);
console.log(`tarball 独立安装、公开类型与真实 WXT 生命周期验证通过\n验证目录：${root}`);

function runNode(args, timeout) {
  return new Promise((resolveResult, reject) => {
    const child = spawn(process.execPath, args, { cwd: consumer, shell: false, windowsHide: true, timeout, stdio: 'inherit' });
    child.on('error', reject);
    child.on('close', code => code === 0 ? resolveResult() : reject(new Error(`独立验证失败：${code}`)));
  });
}
