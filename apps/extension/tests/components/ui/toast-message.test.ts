import { expect, it } from 'vitest';
import { isEnglishDisplayText, resolveToastDisplayText } from '../../../src/components/ui/toast-message';

it('保留英文文案，拒绝中文与不可复制输入', () => {
  expect(isEnglishDisplayText('Query failed. Please try again.')).toBe(true);
  expect(isEnglishDisplayText('数据加载失败，请稍后重试')).toBe(false);
  expect(resolveToastDisplayText('Saved.', 'success')).toBe('Saved.');
  expect(resolveToastDisplayText('登录已失效，请重新登录', 'error')).toBe('Something went wrong. Please try again.');
  expect(resolveToastDisplayText('', 'error')).toBe('Something went wrong. Please try again.');
});

it('按等级返回通用英文回退', () => {
  expect(resolveToastDisplayText('已保存', 'success')).toBe('Completed successfully.');
  expect(resolveToastDisplayText('加载中', 'loading')).toBe('Please wait.');
});
