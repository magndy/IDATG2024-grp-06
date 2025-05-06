// src/data/mockData.ts

// --- Interfaces ---
export interface Category {
    id: number;
    name: string;
    parentId: number | null; // null for top-level categories
    description?: string;
  }
  
  // Interface for the ProductCard component & mock data
  export interface Product {
    id: number | string;
    name: string;
    description: string;
    price: number;
    imageUrl?: string;
    // Add categoryId directly to the base Product type for simplicity here
    categoryId: number;
  }
  
  // Interface for hierarchical category node (used in Layout)
  export interface CategoryNode extends Category {
      children: CategoryNode[];
  }
  
  
  // --- Mock Data ---
  export const mockCategories: Category[] = [
    // Top Level
    { id: 1, name: 'Computers', parentId: null },
    { id: 2, name: 'Mobile Devices', parentId: null },
    { id: 3, name: 'Cameras', parentId: null },
    { id: 4, name: 'Home Appliances', parentId: null },
    { id: 5, name: 'Accessories', parentId: null },
  
    // Sub-categories for Computers
    { id: 6, name: 'Laptops', parentId: 1 },
    { id: 7, name: 'Desktops', parentId: 1 },
    { id: 8, name: 'Tablets', parentId: 1 }, // Example: Tablet under Computers
  
    // Sub-categories for Mobile Devices
    { id: 9, name: 'Smartphones', parentId: 2 },
    { id: 10, name: 'Smartwatches', parentId: 2 },
    { id: 11, name: 'Tablets', parentId: 2 }, // Example: Tablet also under Mobile
  
    // Sub-categories for Accessories
    { id: 12, name: 'Keyboards', parentId: 5 },
    { id: 13, name: 'Mice', parentId: 5 },
    { id: 14, name: 'Headphones', parentId: 5 },
  
    // Sub-sub-category example (Level 3)
    { id: 15, name: 'Gaming Laptops', parentId: 6 },
    { id: 16, name: 'Business Laptops', parentId: 6 },
  ];
  
  export const mockProducts: Product[] = [ // Uses Product interface directly now
    { id: 1, name: 'Laptop Pro 15"', description: '...', price: 14999.90, imageUrl: '...', categoryId: 6 },
    { id: 2, name: 'Smartphone X', description: '...', price: 9890.00, imageUrl: '...', categoryId: 9 },
    { id: 3, name: 'Wireless Noise-Cancelling Headphones', description: '...', price: 3495.50, categoryId: 14 },
    { id: 4, name: '4K Ultra HD Smart TV 55"', description: '...', price: 7490.00, imageUrl: '...', categoryId: 4 },
    { id: 5, name: 'Digital Camera Alpha', description: '...', price: 11500.00, imageUrl: '...', categoryId: 3 },
    { id: 6, name: 'Gaming Laptop Beast', description: '...', price: 21999.00, imageUrl: '...', categoryId: 15 },
    { id: 7, name: 'Business Laptop Slim', description: '...', price: 13500.00, imageUrl: '...', categoryId: 16 },
    { id: 8, name: 'Mechanical Keyboard RGB', description: '...', price: 899.00, imageUrl: '...', categoryId: 12 },
    { id: 9, // Add a Tablet for testing hierarchy
      name: 'Tablet Tab S9', description: 'Versatile tablet for work and play.', price: 6990.00, imageUrl: '...', categoryId: 8 // Child of Computers
    },
    { id: 10, // Add another Tablet
      name: 'Tablet Tab Mini', description: 'Compact and portable tablet.', price: 4500.00, imageUrl: '...', categoryId: 11 // Child of Mobile Devices
    }
  ];