import { expect, it } from 'vitest';
import type { ColumnDef } from '@tanstack/react-table';
import { dailyColumns } from '../../../../src/features/activity/daily/columns';
import { filtersFromColumns, parseEditFieldValue, validateEditDraft, editFieldsFromColumns, hasWritableEditFields, writableEditFieldsFromColumns } from '../../../../src/components/custom/data-table/column-meta';

type Row = { date: string; exerciseHours: number | null };

it('从 Daily 列推导日期筛选配置', () => {
  expect(filtersFromColumns(dailyColumns)).toEqual([{ columnId: 'date', label: 'Date range', type: 'date' }]);
});

it('Daily 小时字段必填、0.5 步进且 0 合法', () => {
  const fields = writableEditFieldsFromColumns(dailyColumns);
  const required = fields.map(field => field.config).every(config => config.type === 'number' && config.required && config.step === 0.5);
  expect(required).toBe(true);
  const empty = validateEditDraft(fields, Object.fromEntries(fields.map(field => [field.id, ''])));
  expect(Object.keys(empty.errors).length).toBe(fields.length);
  const zeros = validateEditDraft(fields, Object.fromEntries(fields.map(field => [field.id, '0'])));
  expect(zeros.errors).toEqual({});
  expect(zeros.values).toEqual({
    exerciseHours: 0, readingHours: 0, learningHours: 0, creationHours: 0, sleepHours: 0,
  });
  const half = validateEditDraft(fields, { exerciseHours: '0.5', readingHours: '1', learningHours: '0', creationHours: '0', sleepHours: '0' });
  expect(half.errors).toEqual({});
});

it('拒绝非 0.5 倍数小数', () => {
  const config = { type: 'number' as const, min: 0, step: 0.5 };
  expect(parseEditFieldValue(config, '0.25').error).toBeTruthy();
  expect(parseEditFieldValue(config, '0.5').error).toBeUndefined();
  expect(parseEditFieldValue(config, '-1').error).toBeTruthy();
});

it('空输入在 emptyAsNull 时保存为 null，0 保存为 0', () => {
  const config = { type: 'integer' as const, min: 0, emptyAsNull: true };
  expect(parseEditFieldValue(config, '')).toEqual({ value: null });
  expect(parseEditFieldValue(config, '0')).toEqual({ value: 0 });
});

it('validateEditDraft 汇总字段错误', () => {
  const columns: ColumnDef<Row>[] = [{ accessorKey: 'exerciseHours', header: 'Exercise',
    meta: { dataTable: { edit: { type: 'number', min: 0, step: 0.5, max: 10 } } } }];
  const fields = editFieldsFromColumns(columns);
  const result = validateEditDraft(fields, { exerciseHours: '9.25' });
  expect(result.errors.exerciseHours).toBeTruthy();
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
  const config = { type: 'number' as const, disabled: true, required: true, min: 0, step: 0.5 };
  expect(parseEditFieldValue(config, '')).toEqual({});
  const onlyDisabled: ColumnDef<Row>[] = [{ accessorKey: 'exerciseHours', header: 'Exercise',
    meta: { dataTable: { edit: config } } }];
  expect(hasWritableEditFields(onlyDisabled)).toBe(false);
  expect(writableEditFieldsFromColumns(onlyDisabled)).toEqual([]);
  const columns: ColumnDef<Row>[] = [
    { accessorKey: 'exerciseHours', header: 'Exercise', meta: { dataTable: { edit: config } } },
    { accessorKey: 'readingHours', header: 'Reading', meta: { dataTable: { edit: { type: 'integer', emptyAsNull: true } } } },
  ];
  const result = validateEditDraft(editFieldsFromColumns(columns), { exerciseHours: '0.5', readingHours: '3' });
  expect(result.values).toEqual({ readingHours: 3 });
  expect(result.errors).toEqual({});
});

it('edit.unit 仅展示，不参与解析与 payload', () => {
  const config = { type: 'number' as const, unit: 'h', min: 0, step: 0.5 };
  expect(parseEditFieldValue(config, '1.5')).toEqual({ value: 1.5 });
  const columns: ColumnDef<Row>[] = [{ accessorKey: 'exerciseHours', header: 'Exercise', meta: { dataTable: { edit: config } } }];
  expect(editFieldsFromColumns(columns)[0]!.config).toMatchObject({ unit: 'h' });
  const exerciseColumn = dailyColumns.find(column => 'accessorKey' in column && column.accessorKey === 'exerciseHours');
  expect(exerciseColumn?.meta?.dataTable?.edit).toMatchObject({ unit: 'h', step: 0.5 });
});

it('partial 与 rejectEmptyIfChanged 只提交改动且禁止清空已改字段', () => {
  const columns: ColumnDef<Row>[] = [{ accessorKey: 'exerciseHours', header: 'Exercise',
    meta: { dataTable: { edit: { type: 'number', min: 0, step: 0.5, rejectEmptyIfChanged: true } } } },
  { accessorKey: 'readingHours', header: 'Reading',
    meta: { dataTable: { edit: { type: 'integer', min: 0, emptyAsNull: true } } } }];
  const fields = writableEditFieldsFromColumns(columns);
  const baseline = { exerciseHours: '1', readingHours: '' };
  const changed = validateEditDraft(fields, { exerciseHours: '1.5', readingHours: '' }, { baseline, partial: true });
  expect(changed.values).toEqual({ exerciseHours: 1.5 });
  const cleared = validateEditDraft(fields, { exerciseHours: '', readingHours: '' }, { baseline, partial: true });
  expect(cleared.errors.exerciseHours).toBeTruthy();
  expect(cleared.values).toEqual({});
});

it('只读字段不进入可写 payload', () => {
  const columns: ColumnDef<Row>[] = [
    { accessorKey: 'date', header: 'Date', meta: { dataTable: { edit: { type: 'text', readOnly: true } } } },
    { accessorKey: 'exerciseHours', header: 'Exercise', meta: { dataTable: { edit: { type: 'number', min: 0, step: 0.5 } } } },
  ];
  const result = validateEditDraft(editFieldsFromColumns(columns), { date: '2026-11-01', exerciseHours: '0.5' });
  expect(result.values).toEqual({ exerciseHours: 0.5 });
});
