import { createElement, useEffect, useState } from 'react';
import { toast, useSonner } from 'sonner';
import { notificationSounds } from '../../lib/audio/notification-sounds';
import { getSettings, subscribeSettings } from './store-client';

/** 展示环境只接收开关，不读取 Chrome API；MAIN 页面通过原有隔离桥取得偏好。 */
export function NotificationAudio({ soundEnabled }: { soundEnabled: boolean }) {
  const { toasts } = useSonner();
  useEffect(() => {
    notificationSounds.seed(toast.getToasts().filter(item => !('dismiss' in item)));
    const release = () => notificationSounds.dispose();
    window.addEventListener('pagehide', release);
    return () => { window.removeEventListener('pagehide', release); release(); };
  }, []);
  useEffect(() => {
    notificationSounds.setEnabled(soundEnabled);
    const restore = () => {
      notificationSounds.seed(toast.getToasts().filter(item => !('dismiss' in item)));
      notificationSounds.setEnabled(soundEnabled);
    };
    window.addEventListener('pageshow', restore);
    return () => window.removeEventListener('pageshow', restore);
  }, [soundEnabled]);
  useEffect(() => { notificationSounds.observe(toasts); }, [toasts]);
  return null;
}

/** 扩展页面使用既有设置数据入口，和 MAIN 展示环境保持明确边界。 */
export function SettingsNotificationAudio() {
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
  return createElement(NotificationAudio, { soundEnabled });
}
