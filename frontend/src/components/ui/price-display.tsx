import * as React from "react"
import { cn } from "@/lib/utils"

interface PriceDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
  amount: number
  period?: "day" | "week" | "month" | "total"
  currency?: string
  size?: "sm" | "md" | "lg" | "xl"
}

export function PriceDisplay({
  amount,
  period = "day",
  currency = "₹",
  size = "md",
  className,
  ...props
}: PriceDisplayProps) {
  const sizeMap = {
    sm: { amount: "text-base font-bold", period: "text-[10px]" },
    md: { amount: "text-lg md:text-xl font-bold", period: "text-xs" },
    lg: { amount: "text-2xl md:text-3xl font-bold", period: "text-sm" },
    xl: { amount: "text-4xl md:text-5xl font-medium tracking-tight", period: "text-base" },
  }

  return (
    <div className={cn("flex items-baseline gap-1 text-foreground", className)} {...props}>
      <span className={sizeMap[size].amount}>
        {currency}{amount.toLocaleString("en-IN")}
      </span>
      {period && (
        <span className={cn("text-muted-foreground uppercase tracking-widest", sizeMap[size].period)}>
          /{period}
        </span>
      )}
    </div>
  )
}
