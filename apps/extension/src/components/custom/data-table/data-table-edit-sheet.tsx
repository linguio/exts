import { useEffect, useMemo, useRef, useState, useId, type ChangeEvent, type FormEvent } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { SquarePen } from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '../../ui/input-group';
import { Spinner } from '../../ui/spinner';
import { Field, FieldGroup } from '../../ui/field';
import { ScrollArea } from '../../ui/scroll-area';
import { Separator } from '../../ui/separator';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetTitle } from '../../ui/sheet';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../ui/alert-dialog';
import { toast } from '../../ui/sonner';
import { editFieldsFromColumns, formatEditDraftValue, validateEditDraft, writableEditFieldsFromColumns, type DataTableEditFieldDefinition } from './column-meta';
import { useDataTableEditLifecycle } from './use-data-table-edit-lifecycle';
import type { DataTableUpdateFn } from './types';

interface DataTableEditSheetProps<T> {
  open: boolean;
  row: T | null;
  columns: ColumnDef<T, any>[];
  onOpenChange: (open: boolean) => void;
  updateFn: DataTableUpdateFn<T>;
  getRowId: (row: T) => string;
  onSaved: () => void;
  editDescription?: string;
  partialUpdates?: boolean;
}

function buildDraft<T>(row: T, fields: DataTableEditFieldDefinition[]): Record<string, string> {
  const record = row as Record<string, unknown>;
  return Object.fromEntries(fields.map(field => [field.id, formatEditDraftValue(field.config, record[field.id])]));
}

