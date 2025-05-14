// --- Raw API types ---

export interface APIParentCategory {
  id: number;
  parent: null;
  name: string;
  description: string;
}

export interface APICategory {
  id: number;
  parent: APIParentCategory | null;
  name: string;
  description: string;
}

export interface APIBrand {
  id: number;
  name: string;
  description: string;
}

export interface APIProduct {
  id: number;
  brand: APIBrand;
  category: APICategory;
  images: {
    id: number;
    image_url: string;
    product: number;
    altText?: string;
  }[];
  name: string;
  description: string;
  price: string;
  stock_quantity: number;
  is_active: boolean;
}

// --- Frontend-friendly types ---

export interface Category {
  id: number;
  name: string;
  parentId: number | null;
  description?: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  isActive: boolean;
  brandName: string;
  brandId: number;
  categoryName: string;
  categoryId: number;
  categoryParentName?: string;
  primaryImageUrl?: string;
  allImages: {
    id: number;
    imageUrl: string;
    altText?: string;
  }[];
}

export interface ProductImage {
  id: number;
  productId: number | string;
  imageUrl: string;
  altText?: string;
}

export interface Brand {
  id: number;
  name: string;
}

export interface CategoryNode extends Category {
  children: CategoryNode[];
}

// --- Order types ---

export interface OrderFromDB {
  order_id: number;
  user_id: number | null;
  order_date: string;
  total_amount: number;
  order_status_id: number;
  tracking_number: string | null;
  shipping_address_id: number;
  itemCount?: number;
}

export const OrderStatusMap: { [key: number]: string } = {
  1: 'Confirmed',
  2: 'Processing',
  3: 'Shipped',
  4: 'Delivered',
  5: 'Cancelled',
};
