import { useEffect, useState } from 'react';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Slider } from '../../../components/ui/slider';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../../components/ui/tooltip';
import { UiIcon } from '../../../components/custom/ui-icon';
import { FlipDigit } from './flip-digit';
import { TimerSoundMenu } from './sound-menu';
import { useCountdown } from './use-countdown';
import './timer.css';

/** 当前时间按系统本地时区读取，在分钟边界更新，恢复页面时立即校准。 */
function useClock(enabled: boolean) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    if (!enabled) return;
    let timeout: ReturnType<typeof setTimeout>;
    function update() {
      clearTimeout(timeout);
      setNow(new Date());
      timeout = setTimeout(update, 60_000 - Date.now() % 60_000 + 10);
    }
    update();
    document.addEventListener('visibilitychange', update);
    return () => { clearTimeout(timeout); document.removeEventListener('visibilitychange', update); };
  }, [enabled]);
  return { hours: String(now.getHours()).padStart(2, '0'), minutes: String(now.getMinutes()).padStart(2, '0') };
}

/** 同一卡片切换本地时钟与倒计时，不恢复已清空的旧计时。 */
export function TimerCard() {
  const timer = useCountdown();
  const [mode, setMode] = useState<'timer' | 'clock'>('clock');
  const [menuOpen, setMenuOpen] = useState(false);
  const clock = useClock(mode === 'clock');
  const seconds = Math.ceil(timer.remainingMs / 1000);
  const minutesText = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secondsText = String(seconds % 60).padStart(2, '0');
  const minuteValue = (value: number | readonly number[]) => typeof value === 'number' ? value : value[0] ?? 0;
  const toggleLabel = mode === 'timer' ? 'Time' : 'Countdown';

  return <TimerSoundMenu sounds={timer.sounds} onSelect={timer.chooseSound} onOpenChange={setMenuOpen}>
  <Card data-timer-context-menu ref={timer.hostRef} aria-label={mode === 'timer' ? 'Countdown' : 'Current time'} className="activity-timer box-border h-[var(--size-bookmark-folder)] w-[var(--size-bookmark-folder)] shrink-0 gap-4 rounded-[var(--radius)] p-4 shadow-none">
    <div className="flex h-8 shrink-0 items-center gap-3">
      <Slider aria-label="Countdown minutes" className="min-w-0 flex-1" value={[timer.remainingMs / 60_000]} min={0} max={60} step={5} largeStep={5}
        onPointerDownCapture={timer.prepare} onKeyDownCapture={event => { if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown'].includes(event.key)) timer.prepare(); }}
        onValueChange={value => { setMode('timer'); timer.select(minuteValue(value)); }}
        onValueCommitted={value => { setMode('timer'); timer.start(minuteValue(value)); }} />
      <Tooltip>
        <TooltipTrigger asChild>
          <Button type="button" variant="ghost" size="icon-sm" aria-label={toggleLabel} onClick={() => {
            if (mode === 'timer') {
              timer.clear();
              setMode('clock');
            } else {
              timer.start(25);
              setMode('timer');
            }
          }}><UiIcon name={mode} className="size-4" /></Button>
        </TooltipTrigger>
        <TooltipContent hidden={menuOpen}>{toggleLabel}</TooltipContent>
      </Tooltip>
    </div>
    <div className="flex min-h-0 flex-1 items-center">
      <div className="timer-face" role="timer" aria-label={mode === 'clock' ? `${clock.hours}:${clock.minutes}` : `${minutesText} minutes ${secondsText} seconds`} aria-live="off">
        <FlipDigit value={mode === 'clock' ? clock.hours : minutesText} />
        <span className="timer-colon" aria-hidden="true">:</span>
        <FlipDigit value={mode === 'clock' ? clock.minutes : secondsText} />
      </div>
    </div>
  </Card>
  </TimerSoundMenu>;
}
