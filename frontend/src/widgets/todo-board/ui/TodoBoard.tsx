import { memo, useCallback, useMemo } from 'react'
import { useTodos, type Todo } from '@/entities/todo'
import { useCategories } from '@/entities/category'
import { CreateTodoForm } from '@/features/create-todo'
import { TodoFilter, useTodoFilter } from '@/features/filter-todos'
import { useBulkCompleteTodos, useTodoSelection } from '@/features/bulk-complete'
import { useUpdateTodo } from '@/features/update-todo'
import { useDeleteTodo, useBulkDeleteTodos } from '@/features/delete-todo'
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
  onBulkDelete: () => void
  isBulkCompleting: boolean
  isBulkDeleting: boolean
}

export function TodoBoard() {
  const { selected: selectedCategory, setSelected: setSelectedCategory } = useTodoFilter()
  const { data: todos, isLoading, isError, refetch } = useTodos(selectedCategory)
  const { data: categories = [] } = useCategories()
  const { handleCompleteTodo } = useUpdateTodo()
  const { handleDeleteTodo } = useDeleteTodo()
  const { bulkComplete, isBulkCompleting } = useBulkCompleteTodos()
  const { bulkDelete, isBulkDeleting } = useBulkDeleteTodos()

  const allIds = useMemo(() => todos.map((t: Todo) => t.id), [todos])

  const {
    selectedIds,
    allSelected,
    someSelected,
    toggle,
    toggleAll,
    clear,
    removeIds,
  } = useTodoSelection(allIds)

  const handleComplete = useCallback(
    (todo: Parameters<typeof handleCompleteTodo>[0]) => {
      handleCompleteTodo(todo)
    },
    [handleCompleteTodo],
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
  }, [selectedIds, bulkComplete])

  const handleBulkDelete = useCallback(() => {
    const selectedTodos = todos.filter((t: Todo) => selectedIds.has(t.id))
    if (!selectedTodos.length) return
    bulkDelete(selectedTodos)
    clear()
  }, [todos, selectedIds, bulkDelete, clear])

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
          onBulkDelete={handleBulkDelete}
          isBulkCompleting={isBulkCompleting}
          isBulkDeleting={isBulkDeleting}
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
  onBulkDelete,
  isBulkCompleting,
  isBulkDeleting,
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
      onBulkDelete={onBulkDelete}
      isBulkCompleting={isBulkCompleting}
      isBulkDeleting={isBulkDeleting}
    />
  )
})

TodoBoardContent.displayName = 'TodoBoardContent'