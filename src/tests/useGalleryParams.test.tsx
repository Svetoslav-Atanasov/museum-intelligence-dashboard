import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useGalleryParams } from '../hooks/useGalleryParams'

function wrapper(initialUrl = '/') {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <MemoryRouter initialEntries={[initialUrl]}>
        {children}
      </MemoryRouter>
    )
  }
}

describe('useGalleryParams', () => {
  it('returns default filter state when URL has no params', () => {
    const { result } = renderHook(() => useGalleryParams(), { wrapper: wrapper('/') })

    expect(result.current.filters).toEqual({
      q: '',
      departmentId: null,
      dateBegin: null,
      dateEnd: null,
    })
  })

  it('reads keyword from URL param q', () => {
    const { result } = renderHook(() => useGalleryParams(), {
      wrapper: wrapper('/?q=monet'),
    })
    expect(result.current.filters.q).toBe('monet')
  })

  it('reads departmentId from URL param dept', () => {
    const { result } = renderHook(() => useGalleryParams(), {
      wrapper: wrapper('/?dept=11'),
    })
    expect(result.current.filters.departmentId).toBe(11)
  })

  it('reads negative BCE dateBegin from URL param from', () => {
    const { result } = renderHook(() => useGalleryParams(), {
      wrapper: wrapper('/?from=-500'),
    })
    expect(result.current.filters.dateBegin).toBe(-500)
  })

  it('reads dateEnd from URL param to', () => {
    const { result } = renderHook(() => useGalleryParams(), {
      wrapper: wrapper('/?to=1800'),
    })
    expect(result.current.filters.dateEnd).toBe(1800)
  })

  it('sets q param in URL when setFilters is called with keyword', () => {
    const { result } = renderHook(() => useGalleryParams(), { wrapper: wrapper('/') })

    act(() => {
      result.current.setFilters({ q: 'sunflowers' })
    })

    expect(result.current.filters.q).toBe('sunflowers')
  })

  it('sets dept param in URL when setFilters is called with departmentId', () => {
    const { result } = renderHook(() => useGalleryParams(), { wrapper: wrapper('/') })

    act(() => {
      result.current.setFilters({ departmentId: 5 })
    })

    expect(result.current.filters.departmentId).toBe(5)
  })

  it('encodes negative BCE date correctly in URL', () => {
    const { result } = renderHook(() => useGalleryParams(), { wrapper: wrapper('/') })

    act(() => {
      result.current.setFilters({ dateBegin: -500 })
    })

    expect(result.current.filters.dateBegin).toBe(-500)
  })

  it('preserves existing params when patching a single filter', () => {
    const { result } = renderHook(() => useGalleryParams(), {
      wrapper: wrapper('/?dept=11'),
    })

    act(() => {
      result.current.setFilters({ q: 'monet' })
    })

    expect(result.current.filters.departmentId).toBe(11)
    expect(result.current.filters.q).toBe('monet')
  })

  it('clears all params when resetFilters is called', () => {
    const { result } = renderHook(() => useGalleryParams(), {
      wrapper: wrapper('/?q=monet&dept=11&from=1700&to=1800'),
    })

    act(() => {
      result.current.resetFilters()
    })

    expect(result.current.filters).toEqual({
      q: '',
      departmentId: null,
      dateBegin: null,
      dateEnd: null,
    })
  })

  it('omits q param from URL when keyword is empty string', () => {
    const { result } = renderHook(() => useGalleryParams(), {
      wrapper: wrapper('/?q=monet'),
    })

    act(() => {
      result.current.setFilters({ q: '' })
    })

    expect(result.current.filters.q).toBe('')
  })
})
