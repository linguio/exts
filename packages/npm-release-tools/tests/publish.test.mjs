import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { selectPackage, assertUnpublished, validatePack } from '../publish.mjs';

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
