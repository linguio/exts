import '../../styles/index.css';
import './style.css';
import { createRoot } from 'react-dom/client';
import { DownloadsPopup } from '../../modules/downloads/popup';
import { applyTheme, subscribeTheme } from '../../shared/theme/runtime';

applyTheme();
const stop = subscribeTheme(() => {});
if (import.meta.hot) import.meta.hot.dispose(stop);
const container = document.getElementById('app');
if (!container) throw new Error('Downloads 根节点不存在');
createRoot(container).render(<DownloadsPopup />);
