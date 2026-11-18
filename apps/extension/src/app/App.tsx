import '@linguio/exts-ui/styles.css';
import { Activity, useState } from 'react';

import { SettingsToaster } from '../features/settings/notification-toaster';

import { Dock } from '../pages/dock';
import { NewtabHome } from '../pages/newtab/index';
import { DOCK_FAVORITES } from '../features/bookmarks/defaults';
import { Studio } from '@/pages/studio';
import { TooltipProvider } from '../components/ui/tooltip';
import { toast } from '@linguio/exts-ui/plus/toast';
import { saveViewPreference, type AppView } from './view-preference';
import { ActivityDataProvider } from '../features/activity/charts/provider';

import '../pages/newtab/newtab.css';

/** 首页和工作台各自持有布局；Activity 保留页面状态，Dock 只随首页显示。 */
export function App({ initialView }: { initialView: AppView }) {
  const [studioActive, setStudioActive] = useState(initialView === 'studio');
  function changeStudio(active: boolean) {
    setStudioActive(active);
    void saveViewPreference(active ? 'studio' : 'home').catch(() => {
      console.error('页面位置保存失败');
      toast.add({ type: "error", title: 'Unable to save page preference.' });
    });
  }

  return (
    <TooltipProvider>
      <SettingsToaster>
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
                  onOpenStudio={() => changeStudio(true)}
                />
              </div>
            </main>
          </Activity>
          <Activity mode={studioActive ? 'visible' : 'hidden'}>
            <Studio onHome={() => changeStudio(false)} />
          </Activity>
        </div>
        </ActivityDataProvider>
      </SettingsToaster>
    </TooltipProvider>
  );
}
