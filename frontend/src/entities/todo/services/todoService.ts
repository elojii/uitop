import type { Todo, TodoDto } from '../model/types'

export function adaptTodoDto(dto: TodoDto): Todo {
  return { ...dto, createdAt: new Date(dto.createdAt) }
}

export function toTodoDto(todo: Todo): TodoDto {
  return { ...todo, createdAt: todo.createdAt.toISOString() }
}

export function sortByCreatedAt(todos: Todo[]): Todo[] {
  return [...todos].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}
