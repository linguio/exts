/** 后台会话边界：重置期间拒绝业务操作，并让旧请求失效。 */
export function createSessionReset() {
  let generation = crypto.randomUUID();
  let resetting = false;
  const pending = new Set<Promise<unknown>>();
  const cancel = new Set<() => void>();

  return {
    get generation() { return generation; },
    get resetting() { return resetting; },
    isCurrent(value: string) { return !resetting && value === generation; },
    accepts(value: unknown) { return !resetting && value === generation; },
    guard() { if (resetting) throw new Error('会话正在重置，请稍后重试'); },
    track<T>(operation: () => Promise<T>): Promise<T> {
      if (resetting) return Promise.reject(new Error('会话正在重置，请稍后重试'));
      const result = operation();
      pending.add(result);
      void result.finally(() => pending.delete(result)).catch(() => {});
      return result;
    },
    onCancel(listener: () => void) { cancel.add(listener); return () => cancel.delete(listener); },
    async begin() {
      if (resetting) throw new Error('会话正在重置');
      resetting = true;
      generation = crypto.randomUUID();
      for (const listener of cancel) listener();
      await Promise.allSettled([...pending]);
    },
    finish() { generation = crypto.randomUUID(); resetting = false; },
  };
}

export type SessionReset = ReturnType<typeof createSessionReset>;
