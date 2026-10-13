import { randomUUID } from 'node:crypto';
import {
  cp,
  lstat,
  mkdir,
  readFile,
  rename,
  rm,
} from 'node:fs/promises';
import {
  dirname,
  isAbsolute,
  join,
  relative,
  resolve,
  sep,
} from 'node:path';

const nodeFileSystem = {
  // 默认使用 Node 文件系统；测试可以注入替代实现来模拟跨平台异常。
  cp,
  lstat,
  mkdir,
  readFile,
  rename,
  rm,
};

// 同一 WXT 实例重启时复用状态，避免叠加通知包装。
const serverStates = new WeakMap();

export class StableDevelopmentError extends Error {
  constructor(message, cause) {
    super(message, cause ? { cause } : undefined);
    this.name = 'StableDevelopmentError';
    this.code = cause?.code;
  }
}

export async function publishStableBuild({
  sourceDir,
  targetDir,
  requiredFiles = [],
  fileSystem = nodeFileSystem,
}) {
  // 先校验源目录，再在稳定目录旁创建暂存目录，避免半成品直接暴露给浏览器。
  const sourcePath = resolve(sourceDir);
  const targetPath = resolve(targetDir);

  if (isWithin(sourcePath, targetPath) || isWithin(targetPath, sourcePath)) {
    throw new StableDevelopmentError('源构建目录和稳定目录不能重叠');
  }

  const normalizedRequiredFiles = normalizeRequiredFiles(requiredFiles);
  await validateBuild(sourcePath, normalizedRequiredFiles, fileSystem);

  // 暂存目录和备份目录必须与目标目录同级，保证目录替换发生在同一文件系统内。
  const stagingPath = `${targetPath}.staging-${randomUUID()}`;
  const backupPath = `${targetPath}.backup-${randomUUID()}`;
  let stagingExists = false;
  let backupExists = false;

  try {
    await fileSystem.mkdir(dirname(targetPath), { recursive: true });
    await fileSystem.rm(stagingPath, { recursive: true, force: true });
    stagingExists = true;
    await fileSystem.cp(sourcePath, stagingPath, {
      recursive: true,
      force: true,
    });
    // 复制完成后再次校验，防止复制过程中的文件缺失进入稳定目录。
    await validateBuild(stagingPath, normalizedRequiredFiles, fileSystem);

    if (await pathExists(targetPath, fileSystem)) {
      try {
        // 先暂存旧版本，只有新版本安装成功后才清理它。
        await fileSystem.rename(targetPath, backupPath);
        backupExists = true;
      } catch (error) {
        throw new StableDevelopmentError(
          `稳定开发产物替换失败（${error?.code ?? 'unknown'}）：无法暂存旧目录`,
          error,
        );
      }
    }

    try {
      // 同级 rename 完成目录切换；失败时立即尝试恢复旧版本。
      await fileSystem.rename(stagingPath, targetPath);
      stagingExists = false;
    } catch (error) {
      if (backupExists) {
        try {
          await fileSystem.rename(backupPath, targetPath);
          backupExists = false;
        } catch (restoreError) {
          throw new StableDevelopmentError(
            `稳定开发产物替换失败（${error?.code ?? 'unknown'}），旧目录仍保留在 ${backupPath}`,
            restoreError,
          );
        }
      }

      throw new StableDevelopmentError(
        `稳定开发产物替换失败（${error?.code ?? 'unknown'}）：无法安装新目录`,
        error,
      );
    }

    if (backupExists) {
      try {
        // 旧版本只在新版本已经成为目标目录后才允许清理。
        await fileSystem.rm(backupPath, {
          recursive: true,
          force: true,
          maxRetries: 3,
          retryDelay: 100,
        });
        backupExists = false;
      } catch {
        backupExists = true;
      }
    }

    return {
      targetDir: targetPath,
      backupDir: backupExists ? backupPath : undefined,
    };
  } finally {
    if (stagingExists) {
      await removeTemporaryDirectory(stagingPath, fileSystem);
    }
  }
}

