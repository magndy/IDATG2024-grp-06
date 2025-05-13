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

// In src/data/mockData.ts (or your types file)

// Interface representing an order as it might come from the DB (matching your ORDER table)
export interface OrderFromDB {
  order_id: number;
  user_id: number | null; // Allow null for guests
  order_date: string; // Keep as string for simplicity (e.g., "YYYY-MM-DD")
  total_amount: number;
  order_status_id: number;
  tracking_number: string | null;
  shipping_address_id: number; // Or string
  // For display convenience on the summary page, we might add derived fields.
  // For this mock, let's add itemCount directly to the JSON later.
  itemCount?: number; // Number of distinct items or total quantity of items
}

// Simple lookup for order statuses
export const OrderStatusMap: { [key: number]: string } = {
  1: 'Confirmed',
  2: 'Processing',
  3: 'Shipped',
  4: 'Delivered',
  5: 'Cancelled',
  // Add more statuses as defined in your lookup table
};