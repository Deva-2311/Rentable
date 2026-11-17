import * as React from "react"
import { cn } from "@/lib/utils"

const STATUS_CONFIG: Record<string, { label: string; styles: string }> = {
  PENDING: { label: "Pending", styles: "bg-amber-500/15 text-amber-800 border-amber-300 dark:text-amber-300 dark:border-amber-700" },
  CONFIRMED: { label: "Confirmed", styles: "bg-blue-500/15 text-blue-800 border-blue-300 dark:text-blue-300 dark:border-blue-700" },
  ACTIVE: { label: "Active", styles: "bg-emerald-500/15 text-emerald-800 border-emerald-300 dark:text-emerald-300 dark:border-emerald-700" },
  CANCELLED: { label: "Cancelled", styles: "bg-red-500/15 text-red-800 border-red-300 dark:text-red-300 dark:border-red-700" },
  REJECTED: { label: "Rejected", styles: "bg-red-500/15 text-red-800 border-red-300 dark:text-red-300 dark:border-red-700" },
  COMPLETED: { label: "Completed", styles: "bg-neutral-500/15 text-neutral-800 border-neutral-300 dark:text-neutral-300 dark:border-neutral-700" },
  RETURN_REQUESTED: { label: "Return Requested", styles: "bg-amber-500/15 text-amber-800 border-amber-300 dark:text-amber-300 dark:border-amber-700" },
  RETURNED: { label: "Returned", styles: "bg-neutral-500/15 text-neutral-800 border-neutral-300 dark:text-neutral-300 dark:border-neutral-700" },
  UPCOMING: { label: "Upcoming", styles: "bg-purple-500/15 text-purple-800 border-purple-300 dark:text-purple-300 dark:border-purple-700" },
  AVAILABLE: { label: "Available", styles: "bg-emerald-500/15 text-emerald-800 border-emerald-300 dark:text-emerald-300 dark:border-emerald-700" },
  UNAVAILABLE: { label: "Unavailable", styles: "bg-secondary text-muted-foreground border-border" },
}

interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: string
  variant?: "outline" | "filled"
}

export function StatusBadge({ status, variant = "outline", className, ...props }: StatusBadgeProps) {
  const normalizedStatus = status.toUpperCase()
  const config = STATUS_CONFIG[normalizedStatus] || { label: status, styles: "bg-secondary text-foreground border-border" }

  const isActive = normalizedStatus === "ACTIVE" || normalizedStatus === "AVAILABLE"

  return (
    <span
      className={cn(
        "inline-flex items-center h-6 px-2.5 rounded-full text-[11px] font-bold uppercase tracking-[0.08em] whitespace-nowrap",
        variant === "outline" ? "border" : "",
        config.styles,
        className
      )}
      {...props}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full mr-1.5", isActive ? "bg-emerald-600 animate-pulse" : "bg-current opacity-70")} />
      {config.label}
    </span>
  )
}
