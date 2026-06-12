import { type SelectHTMLAttributes, forwardRef } from 'react'
import { cn } from '../../lib/cn'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  hasError?: boolean
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, hasError, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        'rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500',
        hasError ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white',
        className,
      )}
      {...props}
    />
  ),
)
Select.displayName = 'Select'
