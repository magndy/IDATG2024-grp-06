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
    categoryId: number;
    stockQuantity: number;
    brandId: number;
    isActive: boolean;
  }

  export interface ProductImage {
    id: number;
    productId: number | string;
    imageUrl: string;
    altText?: string;
  }
  
  // Interface for hierarchical category node (used in Layout)
  export interface CategoryNode extends Category {
      children: CategoryNode[];
  }

  // Optional: Mock Brand Data (if you want to display brand names)
export interface Brand { id: number; name: string; }