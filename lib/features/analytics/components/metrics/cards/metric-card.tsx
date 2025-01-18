"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  title: string
  icon: LucideIcon
  children: React.ReactNode
  className?: string
  summary?: boolean
}

export function MetricCard({ title, icon: Icon, children, className, summary = false }: MetricCardProps) {
  return (
    <Card className={className}>
      <CardHeader className={cn("flex flex-row items-center justify-between", summary && "pb-2")}>
        <CardTitle className={cn(summary ? "text-sm font-medium" : "text-base font-semibold")}>{title}</CardTitle>
        <Icon className={cn("text-muted-foreground", summary ? "h-4 w-4" : "h-5 w-5")} />
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  )
}
