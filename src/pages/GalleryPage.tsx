import { useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import ArtworkGrid from "../components/ArtworkGrid";
import LoadMoreTrigger from "../components/LoadMoreTrigger";
import { useGalleryParams } from "../hooks/useGalleryParams";
import { useArtworkSearch } from "../hooks/useArtworkSearch";

export default function GalleryPage() {
  const navigate = useNavigate();
  const { filters } = useGalleryParams();

  const {
    artworks,
    total,
    isLoadingSearch,
    isLoadingArtworks,
    error,
    hasMore,
    loadMore,
  } = useArtworkSearch(filters);

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Alert severity="error">
          Failed to load artworks. Please try again later.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {!isLoadingSearch && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {total.toLocaleString()} results
          </Typography>
        </Box>
      )}

      <ArtworkGrid
        artworks={artworks.map((a) => ({
          id: a.id,
          title: a.title,
          artistName: a.artistName,
          objectDate: a.objectDate,
          thumbnailUrl: a.thumbnailUrl,
        }))}
        loading={
          isLoadingSearch || (artworks.length === 0 && isLoadingArtworks)
        }
        onCardClick={(id) => navigate(`/artwork/${id}`)}
      />

      <LoadMoreTrigger
        onIntersect={loadMore}
        hasMore={hasMore}
        loading={isLoadingArtworks}
      />
    </Container>
  );
}
