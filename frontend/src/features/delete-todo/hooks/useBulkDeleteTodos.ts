import { useCallback } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  todoApi,
  todoKeys,
  removeTodosFromCache,
  addTodosToCache,
  restoreTodos,
  snapshotTodos,
  toTodoDto,
  type Todo,
} from '@/entities/todo'
import { toastUndo } from '@/shared/lib'

export function useBulkDeleteTodos() {
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: (ids: number[]) => todoApi.bulkDelete(ids),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: todoKeys.all })
    },
  })

  const restoreMutation = useMutation({
    mutationFn: (todos: Todo[]) => todoApi.bulkRestore(todos.map((t) => t.id)),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: todoKeys.all })
    },
  })

  const bulkDelete = useCallback(
    (todos: Todo[]) => {
      if (!todos.length) return
      const ids = todos.map((t) => t.id)

      // Remove from the cache synchronously (not inside the mutation's async
      // onMutate) so this update batches with the caller's selection clear in
      // the same render — otherwise the rows briefly flash as unselected before
      // they disappear.
      queryClient.cancelQueries({ queryKey: todoKeys.all })
      const snapshot = snapshotTodos(queryClient)
      removeTodosFromCache(queryClient, ids)

      deleteMutation.mutate(ids, {
        onError: () => {
          restoreTodos(queryClient, snapshot)
          toast.error("Couldn't delete tasks")
        },
      })

      toastUndo(`${todos.length} task${todos.length > 1 ? 's' : ''} deleted`, () => {
        const restoreSnapshot = snapshotTodos(queryClient)
        addTodosToCache(queryClient, todos.map(toTodoDto))
        restoreMutation.mutate(todos, {
          onError: () => {
            restoreTodos(queryClient, restoreSnapshot)
            toast.error("Couldn't restore tasks")
          },
        })
      })
    },
    [queryClient, deleteMutation, restoreMutation],
  )

  return { bulkDelete, isBulkDeleting: deleteMutation.isPending }
}
