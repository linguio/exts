import { spawnSync } from 'node:child_process';
import { mkdir, readFile, writeFile, readdir, copyFile, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join, relative, isAbsolute } from 'node:path';

const directory = fileURLToPath(new URL('../', import.meta.url));
const output = fileURLToPath(new URL('../../../dist/build/npm/exts-ui/', import.meta.url));
const cssOutput = fileURLToPath(new URL('../../../dist/.cache/exts-ui-css/styles.css', import.meta.url));
function run(relative, args) {
  const result = spawnSync(process.execPath, [join(directory, 'node_modules', relative), ...args], { cwd: directory, stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`组件包构建失败：${relative}`);
}
// 只清理本包的独立目标，不清理公共产物父目录。
const distRoot = fileURLToPath(new URL('../../../dist/', import.meta.url));
const outputRelative = relative(distRoot, output);
if (!outputRelative || outputRelative.startsWith('..') || isAbsolute(outputRelative)) throw new Error('组件包目标目录越界');
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
run('typescript/bin/tsc', ['-p', 'tsconfig.json']);
run('vite/bin/vite.js', ['build', '--config', 'vite.styles.config.ts']);
async function rewrite(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = join(directory, entry.name);
    if (entry.isDirectory()) await rewrite(file);
    else if (/\.(js|ts)$/.test(entry.name)) {
      const source = await readFile(file, 'utf8');
      await writeFile(file, source.replace(/(from\s*['"]|import\s*['"])(\.[^'"]+)(['"])/g, (match, before, path, after) => /\.(js|css)$/.test(path) ? match : `${before}${path}.js${after}`));
    }
  }
}
await rewrite(output);
await copyFile(cssOutput, join(output, 'styles.css'));
const metadata = JSON.parse(await readFile(join(directory, 'package.json'), 'utf8'));
metadata.exports = Object.fromEntries(Object.entries(metadata.exports).map(([name, source]) => name.endsWith('.css')
  ? [name, { types: './styles.css.d.ts', default: './styles.css' }]
  : [name, { types: source.replace('./src/', './').replace(/\.tsx?$/, '.d.ts'), import: source.replace('./src/', './').replace(/\.tsx?$/, '.js') }]));
delete metadata.devDependencies;
delete metadata.scripts;
delete metadata.npmRelease;
metadata.files = ['ui', 'plus', 'lib', 'styles.css', 'styles.css.d.ts', 'README.md', 'CHANGELOG.md', 'LICENSE', 'SOURCES.md', 'THIRD_PARTY_NOTICES.md'];
await writeFile(join(output, 'styles.css.d.ts'), 'export {};\n');
await writeFile(join(output, 'package.json'), `${JSON.stringify(metadata, null, 2)}\n`);
for (const name of ['README.md', 'CHANGELOG.md', 'LICENSE', 'SOURCES.md', 'THIRD_PARTY_NOTICES.md']) await copyFile(join(directory, name), join(output, name));
console.log(`组件包已构建：${output}`);
