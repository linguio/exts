import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { startApi } from '../scripts/dev.mjs';

function fixture(t, platform = 'darwin') {
  const root = mkdtempSync(join(tmpdir(), 'exts api '));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const api = join(root, 'apps', 'api');
  mkdirSync(api, { recursive: true });
  writeFileSync(join(api, '.python-version'), '3.12.13\n');
  writeFileSync(join(api, 'requirements.txt'), 'PyJWT==2.15.1\n');
  writeFileSync(join(api, 'requirements-dev.txt'), '-r requirements.txt\n');
  const venv = join(root, 'dist', '.cache', 'api', 'venv');
  const python = join(venv, ...(platform === 'win32' ? ['Scripts', 'python.exe'] : ['bin', 'python']));
  const calls = [], messages = [];
  let fail;
  const options = {
    root, platform, report: message => messages.push(message),
    run(command, args, options) {
      const step = args.includes('--version') ? 'version' : args.includes('venv') ? 'create'
        : args.includes('pip') ? 'install' : args.includes('uvicorn') ? 'serve' : 'config';
      calls.push({ step, command, args, options });
      if (fail?.step === step) return fail.result;
      if (step === 'create') {
        mkdirSync(join(python, '..'), { recursive: true });
        writeFileSync(python, '');
      }
      return { status: 0, stdout: step === 'version' ? 'Python 3.12.13\n' : '' };
    },
  };
  return { root, api, venv, python, calls, messages, options,
    fail: (step, result) => { fail = { step, result }; },
    existing: () => { mkdirSync(join(python, '..'), { recursive: true }); writeFileSync(python, ''); },
  };
}

for (const platform of ['darwin', 'linux', 'win32']) {
  test(`${platform} 首次启动自动创建环境、安装依赖并保持重载`, t => {
    const f = fixture(t, platform);
    assert.equal(startApi(f.options), 0);
    assert.deepEqual(f.calls.map(call => call.step), ['version', 'create', 'version', 'install', 'config', 'serve']);
    assert.equal(f.calls[0].command, platform === 'win32' ? 'py' : 'python3.12');
    const serve = f.calls.at(-1);
    assert.equal(serve.command, f.python);
    assert.deepEqual(serve.args, ['-B', '-m', 'uvicorn', 'app:app', '--host', '127.0.0.1', '--port', '8000', '--reload']);
    assert.equal(serve.options.cwd, f.api);
    assert.equal(serve.options.stdio, 'inherit');
    assert.notEqual(serve.options.shell, true);
  });
}

test('已有环境首次同步；清单未变跳过安装，两份清单变化分别同步', t => {
  const f = fixture(t);
  f.existing();
  assert.equal(startApi(f.options), 0);
  assert.equal(f.calls.filter(call => call.step === 'install').length, 1);
  f.calls.length = 0;
  assert.equal(startApi(f.options), 0);
  assert.deepEqual(f.calls.map(call => call.step), ['version', 'config', 'serve']);
  for (const file of ['requirements.txt', 'requirements-dev.txt']) {
    writeFileSync(join(f.api, file), readFileSync(join(f.api, file), 'utf8') + '# 清单变化\n');
    f.calls.length = 0;
    assert.equal(startApi(f.options), 0);
    assert.equal(f.calls.filter(call => call.step === 'install').length, 1);
  }
});

test('Python 缺失或版本不符时给出版本提示且不创建环境', t => {
  for (const result of [{ error: new Error('ENOENT') }, { status: 0, stdout: 'Python 3.12.12\n' }]) {
    const f = fixture(t);
    f.fail('version', result);
    assert.equal(startApi(f.options), 1);
    assert.deepEqual(f.calls.map(call => call.step), ['version']);
    assert.match(f.messages.join('\n'), /3\.12\.13/);
  }
});

test('已有环境版本改变时停止并提示重建，不自动删除', t => {
  const f = fixture(t);
  f.existing();
  f.fail('version', { status: 0, stdout: 'Python 3.13.0\n' });
  assert.equal(startApi(f.options), 1);
  assert.ok(existsSync(f.python));
  assert.match(f.messages.join('\n'), /重建/);
});

test('创建或安装失败时停止；安装失败后再次启动会重试', t => {
  for (const step of ['create', 'install']) {
    const f = fixture(t);
    f.fail(step, { status: 1 });
    assert.equal(startApi(f.options), 1);
    assert.ok(!f.calls.some(call => call.step === 'serve'));
    assert.ok(!existsSync(join(f.venv, '.exts-dependencies.sha256')));
    if (step === 'install') {
      f.calls.length = 0;
      f.fail('install', { status: 0 });
      assert.equal(startApi(f.options), 0);
      assert.ok(f.calls.some(call => call.step === 'install'));
    }
  }
});

test('配置检查失败不启动服务，依赖同步成功仍可复用', t => {
  const f = fixture(t);
  f.fail('config', { status: 1 });
  assert.equal(startApi(f.options), 1);
  assert.ok(!f.calls.some(call => call.step === 'serve'));
  f.calls.length = 0;
  f.fail('config', { status: 0 });
  assert.equal(startApi(f.options), 0);
  assert.ok(!f.calls.some(call => call.step === 'install'));
});

test('服务退出、启动错误和中断保留退出状态', t => {
  for (const [result, expected] of [
    [{ status: 7 }, 7], [{ error: new Error('无法执行解释器') }, 1],
    [{ status: null, signal: 'SIGINT' }, 130], [{ status: null, signal: 'SIGTERM' }, 143],
  ]) {
    const f = fixture(t);
    f.fail('serve', result);
    assert.equal(startApi(f.options), expected);
  }
});
