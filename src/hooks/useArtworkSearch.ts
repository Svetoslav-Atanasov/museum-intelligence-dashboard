import { useState, useMemo } from 'react'
import { useQuery, useQueries } from '@tanstack/react-query'
import { searchArtworks, getArtwork } from '../api/met'
import type { GalleryFilters, ArtworkDetail } from '../types/artwork'

const BATCH_SIZE = 20

export function useArtworkSearch(filters: GalleryFilters) {
  const [loadedCount, setLoadedCount] = useState(BATCH_SIZE)

  // Step 1 — get the full list of matching IDs
  const searchQuery = useQuery({
    queryKey: ['search', filters],
    queryFn: () => searchArtworks(filters),
    staleTime: 5 * 60 * 1000,
  })

  // Stable reference — only changes when the query data itself changes
  const objectIDs = useMemo(
    () => searchQuery.data?.objectIDs ?? [],
    [searchQuery.data],
  )
  const total = searchQuery.data?.total ?? 0

  // Derived state pattern: reset loadedCount during render when new search data arrives.
  // Using dataUpdatedAt (a stable timestamp) avoids the unstable array reference from objectIDs.
  const [prevDataUpdatedAt, setPrevDataUpdatedAt] = useState(0)
  if (searchQuery.dataUpdatedAt !== 0 && searchQuery.dataUpdatedAt !== prevDataUpdatedAt) {
    setPrevDataUpdatedAt(searchQuery.dataUpdatedAt)
    setLoadedCount(BATCH_SIZE)
  }

  const visibleIDs = objectIDs.slice(0, loadedCount)

  // Step 2 — fetch individual objects for the visible slice
  const artworkQueries = useQueries({
    queries: visibleIDs.map((id) => ({
      queryKey: ['artwork', id],
      queryFn: () => getArtwork(id),
      staleTime: 30 * 60 * 1000,
    })),
  })

  const artworks = artworkQueries
    .map((q) => q.data)
    .filter((a): a is ArtworkDetail => a !== undefined)

  const isLoadingSearch = searchQuery.isLoading
  const isLoadingArtworks = artworkQueries.some((q) => q.isLoading)
  const error = searchQuery.error
  const hasMore = loadedCount < objectIDs.length

  function loadMore() {
    if (hasMore) setLoadedCount((c) => c + BATCH_SIZE)
  }

  return {
    artworks,
    total,
    isLoadingSearch,
    isLoadingArtworks,
    error,
    hasMore,
    loadMore,
  }
}
