import assert from 'node:assert/strict';
import { test } from 'node:test';

import { renderReleaseNotes } from '../scripts/release-notes.mjs';

test('草稿正文只取最新条目内容，按原顺序输出无序列表', () => {
  const entries = [
    {
      date: '2026-11-05', title: '不输出标题',
      groups: [
        { platform: 'Extension', changes: ['扩展更新。', '第二点更新。'] },
        { platform: 'Skills', changes: ['新增 workflow-tests。'] },
      ],
    },
    { date: '2026-11-04', title: '旧条目', groups: [{ platform: 'Build', changes: ['不输出旧内容。'] }] },
  ];
  assert.equal(renderReleaseNotes(entries), '- 扩展更新。\n- 第二点更新。\n- 新增 workflow-tests。\n');
});

test('缺少最新更新内容时拒绝生成空草稿正文', () => {
  for (const entries of [[], [{ groups: [] }], [{ groups: [{ changes: [] }] }]]) {
    assert.throws(() => renderReleaseNotes(entries), /最新 changelog/);
  }
});

test('更新点为空或包含换行时拒绝生成格式不明确的列表', () => {
  for (const change of ['', '  ', null, '第一行\n第二行']) {
    assert.throws(() => renderReleaseNotes([{ groups: [{ changes: [change] }] }]), /更新点/);
  }
});
