import { expect, it } from 'vitest';
import { getToastCopyAriaLabel } from '../../../src/components/ui/toast-copy-action';

it('复制按钮提供英文可访问名称并在成功后切换', () => {
  expect(getToastCopyAriaLabel(false)).toBe('Copy toast message');
  expect(getToastCopyAriaLabel(true)).toBe('Copied');
});
