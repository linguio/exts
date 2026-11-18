import { createContext, useContext, useEffect, useRef, useState, type ComponentProps, type ReactNode } from 'react';
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from 'lucide-react';
import { Branch as DismissableLayerBranch } from '@radix-ui/react-dismissable-layer';
import { Toast, ToastAction, ToastClose, ToastContent, ToastDescription, ToastPortal, ToastProvider, ToastTitle, ToastViewport, toast, useToastManager } from '../../ui/toast';
import { TooltipProvider } from '../../ui/tooltip';
import { ToastCopyAction } from './copy-action';
import { getToastCopyText } from './message';
import { NotificationSounds } from './sound';
import { ToastAudioPlayer } from './sound-player';

const AudioContext = createContext<NotificationSounds | null>(null);

/** 声音设置与试听仅连接当前 Toaster，包不读取应用设置。 */
export function useExtsToastSound() {
  const audio = useContext(AudioContext);
  if (!audio) throw new Error('useExtsToastSound requires ExtsToaster.');
  return audio;
}

function SoundObserver({ enabled }: { enabled: boolean }) {
  const audio = useExtsToastSound();
  const { toasts } = useToastManager();
  const current = useRef(toasts);
  current.current = toasts;
  useEffect(() => {
    audio.seed(current.current);
    const release = () => audio.dispose();
    window.addEventListener('pagehide', release);
    return () => { window.removeEventListener('pagehide', release); release(); };
  }, [audio]);
  useEffect(() => {
    audio.setEnabled(enabled);
    const restore = () => { audio.seed(current.current); audio.setEnabled(enabled); };
    window.addEventListener('pageshow', restore);
    return () => window.removeEventListener('pageshow', restore);
  }, [audio, enabled]);
  useEffect(() => { audio.observe(toasts.filter(item => item.transitionStatus !== 'ending')); }, [audio, toasts]);
  return null;
}

function ExtsToastList({ container }: { container?: HTMLElement | ShadowRoot | null }) {
  const { toasts } = useToastManager();
  const icons = { success: CircleCheckIcon, info: InfoIcon, warning: TriangleAlertIcon, error: OctagonXIcon, loading: Loader2Icon };
  return toasts.map(item => {
    const Icon = icons[item.type as keyof typeof icons];
    return <Toast key={item.id} toast={item} className="exts-toast-card">
      <ToastContent>
        {Icon && <span className="shrink-0 [&_svg]:size-4"><Icon aria-hidden className={item.type === 'error' ? 'text-destructive' : item.type === 'loading' ? 'animate-spin' : undefined} /></span>}
        <div className="flex min-w-0 flex-1 flex-col gap-1"><ToastTitle /><ToastDescription /></div>
        <ToastCopyAction displayText={getToastCopyText(item.title, item.description)} portalContainer={container} />
        <ToastAction /><ToastClose />
      </ToastContent>
    </Toast>;
  });
}

export interface ExtsToasterProps extends ComponentProps<typeof ToastProvider> {
  soundEnabled?: boolean;
  portalContainer?: HTMLElement | ShadowRoot | null;
  children?: ReactNode;
}

/** 统一项目增强能力；原语及默认交互继续由官方 Toast 维护。 */
export function ExtsToaster({ children, soundEnabled = false, portalContainer, toastManager = toast, ...props }: ExtsToasterProps) {
  const [audio] = useState(() => new NotificationSounds(new ToastAudioPlayer()));
  return <ToastProvider toastManager={toastManager} {...props}>
    <AudioContext.Provider value={audio}>
      {children}
      <SoundObserver enabled={soundEnabled} />
      <ToastPortal container={portalContainer}>
        <TooltipProvider delayDuration={400}>
          <DismissableLayerBranch asChild>
            <ToastViewport className="exts-toast-viewport"><ExtsToastList container={portalContainer} /></ToastViewport>
          </DismissableLayerBranch>
        </TooltipProvider>
      </ToastPortal>
    </AudioContext.Provider>
  </ToastProvider>;
}
