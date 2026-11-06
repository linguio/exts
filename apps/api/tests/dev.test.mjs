import assert from 'node:assert/strict';
import { join, resolve } from 'node:path';
import test from 'node:test';
import { startApi } from '../scripts/dev.mjs';

for (const [platform, relativePython] of [
  ['win32', ['Scripts', 'python.exe']],
  ['darwin', ['bin', 'python']],
  ['linux', ['bin', 'python']],
]) {
  test(`${platform} 使用项目解释器启用自动重载并传递失败状态`, () => {
    const root = resolve('临时 项目');
    const python = join(root, 'dist', '.cache', 'api', 'venv', ...relativePython);
    let called = false;
    const status = startApi({
      platform,
      root,
      exists: (path) => path === python,
      run: (command, args, options) => {
        called = true;
        assert.equal(command, python);
        assert.deepEqual(args, ['-B', '-m', 'uvicorn', 'app:app', '--host', '127.0.0.1', '--port', '8000', '--reload']);
        assert.equal(options.cwd, join(root, 'apps', 'api'));
        assert.equal(options.stdio, 'inherit');
        assert.notEqual(options.shell, true);
        return { status: 7 };
      },
    });
    assert.equal(called, true);
    assert.equal(status, 7);
  });

  test(`${platform} 缺少虚拟环境时提示准备命令且不启动全局 Python`, () => {
    const messages = [];
    const status = startApi({
      platform,
      exists: () => false,
      run: () => assert.fail('缺少环境时不应启动进程'),
      report: (message) => messages.push(message),
    });
    const output = messages.join('\n');
    assert.equal(status, 1);
    assert.match(output, /3\.12\.13/);
    assert.ok(output.includes(platform === 'win32' ? 'py -3.12 -m venv' : 'python3.12 -m venv'));
    assert.match(output, /requirements-dev\.txt/);
  });
}

test('成功、启动失败和中断返回对应退出状态', () => {
  for (const [result, expected] of [
    [{ status: 0 }, 0],
    [{ error: new Error('无法执行解释器'), status: null }, 1],
    [{ status: null, signal: 'SIGINT' }, 130],
    [{ status: null, signal: 'SIGTERM' }, 143],
  ]) {
    const messages = [];
    assert.equal(startApi({ exists: () => true, run: () => result, report: (message) => messages.push(message) }), expected);
    if (result.error) assert.match(messages.join('\n'), /无法执行解释器/);
  }
});
