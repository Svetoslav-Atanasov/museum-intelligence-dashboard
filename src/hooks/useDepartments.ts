import { useQuery } from '@tanstack/react-query'
import { getDepartments } from '../api/met'

export function useDepartments() {
  return useQuery({
    queryKey: ['departments'],
    queryFn: getDepartments,
    staleTime: Infinity, // departments never change
  })
}
