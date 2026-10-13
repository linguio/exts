import { defineConfig } from 'wxt';
import { createStableDevelopmentHooks, publishStableBuild, StableDevelopmentError } from '@linguio/wxt-stable-output';

// 仅由 TypeScript 编译，不作为运行时测试执行。
defineConfig({ hooks: createStableDevelopmentHooks({ suffix: '-stable', targetDir: '/tmp/stable' }) });
const result = await publishStableBuild({ sourceDir: '/tmp/source', targetDir: '/tmp/stable' });
const target: string = result.targetDir;
const error: Error = new StableDevelopmentError(target);
void error;
