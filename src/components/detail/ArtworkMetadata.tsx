import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import type { ArtworkDetail } from '../../types/artwork'

interface ArtworkMetadataProps {
  artwork: ArtworkDetail
}

interface MetaRow {
  label: string
  value: string | null | undefined
}

export default function ArtworkMetadata({ artwork }: ArtworkMetadataProps) {
  const rows: MetaRow[] = [
    { label: 'Department', value: artwork.department },
    { label: 'Medium', value: artwork.medium },
    { label: 'Dimensions', value: artwork.dimensions },
    { label: 'Credit Line', value: artwork.creditLine },
  ]

  const filledRows = rows.filter((r) => r.value)

  return (
    <Box>
      {filledRows.length > 0 && (
        <>
          <Typography variant="h6" gutterBottom>
            Details
          </Typography>
          <Table size="small" sx={{ mb: 3 }}>
            <TableBody>
              {filledRows.map((row) => (
                <TableRow key={row.label}>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      width: 160,
                      verticalAlign: 'top',
                      borderBottom: 'none',
                      pl: 0,
                      color: 'text.secondary',
                    }}
                  >
                    {row.label}
                  </TableCell>
                  <TableCell sx={{ borderBottom: 'none', pr: 0 }}>
                    {row.value}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}

      {artwork.tags.length > 0 && (
        <>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Tags
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {artwork.tags.map((tag) => (
              <Chip key={tag} label={tag} size="small" />
            ))}
          </Box>
        </>
      )}
    </Box>
  )
}