export function createStableDevelopmentHooks({ suffix = '-stable', targetDir } = {}) {
  if (!suffix || suffix.includes('/') || suffix.includes('\\')) {
    throw new StableDevelopmentError('稳定目录后缀必须是单一目录名片段');
  }

  async function publishOutput(wxt, output) {
    const result = await publishStableBuild({
      sourceDir: wxt.config.outDir,
      targetDir: targetDir ?? `${wxt.config.outDir}${suffix}`,
      requiredFiles: [
        'manifest.json',
        ...(output?.publicAssets ?? []).map(asset => asset.fileName),
        ...(output?.steps ?? []).flatMap(step =>
          (step.chunks ?? []).map(chunk => chunk.fileName),
        ),
      ],
    });
    wxt.logger?.info?.(`稳定开发产物已发布到 ${relative(process.cwd(), result.targetDir)}`);
    if (result.backupDir) wxt.logger?.warn?.(`旧产物清理失败，备份保留在 ${result.backupDir}`);
  }

  function attach(wxt, server) {
    if (wxt.config.command !== 'serve') return;
    let state = serverStates.get(server);
    if (state) {
      state.wxt = wxt;
      state.publish = publishOutput;
      return state;
    }
    state = { active: true, generation: 0, lastOutput: undefined, queue: Promise.resolve(), wxt, publish: publishOutput };
    serverStates.set(server, state);
    for (const method of ['reloadExtension', 'reloadPage', 'reloadContentScript']) {
      const original = server[method];
      server[method] = function (...args) {
        const output = server.currentOutput;
        const generation = state.generation;
        const context = this;
        state.queue = state.queue.then(async () => {
          if (!state.active || generation !== state.generation || !output || server.currentOutput !== output) return;
          if (state.lastOutput !== output) {
            await state.publish(state.wxt, output);
            if (!state.active || generation !== state.generation || server.currentOutput !== output) return;
            state.lastOutput = output;
          }
          original.apply(context, args);
        }).catch(error => {
          // 发布失败不让浏览器重载半成品；捕获后允许下一次成功构建恢复。
          state.wxt.logger?.error?.('稳定产物同步失败，本次重载已取消', error);
        });
      };
    }
    return state;
  }

  return {
    'server:created': (wxt, server) => { attach(wxt, server); },
    'server:started': (wxt, server) => {
      const state = attach(wxt, server);
      if (state) {
        state.active = true;
        state.generation++;
        state.lastOutput = undefined;
      }
    },
    'server:closed': async (_, server) => {
      const state = serverStates.get(server);
      if (!state) return;
      state.active = false;
      state.generation++;
      await state.queue;
    },
    'build:done': async (wxt, output) => {
      // 生产构建仍使用 WXT 原始输出，不额外维护稳定目录。
      if (wxt.config.command !== 'serve') return;
      await publishOutput(wxt, output);
      const state = wxt.server && serverStates.get(wxt.server);
      if (state) state.lastOutput = output;
    },
  };
}

function isWithin(parent, child) {
  const path = relative(parent, child);
  return path === '' || (!path.startsWith(`..${sep}`) && path !== '..' && !isAbsolute(path));
}

function normalizeRequiredFiles(requiredFiles) {
  const files = new Set(['manifest.json']);

  for (const file of requiredFiles) {
    if (typeof file !== 'string') {
      throw new StableDevelopmentError('必需构建文件路径必须是字符串');
    }

    const normalized = file.replaceAll('\\', '/').replace(/^\.\//, '');
    if (
      !normalized ||
      isAbsolute(file) ||
      normalized.startsWith('/') ||
      /^[A-Za-z]:\//.test(normalized) ||
      normalized.split('/').includes('..')
    ) {
      throw new StableDevelopmentError(`非法必需构建文件路径：${file}`);
    }

    files.add(normalized);
  }

  return [...files];
}

async function validateBuild(directory, requiredFiles, fileSystem) {
  const directoryStat = await getStat(directory, fileSystem, `构建目录不存在：${directory}`);
  if (!directoryStat.isDirectory()) {
    throw new StableDevelopmentError(`构建路径不是目录：${directory}`);
  }

  for (const file of requiredFiles) {
    const filePath = join(directory, file);
    const fileStat = await getStat(
      filePath,
      fileSystem,
      `构建产物缺少必需文件：${file}`,
    );
    if (!fileStat.isFile()) {
      throw new StableDevelopmentError(`构建产物不是普通文件：${file}`);
    }
  }

  // Manifest 是扩展能否被浏览器识别的最低完整性检查。
  let manifest;
  try {
    manifest = JSON.parse(
      await fileSystem.readFile(join(directory, 'manifest.json'), 'utf8'),
    );
  } catch (error) {
    throw new StableDevelopmentError(
      `构建产物中的 manifest.json 无法读取或解析`,
      error,
    );
  }

  if (
    !manifest ||
    Array.isArray(manifest) ||
    ![2, 3].includes(manifest.manifest_version) ||
    typeof manifest.name !== 'string' ||
    !manifest.name.trim() ||
    typeof manifest.version !== 'string' ||
    !manifest.version.trim()
  ) {
    throw new StableDevelopmentError('构建产物中的 manifest.json 字段不完整');
  }
}

async function pathExists(path, fileSystem) {
  try {
    await fileSystem.lstat(path);
    return true;
  } catch (error) {
    if (error?.code === 'ENOENT') return false;
    throw error;
  }
}

async function getStat(path, fileSystem, message) {
  try {
    return await fileSystem.lstat(path);
  } catch (error) {
    if (error?.code === 'ENOENT') {
      throw new StableDevelopmentError(message, error);
    }
    throw error;
  }
}

async function removeTemporaryDirectory(path, fileSystem) {
  try {
    await fileSystem.rm(path, {
      recursive: true,
      force: true,
      maxRetries: 3,
      retryDelay: 100,
    });
  } catch {
    return;
  }
}
