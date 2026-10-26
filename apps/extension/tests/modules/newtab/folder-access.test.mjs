import { test } from 'vitest';
import assert from 'node:assert/strict';

import { canUnlockEdu } from '../../../src/modules/newtab/components/bookmark-folder/folder-access.ts';

test('EDU 只接受完整的固定四位码', () => {
  assert.equal(canUnlockEdu('0000'), true);
  assert.equal(canUnlockEdu('000'), false);
  assert.equal(canUnlockEdu('0001'), false);
  assert.equal(canUnlockEdu('00000'), false);
  assert.equal(canUnlockEdu('00a0'), false);
});
