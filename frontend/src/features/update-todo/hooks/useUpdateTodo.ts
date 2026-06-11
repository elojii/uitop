import { useCallback } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { todoApi } from '@/entities/todo/api/todoApi'
import { adaptTodoDto } from '@/entities/todo/services/todoService'
import { todoKeys } from '@/entities/todo/hooks/useTodos'
import {
  patchTodoInCache,
  restoreTodos,
  snapshotTodos,
} from '@/entities/todo/lib/todoCache'
import { toastUndo } from '@/shared/lib/toastUndo'
import type { Todo } from '@/entities/todo'

export function useUpdateTodo() {
  const queryClient = useQueryClient()

  const setCompleted = useMutation({
    mutationFn: ({ id, completed }: { id: number; completed: boolean }) =>
      todoApi.update(id, completed).then(adaptTodoDto),
    onMutate: async ({ id, completed }) => {
      await queryClient.cancelQueries({ queryKey: todoKeys.all })
      const snapshot = snapshotTodos(queryClient)
      patchTodoInCache(queryClient, id, { completed })
      return { snapshot }
    },
    onError: (_error, _variables, context) => {
      if (context) restoreTodos(queryClient, context.snapshot)
      toast.error("Couldn't update task")
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: todoKeys.all })
    },
  })

  const complete = useCallback(
    (todo: Todo) => {
      setCompleted.mutate({ id: todo.id, completed: true })
      toastUndo('Task completed', () =>
        setCompleted.mutate({ id: todo.id, completed: false }),
      )
    },
    [setCompleted],
  )

  return { complete }
}
