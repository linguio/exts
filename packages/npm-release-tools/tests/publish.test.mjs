import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm, realpath } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import * as release from '../publish.mjs';
import { selectPackage, assertUnpublished, validatePack } from '../publish.mjs';

test('npm CLI 按平台解析安装路径，显式路径优先', () => {
  assert.equal(typeof release.resolveNpmCli, 'function');
  for (const platform of ['linux', 'darwin']) {
    assert.equal(release.resolveNpmCli({
      execPath: '/opt/node/24.16.0/bin/node', platform, env: {},
    }), '/opt/node/24.16.0/lib/node_modules/npm/bin/npm-cli.js');
  }
  assert.equal(release.resolveNpmCli({
    execPath: 'C:\\Program Files\\nodejs\\node.exe', platform: 'win32', env: {},
  }), 'C:\\Program Files\\nodejs\\node_modules\\npm\\bin\\npm-cli.js');
  assert.equal(release.resolveNpmCli({
    execPath: '/opt/node/bin/node', platform: 'linux', env: { NPM_CLI_PATH: '/custom/npm-cli.js' },
  }), '/custom/npm-cli.js');
});

test('只选择明确允许发布的包，拒绝非法输入、私有包和重复包', async () => {
  const root = await mkdtemp(join(tmpdir(), 'npm-release-'));
  try {
    await mkdir(join(root, 'packages', 'one'), { recursive: true });
    const metadata = {
      name: '@linguio/one', version: '1.0.0', publishConfig: { access: 'public' },
      npmRelease: { verify: 'verify:npm' }, scripts: { 'verify:npm': 'node verify.mjs' },
    };
    const save = value => writeFile(join(root, 'packages', 'one', 'package.json'), JSON.stringify(value));
    await save(metadata);
    assert.equal((await selectPackage(root, '@linguio/one')).metadata.version, '1.0.0');
    await assert.rejects(selectPackage(root, '@linguio/one; echo secret'));
    await save({ ...metadata, private: true });
    await assert.rejects(selectPackage(root, '@linguio/one'), /私有/);
    await save(metadata);
    await mkdir(join(root, 'packages', 'two'));
    await writeFile(join(root, 'packages', 'two', 'package.json'), JSON.stringify(metadata));
    await assert.rejects(selectPackage(root, '@linguio/one'), /唯一/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('仅 registry 404 表示未发布，已有版本和网络错误中止', async () => {
  await assertUnpublished('@linguio/one', '1.0.0', async () => ({ status: 404 }));
  await assert.rejects(assertUnpublished('@linguio/one', '1.0.0', async () => ({ status: 200 })), /已发布/);
  await assert.rejects(assertUnpublished('@linguio/one', '1.0.0', async () => ({ status: 503 })), /查询失败/);
  await assert.rejects(assertUnpublished('@linguio/one', '1.0.0', async () => { throw new Error('offline'); }), /offline/);
});

test('拒绝包身份不符或危险的打包清单', () => {
  const metadata = { name: '@linguio/one', version: '1.0.0' };
  const pack = { ...metadata, files: [{ path: 'package.json' }, { path: 'src/index.mjs' }] };
  assert.doesNotThrow(() => validatePack(pack, metadata));
  assert.throws(() => validatePack({ ...pack, version: '2.0.0' }, metadata), /不一致/);
  for (const path of ['../secret', '.env', 'src/.env.production', 'node_modules/secret', '.cache/a']) {
    assert.throws(() => validatePack({ ...pack, files: [{ path }] }, metadata));
  }
});

test('Actions 只暂存校验过的产物，上传失败或产物被篡改时中止', async t => {
  assert.equal(typeof release.stagePackage, 'function', '发布器尚未提供暂存流程');
  const root = await realpath(await mkdtemp(join(tmpdir(), 'npm-stage-')));
  try {
    const directory = join(root, 'packages', 'one');
    const artifact = join(root, 'dist', 'artifact');
    await mkdir(directory, { recursive: true });
    await mkdir(artifact, { recursive: true });
    const metadata = {
      name: '@linguio/one', version: '1.0.0', publishConfig: { access: 'public' },
      npmRelease: { verify: 'verify:npm' }, scripts: { 'verify:npm': 'node verify.mjs' },
    };
    await writeFile(join(directory, 'package.json'), JSON.stringify(metadata));
    const tarball = join(artifact, 'linguio-one-1.0.0.tgz');
    await writeFile(tarball, 'verified-build');
    await writeFile(join(artifact, 'release.json'), JSON.stringify({
      name: metadata.name, version: metadata.version, filename: 'linguio-one-1.0.0.tgz',
      commit: 'source-commit', sha512: createHash('sha512').update('verified-build').digest('hex'),
    }));
    const pack = { ...metadata, files: [{ path: 'package.json' }] };
    const calls = [];
    const options = {
      root, env: { GITHUB_ACTIONS: 'true', GITHUB_SHA: 'source-commit' },
      request: async () => ({ status: 404 }),
      run: async args => {
        calls.push(args);
        return JSON.stringify(args[0] === 'pack' ? [pack] : { [metadata.name]: { ...pack, stageId: 'stage-123' } });
      },
    };
    await t.test('成功后返回暂存编号，不执行直接发布或批准', async () => {
      const result = await release.stagePackage(metadata.name, artifact, options);
      assert.deepEqual(result, { name: metadata.name, version: '1.0.0', stageId: 'stage-123' });
      assert.deepEqual(calls.map(args => args.slice(0, 2)), [['pack', tarball], ['stage', 'publish']]);
      assert.equal(calls[1][2], tarball);
    });
    await t.test('上传失败不产生成功结果', async () => {
      await assert.rejects(release.stagePackage(metadata.name, artifact, {
        ...options, run: async args => {
          if (args[0] === 'stage') throw new Error('registry staging failed');
          return JSON.stringify([pack]);
        },
      }), error => {
        assert.match(error.message, /registry staging failed/);
        assert.match(error.message, /Staged Packages/);
        assert.match(error.message, /不要重复上传/);
        assert.match(error.message, /拒绝.*重新运行/);
        assert.equal(error.cause?.message, 'registry staging failed');
        return true;
      });
    });
    await t.test('暂存成功但返回缺少编号时提示检查，不重传', async () => {
      await assert.rejects(release.stagePackage(metadata.name, artifact, {
        ...options, run: async args => JSON.stringify(args[0] === 'pack' ? [pack] : { [metadata.name]: pack }),
      }), /检查.*不要重传/);
    });
    await t.test('源码提交不符或产物被篡改时不调用 npm', async () => {
      calls.length = 0;
      await assert.rejects(release.stagePackage(metadata.name, artifact, {
        ...options, env: { GITHUB_ACTIONS: 'true', GITHUB_SHA: 'other-commit' },
      }), /同一 GitHub Actions 提交/);
      await writeFile(tarball, 'tampered');
      await assert.rejects(release.stagePackage(metadata.name, artifact, options), /校验和/);
      assert.deepEqual(calls, []);
    });
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
