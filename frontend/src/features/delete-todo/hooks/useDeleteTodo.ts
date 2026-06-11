import { useCallback } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { todoApi } from '@/entities/todo/api/todoApi'
import { todoKeys } from '@/entities/todo/hooks/useTodos'
import {
  removeTodoFromCache,
  restoreTodos,
  snapshotTodos,
} from '@/entities/todo/lib/todoCache'
import { toastUndo } from '@/shared/lib/toastUndo'
import { useRestoreTodo } from './useRestoreTodo'
import type { Todo } from '@/entities/todo'

export function useDeleteTodo() {
  const queryClient = useQueryClient()
  const { handleRestoreTodo } = useRestoreTodo()

  const deleteTodoMutation = useMutation({
    mutationFn: (id: number) => todoApi.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: todoKeys.all })
      const snapshot = snapshotTodos(queryClient)
      removeTodoFromCache(queryClient, id)
      return { snapshot }
    },
    onError: (_error, _variables, context) => {
      if (context) restoreTodos(queryClient, context.snapshot)
      toast.error("Couldn't delete task")
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: todoKeys.all })
    },
  })

  const handleDeleteTodo = useCallback(
    (todo: Todo) => {
      deleteTodoMutation.mutate(todo.id)
      toastUndo('Task deleted', () => handleRestoreTodo.mutate(todo))
    },
    [deleteTodoMutation, handleRestoreTodo],
  )

  return { handleDeleteTodo }
}
