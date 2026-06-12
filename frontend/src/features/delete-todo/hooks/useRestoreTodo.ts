import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  todoApi,
  adaptTodoDto,
  toTodoDto,
  todoKeys,
  addTodoToCache,
  restoreTodos,
  snapshotTodos,
  type Todo,
} from '@/entities/todo'
import { getApiErrorMessage } from '@/shared/lib'

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
      toast.error(getApiErrorMessage(err, "Couldn't restore task"))
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: todoKeys.all })
    },
  })

  return { handleRestoreTodo }
}
