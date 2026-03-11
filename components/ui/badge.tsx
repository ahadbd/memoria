import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "slate" | "indigo" | "rose" | "emerald"
}

function Badge({ className, variant = "slate", ...props }: BadgeProps) {
  const variants = {
    slate: "bg-slate-800 text-slate-300 border-slate-700",
    indigo: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    rose: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  }
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500",
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }
