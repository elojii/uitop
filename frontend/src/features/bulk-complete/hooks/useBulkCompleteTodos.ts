import { useCallback } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  todoApi,
  adaptTodoDto,
  todoKeys,
  patchTodosInCache,
  restoreTodos,
  snapshotTodos,
} from '@/entities/todo'

export function useBulkCompleteTodos() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (ids: number[]) => todoApi.bulkComplete(ids).then((dtos) => dtos.map(adaptTodoDto)),
    onMutate: async (ids) => {
      await queryClient.cancelQueries({ queryKey: todoKeys.all })
      const snapshot = snapshotTodos(queryClient)
      patchTodosInCache(queryClient, ids, { completed: true })
      return { snapshot }
    },
    onError: (_error, _variables, context) => {
      if (context) restoreTodos(queryClient, context.snapshot)
      toast.error("Couldn't complete tasks")
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: todoKeys.all })
    },
  })

  const bulkComplete = useCallback(
    async (ids: number[]) => {
      if (!ids.length) return
      await mutation.mutateAsync(ids)
    },
    [mutation],
  )

  return { bulkComplete, isBulkCompleting: mutation.isPending }
}
