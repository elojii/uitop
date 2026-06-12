import { cn } from '../lib/cn'

interface SpinnerProps {
  className?: string
}

export function Spinner({ className }: SpinnerProps) {
  return (
    <div
      className={cn(
        'h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary',
        className,
      )}
    />
  )
}
