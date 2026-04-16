import { apiGet } from './client'
import { transformArtworkDetail } from './transforms'
import type {
  RawMetObject,
  RawSearchResult,
  RawDepartmentsResult,
  ArtworkDetail,
  Department,
  GalleryFilters,
} from '../types/artwork'

export async function searchArtworks(filters: GalleryFilters): Promise<{ total: number; objectIDs: number[] }> {
  const params: Record<string, string | number | boolean | null | undefined> = {
    q: filters.q || '*',
    hasImages: true,
  }

  // When date filters are active, drop hasImages — it's too restrictive combined with date ranges
  // and is not part of the documented date-filtering pattern
  if (filters.dateBegin !== null || filters.dateEnd !== null) {
    delete params.hasImages
  }

  if (filters.departmentId !== null) params.departmentId = filters.departmentId

  // API requires both dateBegin and dateEnd together — fill in the missing side if only one is set
  const hasBegin = filters.dateBegin !== null
  const hasEnd = filters.dateEnd !== null
  if (hasBegin || hasEnd) {
    params.dateBegin = hasBegin ? filters.dateBegin : -5000
    params.dateEnd = hasEnd ? filters.dateEnd : new Date().getFullYear()
  }

  const result = await apiGet<RawSearchResult>('/search', params)

  return {
    total: result.total,
    objectIDs: result.objectIDs ?? [],
  }
}

export async function getArtwork(id: number): Promise<ArtworkDetail> {
  const raw = await apiGet<RawMetObject>(`/objects/${id}`)
  return transformArtworkDetail(raw)
}

export async function getDepartments(): Promise<Department[]> {
  const result = await apiGet<RawDepartmentsResult>('/departments')
  return result.departments.map((d) => ({ id: d.departmentId, name: d.displayName }))
}
