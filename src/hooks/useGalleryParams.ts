import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { GalleryFilters } from '../types/artwork'

function parseIntOrNull(value: string | null): number | null {
  if (value === null || value === '') return null
  const n = parseInt(value, 10)
  return isNaN(n) ? null : n
}

function toParams(filters: GalleryFilters): URLSearchParams {
  const params = new URLSearchParams()
  if (filters.q) params.set('q', filters.q)
  if (filters.departmentId !== null) params.set('dept', String(filters.departmentId))
  if (filters.dateBegin !== null) params.set('from', String(filters.dateBegin))
  if (filters.dateEnd !== null) params.set('to', String(filters.dateEnd))
  return params
}

export function useGalleryParams() {
  const [searchParams, setSearchParams] = useSearchParams()

  const filters: GalleryFilters = {
    q: searchParams.get('q') ?? '',
    departmentId: parseIntOrNull(searchParams.get('dept')),
    dateBegin: parseIntOrNull(searchParams.get('from')),
    dateEnd: parseIntOrNull(searchParams.get('to')),
  }

  const setFilters = useCallback(
    (patch: Partial<GalleryFilters>) => {
      const next: GalleryFilters = { ...filters, ...patch }
      setSearchParams(toParams(next), { replace: false })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchParams, setSearchParams],
  )

  const resetFilters = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: false })
  }, [setSearchParams])

  return { filters, setFilters, resetFilters }
}
