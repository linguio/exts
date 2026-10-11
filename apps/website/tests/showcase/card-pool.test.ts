import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getNextCardHead, getVisibleCardIndices } from '../../src/features/showcase/card-pool.ts';

test('十张卡片池只展示连续三张，第四张从队尾补位', () => {
  assert.deepEqual(getVisibleCardIndices(10, 0), [0, 1, 2]);
  assert.deepEqual(getVisibleCardIndices(10, getNextCardHead(10, 0)), [1, 2, 3]);
});

test('整轮循环按顺序展示十张，第一张重新补到展示末尾', () => {
  let head = 0;
  const heads: number[] = [];
  for (let step = 0; step < 20; step++) {
    heads.push(head);
    const visible = getVisibleCardIndices(10, head);
    assert.equal(visible.length, 3);
    assert.equal(new Set(visible).size, 3);
    head = getNextCardHead(10, head);
  }
  assert.deepEqual(heads, [...Array(10).keys(), ...Array(10).keys()]);
  assert.deepEqual(getVisibleCardIndices(10, 8), [8, 9, 0]);
  assert.deepEqual(getVisibleCardIndices(10, 9), [9, 0, 1]);
});

test('点击第三张只临时置前，自动下一组仍为第二第三第四张', () => {
  assert.deepEqual(getVisibleCardIndices(10, 0, 2), [2, 0, 1]);
  assert.deepEqual(getVisibleCardIndices(10, getNextCardHead(10, 0)), [1, 2, 3]);
});

test('点击当前可见的第二张不会改变卡片池顺序，隐藏卡片不能置前', () => {
  assert.deepEqual(getVisibleCardIndices(10, 8, 9), [9, 8, 0]);
  assert.deepEqual(getVisibleCardIndices(10, 8, 4), [8, 9, 0]);
  assert.deepEqual(getVisibleCardIndices(10, getNextCardHead(10, 8)), [9, 0, 1]);
});

test('池不足三张不重复补卡，两张及单张仍能安全循环', () => {
  assert.deepEqual(getVisibleCardIndices(2, 0), [0, 1]);
  assert.deepEqual(getVisibleCardIndices(2, 1), [1, 0]);
  assert.equal(getNextCardHead(2, 1), 0);
  assert.deepEqual(getVisibleCardIndices(1, 0), [0]);
  assert.equal(getNextCardHead(1, 0), 0);
  assert.deepEqual(getVisibleCardIndices(0, 0), []);
});

test('只有两张时，点击第二张后首个周期不重复当前展示组合', () => {
  assert.deepEqual(getVisibleCardIndices(2, 0, 1), [1, 0]);
  const next = getNextCardHead(2, 0, 1);
  assert.deepEqual(getVisibleCardIndices(2, next), [0, 1]);
});

test('十张池点击置前后仍进入原池下一窗口，不跳过未展示卡片', () => {
  assert.equal(getNextCardHead(10, 0, 2), 1);
  assert.deepEqual(getVisibleCardIndices(10, getNextCardHead(10, 0, 2)), [1, 2, 3]);
});
