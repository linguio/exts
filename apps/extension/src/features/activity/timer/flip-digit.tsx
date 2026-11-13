import { useEffect, useState } from 'react';

/** 上半旧页先落下，新下页再展开；静态下半页在动画结束后才更新。 */
export function FlipDigit({ value }: { value: string }) {
  const [frame, setFrame] = useState({ current: value, previous: null as string | null });
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setFrame(old => old.current === value ? old : { current: value, previous: reduced ? null : old.current });
    const timeout = setTimeout(() => setFrame(old => ({ ...old, previous: null })), 480);
    return () => clearTimeout(timeout);
  }, [value]);
  return <span className="timer-digit" aria-hidden="true">
    <span className="timer-half timer-half-top"><span><span className="timer-number">{frame.current}</span></span></span>
    <span className="timer-half timer-half-bottom"><span><span className="timer-number">{frame.previous ?? frame.current}</span></span></span>
    {frame.previous !== null && <span key={frame.current}>
      <span className="timer-half timer-half-top timer-fold"><span><span className="timer-number">{frame.previous}</span></span></span>
      <span className="timer-half timer-half-bottom timer-unfold"><span><span className="timer-number">{frame.current}</span></span></span>
    </span>}
  </span>;
}
