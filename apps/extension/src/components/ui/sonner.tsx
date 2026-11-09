// 基于 shadcn/ui 固定版本的官方 Sonner；主题由调用方传入，来源见 docs/web-ui-sources.md。
import { createElement, type CSSProperties } from "react"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { Toaster as Sonner, toast as sonnerToast, type ExternalToast, type ToasterProps } from "sonner"
import { cn } from "../../lib/utils"
import { resolveToastDisplayText, type ToastKind } from "./toast-message"
import { ToastCopyAction } from "./toast-copy-action"

type ToastMessage = Parameters<typeof sonnerToast>[0]

/** 共用复制按钮与指针事件，避免点击穿透到页面控件。 */
function withToastDefaults(displayText: string, options?: ExternalToast): ExternalToast {
  const toastClass = cn(options?.classNames?.toast, "pointer-events-auto")
  return {
    ...options,
    classNames: { ...options?.classNames, toast: toastClass },
    action: createElement(ToastCopyAction, { displayText }),
  }
}

function wrapToastCall<T extends (message: ToastMessage, data?: ExternalToast) => string | number>(fn: T, kind: ToastKind) {
  return (message: ToastMessage, data?: ExternalToast) => {
    const display = resolveToastDisplayText(message as Parameters<typeof resolveToastDisplayText>[0], kind)
    return fn(display, withToastDefaults(display, data))
  }
}

const toast = Object.assign(wrapToastCall(sonnerToast, 'default'), {
  success: wrapToastCall(sonnerToast.success, 'success'),
  info: wrapToastCall(sonnerToast.info, 'info'),
  warning: wrapToastCall(sonnerToast.warning, 'warning'),
  error: wrapToastCall(sonnerToast.error, 'error'),
  message: wrapToastCall(sonnerToast.message, 'default'),
  loading: wrapToastCall(sonnerToast.loading, 'loading'),
  custom: sonnerToast.custom,
  promise: sonnerToast.promise,
  dismiss: sonnerToast.dismiss,
  getHistory: sonnerToast.getHistory,
  getToasts: sonnerToast.getToasts,
})

const defaultToastClass = "pointer-events-auto"

const Toaster = ({ theme = "system", className, toastOptions, ...props }: ToasterProps) => {

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="bottom-right"
      className={cn("toaster group pointer-events-none", className)}
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      toastOptions={{
        ...toastOptions,
        classNames: {
          ...toastOptions?.classNames,
          toast: cn(defaultToastClass, toastOptions?.classNames?.toast),
        },
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster, toast }
