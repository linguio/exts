import { Activity, useState, useSyncExternalStore } from 'react';
import 'sonner/dist/styles.css';

import { Dock } from '../pages/dock';
import { NewtabHome } from '../pages/newtab/index';
import { DOCK_FAVORITES } from '../features/bookmarks/defaults';
import { Studio } from '@/pages/studio';
import { TooltipProvider } from '../components/ui/tooltip';
import { subscribeTheme } from '../features/settings/theme';
import { Toaster, toast } from '../components/ui/sonner';
import { saveViewPreference, type AppView } from './view-preference';
import { ActivityDataProvider } from '../features/activity/charts/provider';

import '../pages/newtab/newtab.css';

const readAppearance = () => document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';

/** 首页和工作台各自持有布局；Activity 保留页面状态，Dock 只随首页显示。 */
export function App({ initialView }: { initialView: AppView }) {
  const [studioActive, setStudioActive] = useState(initialView === 'studio');
  function changeStudio(active: boolean) {
    setStudioActive(active);
    void saveViewPreference(active ? 'studio' : 'home').catch(() => {
      console.error('页面位置保存失败');
      toast.error('Unable to save page preference.');
    });
  }
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
                onStudioChange={changeStudio}
              />
            </div>
          </main>
        </Activity>
        <Activity mode={studioActive ? 'visible' : 'hidden'}>
          <Studio onHome={() => changeStudio(false)} />
        </Activity>
      </div>
      <Toaster theme={appearance} />
      </ActivityDataProvider>
    </TooltipProvider>
  );
}
