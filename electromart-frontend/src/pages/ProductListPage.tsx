// src/pages/ProductListPage.tsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Product,
  Category,
  ProductImage,
} from "../data/mockData"; // Types are still fine
import ProductCard from "../components/ProductCard";
// --- Step 1: Import the service functions ---
import {
  fetchProducts,
  fetchCategories,
  fetchProductImages,
} from "../services/apiService"; // Adjust path if needed

// Keep this helper function (it will operate on fetched category data)
function getAllDescendantIds(
  startCategoryId: number,
  allCategories: Category[]
): Set<number> {
  const ids = new Set<number>([startCategoryId]);
  const children = allCategories.filter(
    (cat) => cat.parentId === startCategoryId
  );
  children.forEach((child) => {
    const descendantIds = getAllDescendantIds(child.id, allCategories);
    descendantIds.forEach((id) => ids.add(id));
  });
  return ids;
}

const ProductListPage: React.FC = () => {
  const { categoryId: categoryIdParam } = useParams<{ categoryId?: string }>();

  // --- State Variables (remain the same) ---
  const [allProductImages, setAllProductImages] = useState<ProductImage[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [pageTitle, setPageTitle] = useState<string>("Our Products");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // --- Step 2: useEffect to Fetch Data and Filter using service functions ---
  useEffect(() => {
    const loadAndFilterData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // --- MODIFIED: Fetch all necessary data concurrently using service functions ---
        const [productsData, categoriesData, imagesData] = await Promise.all([
          fetchProducts(),
          fetchCategories(),
          fetchProductImages(),
        ]);
        // --- END MODIFICATION ---

        // --- REMOVED: Individual response.ok checks and .json() calls ---
        // These are now handled by the service functions.

        // Store the full fetched list for product images (still needed for ProductCard)
        setAllProductImages(imagesData);

        // --- Perform Filtering (logic remains the same, using fetched data) ---
        let currentTitle = "Our Products";
        let productsToDisplay = productsData;

        if (categoryIdParam) {
          const categoryId = parseInt(categoryIdParam, 10);
          if (!isNaN(categoryId)) {
            const category = categoriesData.find(
              (cat) => cat.id === categoryId
            );
            currentTitle = category ? category.name : "Category Products";

            const categoryIdsToShow = getAllDescendantIds(
              categoryId,
              categoriesData // Use fetched categoriesData
            );
            productsToDisplay = productsData.filter((product) => // Use fetched productsData
              categoryIdsToShow.has(product.categoryId)
            );
          } else {
            setError(`Invalid category ID: ${categoryIdParam}`);
            productsToDisplay = [];
            currentTitle = "Invalid Category";
          }
        }

        setDisplayedProducts(productsToDisplay);
        setPageTitle(currentTitle);
      } catch (e) {
        console.error("Failed to load page data:", e);
        setError(e instanceof Error ? e.message : "Failed to load data");
        setDisplayedProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadAndFilterData();
  }, [categoryIdParam]);

  // --- Render Logic (remains the same) ---
  if (isLoading) {
    return <div className="text-center p-10">Loading products...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-600">Error: {error}</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-800">{pageTitle}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayedProducts.length > 0 ? (
          displayedProducts.map((product) => {
            const productImage = allProductImages.find(
              (img: ProductImage) =>
                img.productId.toString() === product.id.toString()
            );
            const imageUrlForCard = productImage?.imageUrl;

            return (
              <ProductCard
                key={product.id}
                product={product}
                displayImageUrl={imageUrlForCard}
              />
            );
          })
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No products found in this category or its subcategories.
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductListPage;