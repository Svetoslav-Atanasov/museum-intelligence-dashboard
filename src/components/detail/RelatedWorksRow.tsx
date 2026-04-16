import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
import ArtworkCard from '../ArtworkCard'
import type { ArtworkDetail } from '../../types/artwork'

interface RelatedWorksRowProps {
  works: ArtworkDetail[]
  isLoading: boolean
}

export default function RelatedWorksRow({ works, isLoading }: RelatedWorksRowProps) {
  const navigate = useNavigate()

  if (!isLoading && works.length === 0) return null

  return (
    <Box sx={{ mt: 4 }}>
      <Divider sx={{ mb: 3 }} />
      <Typography variant="h6" gutterBottom>
        Related Works
      </Typography>

      <Box
        sx={{
          display: 'flex',
          gap: 2,
          overflowX: 'auto',
          pb: 1,
          // hide scrollbar but keep functionality
          '&::-webkit-scrollbar': { height: 6 },
          '&::-webkit-scrollbar-track': { bgcolor: 'grey.100' },
          '&::-webkit-scrollbar-thumb': { bgcolor: 'grey.400', borderRadius: 3 },
        }}
      >
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Box key={i} sx={{ minWidth: 220, flexShrink: 0 }}>
                <Skeleton variant="rectangular" height={180} sx={{ borderRadius: 1 }} />
                <Skeleton variant="text" sx={{ mt: 1 }} />
                <Skeleton variant="text" width="60%" />
              </Box>
            ))
          : works.map((work) => (
              <Box key={work.id} sx={{ minWidth: 220, flexShrink: 0 }}>
                <ArtworkCard
                  id={work.id}
                  title={work.title}
                  artistName={work.artistName}
                  objectDate={work.objectDate}
                  thumbnailUrl={work.thumbnailUrl}
                  onClick={(id) => navigate(`/artwork/${id}`)}
                />
              </Box>
            ))}
      </Box>
    </Box>
  )
}
