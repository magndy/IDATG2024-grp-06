// src/layouts/MainLayout.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import { Category, CategoryNode, mockCategories } from "../data/mockData"; // Adjust path if needed

// Define the type for the component props, including 'children'
type MainLayoutProps = {
  children: React.ReactNode; // 'children' represents the content to be rendered inside the layout
};

function buildCategoryTree(
  categories: Category[],
  parentId: number | null = null
): CategoryNode[] {
  return categories
    .filter((category) => category.parentId === parentId)
    .map((category) => ({
      ...category,
      // Recursively find children for the current category
      children: buildCategoryTree(categories, category.id),
    }));
}

// Define the MainLayout component
const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  // State to control the main category dropdown visibility
  const [isCategoryMenuOpen, setCategoryMenuOpen] = useState(false);
  // State to track which category's submenu is open (using its ID)
  const [openSubMenuId, setOpenSubMenuId] = useState<number | null>(null);

  // Build the hierarchical category tree from mock data
  const categoryTree = buildCategoryTree(mockCategories);
  return (
    <div className="min-h-screen flex flex-col">
      {" "}
      {/* Ensure layout takes full height */}
      {/* 1. Navigation Section (Moved from App.tsx) */}
      <nav className="bg-gray-800 text-white p-4 shadow-md sticky top-0 z-10">
        {" "}
        {/* Made nav sticky */}
        {/* Inside the <nav> tag... */}
        <ul className="flex space-x-6 container mx-auto">
          {/* Home Link (Stays the same) */}
          <li>
            <Link
              to="/"
              className="hover:text-gray-300 transition duration-200"
            >
              Home
            </Link>
          </li>

          {/* --- Start Products Dropdown Item --- */}
          <li
            className="relative" // Parent is relative for dropdown positioning
            // *** Hover handlers now on the "Products" li ***
            onMouseEnter={() => setCategoryMenuOpen(true)} // Open dropdown on enter
            onMouseLeave={() => {
              // Close dropdown on leave
              setCategoryMenuOpen(false);
              setOpenSubMenuId(null); // Close submenus too
            }}
          >
            {/* The main link to see ALL products */}
            <Link
              to="/products"
              className="hover:text-gray-300 transition duration-200 focus:outline-none"
              aria-haspopup="true" // Indicate interaction
              aria-expanded={isCategoryMenuOpen} // Indicate dropdown state (accessibility)
            >
              Products
            </Link>

            {/* --- Category Dropdown Menu (Moved Here) --- */}
            {isCategoryMenuOpen && (
              <div
                className="absolute left-0 top-full w-56 bg-white rounded-md shadow-xl z-20 py-1" // Position below "Products"
                // No handlers needed here for main visibility
              >
                {/* Map over TOP-LEVEL categories */}
                {categoryTree.map((category) => (
                  <div
                    key={category.id}
                    className="relative group" // For submenu hover
                    onMouseEnter={() => {
                      // Submenu open logic
                      if (category.children.length > 0) {
                        setOpenSubMenuId(category.id);
                      } else {
                        setOpenSubMenuId(null);
                      }
                    }}
                  >
                    {/* Link for the specific category */}
                    <Link
                      to={`/category/${category.id}`} // Link to category-specific page
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-500 hover:text-white w-full text-left"
                      onClick={() => setCategoryMenuOpen(false)} // Close menu on click
                    >
                      {category.name}
                      {category.children.length > 0 && (
                        <span className="float-right">&raquo;</span>
                      )}
                    </Link>

                    {/* --- Submenu --- */}
                    {category.children.length > 0 &&
                      openSubMenuId === category.id && (
                        <div
                          className="absolute left-full top-0 mt-0 ml-px w-56 bg-white rounded-md shadow-xl z-30 py-1"
                          onMouseLeave={() => setOpenSubMenuId(null)} // Close submenu
                        >
                          {/* Map over CHILDREN categories */}
                          {category.children.map((childCategory) => (
                            <Link
                              key={childCategory.id}
                              to={`/category/${childCategory.id}`} // Link to sub-category page
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-500 hover:text-white w-full text-left"
                              onClick={() => {
                                // Close all menus on click
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
                ))}
                {/* Optional: Add a direct link to "All Products" within the dropdown too? */}
                {/* <hr className="my-1 border-gray-200" />
             <Link
                 to="/products"
                 className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-500 hover:text-white w-full text-left font-semibold"
                 onClick={() => setCategoryMenuOpen(false)}
             >
                 View All Products
             </Link> */}
              </div>
            )}
          </li>
          {/* --- End Products Dropdown Item --- */}

          {/* The separate "Categories" <li> is now completely removed */}

          {/* Add more links later (e.g., Cart, Login) */}
        </ul>
        {/* End of <ul> */}
      </nav>
      {/* 2. Page Content Section */}
      {/* 'children' will render the actual page component (e.g., HomePage, ProductListPage) here */}
      {/* 'flex-grow' makes this section take up available space */}
      <main className="container mx-auto p-4 flex-grow">{children}</main>
      {/* 3. Optional Footer (Moved from App.tsx comment) */}
      <footer className="bg-gray-200 p-4 mt-auto text-center text-sm text-gray-600">
        {" "}
        {/* mt-auto pushes footer down */}© {new Date().getFullYear()}{" "}
        ElectroMart - Gjøvik, Norway
        {/* Used current year and added location context */}
      </footer>
    </div>
  );
};

// Export the component
export default MainLayout;
