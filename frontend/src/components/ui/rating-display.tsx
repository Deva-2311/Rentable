import * as React from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface RatingDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
  rating: number
  reviewsCount?: number
  showCount?: boolean
  size?: "sm" | "md" | "lg"
}

export function RatingDisplay({
  rating,
  reviewsCount,
  showCount = true,
  size = "md",
  className,
  ...props
}: RatingDisplayProps) {
  const roundedRating = Math.round(rating * 10) / 10
  
  const sizeMap = {
    sm: "w-3 h-3 text-xs",
    md: "w-4 h-4 text-sm",
    lg: "w-5 h-5 text-base",
  }

  const iconSize = sizeMap[size].split(" ")[0]

  return (
    <div className={cn("flex items-center gap-1.5 text-foreground font-medium", sizeMap[size], className)} {...props}>
      <Star className={cn("fill-forest-mint text-forest-mint", iconSize)} />
      <span>{roundedRating.toFixed(1)}</span>
      {showCount && reviewsCount !== undefined && (
        <span className="text-muted-foreground font-normal">
          ({reviewsCount})
        </span>
      )}
    </div>
  )
}
