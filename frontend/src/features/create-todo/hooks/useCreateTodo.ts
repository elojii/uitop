import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { todoApi, adaptTodoDto, todoKeys } from '@/entities/todo'
import { getApiErrorMessage } from '@/shared/lib'

export function useCreateTodo() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ text, categoryId }: { text: string; categoryId: number }) =>
      todoApi.create(text, categoryId).then(adaptTodoDto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todoKeys.all })
      toast.success('Task added')
    },
  })

  const create = async (text: string, categoryId: number): Promise<string | null> => {
    try {
      await mutation.mutateAsync({ text, categoryId })
      return null
    } catch (err) {
      return getApiErrorMessage(err, 'Failed to create task')
    }
  }

  return { create, isCreating: mutation.isPending }
}
