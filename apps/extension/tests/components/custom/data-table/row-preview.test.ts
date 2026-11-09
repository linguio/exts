import { describe, expect, it } from 'vitest';
import { applyRowPreviewPatch, RowPreviewError } from '../../../../src/components/custom/data-table/row-preview';

type Row = { date: string; exerciseHours: number | null; readingHours: number | null };
const getRowId = (row: Row) => row.date;

describe('applyRowPreviewPatch', () => {
  it('merges only supplied fields on matching row', () => {
    const base = { total: 2, rows: [
      { date: '2026-11-01', exerciseHours: 0.5, readingHours: null },
      { date: '2026-11-02', exerciseHours: null, readingHours: 0 },
    ] };
    const next = applyRowPreviewPatch(base, '2026-11-02', { readingHours: 1.5, exerciseHours: 0 }, getRowId);
    expect(next.total).toBe(2);
    expect(next.rows[0]).toEqual(base.rows[0]);
    expect(next.rows[1]).toEqual({ date: '2026-11-02', exerciseHours: 0, readingHours: 1.5 });
  });

  it('allows clearing nullable numeric fields', () => {
    const base = { total: 1, rows: [{ date: '2026-11-01', exerciseHours: 0.5, readingHours: 1 }] };
    const next = applyRowPreviewPatch(base, '2026-11-01', { exerciseHours: null, readingHours: 0 }, getRowId);
    expect(next.rows[0]!.exerciseHours).toBeNull();
    expect(next.rows[0]!.readingHours).toBe(0);
  });

  it('throws when row id is missing', () => {
    expect(() => applyRowPreviewPatch({ total: 0, rows: [] }, 'missing', { exerciseHours: 1 }, getRowId)).toThrow(RowPreviewError);
  });
});

it('requires optimistic preview target', () => {
  const data = { total: 1, rows: [{ date: '2026-11-01', exerciseHours: 0.5, readingHours: null }] };
  expect(applyRowPreviewPatch(data, '2026-11-01', { exerciseHours: 1 }, getRowId).rows[0]!.exerciseHours).toBe(1);
});
