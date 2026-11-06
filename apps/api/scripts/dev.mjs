import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = fileURLToPath(new URL('../../../', import.meta.url));

function exitStatus(result) {
  return result.status ?? ({ SIGINT: 130, SIGTERM: 143 }[result.signal] ?? 1);
}

export function startApi({
  platform = process.platform,
  root = repositoryRoot,
  run = spawnSync,
  report = console.error,
} = {}) {
  const windows = platform === 'win32';
  const api = join(root, 'apps', 'api');
  const venv = join(root, 'dist', '.cache', 'api', 'venv');
  const python = join(venv, ...(windows ? ['Scripts', 'python.exe'] : ['bin', 'python']));
  const marker = join(venv, '.exts-dependencies.sha256');
  try {
    const version = readFileSync(join(api, '.python-version'), 'utf8').trim();
    const launcher = windows ? 'py' : `python${version.split('.').slice(0, 2).join('.')}`;
    const launcherArgs = windows ? [`-${version.split('.').slice(0, 2).join('.')}`] : [];
    function checkVersion(command, args, existing) {
      const result = run(command, [...args, '--version'], {
        cwd: api, encoding: 'utf8', timeout: 10_000,
      });
      if (result.error || result.status !== 0 || result.stdout?.trim() !== `Python ${version}`) {
        report(existing
          ? `API 虚拟环境需要 Python ${version}。请确认该版本已安装后，手动移除并重建 dist/.cache/api/venv；现有环境未删除。`
          : `未找到可用的 Python ${version}。请先安装该精确版本，并确认 ${[command, ...args, '--version'].join(' ')} 输出一致，再重新启动。`);
        return false;
      }
      return true;
    }

    if (!existsSync(python)) {
      if (!checkVersion(launcher, launcherArgs, false)) return 1;
      report('正在创建 API 虚拟环境…');
      mkdirSync(join(root, 'dist', '.cache', 'api'), { recursive: true });
      const result = run(launcher, [...launcherArgs, '-m', 'venv', venv], { cwd: api, stdio: 'inherit' });
      if (result.error || exitStatus(result) !== 0) {
        report('API 虚拟环境创建失败，请检查 Python 安装和目录权限后重新启动。');
        return exitStatus(result) || 1;
      }
    }
    if (!checkVersion(python, [], true)) return 1;

    const digest = createHash('sha256')
      .update(version).update('\0')
      .update(readFileSync(join(api, 'requirements.txt'))).update('\0')
      .update(readFileSync(join(api, 'requirements-dev.txt'))).digest('hex');
    if (!existsSync(marker) || readFileSync(marker, 'utf8').trim() !== digest) {
      report('正在同步 API Python 依赖（首次启动或依赖清单已变化）…');
      const result = run(python, ['-m', 'pip', 'install', '-r', 'requirements-dev.txt'], {
        cwd: api, stdio: 'inherit',
      });
      if (result.error || exitStatus(result) !== 0) {
        report('API 依赖安装失败，服务未启动。请检查上方安装错误及网络连接；下次启动会重新同步。');
        return exitStatus(result) || 1;
      }
      // 只有安装成功才保存摘要，避免失败后误跳过同步。
      writeFileSync(marker, `${digest}\n`);
    }

    const configuration = run(python, ['-B', '-m', 'scripts.check_environment'], {
      cwd: api, stdio: 'inherit', timeout: 10_000,
    });
    if (configuration.error || exitStatus(configuration) !== 0) {
      report('API 配置预检失败，服务未启动。请检查 apps/api/.env 或 .env.local 及进程环境变量后重试。');
      return exitStatus(configuration) || 1;
    }
    const result = run(python, ['-B', '-m', 'uvicorn', 'app:app', '--host', '127.0.0.1', '--port', '8000', '--reload'], {
      cwd: api, stdio: 'inherit',
    });
    if (result.error) report('API 启动失败，请检查虚拟环境解释器和端口占用。');
    return exitStatus(result);
  } catch {
    report('API 环境准备失败，请检查 .python-version、依赖清单和 dist/.cache/api 目录的读写权限。');
    return 1;
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = startApi();
}
