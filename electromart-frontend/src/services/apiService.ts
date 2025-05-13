// src/services/apiService.ts
import {
  APIProduct, // For typing the raw API response
  Product,    // For typing the transformed, frontend-friendly data
  // ... other types like Category, Brand, ProductImage, OrderFromDB if used by other functions
  Category,
  Brand,
  ProductImage, // This is your older, simpler ProductImage type. Keep if fetchProductImages still uses it.
  OrderFromDB
} from '../data/models'; // Adjust path if your types are elsewhere

// const BASE_URL = '/mock-data'; // We might not need this for this specific function anymore if all go to API

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorBody = await response.text().catch(() => 'Could not read error body');
    throw new Error(
      `API Error: ${response.status} ${response.statusText} - ${errorBody}`
    );
  }
  return response.json() as Promise<T>;
}

function transformAPIProductToProduct(apiProduct: APIProduct): Product {
  return {
    id: apiProduct.id,
    name: apiProduct.name,
    description: apiProduct.description,
    price: parseFloat(apiProduct.price),
    stockQuantity: apiProduct.stock_quantity,
    isActive: apiProduct.is_active,
    brandName: apiProduct.brand.name,
    brandId: apiProduct.brand.id,
    categoryName: apiProduct.category.name,
    categoryId: apiProduct.category.id,
    categoryParentName: apiProduct.category.parent?.name,
    primaryImageUrl: apiProduct.images[0]?.image_url || undefined,
    allImages: apiProduct.images.map(img => ({
      id: img.id,
      imageUrl: img.image_url,
      altText: img.altText || apiProduct.name, // Assuming APIProductImage now has optional altText
    }))
  };
}

// --- Updated fetchProducts function ---
export const fetchProducts = async (): Promise<Product[]> => {
  // --- CHANGE THE URL HERE ---
  const response = await fetch('http://127.0.0.1:8000/api/products/'); // Your actual backend endpoint
  // --- END CHANGE ---
  const apiProducts: APIProduct[] = await handleResponse<APIProduct[]>(response);
  return apiProducts.map(transformAPIProductToProduct);
};

// --- Other fetch functions still pointing to mock data (for now) ---
export const fetchCategories = async (): Promise<Category[]> => {
  const response = await fetch(`/mock-data/categories.json`);
  return handleResponse<Category[]>(response);
};

export const fetchProductImages = async (): Promise<ProductImage[]> => {
  // Note: If products API now returns images, this separate fetch might become obsolete
  // or only used if categories/brands also need separate image lists.
  const response = await fetch(`/mock-data/productImages.json`);
  return handleResponse<ProductImage[]>(response);
};

export const fetchBrands = async (): Promise<Brand[]> => {
  const response = await fetch(`/mock-data/brands.json`);
  return handleResponse<Brand[]>(response);
};

export const fetchUserOrders = async (): Promise<OrderFromDB[]> => {
  const response = await fetch(`/mock-data/user-orders.json`);
  return handleResponse<OrderFromDB[]>(response);
};