import type { ReactNode } from 'react'

interface FormFieldProps {
  error?: string
  children: ReactNode
  className?: string
}

export function FormField({ error, children, className }: FormFieldProps) {
  return (
    <div className={className}>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}
