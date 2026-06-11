import { useQuery } from '@tanstack/react-query'
import { todoApi } from '../api/todoApi'
import { adaptTodoDto, sortByCreatedAt } from '../services/todoService'

export const todoKeys = {
  all: ['todos'] as const,
  list: (categoryId?: number) => [...todoKeys.all, { categoryId }] as const,
}

export function useTodos(categoryId?: number) {
  const query = useQuery({
    queryKey: todoKeys.list(categoryId),
    queryFn: () => todoApi.getAll(categoryId),
    select: (data) => sortByCreatedAt(data.map(adaptTodoDto)),
  })

  return { ...query, data: query.data ?? [] }
}
