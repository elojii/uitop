import { useCallback, useMemo } from 'react'
import { Checkbox } from '@/shared/ui'
import { TodoItem } from '@/entities/todo'
import type { Todo } from '@/entities/todo'
import { BulkActionsBar } from '@/features/bulk-complete'

interface Props {
  todos: Todo[]
  selectedIds: Set<number>
  allSelected: boolean
  someSelected: boolean
  onToggleSelect: (id: number) => void
  onToggleSelectAll: () => void
  onComplete: (todo: Todo) => void
  onDelete: (todo: Todo) => void
  onBulkComplete: () => void
  onBulkDelete: () => void
  isBulkCompleting?: boolean
  isBulkDeleting?: boolean
}

export function TodoList({
  todos,
  selectedIds,
  allSelected,
  someSelected,
  onToggleSelect,
  onToggleSelectAll,
  onComplete,
  onDelete,
  onBulkComplete,
  onBulkDelete,
  isBulkCompleting,
  isBulkDeleting,
}: Props) {
  const handleComplete = useCallback((todo: Todo) => onComplete(todo), [onComplete])
  const handleDelete = useCallback((todo: Todo) => onDelete(todo), [onDelete])
  const handleToggleSelect = useCallback((id: number) => onToggleSelect(id), [onToggleSelect])

  const selectAllChecked = useMemo(() => {
    if (allSelected) return true
    if (someSelected) return 'indeterminate' as const
    return false
  }, [allSelected, someSelected])

  return (
    <div>
      {someSelected && (
        <BulkActionsBar
          count={selectedIds.size}
          onBulkComplete={onBulkComplete}
          onBulkDelete={onBulkDelete}
          isCompleting={isBulkCompleting}
          isDeleting={isBulkDeleting}
        />
      )}
      <ul>
        <li className="flex items-center gap-3 border-b bg-muted/30 px-4 py-2">
          <Checkbox
            checked={selectAllChecked}
            onCheckedChange={onToggleSelectAll}
            aria-label="select all"
          />
          <span className="text-xs text-muted-foreground">Select all</span>
        </li>
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            isSelected={selectedIds.has(todo.id)}
            onToggleSelect={handleToggleSelect}
            onComplete={handleComplete}
            onDelete={handleDelete}
          />
        ))}
      </ul>
    </div>
  )
}
