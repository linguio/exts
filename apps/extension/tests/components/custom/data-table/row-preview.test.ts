import { expect, it } from 'vitest';
import { RowPreviewError, applyRowPreviewPatch, canApplyRowPreview } from '../../../../src/components/custom/data-table/row-preview';

type Row = { date: string; exerciseMinutes: number | null; readingMinutes: number | null };

const getRowId = (row: Row) => row.date;

it('只替换匹配行并保留 total', () => {
  const base = { total: 12, rows: [
    { date: '2026-11-01', exerciseMinutes: 10, readingMinutes: null },
    { date: '2026-11-02', exerciseMinutes: null, readingMinutes: 0 },
  ] };
  const next = applyRowPreviewPatch(base, '2026-11-02', { readingMinutes: 30, exerciseMinutes: 0 }, getRowId);
  expect(next.total).toBe(12);
  expect(next.rows[0]).toEqual(base.rows[0]);
  expect(next.rows[1]).toEqual({ date: '2026-11-02', exerciseMinutes: 0, readingMinutes: 30 });
});

it('空值保存为 null，0 保持为 0', () => {
  const base = { total: 1, rows: [{ date: '2026-11-01', exerciseMinutes: 5, readingMinutes: 10 }] };
  const next = applyRowPreviewPatch(base, '2026-11-01', { exerciseMinutes: null, readingMinutes: 0 }, getRowId);
  expect(next.rows[0]!.exerciseMinutes).toBeNull();
  expect(next.rows[0]!.readingMinutes).toBe(0);
});

it('找不到行时抛出 RowPreviewError', () => {
  expect(() => applyRowPreviewPatch({ total: 0, rows: [] }, 'missing', { exerciseMinutes: 1 }, getRowId)).toThrow(RowPreviewError);
});

it('canApplyRowPreview 要求成功响应、匹配 key 且非在途', () => {
  const data = { total: 1, rows: [{ date: '2026-11-01', exerciseMinutes: 1, readingMinutes: null }] };
  expect(canApplyRowPreview({ key: 'a', status: 'success', data }, 'a', false)).toBe(true);
  expect(canApplyRowPreview({ key: 'a', status: 'success', data }, 'b', false)).toBe(false);
  expect(canApplyRowPreview({ key: 'a', status: 'loading', data }, 'a', true)).toBe(false);
  expect(canApplyRowPreview({ key: 'a', status: 'error' }, 'a', false)).toBe(false);
});
