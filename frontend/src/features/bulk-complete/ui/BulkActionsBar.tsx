import { Button } from '@/shared/ui'

interface Props {
  count: number
  onBulkComplete: () => void
  onBulkDelete: () => void
  isCompleting?: boolean
  isDeleting?: boolean
}

export function BulkActionsBar({
  count,
  onBulkComplete,
  onBulkDelete,
  isCompleting,
  isDeleting,
}: Props) {
  return (
    <div className="flex items-center gap-3 border-b bg-muted/50 px-4 py-2">
      <span className="text-sm text-muted-foreground">{count} selected</span>
      <Button variant="link" size="sm" onClick={onBulkComplete} disabled={isCompleting}>
        Mark as done
      </Button>
      <Button
        variant="link"
        size="sm"
        onClick={onBulkDelete}
        disabled={isDeleting}
        className="text-destructive"
      >
        Delete
      </Button>
    </div>
  )
}
