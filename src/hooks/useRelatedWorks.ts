import { useQueries, useQuery } from '@tanstack/react-query'
import { searchArtworks, getArtwork } from '../api/met'
import type { ArtworkDetail } from '../types/artwork'

const RELATED_LIMIT = 8
const DATE_RANGE = 50

export function useRelatedWorks(artwork: ArtworkDetail | null | undefined) {
  const searchQuery = useQuery({
    queryKey: ['related-search', artwork?.id],
    queryFn: () =>
      searchArtworks({
        q: '*',
        departmentId: artwork!.departmentId,
        dateBegin: artwork!.objectBeginDate - DATE_RANGE,
        dateEnd: artwork!.objectEndDate + DATE_RANGE,
      }),
    enabled: artwork != null,
    staleTime: 10 * 60 * 1000,
  })

  const relatedIDs = (searchQuery.data?.objectIDs ?? [])
    .filter((id) => id !== artwork?.id)
    .slice(0, RELATED_LIMIT)

  const artworkQueries = useQueries({
    queries: relatedIDs.map((id) => ({
      queryKey: ['artwork', id],
      queryFn: () => getArtwork(id),
      staleTime: 30 * 60 * 1000,
    })),
  })

  const relatedWorks = artworkQueries
    .map((q) => q.data)
    .filter((a): a is ArtworkDetail => a !== undefined)

  return {
    relatedWorks,
    isLoading: searchQuery.isLoading || artworkQueries.some((q) => q.isLoading),
  }
}
