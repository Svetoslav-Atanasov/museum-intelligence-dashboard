import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import BrokenImageOutlined from '@mui/icons-material/BrokenImageOutlined'
import OpenInNewOutlined from '@mui/icons-material/OpenInNewOutlined'
import type { ArtworkDetail } from '../../types/artwork'

interface ArtworkHeroProps {
  artwork: ArtworkDetail
}

export default function ArtworkHero({ artwork }: ArtworkHeroProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 4,
        mb: 4,
      }}
    >
      {/* Image */}
      <Box
        sx={{
          flexShrink: 0,
          width: { xs: '100%', md: 480 },
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
        }}
      >
        {artwork.highResUrl ? (
          <Box
            component="img"
            src={artwork.highResUrl}
            alt={artwork.title}
            sx={{
              width: '100%',
              maxHeight: 600,
              objectFit: 'contain',
              borderRadius: 1,
              boxShadow: 3,
            }}
          />
        ) : (
          <Box
            sx={{
              width: '100%',
              height: 400,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'grey.100',
              borderRadius: 1,
            }}
          >
            <BrokenImageOutlined sx={{ fontSize: 80, color: 'grey.400' }} />
          </Box>
        )}
      </Box>

      {/* Info */}
      <Box sx={{ flex: 1 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {artwork.title}
        </Typography>

        <Typography variant="h6" color="text.secondary" gutterBottom>
          {artwork.artistName}
        </Typography>

        <Typography variant="body1" color="text.disabled" gutterBottom>
          {artwork.objectDate}
        </Typography>

        <Chip
          label={`Accession: ${artwork.accessionNumber}`}
          variant="outlined"
          size="small"
          sx={{ mt: 1, mb: 2 }}
        />

        {artwork.metObjectUrl && (
          <Box>
            <Chip
              component="a"
              href={artwork.metObjectUrl}
              target="_blank"
              rel="noopener noreferrer"
              label="View on Met Museum"
              icon={<OpenInNewOutlined />}
              clickable
              size="small"
              color="primary"
              variant="outlined"
            />
          </Box>
        )}
      </Box>
    </Box>
  )
}
