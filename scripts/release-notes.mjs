import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { changelogEntries } from '../apps/website/src/pages/changelog/data.ts';

export function renderReleaseNotes(entries) {
  const changes = entries[0]?.groups?.flatMap(group => group.changes) ?? [];
  if (changes.length === 0) throw new Error('最新 changelog 没有更新内容');
  if (changes.some(change => typeof change !== 'string' || !change.trim() || /[\r\n]/.test(change))) {
    throw new Error('changelog 更新点必须是非空的单行文字');
  }
  return changes.map(change => `- ${change.trim()}`).join('\n') + '\n';
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    process.stdout.write(renderReleaseNotes(changelogEntries));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
