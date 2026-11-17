import * as React from "react"
import { cn } from "@/lib/utils"

interface BentoBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "small" | "medium" | "large" | "wide" | "tall" | "featured"
  variant?: "default" | "dark" | "glass"
  children: React.ReactNode
}

export function BentoBlock({
  className,
  size = "small",
  variant = "default",
  children,
  ...props
}: BentoBlockProps) {
  return (
    <div
      className={cn(
        "relative rounded-xl md:rounded-2xl overflow-hidden transition-all duration-300",
        // Sizes
        {
          "col-span-1 row-span-1": size === "small",
          "col-span-1 row-span-2 md:col-span-2 md:row-span-1": size === "medium",
          "col-span-1 row-span-2 md:col-span-2 md:row-span-2": size === "large",
          "col-span-1 md:col-span-2 lg:col-span-3 row-span-1": size === "wide",
          "col-span-1 row-span-2": size === "tall",
          "col-span-1 md:col-span-3 lg:col-span-4 row-span-2": size === "featured",
        },
        // Variants
        {
          "bg-card text-card-foreground border border-border shadow-xs": variant === "default",
          "bg-[#181B18] text-[#F7F6F1] border border-[#2C312B] shadow-sm": variant === "dark",
          "glass-panel": variant === "glass",
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
