import { cn } from '@/shared/lib/cn'

interface SpinnerProps {
  className?: string
}

export function Spinner({ className }: SpinnerProps) {
  return (
    <div
      className={cn(
        'h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600',
        className,
      )}
    />
  )
}
