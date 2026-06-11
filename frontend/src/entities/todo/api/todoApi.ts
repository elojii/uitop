import { apiClient } from '@/shared/api'
import type { TodoDto } from '../model/types'

export const todoApi = {
  getAll: (categoryId?: number): Promise<TodoDto[]> =>
    apiClient
      .get<TodoDto[]>('/todos', { params: categoryId ? { category: categoryId } : {} })
      .then((r) => r.data),

  create: (text: string, categoryId: number): Promise<TodoDto> =>
    apiClient.post<TodoDto>('/todos', { text, categoryId }).then((r) => r.data),

  update: (id: number, completed: boolean): Promise<TodoDto> =>
    apiClient.patch<TodoDto>(`/todos/${id}`, { completed }).then((r) => r.data),

  bulkComplete: (ids: number[]): Promise<TodoDto[]> =>
    apiClient.patch<TodoDto[]>('/todos/bulk-complete', { ids }).then((r) => r.data),

  delete: (id: number): Promise<void> =>
    apiClient.delete(`/todos/${id}`).then(() => undefined),

  restore: (id: number): Promise<TodoDto> =>
    apiClient.patch<TodoDto>(`/todos/${id}/restore`).then((r) => r.data),
}
