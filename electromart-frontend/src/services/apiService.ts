// src/services/apiService.ts
import { Product, Category, ProductImage, Brand } from '../data/mockData'; // Import your types

const BASE_URL = '/mock-data'; // Base path for your mock JSON files in the /public folder

// Helper function to handle fetch responses and parse JSON
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    // Try to get more details from the error response body
    const errorBody = await response.text().catch(() => 'Could not read error body');
    throw new Error(
      `API Error: ${response.status} ${response.statusText} - ${errorBody}`
    );
  }
  return response.json() as Promise<T>;
}

// Fetches all categories
export const fetchCategories = async (): Promise<Category[]> => {
  const response = await fetch(`${BASE_URL}/categories.json`);
  return handleResponse<Category[]>(response);
};

// Fetches all products
export const fetchProducts = async (): Promise<Product[]> => {
  const response = await fetch(`${BASE_URL}/products.json`);
  return handleResponse<Product[]>(response);
};

// Fetches all product images
export const fetchProductImages = async (): Promise<ProductImage[]> => {
  const response = await fetch(`${BASE_URL}/productImages.json`);
  return handleResponse<ProductImage[]>(response);
};

// Fetches all brands
export const fetchBrands = async (): Promise<Brand[]> => {
  const response = await fetch(`${BASE_URL}/brands.json`);
  return handleResponse<Brand[]>(response);
};

/*
// Example for future real API functions:
export const fetchProductByIdAPI = async (productId: string | number): Promise<Product> => {
  const response = await fetch(`/api/real/products/${productId}`); // Example real API endpoint
  return handleResponse<Product>(response);
};

export const createOrderAPI = async (orderData: any): Promise<{success: boolean, orderId?: any}> => {
  const response = await fetch('/api/real/orders', { // Example real API endpoint
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
  });
  return handleResponse<{success: boolean, orderId?: any}>(response);
};
*/