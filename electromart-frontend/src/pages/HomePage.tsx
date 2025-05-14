import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Category, Product } from '../data/models';
import { fetchCategories, fetchProducts } from '../services/apiService';
import ProductCard from '../components/ProductCard';

function getAllDescendantIds(startCategoryId: number, allCategories: Category[]): Set<number> {
  const ids = new Set<number>([startCategoryId]);
  const queue: number[] = [startCategoryId];
  let head = 0;

  while (head < queue.length) {
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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadHomePageData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [categoriesData, productsData] = await Promise.all([
          fetchCategories(),
          fetchProducts(),
        ]);

        const topLevelCategories = categoriesData.filter(cat => cat.parentId === null);
        const rows: DisplayCategoryRow[] = [];

        for (const topCat of topLevelCategories) {
          const descendantIds = getAllDescendantIds(topCat.id, categoriesData);
          const categoryProducts = productsData
            .filter(p => descendantIds.has(p.categoryId))
            .slice(0, 3);

          if (categoryProducts.length > 0) {
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

  if (isLoading) return <div className="container mx-auto p-4 text-center">Loading ElectroMart Home...</div>;
  if (error) return <div className="container mx-auto p-4 text-center text-red-600">Error: {error}</div>;
  if (displayRows.length === 0) return <div className="container mx-auto p-4 text-center">No featured products available at the moment.</div>;

  return (
    <div className="container mx-auto p-4 space-y-12">
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
            {row.products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                displayImageUrl={product.primaryImageUrl}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default HomePage;
