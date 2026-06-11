import type { QueryClient, QueryKey } from '@tanstack/react-query'
import { todoKeys } from '../hooks/useTodos'
import type { TodoDto } from '../model/types'

export type TodoCacheSnapshot = [QueryKey, TodoDto[] | undefined][]

export function snapshotTodos(qc: QueryClient): TodoCacheSnapshot {
  return qc.getQueriesData<TodoDto[]>({ queryKey: todoKeys.all })
}

export function restoreTodos(qc: QueryClient, snapshot: TodoCacheSnapshot) {
  snapshot.forEach(([key, data]) => {
    qc.setQueryData(key, data)
  })
}

export function patchTodoInCache(qc: QueryClient, id: number, patch: Partial<TodoDto>) {
  qc.setQueriesData<TodoDto[]>({ queryKey: todoKeys.all }, (old) =>
    old?.map((todo) => (todo.id === id ? { ...todo, ...patch } : todo)),
  )
}

export function removeTodoFromCache(qc: QueryClient, id: number) {
  qc.setQueriesData<TodoDto[]>({ queryKey: todoKeys.all }, (old) =>
    old?.filter((todo) => todo.id !== id),
  )
}

export function addTodoToCache(qc: QueryClient, dto: TodoDto) {
  qc.setQueriesData<TodoDto[]>({ queryKey: todoKeys.all }, (old) => {
    if (!old) return [dto]
    if (old.some((todo) => todo.id === dto.id)) return old
    return [...old, dto]
  })
}

export function patchTodosInCache(qc: QueryClient, ids: number[], patch: Partial<TodoDto>) {
  const idSet = new Set(ids)
  qc.setQueriesData<TodoDto[]>({ queryKey: todoKeys.all }, (old) =>
    old?.map((todo) => (idSet.has(todo.id) ? { ...todo, ...patch } : todo)),
  )
}
