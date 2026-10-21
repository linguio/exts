import type { TaskSnapshot } from '../downloads/protocol';

/** 只发送变化任务，进度合并为每 250ms 一次；开始及终态立即上报。 */
export function createTaskReporter(send: (snapshot: TaskSnapshot) => void) {
  const previous = new Map<string, string>();
  const pending = new Map<string, TaskSnapshot['tasks'][number]>();
  let timer: ReturnType<typeof setTimeout> | undefined;
  const flush = () => {
    clearTimeout(timer);
    timer = undefined;
    if (!pending.size) return;
    const tasks = [...pending.values()];
    pending.clear();
    send({ tasks });
  };
  return {
    flush,
    update(snapshot: TaskSnapshot) {
      let immediate = false;
      const ids = new Set(snapshot.tasks.map(task => task.id));
      for (const id of previous.keys()) if (!ids.has(id)) previous.delete(id);
      for (const task of snapshot.tasks) {
        const serialized = JSON.stringify(task);
        if (previous.get(task.id) === serialized) continue;
        if (!previous.has(task.id) || task.state !== 'downloading') immediate = true;
        previous.set(task.id, serialized);
        pending.set(task.id, { ...task });
      }
      if (immediate) flush();
      else if (pending.size && !timer) timer = setTimeout(flush, 250);
    },
  };
}
