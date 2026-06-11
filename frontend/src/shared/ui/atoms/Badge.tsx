import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

interface BadgeProps {
  children: ReactNode
  className?: string
}

export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'shrink-0 rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700',
        className,
      )}
    >
      {children}
    </span>
  )
}
