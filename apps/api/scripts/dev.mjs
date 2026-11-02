import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = fileURLToPath(new URL('../../../', import.meta.url));
const pythonVersion = readFileSync(new URL('../.python-version', import.meta.url), 'utf8').trim();

export function startApi({
  platform = process.platform,
  root = repositoryRoot,
  exists = existsSync,
  run = spawnSync,
  report = console.error,
} = {}) {
  const windows = platform === 'win32';
  const python = join(root, 'dist', '.cache', 'api', 'venv', ...(windows ? ['Scripts', 'python.exe'] : ['bin', 'python']));
  if (!exists(python)) {
    const create = windows ? 'py -3.12' : 'python3.12';
    const install = windows
      ? '& .\\dist\\.cache\\api\\venv\\Scripts\\python.exe'
      : 'dist/.cache/api/venv/bin/python';
    report(`未找到 API 虚拟环境解释器：${python}
请先安装 Python ${pythonVersion}，再从仓库根目录执行${windows ? '（PowerShell）' : ''}：
  ${create} -m venv dist/.cache/api/venv
  ${install} -m pip install -r apps/api/requirements-dev.txt
  pnpm api:dev
详见 apps/api/README.md；不会自动安装或回退到全局 Python。`);
    return 1;
  }

  const result = run(python, ['-B', '-m', 'uvicorn', 'app:app', '--host', '127.0.0.1', '--port', '8000'], {
    cwd: join(root, 'apps', 'api'),
    stdio: 'inherit',
  });
  if (result.error) {
    report(`API 启动失败：${result.error.message}。请检查虚拟环境及 apps/api/README.md 中的依赖准备步骤。`);
    return 1;
  }
  return result.status ?? ({ SIGINT: 130, SIGTERM: 143 }[result.signal] ?? 1);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = startApi();
}
