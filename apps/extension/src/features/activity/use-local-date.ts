import { useEffect, useState } from 'react';
import { activityToday, nextActivityMidnight } from './data';

/** 上海业务日期只推进展示，不触发网络请求。 */
export function useLocalDate() {
  const [today, setToday] = useState(() => activityToday());

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    function update() {
      clearTimeout(timer);
      const now = new Date();
      setToday(activityToday(now));
      timer = setTimeout(update, nextActivityMidnight(now) - now.getTime() + 50);
    }
    function onVisible() {
      if (document.visibilityState === 'visible') update();
    }
    update();
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  return today;
}
