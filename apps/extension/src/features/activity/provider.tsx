import { createContext, useContext, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';

import { readSessionResetVersion, subscribeSessionReset, useAccount } from '../account/auth-client';
import { ApiRequestError } from '../../api/client';
import { toast } from '../../components/ui/sonner';
import { activityPeriod, activityRecords, type ActivityView } from './data';
import { requestActivity } from './requests';
import type { ActivityRecords } from './types';

interface ActivityState {
  userId: string | null;
  version: number;
  view: ActivityView;
  records: ActivityRecords;
  status: 'idle' | 'loading' | 'success' | 'error';
  hasPreviousResult: boolean;
}
interface ActivityContextValue extends ActivityState { setView: (view: ActivityView) => void }
const context = createContext<ActivityContextValue | null>(null);

/** 只持有当前展示数据；放在页面隐藏边界之外，不把 Effect 恢复当作重新请求。 */
export function ActivityDataProvider({ children }: { children: ReactNode }) {
  const resetVersion = useSyncExternalStore(subscribeSessionReset, readSessionResetVersion);
  const { user } = useAccount();
  const userId = user?.id ?? null;
  const [selection, setSelection] = useState<{ version: number; view: ActivityView }>({ version: resetVersion, view: 'calendar' });
  const view = selection.version === resetVersion ? selection.view : 'calendar';
  const [state, setState] = useState<ActivityState>({ userId: null, version: resetVersion, view, records: {}, status: 'idle', hasPreviousResult: false });
  const previous = useRef<{ userId: string | null; version: number; views: Map<ActivityView, ActivityRecords> }>(
    { userId: null, version: resetVersion, views: new Map() });

  useEffect(() => {
    if (previous.current.userId !== userId || previous.current.version !== resetVersion) {
      previous.current = { userId, version: resetVersion, views: new Map() };
    }
    if (!userId) {
      setState({ userId, version: resetVersion, view, records: {}, status: 'idle', hasPreviousResult: false });
      return;
    }
    const controller = new AbortController();
    const period = activityPeriod(view);
    const cached = previous.current.views.get(view);
    setState({ userId, version: resetVersion, view, records: cached ?? {}, status: 'loading', hasPreviousResult: cached !== undefined });
    void requestActivity(period, userId, controller.signal).then(data => {
      if (controller.signal.aborted) return;
      const records = activityRecords(data, userId, period);
      previous.current.views.set(view, records);
      setState({ userId, version: resetVersion, view, records, status: 'success', hasPreviousResult: true });
    }).catch(error => {
      if (controller.signal.aborted) return;
      if (error instanceof ApiRequestError && (error.code === 'SESSION_CHANGED' || error.code === 'CANCELLED')) {
        setState({ userId, version: resetVersion, view, records: {}, status: 'idle', hasPreviousResult: false });
        return;
      }
      setState({ userId, version: resetVersion, view, records: {}, status: 'error', hasPreviousResult: false });
      console.error('Activity 加载失败', {
        code: error instanceof ApiRequestError ? error.code : 'UNKNOWN_ERROR',
        status: error instanceof ApiRequestError ? error.status : undefined,
        requestId: error instanceof ApiRequestError ? error.requestId : undefined,
      });
      toast.error('加载失败');
    });
    return () => controller.abort();
  }, [userId, view, resetVersion]);

  const current: ActivityState = state.userId === userId && state.version === resetVersion && state.view === view ? state
    : { userId, version: resetVersion, view, records: previous.current.userId === userId && previous.current.version === resetVersion ? previous.current.views.get(view) ?? {} : {},
      status: userId ? 'loading' : 'idle',
      hasPreviousResult: !!userId && previous.current.userId === userId && previous.current.version === resetVersion && previous.current.views.has(view) };
  return <context.Provider value={{ ...current, setView: next => setSelection({ version: resetVersion, view: next }) }}>{children}</context.Provider>;
}

export function useActivityData() {
  const value = useContext(context);
  if (!value) throw new Error('ActivityDataProvider 未初始化');
  return value;
}
