import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Category, Product } from '../data/models';
import { fetchCategories, fetchProducts } from '../services/apiService';
import ProductCard from '../components/ProductCard';

interface DisplayCategoryRow {
  parentCategory: Category;
  childCategories: Category[];
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

        const parentCategories = categoriesData.filter(cat => cat.parentId === null);
        const childCategories = categoriesData.filter(cat => cat.parentId !== null);

        const rows: DisplayCategoryRow[] = parentCategories.map(parent => {
          const children = childCategories.filter(child => child.parentId === parent.id);

          let relevantProducts: Product[];

          if (children.length > 0) {
            relevantProducts = productsData.filter(p =>
              children.some(child => child.id === p.categoryId)
            );
          } else {
            relevantProducts = productsData.filter(p => p.categoryId === parent.id);
          }

          return {
            parentCategory: parent,
            childCategories: children,
            products: relevantProducts,
          };
        });

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

  if (isLoading)
    return <div className="container mx-auto p-4 text-center">Loading ElectroMart Home...</div>;
  if (error)
    return <div className="container mx-auto p-4 text-center text-red-600">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4 space-y-12">
      <section className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-8 md:p-16 rounded-lg shadow-xl text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to ElectroMart!</h1>
        <p className="text-lg md:text-xl mb-6">
          Your one-stop shop for the latest and greatest in electronics.
        </p>
        <Link
          to="/products"
          className="bg-white text-indigo-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition duration-300 text-lg"
        >
          Shop All Products
        </Link>
      </section>

      {displayRows.map(row => (
        <section key={row.parentCategory.id} className="mb-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">{row.parentCategory.name}</h2>
            <Link
              to={`/category/${row.parentCategory.id}`}
              className="text-indigo-600 hover:text-indigo-800 font-semibold transition duration-200 whitespace-nowrap"
            >
              Explore all {row.parentCategory.name.toLowerCase()} &rarr;
            </Link>
          </div>

          {row.childCategories.length > 0 ? (
            row.childCategories.map(child => {
              const childProducts = row.products.filter(p => p.categoryId === child.id);
              return (
                <div key={child.id} className="mb-10">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-700">{child.name}</h3>
                    <Link
                      to={`/category/${child.id}`}
                      className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition duration-200"
                    >
                      Explore all {child.name.toLowerCase()} &rarr;
                    </Link>
                  </div>
                  {childProducts.length === 0 ? (
                    <p className="text-gray-400 italic">No products found.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {childProducts.map(product => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          displayImageUrl={product.primaryImageUrl}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div>
              {row.products.length === 0 ? (
                <p className="text-gray-400 italic">No products found.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {row.products.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      displayImageUrl={product.primaryImageUrl}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      ))}
    </div>
  );
};

export default HomePage;
