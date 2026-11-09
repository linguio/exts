/** Toast 可见文案规范化；不翻译业务层，只保证用户可见提示为英文纯文本。 */
export type ToastKind = 'default' | 'success' | 'info' | 'warning' | 'error' | 'loading'

type ToastInput = string | number | boolean | null | undefined | (() => unknown) | Record<string, unknown>

const GENERIC_TOAST: Record<ToastKind, string> = {
  default: 'Notice.',
  success: 'Completed successfully.',
  info: 'Notice.',
  warning: 'Please review and try again.',
  error: 'Something went wrong. Please try again.',
  loading: 'Please wait.',
}

function rawToastText(message: ToastInput): string {
  if (typeof message === 'string') return message
  if (typeof message === 'number' || typeof message === 'boolean') return String(message)
  return ''
}

/** 可作为 Toast 展示与复制的英文纯文本。 */
export function isEnglishDisplayText(text: string): boolean {
  const trimmed = text.trim()
  if (!trimmed) return false
  if (/[\u3400-\u9fff\uf900-\ufaff]/.test(trimmed)) return false
  if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(trimmed)) return false
  if (!/^[\t\n\r\x20-\x7e\u00a0-\u024f\u2010-\u2015\u2018-\u201d]+$/.test(trimmed)) return false
  return true
}

export function resolveToastDisplayText(message: ToastInput, kind: ToastKind = 'default'): string {
  const raw = rawToastText(message)
  if (isEnglishDisplayText(raw)) return raw.trim()
  return GENERIC_TOAST[kind]
}
