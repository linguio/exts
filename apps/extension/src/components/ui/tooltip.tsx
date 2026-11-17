// 基于 shadcn/ui new-york-v4 官方 tooltip；固定来源与必要差异见 docs/web-ui-sources.md。
import * as React from "react"
import { cn } from "../../lib/utils"
import { Tooltip as TooltipPrimitive } from "radix-ui"

function TooltipProvider({
  delayDuration = 400,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  )
}

function Tooltip({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />
}

function TooltipTrigger({
  onFocus,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return (
    <TooltipPrimitive.Trigger
      data-slot="tooltip-trigger"
      {...props}
      onFocus={(event) => {
        onFocus?.(event)
        // 只阻止 Radix 因聚焦打开提示，保留真实焦点与官方悬停、关闭行为。
        event.preventDefault()
      }}
    />
  )
}

function TooltipContent({
  className,
  sideOffset = 4,
  portalContainer,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content> & { portalContainer?: React.ComponentProps<typeof TooltipPrimitive.Portal>["container"] }) {
  return (
    <TooltipPrimitive.Portal container={portalContainer}>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          "z-50 w-fit rounded-md border border-border bg-popover px-2 py-1 text-xs text-popover-foreground shadow-[var(--shadow-floating)]",
          className
        )}
        {...props}
      >
        {children}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
