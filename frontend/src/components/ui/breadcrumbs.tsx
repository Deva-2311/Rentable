import * as React from "react"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"

interface BreadcrumbsProps extends React.HTMLAttributes<HTMLElement> {
  items: { label: string; href?: string }[]
}

export function Breadcrumbs({ items, className, ...props }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center text-xs uppercase tracking-widest text-muted-foreground", className)}
      {...props}
    >
      <ol className="flex items-center space-x-2">
        <li>
          <Link href="/" className="hover:text-foreground transition-colors flex items-center">
            <Home className="h-3.5 w-3.5" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <li>
              <ChevronRight className="h-3.5 w-3.5" />
            </li>
            <li>
              {item.href ? (
                <Link href={item.href} className="hover:text-foreground transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className="text-foreground font-bold">{item.label}</span>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  )
}
