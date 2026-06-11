import { apiClient } from "@/shared/api"

export const getCategories = async () => {
  const response = await apiClient.get('/categories')
  return response.data
}