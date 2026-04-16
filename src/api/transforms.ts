import type { RawMetObject, ArtworkDetail, ArtworkSummary } from '../types/artwork'

export function transformArtworkDetail(raw: RawMetObject): ArtworkDetail {
  return {
    id: raw.objectID,
    title: raw.title?.trim() || 'Untitled',
    artistName: raw.artistDisplayName?.trim() || 'Unknown Artist',
    objectDate: raw.objectDate?.trim() || 'Date unknown',
    department: raw.department ?? '',
    departmentId: raw.departmentId ?? null,
    thumbnailUrl: raw.primaryImageSmall || null,
    highResUrl: raw.primaryImage || null,
    additionalImageUrls: (raw.additionalImages ?? []).filter(Boolean),
    accessionNumber: raw.accessionNumber ?? '',
    medium: raw.medium?.trim() || null,
    dimensions: raw.dimensions?.trim() || null,
    creditLine: raw.creditLine?.trim() || null,
    tags: raw.tags?.map((t) => t.term).filter(Boolean) ?? [],
    objectBeginDate: raw.objectBeginDate ?? 0,
    objectEndDate: raw.objectEndDate ?? 0,
    isPublicDomain: raw.isPublicDomain ?? false,
    metObjectUrl: raw.objectURL ?? '',
  }
}

export function toArtworkSummary(detail: ArtworkDetail): ArtworkSummary {
  return {
    id: detail.id,
    title: detail.title,
    artistName: detail.artistName,
    objectDate: detail.objectDate,
    department: detail.department,
    thumbnailUrl: detail.thumbnailUrl,
    isPublicDomain: detail.isPublicDomain,
  }
}
