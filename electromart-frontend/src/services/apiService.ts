import {
  APIProduct,
  APICategory,
  APIUser,
  Product,
  Category,
  User,
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


function transformAPIUser(apiUser: APIUser): User {
  return {
    id: apiUser.id,
    username: apiUser.username,
    firstName: apiUser.first_name,
    lastName: apiUser.last_name,
    email: apiUser.email,
    phone: apiUser.phone,
    role: apiUser.role,
    addressLine: apiUser.address.address_line,
    city: apiUser.address.city,
  };
}

// --- API Fetches ---

export const fetchProducts = async (): Promise<Product[]> => {
  const response = await fetch('http://localhost:8000/api/products/');
  const apiProducts: APIProduct[] = await handleResponse(response);
  return apiProducts.map(transformAPIProductToProduct);
};

export const fetchCategories = async (): Promise<Category[]> => {
  const response = await fetch('http://localhost:8000/api/categories/');
  const apiCategories: APICategory[] = await handleResponse(response);
  return apiCategories.map(transformAPICategory);
};

export const fetchCurrentUser = async (): Promise<User> => {
  const res = await fetch("http://localhost:8000/api/me/", {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Not authenticated");
  return await res.json();
};

export const registerUser = async (registrationDetails: any): Promise<void> => {
  const response = await fetch("http://localhost:8000/api/register/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(registrationDetails),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.error || "Registration failed");
  }
};


export const fetchUserOrders = async (userId: number | string): Promise<OrderFromDB[]> => {
  if (!userId) {
    throw new Error("User ID is required to fetch orders");
  }
  
  const response = await fetch(`http://localhost:8000/api/orders/?userid=${userId}&history=true`, {
    credentials: "include", // Match the credentials pattern from fetchCurrentUser
  });
  
  return handleResponse<OrderFromDB[]>(response);
};