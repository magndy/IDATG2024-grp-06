// src/pages/ProductListPage.tsx
import React, { useState, useEffect } from "react"; // Import hooks
import { useParams } from "react-router-dom";
// --- Import only TYPES from mockData ---
import {
  Product,
  Category,
  ProductImage,
  // Removed mock arrays (mockProducts, mockCategories, mockProductImages)
} from "../data/mockData";
import ProductCard from "../components/ProductCard";

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

  // --- State Variables ---
  const [allProductImages, setAllProductImages] = useState<ProductImage[]>([]); // To store all fetched images
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]); // Products filtered for display
  const [pageTitle, setPageTitle] = useState<string>("Our Products"); // Page title
  const [isLoading, setIsLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  // --- useEffect to Fetch Data and Filter ---
  useEffect(() => {
    const loadAndFilterData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch all necessary data concurrently
        const [productsResponse, categoriesResponse, imagesResponse] =
          await Promise.all([
            fetch("/mock-data/products.json"),
            fetch("/mock-data/categories.json"),
            fetch("/mock-data/productImages.json"), // Also fetch images here
          ]);

        // Check responses
        if (!productsResponse.ok)
          throw new Error(
            `Failed to load products: ${productsResponse.statusText}`
          );
        if (!categoriesResponse.ok)
          throw new Error(
            `Failed to load categories: ${categoriesResponse.statusText}`
          );
        if (!imagesResponse.ok)
          throw new Error(
            `Failed to load images: ${imagesResponse.statusText}`
          );

        // Parse JSON data
        const productsData: Product[] = await productsResponse.json();
        const categoriesData: Category[] = await categoriesResponse.json();
        const imagesData: ProductImage[] = await imagesResponse.json();

        // Store the full fetched lists in state
        setAllProductImages(imagesData); // Store images

        // --- Perform Filtering ---
        let currentTitle = "Our Products";
        let productsToDisplay = productsData; // Start with all products

        if (categoryIdParam) {
          const categoryId = parseInt(categoryIdParam, 10);
          if (!isNaN(categoryId)) {
            const category = categoriesData.find(
              (cat) => cat.id === categoryId
            );
            currentTitle = category ? category.name : "Category Products"; // Update title

            const categoryIdsToShow = getAllDescendantIds(
              categoryId,
              categoriesData
            );
            productsToDisplay = productsData.filter((product) =>
              categoryIdsToShow.has(product.categoryId)
            );
          } else {
            // Handle case where categoryIdParam is not a valid number if necessary
            setError(`Invalid category ID: ${categoryIdParam}`);
            productsToDisplay = []; // Show no products for invalid category
            currentTitle = "Invalid Category";
          }
        }

        // Set the final state for rendering
        setDisplayedProducts(productsToDisplay);
        setPageTitle(currentTitle);
      } catch (e) {
        console.error("Failed to load page data:", e);
        setError(e instanceof Error ? e.message : "Failed to load data");
        setDisplayedProducts([]); // Clear products on error
      } finally {
        setIsLoading(false); // Done loading
      }
    };

    loadAndFilterData();
  }, [categoryIdParam]); // Re-run when the URL parameter changes

  // --- Render Logic ---

  // Handle Loading State
  if (isLoading) {
    return <div className="text-center p-10">Loading products...</div>;
  }

  // Handle Error State
  if (error) {
    return <div className="text-center p-10 text-red-600">Error: {error}</div>;
  }

  // Render Product Grid
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-800">{pageTitle}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayedProducts.length > 0 ? (
          displayedProducts.map((product) => {
            // --- Find image URL using data from STATE ---
            const productImage = allProductImages.find(
              // Search the state variable
              (img: ProductImage) =>
                img.productId.toString() === product.id.toString()
            );
            const imageUrlForCard = productImage?.imageUrl;

            return (
              <ProductCard
                key={product.id}
                product={product}
                displayImageUrl={imageUrlForCard} // Pass URL to card
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
