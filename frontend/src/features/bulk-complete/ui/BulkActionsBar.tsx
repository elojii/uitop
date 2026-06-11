import { Button } from '@/shared/ui'

interface Props {
  count: number
  onBulkComplete: () => void
  isLoading?: boolean
}

export function BulkActionsBar({ count, onBulkComplete, isLoading }: Props) {
  return (
    <div className="flex items-center gap-3 border-b bg-muted/50 px-4 py-2">
      <span className="text-sm text-muted-foreground">{count} selected</span>
      <Button variant="link" size="sm" onClick={onBulkComplete} disabled={isLoading}>
        Mark as done
      </Button>
    </div>
  )
}
