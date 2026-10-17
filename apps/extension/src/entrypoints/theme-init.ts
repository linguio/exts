import { defineUnlistedScript } from 'wxt/utils/define-unlisted-script';

import { applyTheme } from '../shared/theme/runtime';

// 独立经典脚本在 head 中阻塞解析，首屏直接应用本机主题，不依赖 React 挂载。
export default defineUnlistedScript(() => {
  applyTheme();
});
