import { toast } from '../../../components/ui/sonner';

/** 到时只使用应用共用 Toast，不发送浏览器系统通知。 */
export function notifyTimerCompletion() {
  toast.success('Countdown complete.');
}
