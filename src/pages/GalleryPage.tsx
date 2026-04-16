import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import ArtworkGrid from "../components/ArtworkGrid";
import LoadMoreTrigger from "../components/LoadMoreTrigger";
import { useGalleryParams } from "../hooks/useGalleryParams";
import { useArtworkSearch } from "../hooks/useArtworkSearch";
import { useDepartments } from "../hooks/useDepartments";

export default function GalleryPage() {
  const navigate = useNavigate();
  const { filters, setFilters } = useGalleryParams();
  const { data: departments } = useDepartments();

  // Only set a default department once on first load — never override a deliberate user selection
  const hasSetDefault = useRef(false);
  useEffect(() => {
    if (
      !hasSetDefault.current &&
      departments &&
      departments.length > 0 &&
      filters.departmentId === null &&
      filters.q === ""
    ) {
      hasSetDefault.current = true;
      const random =
        departments[Math.floor(Math.random() * departments.length)];
      setFilters({ departmentId: random.id });
    }
  }, [departments, filters.departmentId, filters.q, setFilters]);

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
