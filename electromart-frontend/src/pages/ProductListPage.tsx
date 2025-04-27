import React from "react";
import { useParams } from "react-router-dom";
// Import data and types from the shared file
import {
  Product,
  mockProducts,
  Category,
  mockCategories,
} from "../data/mockData"; // Adjust path if needed
import ProductCard from "../components/ProductCard";

// Function to get all descendant category IDs including the starting one
function getAllDescendantIds(
  startCategoryId: number,
  allCategories: Category[]
): Set<number> {
  const ids = new Set<number>([startCategoryId]); // Use a Set for efficiency

  // Find direct children
  const children = allCategories.filter(
    (cat) => cat.parentId === startCategoryId
  );

  // Recursively find descendants for each child
  children.forEach((child) => {
    const descendantIds = getAllDescendantIds(child.id, allCategories);
    descendantIds.forEach((id) => ids.add(id)); // Add descendant IDs to the set
  });

  return ids;
}

const ProductListPage: React.FC = () => {
  // Get the categoryId from the URL path parameter (if it exists)
  // It comes from the ':categoryId' part in the App.tsx route definition
  const { categoryId: categoryIdParam } = useParams<{ categoryId?: string }>();

  const filteredProducts = React.useMemo(() => {
    if (categoryIdParam) {
      const categoryId = parseInt(categoryIdParam, 10);
      if (!isNaN(categoryId)) {
        // --- Get all relevant category IDs (parent + descendants) ---
        const categoryIdsToShow = getAllDescendantIds(
          categoryId,
          mockCategories
        ); // Use the new function

        // --- Filter products based on the SET of category IDs ---
        return mockProducts.filter((product) =>
          categoryIdsToShow.has(product.categoryId)
        ); // Check if product's categoryId is in the set
      }
    }
    // If no valid categoryIdParam, return all products
    return mockProducts;
  }, [categoryIdParam]); // Dependency array includes categoryIdParam

  // Optional: Find the category name for the title (more robust)
  const currentCategory = categoryIdParam
    ? mockCategories.find((cat) => cat.id === parseInt(categoryIdParam, 10))
    : null;
  const pageTitle = currentCategory ? currentCategory.name : "Our Products";

  // --- Keep the rest of the return statement (JSX) the same ---
  // It already maps over 'filteredProducts'
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-800">{pageTitle}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
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
