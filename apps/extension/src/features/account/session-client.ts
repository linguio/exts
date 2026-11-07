let generation: string | undefined;

export function rememberSessionGeneration(value: unknown): void {
  if (typeof value === 'string' && value) generation = value;
}

export function currentSessionGeneration(): string | undefined { return generation; }

/** 页面首次保存前取得会话代次；后续操作沿用本页收到的最新代次。 */
export async function captureSessionGeneration(api: Pick<typeof chrome, 'runtime'> = chrome): Promise<string> {
  if (generation) return generation;
  const response = await api.runtime.sendMessage({ type: 'exts:session:generation' });
  if (!response?.ok || typeof response.generation !== 'string') throw new Error('暂时无法确认会话，请重试');
  if (!generation) generation = response.generation;
  return generation!;
}
