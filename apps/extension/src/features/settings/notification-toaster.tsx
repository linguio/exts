import { createElement, useEffect, useState, type ReactNode } from 'react';
import { ExtsToaster } from '@linguio/exts-ui/plus/toast';
import { getSettings, subscribeSettings } from './store-client';

/** 扩展页面使用既有设置数据入口，和 MAIN 展示环境保持明确边界。 */
export function SettingsToaster({ children }: { children: ReactNode }) {
  const [soundEnabled, setSoundEnabled] = useState(false);
  useEffect(() => {
    let active = true;
    let revision = 0;
    const stop = subscribeSettings(settings => {
      revision++;
      setSoundEnabled(settings.notifications.soundEnabled);
    });
    const refresh = () => {
      const before = revision;
      void getSettings().then(settings => {
        if (active && before === revision) setSoundEnabled(settings.notifications.soundEnabled);
      }).catch(error => console.error('通知声音设置读取失败', error));
    };
    refresh();
    window.addEventListener('pageshow', refresh);
    return () => { active = false; stop(); window.removeEventListener('pageshow', refresh); };
  }, []);
  return createElement(ExtsToaster, { soundEnabled }, children);
}
