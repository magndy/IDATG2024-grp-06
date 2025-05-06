// src/components/ProductCard.tsx
import React from 'react';

// Define an interface for the product data we expect
// This should match the structure of your product data later (from backend/mock)
export interface Product {
  id: number | string; // Can be number or string depending on your backend
  name: string;
  description: string;
  price: number;
  imageUrl?: string; // Optional image URL
  // Add other fields as needed (e.g., brand, category, stock)
}

// Define the props for the ProductCard component
interface ProductCardProps {
  product: Product; // It expects a single 'product' object
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Fallback image if imageUrl is not provided
  const imageUrl = product.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image';

  // Placeholder function for adding to cart
  const handleAddToCart = () => {
    alert(`Added ${product.name} to cart! (ID: ${product.id})`);
    // Later, this will dispatch an action or call an API
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-lg bg-white flex flex-col">
      {/* Product Image */}
      <img
        src={imageUrl}
        alt={product.name}
        className="w-full h-48 object-cover" // Fixed height, object-cover prevents distortion
      />

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-grow"> {/* flex-grow makes body expand */}
        {/* Product Name */}
        <h3 className="text-lg font-semibold mb-2 text-gray-800">{product.name}</h3>

        {/* Product Description (Truncated) */}
        <p className="text-sm text-gray-600 mb-4 flex-grow"> {/* Truncate long descriptions */}
          {product.description.length > 100
            ? `${product.description.substring(0, 97)}...`
            : product.description}
        </p>

        {/* Price and Add to Cart Button */}
        <div className="mt-auto flex items-center justify-between"> {/* mt-auto pushes this to bottom */}
          <span className="text-xl font-bold text-gray-900">NOK {product.price.toFixed(2)}</span> {/* Format price */}
          <button
            onClick={handleAddToCart}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-200"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;