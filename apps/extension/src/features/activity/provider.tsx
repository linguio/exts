import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import { useAccount } from '../account/auth-client';
import { ApiRequestError } from '../../lib/api/client';
import { toast } from '../../components/ui/sonner';
import { activityPeriod, activityRecords, type ActivityView } from './data';
import { requestActivity } from './requests';
import type { ActivityRecords } from './types';

interface ActivityState {
  userId: string | null;
  view: ActivityView;
  records: ActivityRecords;
}
interface ActivityContextValue extends ActivityState { setView: (view: ActivityView) => void }
const context = createContext<ActivityContextValue | null>(null);

/** 只持有当前展示数据；放在页面隐藏边界之外，不把 Effect 恢复当作重新请求。 */
export function ActivityDataProvider({ children }: { children: ReactNode }) {
  const { user } = useAccount();
  const userId = user?.id ?? null;
  const [view, setView] = useState<ActivityView>('calendar');
  const [state, setState] = useState<ActivityState>({ userId: null, view, records: {} });

  useEffect(() => {
    if (!userId) {
      setState({ userId, view, records: {} });
      return;
    }
    const controller = new AbortController();
    const period = activityPeriod(view);
    setState({ userId, view, records: {} });
    void requestActivity(period, userId, controller.signal).then(data => {
      if (!controller.signal.aborted) setState({ userId, view, records: activityRecords(data, userId, period) });
    }).catch(error => {
      if (controller.signal.aborted) return;
      setState({ userId, view, records: {} });
      console.error('Activity 加载失败', {
        code: error instanceof ApiRequestError ? error.code : 'UNKNOWN_ERROR',
        status: error instanceof ApiRequestError ? error.status : undefined,
        requestId: error instanceof ApiRequestError ? error.requestId : undefined,
      });
      toast.error('加载失败');
    });
    return () => controller.abort();
  }, [userId, view]);

  const current: ActivityState = state.userId === userId && state.view === view ? state
    : { userId, view, records: {} };
  return <context.Provider value={{ ...current, setView }}>{children}</context.Provider>;
}

export function useActivityData() {
  const value = useContext(context);
  if (!value) throw new Error('ActivityDataProvider 未初始化');
  return value;
}
