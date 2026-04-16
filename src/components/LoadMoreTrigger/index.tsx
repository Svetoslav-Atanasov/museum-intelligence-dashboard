import { useEffect, useRef } from 'react'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'

interface LoadMoreTriggerProps {
  onIntersect: () => void
  hasMore: boolean
  loading: boolean
}

export default function LoadMoreTrigger({ onIntersect, hasMore, loading }: LoadMoreTriggerProps) {
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = sentinelRef.current
    // Don't observe while a batch is loading — prevents cascading requests when
    // the sentinel is visible before content has rendered
    if (!el || !hasMore || loading) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) onIntersect()
      },
      { threshold: 0.1 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [hasMore, loading, onIntersect])

  if (!hasMore) return null

  return (
    <Box ref={sentinelRef} sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
      {loading && <CircularProgress />}
    </Box>
  )
}
