import { memo, useCallback, useMemo } from 'react'
import { useTodos, type Todo } from '@/entities/todo'
import { useCategories } from '@/entities/category'
import { CreateTodoForm } from '@/features/create-todo'
import { TodoFilter, useTodoFilter } from '@/features/filter-todos'
import { useBulkCompleteTodos, useTodoSelection } from '@/features/bulk-complete'
import { useUpdateTodo } from '@/features/update-todo'
import { useDeleteTodo } from '@/features/delete-todo'
import { TodoBoardEmpty, TodoBoardError, TodoBoardLoading } from './TodoBoardStates'
import { TodoList } from './TodoList'

interface TodoBoardContentProps {
  isLoading: boolean
  isError: boolean
  todos: Todo[]
  selectedIds: Set<number>
  allSelected: boolean
  someSelected: boolean
  onRetry: () => void
  onToggleSelect: (id: number) => void
  onToggleSelectAll: () => void
  onComplete: (todo: Todo) => void
  onDelete: (todo: Todo) => void
  onBulkComplete: () => void
  isBulkCompleting: boolean
}

export function TodoBoard() {
  const { selected: selectedCategory, setSelected: setSelectedCategory } = useTodoFilter()
  const { data: todos, isLoading, isError, refetch } = useTodos(selectedCategory)
  const { data: categories = [] } = useCategories()
  const { complete } = useUpdateTodo()
  const { handleDeleteTodo } = useDeleteTodo()
  const { bulkComplete, isBulkCompleting } = useBulkCompleteTodos()

  const incompleteIds = useMemo(
    () => todos.filter((t: Todo) => !t.completed).map((t: Todo) => t.id),
    [todos],
  )

  const {
    selectedIds,
    allSelected,
    someSelected,
    toggle,
    toggleAll,
    clear,
    removeIds,
  } = useTodoSelection(incompleteIds)

  const handleComplete = useCallback(
    (todo: Parameters<typeof complete>[0]) => {
      complete(todo)
      removeIds([todo.id])
    },
    [complete, removeIds],
  )

  const handleDelete = useCallback(
    (todo: Parameters<typeof handleDeleteTodo>[0]) => {
      handleDeleteTodo(todo)
      removeIds([todo.id])
    },
    [handleDeleteTodo, removeIds],
  )

  const handleBulkComplete = useCallback(async () => {
    const ids = Array.from(selectedIds)
    if (!ids.length) return
    await bulkComplete(ids)
    clear()
  }, [selectedIds, bulkComplete, clear])

  const handleRetry = useCallback(() => {
    refetch()
  }, [refetch])

  const handleToggleSelect = useCallback(
    (id: number) => toggle(id),
    [toggle],
  )

  const handleToggleSelectAll = useCallback(() => {
    toggleAll()
  }, [toggleAll])

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Todo App</h1>

      <div className="mb-5 rounded-xl border bg-card p-5 shadow-sm">
        <p className="mb-3 text-sm font-semibold">New task</p>
        <CreateTodoForm categories={categories} />
      </div>

      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold">Tasks</p>
        <TodoFilter
          categories={categories}
          selected={selectedCategory}
          onChange={setSelectedCategory}
        />
      </div>

      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <TodoBoardContent
          isLoading={isLoading}
          isError={isError}
          todos={todos}
          selectedIds={selectedIds}
          allSelected={allSelected}
          someSelected={someSelected}
          onRetry={handleRetry}
          onToggleSelect={handleToggleSelect}
          onToggleSelectAll={handleToggleSelectAll}
          onComplete={handleComplete}
          onDelete={handleDelete}
          onBulkComplete={handleBulkComplete}
          isBulkCompleting={isBulkCompleting}
        />
      </div>
    </div>
  )
}

const TodoBoardContent = memo(function TodoBoardContent({
  isLoading,
  isError,
  todos,
  selectedIds,
  allSelected,
  someSelected,
  onRetry,
  onToggleSelect,
  onToggleSelectAll,
  onComplete,
  onDelete,
  onBulkComplete,
  isBulkCompleting,
}: TodoBoardContentProps) {
  if (isLoading) {
    return <TodoBoardLoading />
  }

  if (isError) {
    return <TodoBoardError onRetry={onRetry} />
  }

  if (todos.length === 0) {
    return <TodoBoardEmpty />
  }

  return (
    <TodoList
      todos={todos}
      selectedIds={selectedIds}
      allSelected={allSelected}
      someSelected={someSelected}
      onToggleSelect={onToggleSelect}
      onToggleSelectAll={onToggleSelectAll}
      onComplete={onComplete}
      onDelete={onDelete}
      onBulkComplete={onBulkComplete}
      isBulkCompleting={isBulkCompleting}
    />
  )
})

TodoBoardContent.displayName = 'TodoBoardContent'