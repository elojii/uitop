import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { todoApi } from '@/entities/todo/api/todoApi'
import { adaptTodoDto, toTodoDto } from '@/entities/todo/services/todoService'
import { todoKeys } from '@/entities/todo/hooks/useTodos'
import {
  addTodoToCache,
  restoreTodos,
  snapshotTodos,
} from '@/entities/todo/lib/todoCache'
import type { Todo } from '@/entities/todo'

function getRestoreErrorMessage(err: unknown): string {
  if (
    err &&
    typeof err === 'object' &&
    'response' in err &&
    (err as { response?: { status?: number } }).response?.status === 400
  ) {
    const resp = (err as { response?: { data?: { message?: string } } }).response
    return resp?.data?.message ?? "Couldn't restore task"
  }
  return "Couldn't restore task"
}

export function useRestoreTodo() {
  const queryClient = useQueryClient()

  const handleRestoreTodo = useMutation({
    mutationFn: (todo: Todo) => todoApi.restore(todo.id).then(adaptTodoDto),
    onMutate: async (todo) => {
      await queryClient.cancelQueries({ queryKey: todoKeys.all })
      const snapshot = snapshotTodos(queryClient)
      addTodoToCache(queryClient, toTodoDto(todo))
      return { snapshot }
    },
    onError: (err, _variables, context) => {
      if (context) restoreTodos(queryClient, context.snapshot)
      toast.error(getRestoreErrorMessage(err))
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: todoKeys.all })
    },
  })

  return { handleRestoreTodo }
}
