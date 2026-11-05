export interface MediaWritable {
  write(chunk: Uint8Array): Promise<void> | void;
}

export interface ContentRange {
  end: number;
  total: number;
}

export function parseContentRange(value: string | null): ContentRange | null {
  const match = /^bytes\s+\d+-(\d+)\/(\d+)$/i.exec(value ?? '');
  if (!match) return null;

  return {
    end: Number(match[1]),
    total: Number(match[2]),
  };
}

export async function writeResponse(
  response: Response,
  writable: MediaWritable,
  onProgress: (loaded: number, total: number) => void,
  start = 0,
  total = Number(response.headers.get('Content-Length')) || 0,
): Promise<number> {
  const reader = response.body?.getReader();
  if (!reader) return start;

  let loaded = start;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;

      await writable.write(value);
      loaded += value.byteLength;
      onProgress(loaded, total);
    }
  } catch (error) {
    try { await reader.cancel(); } catch { /* 保留原始读取或写入错误。 */ }
    throw error;
  } finally {
    reader.releaseLock();
  }

  return loaded;
}
