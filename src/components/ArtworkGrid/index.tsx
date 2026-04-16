import Grid from '@mui/material/Grid'
import Skeleton from '@mui/material/Skeleton'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import ArtworkCard from '../ArtworkCard'
import type { ArtworkCardProps } from '../ArtworkCard'

interface ArtworkGridProps {
  artworks: ArtworkCardProps[]
  loading?: boolean
  onCardClick?: (id: number) => void
}

function ArtworkCardSkeleton() {
  return (
    <Card sx={{ height: 300 }}>
      <Skeleton variant="rectangular" height={180} />
      <CardContent>
        <Skeleton variant="text" width="80%" />
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="40%" />
      </CardContent>
    </Card>
  )
}

export default function ArtworkGrid({ artworks, loading = false, onCardClick }: ArtworkGridProps) {
  if (!loading && artworks.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary">
          No artworks found
        </Typography>
        <Typography variant="body2" color="text.disabled">
          Try adjusting your filters
        </Typography>
      </Box>
    )
  }

  return (
    <Grid container spacing={2}>
      {loading
        ? Array.from({ length: 20 }).map((_, i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <ArtworkCardSkeleton />
            </Grid>
          ))
        : artworks.map((artwork) => (
            <Grid key={artwork.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <ArtworkCard {...artwork} onClick={onCardClick} />
            </Grid>
          ))}
    </Grid>
  )
}