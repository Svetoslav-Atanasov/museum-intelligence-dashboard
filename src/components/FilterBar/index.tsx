import { useState, useEffect } from 'react'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useGalleryParams } from '../../hooks/useGalleryParams'
import { useDepartments } from '../../hooks/useDepartments'

export default function FilterBar() {
  const { filters, setFilters } = useGalleryParams()
  const { data: departments } = useDepartments()

  // Local keyword state so typing feels instant; syncs to URL after 300ms
  const [keywordInput, setKeywordInput] = useState(filters.q)

  useEffect(() => {
    setKeywordInput(filters.q)
  }, [filters.q])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (keywordInput !== filters.q) setFilters({ q: keywordInput })
    }, 300)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keywordInput])

  return (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', py: 2, px: 2 }}>
      <TextField
        size="small"
        placeholder="Keyword"
        value={keywordInput}
        onChange={(e) => setKeywordInput(e.target.value)}
        sx={{ bgcolor: 'white', borderRadius: 1, minWidth: 180 }}
      />

      <FormControl size="small" sx={{ bgcolor: 'background.paper', borderRadius: 1, minWidth: 200 }}>
        <Select
          value={filters.departmentId !== null ? String(filters.departmentId) : ''}
          displayEmpty
          renderValue={(val) =>
            val
              ? (departments?.find((d) => String(d.id) === val)?.name ?? 'Department')
              : 'All Departments'
          }
          onChange={(e) =>
            setFilters({ departmentId: e.target.value ? Number(e.target.value) : null })
          }
        >
          <MenuItem value="">All Departments</MenuItem>
          {departments?.map((d) => (
            <MenuItem key={d.id} value={String(d.id)}>
              {d.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <TextField
          size="small"
          placeholder="From year"
          type="number"
          value={filters.dateBegin ?? ''}
          onChange={(e) =>
            setFilters({ dateBegin: e.target.value ? Number(e.target.value) : null })
          }
          sx={{ bgcolor: 'white', borderRadius: 1, width: 120 }}
          slotProps={{ htmlInput: { step: 1 } }}
        />
        <Typography color="text.secondary">–</Typography>
        <TextField
          size="small"
          placeholder="To year"
          type="number"
          value={filters.dateEnd ?? ''}
          onChange={(e) =>
            setFilters({ dateEnd: e.target.value ? Number(e.target.value) : null })
          }
          sx={{ bgcolor: 'white', borderRadius: 1, width: 120 }}
          slotProps={{ htmlInput: { step: 1 } }}
        />
      </Box>
    </Box>
  )
}
