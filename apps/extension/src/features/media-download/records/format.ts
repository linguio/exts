export function formatSize(bytes?: number): string {
  return `${bytes ? Number((bytes / 1024 / 1024).toFixed(1)) : 0} MB`;
}
