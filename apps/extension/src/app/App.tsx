import { Activity, useState, useSyncExternalStore } from 'react';
import 'sonner/dist/styles.css';

import { Dock } from '../pages/dock';
import { NewtabHome } from '../pages/newtab/index';
import { DOCK_FAVORITES } from '../features/bookmarks/defaults';
import { Studio } from '@/pages/studio';
import { TooltipProvider } from '../components/ui/tooltip';
import { subscribeTheme } from '../features/settings/theme';
import { Toaster } from '../components/ui/sonner';
import { ActivityDataProvider } from '../features/activity/provider';

import '../pages/newtab/newtab.css';

const readAppearance = () => document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';

/** 首页和工作台各自持有布局；Activity 保留页面状态，Dock 只随首页显示。 */
export function App() {
  const [studioActive, setStudioActive] = useState(false);
  const appearance = useSyncExternalStore(subscribeTheme, readAppearance);

  return (
    <TooltipProvider>
      <ActivityDataProvider>
      <div className="bookmarks-page h-dvh overflow-hidden">
        <Activity mode={studioActive ? 'hidden' : 'visible'}>
          <main className="newtab-page">
            <div className="grid min-h-0 min-w-0 overflow-hidden">
              <NewtabHome />
            </div>
            <div className="flex min-w-0 justify-center" data-bookmark-dock>
              <Dock
                favorites={DOCK_FAVORITES}
                studioActive={studioActive}
                onStudioChange={setStudioActive}
              />
            </div>
          </main>
        </Activity>
        <Activity mode={studioActive ? 'visible' : 'hidden'}>
          <Studio onHome={() => setStudioActive(false)} />
        </Activity>
      </div>
      <Toaster theme={appearance} />
      </ActivityDataProvider>
    </TooltipProvider>
  );
}
