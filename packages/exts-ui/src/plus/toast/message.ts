import { isValidElement, type ReactNode } from 'react';

/** 提取可见文本供复制，不翻译、截断或替换排错信息。 */
function visibleText(value: ReactNode): string {
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (Array.isArray(value)) return value.map(visibleText).join('');
  if (isValidElement<{ children?: ReactNode }>(value)) return visibleText(value.props.children);
  return '';
}

export function getToastCopyText(title: ReactNode, description: ReactNode): string {
  return [visibleText(title), visibleText(description)].filter(Boolean).join('\n');
}
