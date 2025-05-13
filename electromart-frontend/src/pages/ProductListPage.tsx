// src/pages/ProductListPage.tsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Product, // This should be the NEW frontend-friendly Product interface
  Category,
} from "../data/models";
import ProductCard from "../components/ProductCard";
import {
  fetchProducts,
  fetchCategories,
  // fetchProductImages, // Removed
} from "../services/apiService";

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
  // Removed allProductImages state
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [pageTitle, setPageTitle] = useState<string>("Our Products");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAndFilterData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch only products and categories
        const [productsData, categoriesData] = await Promise.all([
          fetchProducts(), // This now returns Product[] with image info
          fetchCategories(),
        ]);

        // --- Perform Filtering ---
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
              categoriesData
            );
            productsToDisplay = productsData.filter((product) =>
              categoryIdsToShow.has(product.categoryId) // Assumes new Product type has categoryId
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
            // Get image URL directly from the transformed product object
            const imageUrlForCard = product.primaryImageUrl;

            return (
              <ProductCard
                key={product.id}
                product={product} // Pass the full transformed product
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