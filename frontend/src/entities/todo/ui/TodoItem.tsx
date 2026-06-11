import { memo } from 'react'
import { Trash2 } from 'lucide-react'
import { Badge, Button, Checkbox } from '@/shared/ui'
import type { Todo } from '../model/types'

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
  const done = todo.completed

  return (
    <li className="flex items-center gap-3 border-b px-4 py-3 last:border-b-0 transition-colors hover:bg-muted/50">
      <Checkbox
        checked={isSelected}
        onCheckedChange={() => onToggleSelect(todo.id)}
        disabled={done}
        aria-label="select task"
      />
      <Checkbox
        checked={done}
        onCheckedChange={() => !done && onComplete(todo)}
        disabled={done}
        aria-label="complete task"
      />
      <span className={`flex-1 text-sm ${done ? 'text-muted-foreground line-through' : ''}`}>
        {todo.text}
      </span>
      <Badge variant="secondary">{todo.category.name}</Badge>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => onDelete(todo)}
        aria-label="delete task"
        className="text-muted-foreground hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </li>
  )
})
