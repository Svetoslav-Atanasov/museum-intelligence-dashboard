import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Header from "./components/layout/Header";
import FilterBar from "./components/FilterBar";
import GalleryPage from "./pages/GalleryPage";
import ArtworkDetailPage from "./pages/ArtworkDetailPage";

function App() {
  const location = useLocation();
  const showFilterBar = location.pathname === "/gallery";

  return (
    <>
      <Header />
      {showFilterBar && <FilterBar />}
      <Routes>
        <Route path="/" element={<Navigate to="/gallery" replace />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/artwork/:id" element={<ArtworkDetailPage />} />
      </Routes>
    </>
  );
}

export default App;
