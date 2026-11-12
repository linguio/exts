import { useEffect, useRef, useState } from 'react';
import { toast } from '../../../components/ui/sonner';
import { defaultSounds, readSounds, saveSound, soundKeys, type TimerSounds } from './sound-preference';
import { Countdown } from './countdown';
import { TimerAudio } from './audio';
import { notifyTimerCompletion } from './completion';

/** 状态属于当前卡片；用户事件启动调度，不依赖隐藏时会暂停的 Activity Effect。 */
export function useCountdown() {
  const [remainingMs, setRemainingMs] = useState(0);
  const [sounds, setSounds] = useState<TimerSounds>({ ...defaultSounds });
  const soundsRef = useRef<TimerSounds>({ ...defaultSounds });
  const preferenceVersion = useRef(0);
  const hostRef = useRef<HTMLDivElement>(null);
  const model = useRef(new Countdown());
  const audio = useRef(new TimerAudio());
  const interval = useRef<ReturnType<typeof setInterval> | null>(null);
  const pageCleanup = useRef<(() => void) | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      const version = ++preferenceVersion.current;
      try {
        const stored = await readSounds();
        if (!active || version !== preferenceVersion.current) return;
        soundsRef.current = stored;
        setSounds(stored);
        audio.current.setSounds(stored);
      } catch (error) {
        if (!active) return;
        console.error('倒计时声音偏好读取失败', error);
        toast.error('Unable to load timer sounds.');
      }
    }
    void load();
    const changed = (changes: Record<string, chrome.storage.StorageChange>, area: string) => {
      if (area === 'local' && Object.values(soundKeys).some(key => key in changes)) void load();
    };
    chrome.storage.onChanged.addListener(changed);
    return () => { active = false; chrome.storage.onChanged.removeListener(changed); };
  }, []);

  function chooseSound<K extends keyof TimerSounds>(group: K, value: TimerSounds[K]) {
    preferenceVersion.current++;
    const next = { ...soundsRef.current, [group]: value };
    soundsRef.current = next;
    setSounds(next);
    audio.current.setSounds(next);
    audio.current.preview(group);
    if (!pageCleanup.current) {
      pageCleanup.current = dispose;
      window.addEventListener('pagehide', dispose);
    }
    void saveSound(group, value).catch(error => {
      console.error('倒计时声音偏好保存失败', error);
      toast.error('Unable to save timer sound.');
    });
  }

  function stopClock() {
    if (interval.current !== null) clearInterval(interval.current);
    interval.current = null;
  }

  function dispose() {
    stopClock();
    audio.current.dispose();
    model.current.select(0);
    if (pageCleanup.current) window.removeEventListener('pagehide', pageCleanup.current);
    pageCleanup.current = null;
  }

  function prepare() {
    audio.current.prepare();
    if (!pageCleanup.current) {
      pageCleanup.current = dispose;
      window.addEventListener('pagehide', dispose);
    }
  }

  function select(minutes: number) {
    stopClock();
    audio.current.dispose();
    setRemainingMs(model.current.select(minutes));
  }

  function start(minutes: number) {
    stopClock();
    const initial = model.current.start(minutes, Date.now());
    setRemainingMs(initial);
    if (!initial) { audio.current.dispose(); return; }
    audio.current.start();
    if (!pageCleanup.current) {
      pageCleanup.current = dispose;
      window.addEventListener('pagehide', dispose);
    }
    interval.current = setInterval(() => {
      const snapshot = model.current.sample(Date.now());
      setRemainingMs(snapshot.remainingMs);
      if (snapshot.completed) {
        stopClock();
        audio.current.finish();
        void notifyTimerCompletion();
      } else audio.current.schedule();
    }, 50);
  }

  useEffect(() => {
    const host = hostRef.current;
    // Activity 隐藏时节点仍连接文档；只有真正卸载才释放计时和音频。
    return () => { queueMicrotask(() => { if (!host?.isConnected) dispose(); }); };
  }, []);

  function clear() {
    dispose();
    setRemainingMs(0);
  }

  return { hostRef, remainingMs, prepare, select, start, clear, sounds, chooseSound };
}
