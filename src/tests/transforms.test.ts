import { describe, it, expect } from 'vitest'
import { transformArtworkDetail, toArtworkSummary } from '../api/transforms'
import type { RawMetObject } from '../types/artwork'

const BASE_RAW: RawMetObject = {
  objectID: 42,
  title: 'Starry Night',
  artistDisplayName: 'Vincent van Gogh',
  artistDisplayBio: 'Dutch, 1853–1890',
  objectDate: '1889',
  objectBeginDate: 1889,
  objectEndDate: 1889,
  department: 'European Paintings',
  departmentId: 11,
  primaryImage: 'https://example.com/full.jpg',
  primaryImageSmall: 'https://example.com/small.jpg',
  additionalImages: ['https://example.com/extra.jpg'],
  medium: 'Oil on canvas',
  dimensions: '29 x 36 in.',
  creditLine: 'Acquired by exchange, 1941',
  accessionNumber: '53.64',
  tags: [
    { term: 'night', AAT_URL: '', Wikidata_URL: '' },
    { term: 'stars', AAT_URL: '', Wikidata_URL: '' },
  ],
  isPublicDomain: true,
  objectURL: 'https://www.metmuseum.org/art/collection/search/42',
}

describe('transformArtworkDetail', () => {
  it('maps all fields from a fully populated raw object', () => {
    const result = transformArtworkDetail(BASE_RAW)

    expect(result.id).toBe(42)
    expect(result.title).toBe('Starry Night')
    expect(result.artistName).toBe('Vincent van Gogh')
    expect(result.objectDate).toBe('1889')
    expect(result.department).toBe('European Paintings')
    expect(result.departmentId).toBe(11)
    expect(result.thumbnailUrl).toBe('https://example.com/small.jpg')
    expect(result.highResUrl).toBe('https://example.com/full.jpg')
    expect(result.additionalImageUrls).toEqual(['https://example.com/extra.jpg'])
    expect(result.medium).toBe('Oil on canvas')
    expect(result.dimensions).toBe('29 x 36 in.')
    expect(result.creditLine).toBe('Acquired by exchange, 1941')
    expect(result.accessionNumber).toBe('53.64')
    expect(result.tags).toEqual(['night', 'stars'])
    expect(result.objectBeginDate).toBe(1889)
    expect(result.objectEndDate).toBe(1889)
    expect(result.isPublicDomain).toBe(true)
    expect(result.metObjectUrl).toBe('https://www.metmuseum.org/art/collection/search/42')
  })

  it('falls back to "Untitled" when title is empty', () => {
    const result = transformArtworkDetail({ ...BASE_RAW, title: '' })
    expect(result.title).toBe('Untitled')
  })

  it('falls back to "Untitled" when title is whitespace', () => {
    const result = transformArtworkDetail({ ...BASE_RAW, title: '   ' })
    expect(result.title).toBe('Untitled')
  })

  it('falls back to "Unknown Artist" when artistDisplayName is empty', () => {
    const result = transformArtworkDetail({ ...BASE_RAW, artistDisplayName: '' })
    expect(result.artistName).toBe('Unknown Artist')
  })

  it('falls back to "Date unknown" when objectDate is empty', () => {
    const result = transformArtworkDetail({ ...BASE_RAW, objectDate: '' })
    expect(result.objectDate).toBe('Date unknown')
  })

  it('sets thumbnailUrl to null when primaryImageSmall is empty', () => {
    const result = transformArtworkDetail({ ...BASE_RAW, primaryImageSmall: '' })
    expect(result.thumbnailUrl).toBeNull()
  })

  it('sets highResUrl to null when primaryImage is empty', () => {
    const result = transformArtworkDetail({ ...BASE_RAW, primaryImage: '' })
    expect(result.highResUrl).toBeNull()
  })

  it('sets tags to [] when tags is null', () => {
    const result = transformArtworkDetail({ ...BASE_RAW, tags: null })
    expect(result.tags).toEqual([])
  })

  it('extracts term strings from tags array', () => {
    const result = transformArtworkDetail({
      ...BASE_RAW,
      tags: [{ term: 'portrait', AAT_URL: '', Wikidata_URL: '' }],
    })
    expect(result.tags).toEqual(['portrait'])
  })

  it('filters empty strings from additionalImages', () => {
    const result = transformArtworkDetail({
      ...BASE_RAW,
      additionalImages: ['https://example.com/a.jpg', '', 'https://example.com/b.jpg'],
    })
    expect(result.additionalImageUrls).toEqual([
      'https://example.com/a.jpg',
      'https://example.com/b.jpg',
    ])
  })

  it('passes through negative BCE dates unchanged', () => {
    const result = transformArtworkDetail({
      ...BASE_RAW,
      objectBeginDate: -500,
      objectEndDate: -450,
    })
    expect(result.objectBeginDate).toBe(-500)
    expect(result.objectEndDate).toBe(-450)
  })

  it('sets medium to null when blank', () => {
    const result = transformArtworkDetail({ ...BASE_RAW, medium: '' })
    expect(result.medium).toBeNull()
  })

  it('sets dimensions to null when blank', () => {
    const result = transformArtworkDetail({ ...BASE_RAW, dimensions: '' })
    expect(result.dimensions).toBeNull()
  })

  it('sets creditLine to null when blank', () => {
    const result = transformArtworkDetail({ ...BASE_RAW, creditLine: '' })
    expect(result.creditLine).toBeNull()
  })
})

describe('toArtworkSummary', () => {
  it('returns only summary fields, strips detail fields', () => {
    const detail = transformArtworkDetail(BASE_RAW)
    const summary = toArtworkSummary(detail)

    expect(summary.id).toBe(detail.id)
    expect(summary.title).toBe(detail.title)
    expect(summary.artistName).toBe(detail.artistName)
    expect(summary.objectDate).toBe(detail.objectDate)
    expect(summary.department).toBe(detail.department)
    expect(summary.thumbnailUrl).toBe(detail.thumbnailUrl)
    expect(summary.isPublicDomain).toBe(detail.isPublicDomain)

    expect((summary as unknown as Record<string, unknown>).highResUrl).toBeUndefined()
    expect((summary as unknown as Record<string, unknown>).medium).toBeUndefined()
    expect((summary as unknown as Record<string, unknown>).tags).toBeUndefined()
  })
})
