import * as React from "react"
import { cn } from "@/lib/utils"
import { Inbox } from "lucide-react"

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  icon?: React.ReactNode
  action?: React.ReactNode
}

export function EmptyState({
  title,
  description,
  icon = <Inbox className="h-12 w-12 text-muted-foreground/50" />,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card p-8 text-center animate-in fade-in-50 duration-500",
        className
      )}
      {...props}
    >
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted/50 mb-6">
        {icon}
      </div>
      <h3 className="mt-4 text-xl font-medium tracking-tight text-foreground">
        {title}
      </h3>
      {description && (
        <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
          {description}
        </p>
      )}
      {action && <div className="mt-8">{action}</div>}
    </div>
  )
}
