// src/layouts/MainLayout.tsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Category, CategoryNode } from "../data/models"; // Keep type imports
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";
// --- Step 1: Import the service function ---
import { fetchCategories as fetchCategoriesAPI } from "../services/apiService"; // Adjusted path

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
  const [categoryTree, setCategoryTree] = useState<CategoryNode[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(true);
  const [categoryError, setCategoryError] = useState<string | null>(null);

  // State for dropdown interaction (remains the same)
  const [isCategoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [openSubMenuId, setOpenSubMenuId] = useState<number | null>(null);

  // --- Step 2: useEffect to fetch categories using the service ---
  useEffect(() => {
    // Renamed the inner async function to avoid conflict and for clarity
    const loadCategories = async () => {
      setIsLoadingCategories(true);
      setCategoryError(null);
      try {
        // --- MODIFIED: Call the imported service function ---
        const data: Category[] = await fetchCategoriesAPI();
        // --- END MODIFICATION ---

        // Build the tree *after* fetching
        const tree = buildCategoryTree(data);
        setCategoryTree(tree); // Store the nested tree
      } catch (e) {
        console.error("Failed to fetch categories:", e);
        setCategoryError(
          e instanceof Error ? e.message : "Failed to load categories"
        );
        setCategoryTree([]); // Clear tree on error
      } finally {
        setIsLoadingCategories(false);
      }
    };

    loadCategories();
  }, []); // Empty dependency array `[]` means this runs only once when the component mounts

  const { getItemCount } = useCart();
  const { currentUser, logout } = useAuth();
  const itemCount = getItemCount();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Section */}
      <nav className="bg-gray-800 text-white p-4 shadow-md sticky top-0 z-15">
        <ul className="flex space-x-4 md:space-x-6 container mx-auto items-center"> {/* Adjusted space-x for responsiveness */}
          {/* Home Link */}
          <li>
            <Link
              to="/"
              className="hover:text-gray-300 transition duration-200"
            >
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
                {isLoadingCategories ? (
                  <div className="px-4 py-2 text-sm text-gray-500">
                    Loading categories...
                  </div>
                ) : categoryError ? (
                  <div className="px-4 py-2 text-sm text-red-600">
                    Error: {categoryError}
                  </div>
                ) : categoryTree.length === 0 ? (
                  <div className="px-4 py-2 text-sm text-gray-500">
                    No categories found.
                  </div>
                ) : (
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
              </div>
            )}
          </li>
          {/* Spacer element */}
          <li className="flex-grow"></li>
          {/* Conditional Auth Links/Info */}
          {currentUser ? (
        // --- Logged IN View ---
        <>
          <li className="flex items-center text-sm text-gray-300">
            <FaUserCircle className="mr-1" />
            Welcome, {currentUser.username || currentUser.email}
          </li>
          {/* --- ADDED MY ORDERS LINK --- */}
          <li>
            <Link
              to="/my-orders"
              className="hover:text-gray-300 transition duration-200 text-sm px-2 py-1" // Added padding to match button
            >
              My Orders
            </Link>
          </li>
          {/* --- END ADDED MY ORDERS LINK --- */}
          <li>
            <button
              onClick={logout}
              className="hover:text-gray-300 transition duration-200 px-2 py-1 text-sm"
            >
              Logout
            </button>
          </li>
        </>
      ) : (
            <>
              <li>
                <Link
                  to="/login"
                  className="hover:text-gray-300 transition duration-200 text-sm"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="hover:text-gray-300 transition duration-200 text-sm"
                >
                  Register
                </Link>
              </li>
            </>
          )}
          {/* Cart Link/Icon */}
          <li className="relative ml-2">
            <Link
              to="/cart"
              className="hover:text-gray-300 transition duration-200 p-2 flex items-center"
            >
              <FaShoppingCart size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
          </li>
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