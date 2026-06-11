import { Spinner } from '@/shared/ui'
import { Button } from '@/shared/ui'

export function TodoBoardLoading() {
  return (
    <div className="flex justify-center py-14">
      <Spinner />
    </div>
  )
}

export function TodoBoardError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="mx-4 my-4 flex items-center justify-between rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3">
      <span className="text-sm text-destructive">Failed to load tasks. Please try again.</span>
      <Button variant="link" size="sm" onClick={onRetry}>
        Retry
      </Button>
    </div>
  )
}

export function TodoBoardEmpty() {
  return (
    <div className="flex flex-col items-center py-16 text-muted-foreground">
      <svg
        className="mb-3 h-16 w-16 opacity-30"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
        />
      </svg>
      <p className="text-base font-medium">No tasks here</p>
      <p className="mt-1 text-sm">Create one above to get started.</p>
    </div>
  )
}
