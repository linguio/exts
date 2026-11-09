import type { ColumnDef } from '@tanstack/react-table';
import type { DateFilterRange } from './state';
import type { DataTableFilter } from './types';

export type DataTableColumnFilterMeta =
  | { type: 'text'; label?: string; defaultValue?: string }
  | { type: 'options'; label?: string; options: { label: string; value: string }[]; defaultValue?: string[] }
  | { type: 'date'; label?: string; defaultValue?: DateFilterRange };

export type DataTableColumnEditMeta =
  | ({ type: 'text' } & DataTableTextEditRules)
  | ({ type: 'integer' } & DataTableIntegerEditRules);

export interface DataTableTextEditRules {
  /** 输入框内展示的固定单位文案，不参与草稿与 payload。 */
  unit?: string;
  readOnly?: boolean;
  disabled?: boolean;
  required?: boolean;
  requiredMessage?: string;
  pattern?: RegExp;
  patternMessage?: string;
}

export interface DataTableIntegerEditRules {
  /** 输入框内展示的固定单位文案，不参与草稿与 payload。 */
  unit?: string;
  readOnly?: boolean;
  disabled?: boolean;
  required?: boolean;
  requiredMessage?: string;
  min?: number;
  max?: number;
  emptyAsNull?: boolean;
  /** 输入过程只保留 ASCII 数字，用于粘贴过滤。 */
  digitsOnly?: boolean;
  /** 与 baseline 比较已改动时，不允许保存为空。 */
  rejectEmptyIfChanged?: boolean;
  emptyChangedMessage?: string;
  invalidMessage?: string;
  minMessage?: string;
  maxMessage?: string;
}

export interface DataTableColumnMetaConfig {
  filter?: DataTableColumnFilterMeta;
  edit?: DataTableColumnEditMeta;
}

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData, TValue> {
    dataTable?: DataTableColumnMetaConfig;
  }
}

export interface DataTableEditFieldDefinition {
  id: string;
  label: string;
  config: DataTableColumnEditMeta;
}

const defaultRequiredMessage = 'This field is required.';

function columnId<T>(column: ColumnDef<T, any>): string | undefined {
  if (column.id) return column.id;
  if ('accessorKey' in column && column.accessorKey !== undefined) return String(column.accessorKey);
  return undefined;
}

function columnLabel<T>(column: ColumnDef<T, any>, id: string): string {
  const filterLabel = column.meta?.dataTable?.filter?.label;
  if (filterLabel) return filterLabel;
  if (typeof column.header === 'string') return column.header;
  return id;
}

function visitColumns<T>(columns: ColumnDef<T, any>[], visit: (column: ColumnDef<T, any>, id: string) => void) {
  for (const column of columns) {
    if ('columns' in column && column.columns) {
      visitColumns(column.columns, visit);
      continue;
    }
    const id = columnId(column);
    if (!id) continue;
    visit(column, id);
  }
}

export function isReadOnlyEditField(config: DataTableColumnEditMeta): boolean {
  return !!config.readOnly;
}

export function isDisabledEditField(config: DataTableColumnEditMeta): boolean {
  return !!config.disabled;
}

export function isWritableEditField(config: DataTableColumnEditMeta): boolean {
  return !isReadOnlyEditField(config) && !isDisabledEditField(config);
}

/** 从列 meta 推导工具栏筛选配置，避免页面重复维护 columnId。 */
export function filtersFromColumns<T>(columns: ColumnDef<T, any>[]): DataTableFilter[] {
  const filters: DataTableFilter[] = [];
  visitColumns(columns, (column, id) => {
    const filter = column.meta?.dataTable?.filter;
    if (!filter) return;
    const label = columnLabel(column, id);
    if (filter.type === 'text') filters.push({ columnId: id, label, type: 'text', defaultValue: filter.defaultValue });
    if (filter.type === 'options') filters.push({ columnId: id, label, type: 'options', options: filter.options, defaultValue: filter.defaultValue });
    if (filter.type === 'date') filters.push({ columnId: id, label, type: 'date', defaultValue: filter.defaultValue });
  });
  return filters;
}

