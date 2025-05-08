// src/layouts/MainLayout.tsx
import React, { useState, useEffect } from "react"; // Import useState AND useEffect
import { Link } from "react-router-dom";
import { Category, CategoryNode } from "../data/mockData"; // Keep type imports
import { useCart } from "../hooks/useCart";
import { FaShoppingCart } from "react-icons/fa";

// Define the type for the component props (remains the same)
type MainLayoutProps = {
  children: React.ReactNode;
};

// Keep buildCategoryTree function (it operates on the data once fetched)
function buildCategoryTree(
  categories: Category[],
  parentId: number | null = null
): CategoryNode[] {
  return categories
    .filter((category) => category.parentId === parentId)
    .map((category) => ({
      ...category,
      children: buildCategoryTree(categories, category.id),
    }));
}

// Define the MainLayout component
const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  // --- State for fetched data and UI ---
  const [categoryTree, setCategoryTree] = useState<CategoryNode[]>([]); // Holds nested tree
  const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(true); // Loading state
  const [categoryError, setCategoryError] = useState<string | null>(null); // Error state

  // State for dropdown interaction (remains the same)
  const [isCategoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [openSubMenuId, setOpenSubMenuId] = useState<number | null>(null);

  // --- useEffect to fetch categories ---
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoadingCategories(true); // Start loading
      setCategoryError(null);     // Reset error
      try {
        const response = await fetch('/mock-data/categories.json'); // Fetch from public folder
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Category[] = await response.json();

        // Build the tree *after* fetching and setting the flat list
        const tree = buildCategoryTree(data);
        setCategoryTree(tree); // Store the nested tree

      } catch (e) {
        console.error("Failed to fetch categories:", e);
        setCategoryError(e instanceof Error ? e.message : 'Failed to load categories');
        setCategoryTree([]); // Clear tree on error
      } finally {
        setIsLoadingCategories(false); // Stop loading regardless of success/error
      }
    };

    fetchCategories();
  }, []); // Empty dependency array `[]` means this runs only once when the component mounts

  const { getItemCount } = useCart();
  const itemCount = getItemCount();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Section */}
      <nav className="bg-gray-800 text-white p-4 shadow-md sticky top-0 z-10">
        <ul className="flex space-x-6 container mx-auto">
          {/* Home Link */}
          <li>
            <Link to="/" className="hover:text-gray-300 transition duration-200">
              Home
            </Link>
          </li>

          {/* Products Dropdown Item */}
          <li
            className="relative"
            onMouseEnter={() => setCategoryMenuOpen(true)}
            onMouseLeave={() => {
              setCategoryMenuOpen(false);
              setOpenSubMenuId(null);
            }}
          >
            {/* Products Link */}
            <Link
              to="/products"
              className="hover:text-gray-300 transition duration-200 focus:outline-none"
              aria-haspopup="true"
              aria-expanded={isCategoryMenuOpen}
            >
              Products
            </Link>

            {/* Category Dropdown Menu */}
            {isCategoryMenuOpen && (
              <div className="absolute left-0 top-full w-56 bg-white rounded-md shadow-xl z-20 py-1">
                {/* --- Conditional Rendering for Loading/Error/Data --- */}
                {isLoadingCategories ? (
                  <div className="px-4 py-2 text-sm text-gray-500">Loading categories...</div>
                ) : categoryError ? (
                  <div className="px-4 py-2 text-sm text-red-600">Error: {categoryError}</div>
                ) : categoryTree.length === 0 ? (
                    <div className="px-4 py-2 text-sm text-gray-500">No categories found.</div>
                ) : (
                  // Map over the categoryTree *STATE* variable
                  categoryTree.map((category) => (
                    <div
                      key={category.id}
                      className="relative group"
                      onMouseEnter={() => {
                        if (category.children.length > 0) {
                          setOpenSubMenuId(category.id);
                        } else {
                          setOpenSubMenuId(null);
                        }
                      }}
                    >
                      {/* Link for the category */}
                      <Link
                        to={`/category/${category.id}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-500 hover:text-white w-full text-left"
                        onClick={() => setCategoryMenuOpen(false)}
                      >
                        {category.name}
                        {category.children.length > 0 && (
                          <span className="float-right">&raquo;</span>
                        )}
                      </Link>

                      {/* Submenu */}
                      {category.children.length > 0 &&
                        openSubMenuId === category.id && (
                          <div
                            className="absolute left-full top-0 mt-0 ml-px w-56 bg-white rounded-md shadow-xl z-30 py-1"
                            onMouseLeave={() => setOpenSubMenuId(null)}
                          >
                            {category.children.map((childCategory) => (
                              <Link
                                key={childCategory.id}
                                to={`/category/${childCategory.id}`}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-500 hover:text-white w-full text-left"
                                onClick={() => {
                                  setCategoryMenuOpen(false);
                                  setOpenSubMenuId(null);
                                }}
                              >
                                {childCategory.name}
                              </Link>
                            ))}
                          </div>
                        )}
                    </div>
                  ))
                )}
                {/* --- End Conditional Rendering --- */}
              </div>
            )}
          </li>
          {/* End Products Dropdown Item */}

          {/* Spacer element to push cart to the right */}
          <li className="flex-grow"></li> {/* This pushes following items to the end */}

          {/* --- Cart Link/Icon --- */}
          <li className="relative"> {/* Use relative for positioning the badge */}
            <Link
                to="/cart" // Link to the future cart page
                className="hover:text-gray-300 transition duration-200 p-2 flex items-center" // Added padding and flex
            >
              <FaShoppingCart size={20} /> {/* The cart icon */}

              {/* Badge: Show only if itemCount > 0 */}
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount} {/* Display the count */}
                </span>
              )}
            </Link>
          </li>
          {/* --- End Cart Link/Icon --- */}

          {/* You might add Login/Register links after the cart later */}
          
        </ul>
      </nav>

      {/* Page Content */}
      <main className="container mx-auto p-4 flex-grow">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-200 p-4 mt-auto text-center text-sm text-gray-600">
        © {new Date().getFullYear()} ElectroMart - Gjøvik, Norway
      </footer>
    </div>
  );
};

export default MainLayout;