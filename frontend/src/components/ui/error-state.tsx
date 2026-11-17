import * as React from "react"
import { cn } from "@/lib/utils"
import { AlertCircle } from "lucide-react"
import { Button } from "./button"

interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  onRetry?: () => void
}

export function ErrorState({
  title = "Something went wrong",
  description = "An error occurred while loading this content. Please try again.",
  onRetry,
  className,
  ...props
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center animate-in fade-in-50 duration-500",
        className
      )}
      {...props}
    >
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10 mb-6">
        <AlertCircle className="h-10 w-10 text-red-500" />
      </div>
      <h3 className="mt-4 text-xl font-medium tracking-tight text-foreground">
        {title}
      </h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto mb-8">
        {description}
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="border-red-500/20 text-red-500 hover:bg-red-500/10">
          Try Again
        </Button>
      )}
    </div>
  )
}