/** 配置驱动的行编辑 Sheet；共用层维护草稿、校验、防重与放弃确认。 */
export function DataTableEditSheet<T>({ open, row, columns, onOpenChange, updateFn, getRowId, onSaved, editDescription,
  partialUpdates = false }: DataTableEditSheetProps<T>) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const fieldPrefix = useId();
  const displayFields = useMemo(() => editFieldsFromColumns(columns), [columns]);
  const writableFields = useMemo(() => writableEditFieldsFromColumns(columns), [columns]);
  const { beginSubmit, endSubmit, cancelSubmit, isSubmitting } = useDataTableEditLifecycle();
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [baseline, setBaseline] = useState('');
  const [baselineDraft, setBaselineDraft] = useState<Record<string, string>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [discardOpen, setDiscardOpen] = useState(false);

  useEffect(() => {
    if (!open) cancelSubmit();
  }, [open, cancelSubmit]);

  useEffect(() => {
    if (!open || !row) return;
    const next = buildDraft(row, displayFields);
    setDraft(next);
    setBaselineDraft(next);
    setBaseline(JSON.stringify(next));
    setFieldErrors({});
    setSubmitting(false);
    setDiscardOpen(false);
  }, [open, row, displayFields]);

  const dirty = open && baseline !== JSON.stringify(draft);

  function closeClean() {
    cancelSubmit();
    setDiscardOpen(false);
    setSubmitting(false);
    onOpenChange(false);
  }

  function requestClose() {
    if (isSubmitting()) return;
    if (dirty) setDiscardOpen(true);
    else closeClean();
  }

  function handleOpenChange(next: boolean) {
    if (next) onOpenChange(true);
    else requestClose();
  }

  async function handleSave(event: FormEvent) {
    event.preventDefault();
    if (!row || isSubmitting()) return;
    const { values, errors } = validateEditDraft(writableFields, draft,
      partialUpdates ? { baseline: baselineDraft, partial: true } : undefined);
    setFieldErrors(errors);
    if (Object.keys(errors).length) return;
    if (partialUpdates && !Object.keys(values).length) {
      toast.error('No changes to save.');
      return;
    }
    const controller = beginSubmit();
    setSubmitting(true);
    try {
      await updateFn(getRowId(row), values, controller.signal);
      if (controller.signal.aborted) return;
      closeClean();
      onSaved();
    } catch (error) {
      if (controller.signal.aborted) return;
      const message = error instanceof Error ? error.message : 'Save failed. Please try again.';
      toast.error(message);
    } finally {
      endSubmit(controller);
      setSubmitting(false);
    }
  }

  return <>
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="flex flex-col gap-0 p-0"
        {...(editDescription ? {} : { 'aria-describedby': undefined })}
        onOpenAutoFocus={event => {
          event.preventDefault();
          titleRef.current?.focus();
        }}
        onEscapeKeyDown={event => { event.preventDefault(); requestClose(); }}
        onInteractOutside={event => { event.preventDefault(); requestClose(); }}>
        <form className="flex min-h-0 flex-1 flex-col" onSubmit={handleSave}>
          <header className="flex min-h-14 shrink-0 items-center px-6 pr-16">
            <SquarePen className="mr-3 size-5 shrink-0" aria-hidden />
            <SheetTitle ref={titleRef} tabIndex={-1} className="text-lg font-semibold">Edit</SheetTitle>
          </header>
          {editDescription && <SheetDescription className="px-6 pb-4">{editDescription}</SheetDescription>}
          <Separator />
          <ScrollArea className="min-h-0 flex-1">
            <FieldGroup className="gap-5 p-4">
              {displayFields.map(field => {
                const inputId = `${fieldPrefix}-${field.id}`;
                const errorId = `${fieldPrefix}-${field.id}-error`;
                const readOnly = field.config.readOnly;
                const disabled = !!field.config.disabled;
                const required = !readOnly && !disabled && !!field.config.required;
                const error = fieldErrors[field.id];
                const unit = field.config.unit;
                const controlDisabled = disabled || submitting;
                const numberConfig = field.config.type === 'number' ? field.config : undefined;
                const controlProps = {
                  id: inputId,
                  type: numberConfig ? 'number' as const : undefined,
                  inputMode: field.config.type === 'integer' || field.config.type === 'number' ? 'decimal' as const : undefined,
                  min: numberConfig?.min,
                  max: numberConfig?.max,
                  step: numberConfig?.step,
                  value: draft[field.id] ?? '',
                  readOnly,
                  disabled: controlDisabled,
                  'aria-required': required || undefined,
                  'aria-invalid': error ? true as const : undefined,
                  'aria-describedby': error ? errorId : undefined,
                  onChange: (event: ChangeEvent<HTMLInputElement>) => {
                    let next = event.target.value;
                    if (field.config.type === 'integer' && field.config.digitsOnly) next = next.replace(/\D/g, '');
                    setDraft(previous => ({ ...previous, [field.id]: next }));
                  },
                };
                return <Field key={field.id} data-invalid={error ? true : undefined}>
                  <label className="text-sm font-medium" htmlFor={inputId}>
                    {field.label}
                    {required && <span className="text-destructive" aria-hidden> *</span>}
                    {required && <span className="sr-only"> (required)</span>}
                  </label>
                  {unit
                    ? <InputGroup data-disabled={controlDisabled ? true : undefined}>
                      <InputGroupInput {...controlProps} />
                      <InputGroupAddon align="inline-end"><InputGroupText>{unit}</InputGroupText></InputGroupAddon>
                    </InputGroup>
                    : <Input {...controlProps} />}
                  {error && <p id={errorId} role="alert" className="text-sm text-destructive">{error}</p>}
                </Field>;
              })}
            </FieldGroup>
          </ScrollArea>
          <SheetFooter className="flex-row justify-end border-t border-border sm:justify-end">
            <Button type="button" variant="outline" disabled={submitting} onClick={requestClose}>Cancel</Button>
            <Button type="submit" disabled={submitting}>{submitting ? <><Spinner className="size-4" aria-hidden /><span className="sr-only">Saving</span><span>Saving…</span></> : 'Save'}</Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
    <AlertDialog open={discardOpen} onOpenChange={setDiscardOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Discard changes?</AlertDialogTitle>
          <AlertDialogDescription>Unsaved edits will be lost.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep editing</AlertDialogCancel>
          <AlertDialogAction onClick={closeClean}>Discard</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </>;
}
