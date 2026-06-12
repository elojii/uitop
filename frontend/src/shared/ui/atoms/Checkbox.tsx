import { type InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '../../lib/cn'

export const Checkbox = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      type="checkbox"
      className={cn(
        'h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer disabled:opacity-40',
        className,
      )}
      {...props}
    />
  ),
)
Checkbox.displayName = 'Checkbox'
