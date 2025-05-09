// src/pages/HomePage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Category,
  Product,
  ProductImage,
} from '../data/mockData'; // Assuming types are here
import {
  fetchCategories,
  fetchProducts,
  fetchProductImages,
} from '../services/apiService';
import ProductCard from '../components/ProductCard';

// Helper function (ideally move to a utils file later)
function getAllDescendantIds(
  startCategoryId: number,
  allCategories: Category[] // Expects the flat list of all categories
): Set<number> {
  const ids = new Set<number>([startCategoryId]);
  const queue: number[] = [startCategoryId];
  let head = 0;

  while(head < queue.length) {
    const currentParentId = queue[head++];
    const children = allCategories.filter(cat => cat.parentId === currentParentId);
    children.forEach(child => {
      ids.add(child.id);
      queue.push(child.id);
    });
  }
  return ids;
}

interface DisplayCategoryRow {
  category: Category;
  products: Product[];
}

const HomePage: React.FC = () => {
  const [displayRows, setDisplayRows] = useState<DisplayCategoryRow[]>([]);
  const [allProductImages, setAllProductImages] = useState<ProductImage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadHomePageData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch all necessary data
        const [categoriesData, productsData, productImagesData] = await Promise.all([
          fetchCategories(),
          fetchProducts(),
          fetchProductImages(),
        ]);

        setAllProductImages(productImagesData); // Store for image lookup

        const topLevelCategories = categoriesData.filter(cat => cat.parentId === null);
        const rows: DisplayCategoryRow[] = [];

        for (const topCat of topLevelCategories) {
          const descendantIds = getAllDescendantIds(topCat.id, categoriesData);
          const categoryProducts = productsData
            .filter(p => descendantIds.has(p.categoryId)) // Ensure your Product interface has categoryId
            .slice(0, 3); // Get first 3 products

          if (categoryProducts.length > 0) { // Only add row if there are products
            rows.push({
              category: topCat,
              products: categoryProducts,
            });
          }
        }
        setDisplayRows(rows);

      } catch (e) {
        console.error("Failed to load home page data:", e);
        setError(e instanceof Error ? e.message : 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    loadHomePageData();
  }, []);

  if (isLoading) {
    return <div className="container mx-auto p-4 text-center">Loading ElectroMart Home...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-center text-red-600">Error: {error}</div>;
  }

  if (displayRows.length === 0) {
    return <div className="container mx-auto p-4 text-center">No featured products available at the moment.</div>;
  }

  return (
    <div className="container mx-auto p-4 space-y-12">
      {/* Hero Section (Optional - Placeholder) */}
      <section className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-8 md:p-16 rounded-lg shadow-xl text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to ElectroMart!</h1>
        <p className="text-lg md:text-xl mb-6">Your one-stop shop for the latest and greatest in electronics.</p>
        <Link
          to="/products"
          className="bg-white text-indigo-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition duration-300 text-lg"
        >
          Shop All Products
        </Link>
      </section>

      {/* Category Rows */}
      {displayRows.map((row) => (
        <section key={row.category.id} className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">{row.category.name}</h2>
            <Link
              to={`/category/${row.category.id}`}
              className="text-indigo-600 hover:text-indigo-800 font-semibold transition duration-200 whitespace-nowrap"
            >
              Shop more {row.category.name.toLowerCase()} &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {row.products.map((product) => {
              const productImage = allProductImages.find(
                (img) => img.productId.toString() === product.id.toString()
              );
              const imageUrlForCard = productImage?.imageUrl;
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  displayImageUrl={imageUrlForCard}
                />
              );
            })}
            {/* If you want the link strictly after 3 cards, this might be tricky with grid.
                Alternatively, have the above link handle it, or make the grid 4 columns
                and place the link as a 4th item if fewer than 3 products.
                The current setup places the link above the grid of 3 cards.
             */}
          </div>
        </section>
      ))}
    </div>
  );
};

export default HomePage;