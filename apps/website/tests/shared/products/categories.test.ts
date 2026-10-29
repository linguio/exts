import assert from 'node:assert/strict';
import { test } from 'node:test';
import { resolveFeatureSectionId } from '../../../src/shared/products/categories.ts';

test('首页四个分类地址都能解析为对应产品分类', () => {
  for (const id of ['extension', 'desktop', 'packages', 'skills']) {
    assert.equal(resolveFeatureSectionId(`#${id}`), id);
  }
});

test('快速开始可通过独立地址访问', () => {
  assert.equal(resolveFeatureSectionId('#quick-start'), 'quick-start');
});

test('空地址、未知分类及已移除分类回到快速开始', () => {
  for (const hash of ['', '#', '#unknown', '#collaboration']) {
    assert.equal(resolveFeatureSectionId(hash), 'quick-start');
  }
});
