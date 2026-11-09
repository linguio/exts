import { expect, it } from 'vitest';
import type { ColumnDef } from '@tanstack/react-table';
import { dailyColumns } from '../../../../src/features/activity/daily/columns';
import { filtersFromColumns, parseEditFieldValue, validateEditDraft, editFieldsFromColumns, hasWritableEditFields, writableEditFieldsFromColumns } from '../../../../src/components/custom/data-table/column-meta';

type Row = { date: string; exerciseMinutes: number | null };

it('从 Daily 列推导日期筛选配置', () => {
  expect(filtersFromColumns(dailyColumns)).toEqual([{ columnId: 'date', label: 'Date range', type: 'date' }]);
});

it('空输入在 emptyAsNull 时保存为 null，0 保存为 0', () => {
  const config = { type: 'integer' as const, min: 0, emptyAsNull: true };
  expect(parseEditFieldValue(config, '')).toEqual({ value: null });
  expect(parseEditFieldValue(config, '0')).toEqual({ value: 0 });
});

it('拒绝非整数与负数', () => {
  const config = { type: 'integer' as const, min: 0, emptyAsNull: true };
  expect(parseEditFieldValue(config, '12.5').error).toBeTruthy();
  expect(parseEditFieldValue(config, '-1').error).toBeTruthy();
});

it('validateEditDraft 汇总字段错误', () => {
  const columns: ColumnDef<Row>[] = [{ accessorKey: 'exerciseMinutes', header: 'Exercise',
    meta: { dataTable: { edit: { type: 'integer', min: 0, max: 10, emptyAsNull: true } } } }];
  const fields = editFieldsFromColumns(columns);
  const result = validateEditDraft(fields, { exerciseMinutes: '99' });
  expect(result.errors.exerciseMinutes).toBeTruthy();
  expect(result.values).toEqual({});
});

it('requiredMessage 可覆盖默认必填文案', () => {
  const config = { type: 'text' as const, required: true, requiredMessage: 'Need a code.' };
  expect(parseEditFieldValue(config, '  ').error).toBe('Need a code.');
});

it('带 g 标志的 pattern 可重复校验', () => {
  const pattern = /^[a-z]+$/g;
  const config = { type: 'text' as const, pattern };
  expect(parseEditFieldValue(config, 'ab').error).toBeUndefined();
  expect(parseEditFieldValue(config, 'ab').error).toBeUndefined();
  expect(parseEditFieldValue(config, '1').error).toBeTruthy();
});

it('disabled 字段不参与校验与 payload，且不能单独启用 Edit', () => {
  const config = { type: 'integer' as const, disabled: true, required: true, min: 0, emptyAsNull: true };
  expect(parseEditFieldValue(config, '')).toEqual({});
  const onlyDisabled: ColumnDef<Row>[] = [{ accessorKey: 'exerciseMinutes', header: 'Exercise',
    meta: { dataTable: { edit: config } } }];
  expect(hasWritableEditFields(onlyDisabled)).toBe(false);
  expect(writableEditFieldsFromColumns(onlyDisabled)).toEqual([]);
  const columns: ColumnDef<Row>[] = [
    { accessorKey: 'exerciseMinutes', header: 'Exercise', meta: { dataTable: { edit: config } } },
    { accessorKey: 'readingMinutes', header: 'Reading', meta: { dataTable: { edit: { type: 'integer', emptyAsNull: true } } } },
  ];
  const result = validateEditDraft(editFieldsFromColumns(columns), { exerciseMinutes: '9', readingMinutes: '3' });
  expect(result.values).toEqual({ readingMinutes: 3 });
  expect(result.errors).toEqual({});
});

it('edit.unit 仅展示，不参与整数解析与 payload', () => {
  const config = { type: 'integer' as const, unit: 'min', min: 0, emptyAsNull: true };
  expect(parseEditFieldValue(config, '12')).toEqual({ value: 12 });
  const columns: ColumnDef<Row>[] = [{ accessorKey: 'exerciseMinutes', header: 'Exercise', meta: { dataTable: { edit: config } } }];
  expect(editFieldsFromColumns(columns)[0]!.config).toMatchObject({ unit: 'min' });
  const result = validateEditDraft(editFieldsFromColumns(columns), { exerciseMinutes: '12' });
  expect(result.values).toEqual({ exerciseMinutes: 12 });
});

it('partial 与 rejectEmptyIfChanged 只提交改动且禁止清空已改字段', () => {
  const columns: ColumnDef<Row>[] = [{ accessorKey: 'exerciseMinutes', header: 'Exercise',
    meta: { dataTable: { edit: { type: 'integer', min: 0, emptyAsNull: true, rejectEmptyIfChanged: true } } } },
  { accessorKey: 'readingMinutes', header: 'Reading',
    meta: { dataTable: { edit: { type: 'integer', min: 0, emptyAsNull: true } } } }];
  const fields = writableEditFieldsFromColumns(columns);
  const baseline = { exerciseMinutes: '10', readingMinutes: '' };
  const changed = validateEditDraft(fields, { exerciseMinutes: '12', readingMinutes: '' }, { baseline, partial: true });
  expect(changed.values).toEqual({ exerciseMinutes: 12 });
  const cleared = validateEditDraft(fields, { exerciseMinutes: '', readingMinutes: '' }, { baseline, partial: true });
  expect(cleared.errors.exerciseMinutes).toBeTruthy();
  expect(cleared.values).toEqual({});
});

it('只读字段不进入可写 payload', () => {
  const columns: ColumnDef<Row>[] = [
    { accessorKey: 'date', header: 'Date', meta: { dataTable: { edit: { type: 'text', readOnly: true } } } },
    { accessorKey: 'exerciseMinutes', header: 'Exercise', meta: { dataTable: { edit: { type: 'integer', emptyAsNull: true } } } },
  ];
  const result = validateEditDraft(editFieldsFromColumns(columns), { date: '2026-11-01', exerciseMinutes: '5' });
  expect(result.values).toEqual({ exerciseMinutes: 5 });
});
