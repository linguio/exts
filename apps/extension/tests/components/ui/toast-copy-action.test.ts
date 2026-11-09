import { expect, it } from 'vitest';
import { TOAST_COPY_FEEDBACK_MS, TOAST_COPY_TOOLTIP, getToastCopyAriaLabel, toastCopyButtonClassName } from '../../../src/components/ui/toast-copy-action';
import { buttonVariants } from '../../../src/components/ui/button';

it('复制按钮提供英文可访问名称并在成功后切换', () => {
  expect(getToastCopyAriaLabel(false)).toBe('Copy toast message');
  expect(getToastCopyAriaLabel(true)).toBe('Copied');
  expect(TOAST_COPY_TOOLTIP).toBe('Copy');
  expect(TOAST_COPY_FEEDBACK_MS).toBeGreaterThanOrEqual(1_500);
});

it('复制按钮复用 DataTable Columns 同款 outline 图标按钮语义', () => {
  const columns = buttonVariants({ variant: 'outline', size: 'icon' });
  const toastCopy = buttonVariants({ variant: 'outline', size: 'icon', className: toastCopyButtonClassName });
  expect(toastCopy).toBe(`${columns} shrink-0`);
});
