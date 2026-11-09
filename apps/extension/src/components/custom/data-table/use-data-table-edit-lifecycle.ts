import { useCallback, useEffect, useRef } from 'react';

/** 编辑提交与取消信号；作用域卸载或 Sheet 关闭时中止，阻止迟到回调。 */
export function useDataTableEditLifecycle() {
  const active = useRef<AbortController | null>(null);
  const submitting = useRef(false);

  const dispose = useCallback(() => {
    active.current?.abort();
    active.current = null;
    submitting.current = false;
  }, []);

  useEffect(() => () => dispose(), [dispose]);

  const beginSubmit = useCallback(() => {
    active.current?.abort();
    const controller = new AbortController();
    active.current = controller;
    submitting.current = true;
    return controller;
  }, []);

  const endSubmit = useCallback((controller: AbortController) => {
    if (active.current === controller) {
      submitting.current = false;
      active.current = null;
    }
  }, []);

  const cancelSubmit = useCallback(() => {
    active.current?.abort();
    active.current = null;
    submitting.current = false;
  }, []);

  const isSubmitting = useCallback(() => submitting.current, []);

  return { beginSubmit, endSubmit, cancelSubmit, isSubmitting, dispose };
}
