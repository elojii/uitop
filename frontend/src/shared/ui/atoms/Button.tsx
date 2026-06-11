import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/shared/lib/cn'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger'
  size?: 'sm' | 'md'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'rounded-lg font-medium transition-colors focus:outline-none focus:ring-2',
        size === 'sm' && 'px-3 py-1.5 text-xs',
        size === 'md' && 'px-4 py-2 text-sm',
        variant === 'primary' &&
          'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:opacity-50',
        variant === 'ghost' &&
          'text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-400',
        variant === 'danger' &&
          'text-red-500 hover:text-red-600 hover:bg-red-50 focus:ring-red-400',
        className,
      )}
      {...props}
    />
  ),
)
Button.displayName = 'Button'
