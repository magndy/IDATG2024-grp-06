import {
  APIProduct,
  APICategory,
  Product,
  Category,
  Brand,
  OrderFromDB
} from '../data/models';

// --- Utility: Generic response handler ---
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorBody = await response.text().catch(() => 'Could not read error body');
    throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorBody}`);
  }
  return response.json() as Promise<T>;
}

// --- Transformation: APIProduct -> Product ---
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
    allImages: apiProduct.images.map((img) => ({
      id: img.id,
      imageUrl: img.image_url,
      altText: img.altText || apiProduct.name,
    })),
  };
}

// --- Transformation: APICategory -> Category ---
function transformAPICategory(apiCat: APICategory): Category {
  return {
    id: apiCat.id,
    name: apiCat.name,
    description: apiCat.description,
    parentId: apiCat.parent?.id ?? null,
  };
}

// --- API Fetches ---

export const fetchProducts = async (): Promise<Product[]> => {
  const response = await fetch('http://127.0.0.1:8000/api/products/');
  const apiProducts: APIProduct[] = await handleResponse(response);
  return apiProducts.map(transformAPIProductToProduct);
};

export const fetchCategories = async (): Promise<Category[]> => {
  const response = await fetch('http://127.0.0.1:8000/api/categories/');
  const apiCategories: APICategory[] = await handleResponse(response);
  return apiCategories.map(transformAPICategory);
};

export const fetchBrands = async (): Promise<Brand[]> => {
  const response = await fetch('/mock-data/brands.json');
  return handleResponse<Brand[]>(response);
};

export const fetchUserOrders = async (): Promise<OrderFromDB[]> => {
  const response = await fetch('/mock-data/user-orders.json');
  return handleResponse<OrderFromDB[]>(response);
};
