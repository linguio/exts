import '../../styles/index.css';

import { createRoot } from 'react-dom/client';
import { browser } from 'wxt/browser';

import { App } from '../../app/App';
import { readViewPreference } from '../../app/view-preference';
import { applyTheme, subscribeTheme } from '../../features/settings/theme';

applyTheme();
// 面板关闭时也继续跟随系统和其他页面的偏好更新。
const stopThemeSync = subscribeTheme(() => {});
if (import.meta.hot) import.meta.hot.dispose(stopThemeSync);

// 覆盖页面显式使用完整扩展资源地址，避免浏览器内置页地址参与 favicon 解析。
const favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
if (favicon) {
  favicon.type = 'image/png';
  favicon.sizes.value = '32x32';
  favicon.href = browser.runtime.getURL('/src/assets/logo/exts-32.png');
}

// WXT 只负责提供页面容器，React 从这里接管新标签页的渲染生命周期。
const container = document.getElementById('app');

if (!container) {
  throw new Error('exts React 根节点不存在。');
}

// 恢复当前会话位置后再挂载，避免先显示 Home 再跳到 Studio。
void readViewPreference().then(initialView => {
  createRoot(container).render(<App initialView={initialView} />);
});
