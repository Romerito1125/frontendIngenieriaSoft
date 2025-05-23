//Zuluaga


import type React from "react"
import { cn } from "@/lib/utils"


export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded-md bg-blue-100/60", className)} {...props} />;
}
