// ─── Raw API shapes ──────────────────────────────────────────────────────────

export interface RawMetObject {
  objectID: number
  title: string
  artistDisplayName: string
  artistDisplayBio: string
  objectDate: string
  objectBeginDate: number
  objectEndDate: number
  department: string
  departmentId: number
  primaryImage: string
  primaryImageSmall: string
  additionalImages: string[]
  medium: string
  dimensions: string
  creditLine: string
  accessionNumber: string
  tags: Array<{ term: string; AAT_URL: string; Wikidata_URL: string }> | null
  isPublicDomain: boolean
  objectURL: string
}

export interface RawSearchResult {
  total: number
  objectIDs: number[] | null
}

export interface RawDepartmentsResult {
  departments: Array<{ departmentId: number; displayName: string }>
}

// ─── Internal normalized model ───────────────────────────────────────────────

export interface ArtworkSummary {
  id: number
  title: string
  artistName: string
  objectDate: string
  department: string
  thumbnailUrl: string | null
  isPublicDomain: boolean
}

export interface ArtworkDetail extends ArtworkSummary {
  highResUrl: string | null
  additionalImageUrls: string[]
  accessionNumber: string
  medium: string | null
  dimensions: string | null
  creditLine: string | null
  tags: string[]
  objectBeginDate: number
  objectEndDate: number
  departmentId: number | null
  metObjectUrl: string
}

export interface Department {
  id: number
  name: string
}

// ─── Filter state ─────────────────────────────────────────────────────────────

export interface GalleryFilters {
  q: string
  departmentId: number | null
  dateBegin: number | null
  dateEnd: number | null
}
