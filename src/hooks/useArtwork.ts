import { useQuery } from '@tanstack/react-query'
import { getArtwork } from '../api/met'

export function useArtwork(id: number | null) {
  return useQuery({
    queryKey: ['artwork', id],
    queryFn: () => getArtwork(id!),
    enabled: id !== null,
    staleTime: 30 * 60 * 1000,
  })
}
