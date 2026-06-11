import type { Category } from '@/entities/category'

/** Raw shape returned by the backend API */
export interface TodoDto {
  id: number
  text: string
  completed: boolean
  category: Category
  createdAt: string
}

/** Domain model used throughout the frontend */
export interface Todo {
  id: number
  text: string
  completed: boolean
  category: Category
  createdAt: Date
}
