import { Check } from 'lucide-react'
import { Button } from '@/shared/ui'
import { cn } from '@/shared/lib/cn'

interface Props {
  completed: boolean
  onComplete: () => void
}

export function TodoCompleteButton({ completed, onComplete }: Props) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={onComplete}
      disabled={completed}
      aria-label={completed ? 'Task completed' : 'Complete task'}
      className={cn(
        'text-muted-foreground',
        completed ? 'text-primary' : 'hover:text-primary',
      )}
    >
      <Check className="h-4 w-4" aria-hidden />
    </Button>
  )
}
