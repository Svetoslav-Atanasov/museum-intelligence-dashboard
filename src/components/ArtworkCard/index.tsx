import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import ImageNotSupportedOutlined from '@mui/icons-material/ImageNotSupportedOutlined'

export interface ArtworkCardProps {
  id: number
  title: string
  artistName: string
  objectDate: string
  thumbnailUrl: string | null
  onClick?: (id: number) => void
}

export default function ArtworkCard({
  id,
  title,
  artistName,
  objectDate,
  thumbnailUrl,
  onClick,
}: ArtworkCardProps) {
  return (
    <Card sx={{ height: 300, display: 'flex', flexDirection: 'column' }}>
      <CardActionArea sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }} onClick={() => onClick?.(id)}>
        {thumbnailUrl ? (
          <CardMedia
            component="img"
            image={thumbnailUrl}
            alt={title}
            sx={{ height: 180, objectFit: 'cover' }}
          />
        ) : (
          <Box
            sx={{
              height: 180,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'grey.100',
            }}
          >
            <ImageNotSupportedOutlined sx={{ fontSize: 48, color: 'grey.400' }} />
          </Box>
        )}

        <CardContent sx={{ flexGrow: 1 }}>
          <Typography
            variant="subtitle2"
            noWrap
            title={title}
            sx={({fontWeight: 600})}
          >
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {artistName}
          </Typography>
          <Typography variant="caption" color="text.disabled">
            {objectDate}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}