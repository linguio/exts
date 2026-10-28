import { Activity, useState, useSyncExternalStore } from 'react';
import 'sonner/dist/styles.css';

import { Dock } from '../modules/dock';
import { NewtabHome } from '../modules/newtab';
import { DOCK_FAVORITES } from '../modules/newtab/constants/bookmarks';
import { Studio } from '../modules/studio';
import { TooltipProvider } from '../shared/ui/tooltip';
import { subscribeTheme } from '../shared/theme/runtime';
import { Toaster } from '../shared/ui/sonner';

import './newtab.css';

const readAppearance = () => document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';

/** 页面组合只管理主视图切换，Dock 与抽屉不随主视图隐藏。 */
export function App() {
  const [studioActive, setStudioActive] = useState(false);
  const appearance = useSyncExternalStore(subscribeTheme, readAppearance);

  return (
    <TooltipProvider>
      <main className="bookmarks-page newtab-page">
        <div className="grid min-h-0 min-w-0 overflow-hidden">
          <Activity mode={studioActive ? 'hidden' : 'visible'}>
            <NewtabHome />
          </Activity>
          <Activity mode={studioActive ? 'visible' : 'hidden'}>
            <Studio />
          </Activity>
        </div>
        <div className="flex min-w-0 justify-center" data-bookmark-dock>
          <Dock
            favorites={DOCK_FAVORITES}
            studioActive={studioActive}
            onStudioChange={setStudioActive}
          />
        </div>
      </main>
      <Toaster theme={appearance} />
    </TooltipProvider>
  );
}
