import { useCallback } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  todoApi,
  adaptTodoDto,
  todoKeys,
  patchTodoInCache,
  restoreTodos,
  snapshotTodos,
  type Todo,
} from '@/entities/todo'
import { toastUndo } from '@/shared/lib'

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

  const handleCompleteTodo = useCallback(
    (todo: Todo) => {
      setCompleted.mutate({ id: todo.id, completed: true })
      toastUndo('Task completed', () =>
        setCompleted.mutate({ id: todo.id, completed: false }),
      )
    },
    [setCompleted],
  )

  return { handleCompleteTodo }
}
