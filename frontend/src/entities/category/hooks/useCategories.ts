import { useQuery } from '@tanstack/react-query'
import { getCategories } from '../services/getCategory'
import { CATEGORIES_QUERY_KEY } from '../constants'

export function useCategories() {
  return useQuery({
    queryKey: [CATEGORIES_QUERY_KEY],
    queryFn: getCategories,
    staleTime: Infinity,
  })
}
