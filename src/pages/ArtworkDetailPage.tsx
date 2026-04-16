import { useParams, useNavigate } from 'react-router-dom'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Container from '@mui/material/Container'
import Skeleton from '@mui/material/Skeleton'
import ArrowBackOutlined from '@mui/icons-material/ArrowBackOutlined'
import ArtworkHero from '../components/detail/ArtworkHero'
import ArtworkMetadata from '../components/detail/ArtworkMetadata'
import RelatedWorksRow from '../components/detail/RelatedWorksRow'
import { useArtwork } from '../hooks/useArtwork'
import { useRelatedWorks } from '../hooks/useRelatedWorks'

export default function ArtworkDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const artworkId = id ? parseInt(id, 10) : null

  const { data: artwork, isLoading, error } = useArtwork(artworkId)
  const { relatedWorks, isLoading: isLoadingRelated } = useRelatedWorks(artwork)

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Button
        startIcon={<ArrowBackOutlined />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        Back to Gallery
      </Button>

      {isLoading && (
        <Box>
          <Box sx={{ display: 'flex', gap: 4, mb: 4 }}>
            <Skeleton variant="rectangular" width={480} height={500} sx={{ borderRadius: 1, flexShrink: 0 }} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" height={60} width="80%" />
              <Skeleton variant="text" height={36} width="50%" />
              <Skeleton variant="text" height={24} width="30%" sx={{ mt: 1 }} />
            </Box>
          </Box>
        </Box>
      )}

      {error && (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => navigate('/gallery')}>
              Back to Gallery
            </Button>
          }
        >
          Could not load this artwork. It may have been removed or is temporarily unavailable.
        </Alert>
      )}

      {artwork && (
        <>
          <ArtworkHero artwork={artwork} />
          <ArtworkMetadata artwork={artwork} />
          <RelatedWorksRow works={relatedWorks} isLoading={isLoadingRelated} />
        </>
      )}

      {!isLoading && !error && !artwork && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      )}
    </Container>
  )
}
