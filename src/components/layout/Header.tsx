import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"

export default function Header() {
  return (
    <AppBar position="static" elevation={1} sx={{ mb: 2 }}>
      <Toolbar>
        <Typography
          sx={{
            flexGrow: 1,
            textAlign: "center",
            fontSize: {
              xs: "1.5rem",
              sm: "2rem",
              md: "3rem",
            },
          }}
        >
          Museum Intelligence Dashboard
        </Typography>
      </Toolbar>
    </AppBar>
  )
}