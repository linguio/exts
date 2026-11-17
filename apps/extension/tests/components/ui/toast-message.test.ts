import { expect, it } from 'vitest';
import { createElement } from 'react';
import { getToastCopyText } from '../../../src/components/ui/toast-message';

it('完整复制标题与描述，不替换排错内容', () => {
  expect(getToastCopyText('Request failed.', 'HTTP 503\nTrace: abc-123')).toBe('Request failed.\nHTTP 503\nTrace: abc-123');
  expect(getToastCopyText('错误详情', undefined)).toBe('错误详情');
});

it('复制可见的嵌套文本，不包含节点结构', () => {
  expect(getToastCopyText(createElement('strong', null, 'Request ', 'failed'), ['Code: ', 503])).toBe('Request failed\nCode: 503');
  expect(getToastCopyText('Saved.', null)).toBe('Saved.');
});
