// src/App.tsx
import { Routes, Route } from "react-router-dom"; // Only need Routes and Route now
import ProductDetailPage from "./pages/ProductDetailPage"; // Add this line

// Import the Layout component
import MainLayout from "./layouts/MainLayout";

// Import page components
import HomePage from "./pages/HomePage";
import ProductListPage from "./pages/ProductListPage";
// Import other page components here later

function App() {
  return (
    // Use the MainLayout component as the main wrapper
    <MainLayout>
      {/* Routes are now nested inside MainLayout */}
      {/* The matched Route's element will be passed as 'children' to MainLayout */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductListPage />} />

        {/* This route handles paths like /category/6, /category/9 etc. */}
        {/* ':categoryId' makes 'categoryId' a URL parameter */}
        <Route path="/category/:categoryId" element={<ProductListPage />} />
        <Route path="/product/:productId" element={<ProductDetailPage />} />

        {/* Catch-all route - Note: Link is removed as it's now in MainLayout */}
        <Route
          path="*"
          element={
            <div className="text-center py-10">
              <h1 className="text-3xl font-bold text-red-600">
                404 - Not Found
              </h1>
              <p className="mt-2">
                Sorry, the page you are looking for does not exist.
              </p>
              {/* Could add a Link component here if needed, but it's also in the nav */}
            </div>
          }
        />
      </Routes>
    </MainLayout> // Close MainLayout
  );
}

export default App;
