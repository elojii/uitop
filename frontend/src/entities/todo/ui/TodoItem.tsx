import { memo } from 'react'
import { Trash2 } from 'lucide-react'
import { Badge, Button, Checkbox } from '@/shared/ui'
import type { Todo } from '../model/types'
import { TodoCompleteButton } from './TodoCompleteButton'

interface Props {
  todo: Todo
  isSelected: boolean
  onToggleSelect: (id: number) => void
  onComplete: (todo: Todo) => void
  onDelete: (todo: Todo) => void
}

export const TodoItem = memo(function TodoItem({
  todo,
  isSelected,
  onToggleSelect,
  onComplete,
  onDelete,
}: Props) {
  const isDone = todo.completed

  const handleCheckedChange = () => onToggleSelect(todo.id)

  const handleComplete = () => !isDone && onComplete(todo)

  const handleDelete = () => onDelete(todo)

  return (
    <li className="flex items-center gap-3 border-b px-4 py-3 last:border-b-0 transition-colors hover:bg-muted/50">
      <Checkbox
        checked={isSelected}
        onCheckedChange={handleCheckedChange}
        disabled={isDone}
        aria-label="select task"
      />
      <span className={`flex-1 text-sm ${isDone ? 'text-muted-foreground line-through' : ''}`}>
        {todo.text}
      </span>
      <Badge variant="secondary">{todo.category.name}</Badge>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={handleDelete}
        aria-label="delete task"
        className="text-muted-foreground hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
      <TodoCompleteButton completed={isDone} onComplete={handleComplete} />
    </li>
  )
})