/** 按列定义顺序收集可编辑字段；无 edit 的列不参与编辑。 */
export function editFieldsFromColumns<T>(columns: ColumnDef<T, any>[]): DataTableEditFieldDefinition[] {
  const fields: DataTableEditFieldDefinition[] = [];
  visitColumns(columns, (column, id) => {
    const edit = column.meta?.dataTable?.edit;
    if (!edit) return;
    const label = typeof column.header === 'string' ? column.header : id;
    fields.push({ id, label, config: edit });
  });
  return fields;
}

export function writableEditFieldsFromColumns<T>(columns: ColumnDef<T, any>[]): DataTableEditFieldDefinition[] {
  return editFieldsFromColumns(columns).filter(field => isWritableEditField(field.config));
}

export function hasWritableEditFields<T>(columns: ColumnDef<T, any>[]): boolean {
  return writableEditFieldsFromColumns(columns).length > 0;
}

function patternMatches(pattern: RegExp, value: string): boolean {
  const flags = pattern.flags.replace(/[gy]/g, '');
  return new RegExp(pattern.source, flags).test(value);
}

export function parseEditFieldValue(config: DataTableColumnEditMeta, input: string): { value?: unknown; error?: string } {
  if (config.disabled) return {};
  if (config.type === 'text') {
    const value = input;
    if (config.readOnly) return {};
    if (config.required && !value.trim()) return { error: config.requiredMessage ?? defaultRequiredMessage };
    if (config.pattern && !patternMatches(config.pattern, value)) return { error: config.patternMessage ?? 'Invalid format.' };
    return { value };
  }
  const trimmed = input.trim();
  if (config.readOnly) return {};
  if (!trimmed) {
    if (config.required) return { error: config.requiredMessage ?? defaultRequiredMessage };
    return { value: config.emptyAsNull === false ? 0 : null };
  }
  if (!/^-?\d+$/.test(trimmed)) return { error: config.invalidMessage ?? 'Enter a whole number.' };
  const value = Number(trimmed);
  if (!Number.isSafeInteger(value)) return { error: config.invalidMessage ?? 'Enter a whole number.' };
  if (config.min !== undefined && value < config.min) return { error: config.minMessage ?? `Minimum is ${config.min}.` };
  if (config.max !== undefined && value > config.max) return { error: config.maxMessage ?? `Maximum is ${config.max}.` };
  return { value };
}

/** 将行原始值格式化为表单草稿字符串。 */
export function formatEditDraftValue(config: DataTableColumnEditMeta, raw: unknown): string {
  if (config.type === 'integer') {
    if (raw === null || raw === undefined) return '';
    return String(raw);
  }
  return raw === null || raw === undefined ? '' : String(raw);
}

export interface ValidateEditDraftOptions {
  baseline?: Record<string, string>;
  partial?: boolean;
}

export function validateEditDraft(fields: DataTableEditFieldDefinition[], draft: Record<string, string>,
  options?: ValidateEditDraftOptions): {
  values: Record<string, unknown>;
  errors: Record<string, string>;
} {
  const values: Record<string, unknown> = {};
  const errors: Record<string, string> = {};
  const baseline = options?.baseline;
  const partial = options?.partial;
  for (const field of fields) {
    if (!isWritableEditField(field.config)) continue;
    const draftValue = draft[field.id] ?? '';
    if (partial && baseline && draftValue === (baseline[field.id] ?? '')) continue;
    if (configIsInteger(field.config) && field.config.rejectEmptyIfChanged && baseline
      && draftValue !== (baseline[field.id] ?? '') && !draftValue.trim()) {
      errors[field.id] = field.config.emptyChangedMessage ?? field.config.invalidMessage ?? 'Enter a whole number.';
      continue;
    }
    const result = parseEditFieldValue(field.config, draftValue);
    if (result.error) errors[field.id] = result.error;
    else if ('value' in result) values[field.id] = result.value;
  }
  return { values, errors };
}

function configIsInteger(config: DataTableColumnEditMeta): config is { type: 'integer' } & DataTableIntegerEditRules {
  return config.type === 'integer';
}
