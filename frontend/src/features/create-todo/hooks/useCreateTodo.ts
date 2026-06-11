import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { todoApi } from '@/entities/todo/api/todoApi'
import { adaptTodoDto } from '@/entities/todo/services/todoService'
import { todoKeys } from '@/entities/todo/hooks/useTodos'

function getErrorMessage(err: unknown): string | null {
  if (
    err &&
    typeof err === 'object' &&
    'response' in err &&
    (err as { response?: { status?: number } }).response?.status === 400
  ) {
    const resp = (err as { response?: { data?: { message?: string } } }).response
    return resp?.data?.message ?? 'This category already has 5 tasks'
  }
  return 'Failed to create task'
}

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
      return getErrorMessage(err)
    }
  }

  return { create, isCreating: mutation.isPending }
}
