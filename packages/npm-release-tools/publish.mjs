import { spawn } from 'node:child_process';
import { createHash, randomUUID } from 'node:crypto';
import { access, appendFile, mkdir, readFile, readdir, realpath, writeFile } from 'node:fs/promises';
import { isAbsolute, join, posix, relative, resolve, sep, win32 } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const registry = 'https://registry.npmjs.org';
const repositoryRoot = fileURLToPath(new URL('../../', import.meta.url));

export async function selectPackage(root, name) {
  if (!/^@linguio\/[a-z0-9][a-z0-9-]*$/.test(name)) throw new Error('请输入完整的 @linguio/包名，不接受目录或命令');
  const packagesRoot = await realpath(join(root, 'packages'));
  const matches = [];
  for (const entry of await readdir(packagesRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const directory = await realpath(join(packagesRoot, entry.name));
    if (!isInside(packagesRoot, directory)) throw new Error('包目录超出 packages');
    let metadata;
    try {
      metadata = JSON.parse(await readFile(join(directory, 'package.json'), 'utf8'));
    } catch (error) {
      if (error.code === 'ENOENT') continue;
      throw error;
    }
    if (metadata.name === name) matches.push({ directory, metadata });
  }
  if (matches.length !== 1) throw new Error('包名必须唯一且存在于 packages');
  const selected = matches[0];
  const { metadata } = selected;
  if (metadata.private) throw new Error('禁止发布私有包');
  if (metadata.publishConfig?.access !== 'public') throw new Error('包必须明确配置 public');
  if (metadata.publishConfig?.registry && metadata.publishConfig.registry.replace(/\/$/, '') !== registry) throw new Error('只允许 npm 官方 registry');
  if (!/^\d+\.\d+\.\d+$/.test(metadata.version)) throw new Error('请先提交明确的三段版本号');
  const verify = metadata.npmRelease?.verify;
  if (!/^[a-zA-Z0-9:-]+$/.test(verify ?? '') || !metadata.scripts?.[verify]) throw new Error('包必须声明 npmRelease.verify 验证脚本');
  return selected;
}

export async function assertUnpublished(name, version, request = fetch) {
  const response = await request(`${registry}/${encodeURIComponent(name)}/${encodeURIComponent(version)}`, { signal: AbortSignal.timeout(20000) });
  if (response.status === 404) return;
  if (response.status === 200) throw new Error(`${name}@${version} 已发布，不能覆盖，请提升版本`);
  throw new Error(`npm 版本查询失败：HTTP ${response.status}，停止发布`);
}

export function validatePack(pack, metadata) {
  if (pack.name !== metadata.name || pack.version !== metadata.version) throw new Error('tarball 包名或版本与批准元信息不一致');
  if (!Array.isArray(pack.files) || !pack.files.some(file => file.path === 'package.json')) throw new Error('tarball 缺少 package.json');
  for (const { path } of pack.files) {
    const parts = path?.replaceAll('\\', '/').split('/') ?? [];
    if (!path || isAbsolute(path) || /^[A-Za-z]:/.test(path) || parts.some(part => part === '..' || part === 'node_modules' || part === '.cache' || part === '.git' || part.startsWith('.env'))) {
      throw new Error(`tarball 包含不允许的文件：${path}`);
    }
  }
}

export function resolveNpmCli({ execPath = process.execPath, platform = process.platform, env = process.env } = {}) {
  if (env.NPM_CLI_PATH != null) return env.NPM_CLI_PATH;
  const path = platform === 'win32' ? win32 : posix;
  const directory = path.dirname(execPath);
  // Unix 全局包位于安装前缀的 lib 下，Windows 位于 Node 所在目录。
  return platform === 'win32'
    ? path.resolve(directory, 'node_modules/npm/bin/npm-cli.js')
    : path.resolve(directory, '../lib/node_modules/npm/bin/npm-cli.js');
}

// 直接运行 npm CLI，避免 Windows .cmd 和用户输入进入 Shell 拼接。
export async function runNpm(args, { cwd = repositoryRoot, timeout = 120000, quiet = false } = {}) {
  const cli = resolveNpmCli();
  await access(cli);
  return new Promise((resolveResult, reject) => {
    const child = spawn(process.execPath, [cli, ...args], {
      cwd, shell: false, windowsHide: true, timeout,
      env: { ...process.env, npm_config_cache: join(repositoryRoot, 'dist/.cache/npm-cli'), npm_config_update_notifier: 'false' },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', data => {
      stdout += data;
      if (!quiet) process.stdout.write(data);
    });
    child.stderr.on('data', data => {
      stderr += data;
      if (!quiet) process.stderr.write(data);
    });
    child.on('error', reject);
    child.on('close', code => code === 0 ? resolveResult(stdout) : reject(new Error(`npm ${args[0]} 失败（${code}）：${stderr.slice(-1500)}`)));
  });
}

function isInside(parent, child) {
  const path = relative(parent, child);
  return path !== '' && path !== '..' && !path.startsWith(`..${sep}`) && !isAbsolute(path);
}

async function hashFile(path) {
  return createHash('sha512').update(await readFile(path)).digest('hex');
}

async function prepare(name) {
  const { directory, metadata } = await selectPackage(repositoryRoot, name);
  await assertUnpublished(name, metadata.version);
  await runNpm(['run', metadata.npmRelease.verify], { cwd: directory, timeout: 300000 });
  const artifact = join(repositoryRoot, 'dist/.cache/npm-release', `${name.slice(9)}-${randomUUID()}`);
  await mkdir(artifact, { recursive: true });
  const [pack] = JSON.parse(await runNpm(['pack', '--json', '--ignore-scripts', '--pack-destination', artifact], { cwd: directory, quiet: true }));
  validatePack(pack, metadata);
  if (pack.filename !== `${metadata.name.slice(1).replace('/', '-')}-${metadata.version}.tgz`) throw new Error('打包文件名不符合预期');
  const receipt = {
    name, version: metadata.version, filename: pack.filename,
    sha512: await hashFile(join(artifact, pack.filename)),
    commit: process.env.GITHUB_SHA ?? null,
  };
  await writeFile(join(artifact, 'release.json'), `${JSON.stringify(receipt, null, 2)}\n`);
  console.log(`验证与打包完成：${name}@${metadata.version}\n产物：${artifact}\n尚未发布`);
  if (process.env.GITHUB_OUTPUT) await appendFile(process.env.GITHUB_OUTPUT, `artifact=${artifact}\nversion=${metadata.version}\n`);
}

export async function stagePackage(name, artifactPath, {
  root = repositoryRoot, run = runNpm, request = fetch, env = process.env,
} = {}) {
  root = await realpath(root);
  const { metadata } = await selectPackage(root, name);
  const artifact = await realpath(resolve(artifactPath));
  if (!isInside(root, artifact)) throw new Error('暂存产物必须在当前仓库中');
  const receipt = JSON.parse(await readFile(join(artifact, 'release.json'), 'utf8'));
  const expectedFilename = `${metadata.name.slice(1).replace('/', '-')}-${metadata.version}.tgz`;
  if (receipt.name !== name || receipt.version !== metadata.version || receipt.filename !== expectedFilename) throw new Error('发布凭据与所选包或版本不一致');
  if (!env.GITHUB_ACTIONS || !env.GITHUB_SHA || receipt.commit !== env.GITHUB_SHA) throw new Error('暂存仅允许同一 GitHub Actions 提交');
  const tarball = join(artifact, receipt.filename);
  if (await hashFile(tarball) !== receipt.sha512) throw new Error('tarball 校验和不一致');
  const [pack] = JSON.parse(await run(['pack', tarball, '--dry-run', '--json', '--ignore-scripts'], { quiet: true }));
  validatePack(pack, metadata);
  await assertUnpublished(name, metadata.version, request);
  const output = await run(['stage', 'publish', tarball, '--access', 'public', '--registry', registry, '--ignore-scripts', '--json'], { quiet: true });
  let staged;
  try {
    staged = JSON.parse(output)[name];
  } catch {
    throw new Error('暂存命令已成功但结果无法解析；请检查 npm Staged Packages，不要重传同版本');
  }
  if (!staged?.stageId || typeof staged.stageId !== 'string' || staged.name !== name || staged.version !== metadata.version) {
    throw new Error('暂存命令已成功但编号或包信息不完整；请检查 npm Staged Packages，不要重传同版本');
  }
  console.log(`已暂存：${name}@${metadata.version}\n暂存编号：${staged.stageId}\n请在 npm Staged Packages 审核并完成 2FA 批准；尚未正式发布`);
  if (env.GITHUB_STEP_SUMMARY) await appendFile(env.GITHUB_STEP_SUMMARY,
    `已暂存 **${name}@${metadata.version}**，尚未正式发布\n\n暂存编号：\`${staged.stageId}\`\n\n源码提交：${env.GITHUB_SHA}\n\n请登录 [npm](https://www.npmjs.com/)，在 **Staged Packages** 核对包名、版本及文件，完成 2FA 后点击 **Approve**。\n\n不要重新运行 workflow 上传同版本；需要撤销时在 npm 中拒绝暂存项。\n`);
  return { name, version: metadata.version, stageId: staged.stageId };
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  const [mode, name, artifact] = process.argv.slice(2);
  try {
    if (mode === 'prepare') await prepare(name);
    else if (mode === 'stage' && artifact) await stagePackage(name, artifact);
    else throw new Error('用法：node publish.mjs prepare <包名> 或 stage <包名> <产物目录>');
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
