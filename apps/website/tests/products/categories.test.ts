import assert from 'node:assert/strict';
import { test } from 'node:test';
import { resolveCategoryId } from '../../src/features/products/categories.ts';

test('首页四个分类地址都能解析为对应产品分类', () => {
  for (const id of ['extension', 'desktop', 'packages', 'skills']) {
    assert.equal(resolveCategoryId(`#${id}`), id);
  }
});

test('空地址、未知分类及已移除分类回到浏览器扩展', () => {
  for (const hash of ['', '#', '#unknown', '#collaboration']) {
    assert.equal(resolveCategoryId(hash), 'extension');
  }
});
