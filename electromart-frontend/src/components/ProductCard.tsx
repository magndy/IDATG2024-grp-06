// src/components/ProductCard.tsx
import React from "react";
import { Link } from "react-router-dom";
import { Product } from "../data/mockData";
import { useCart } from "../hooks/useCart";

interface ProductCardProps {
  product: Product;
  displayImageUrl?: string; // <-- Accept the prop
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  displayImageUrl,
}) => {
  // <-- Destructure prop

  const { addToCart } = useCart();
  // Use the passed-in prop or the fallback
  const imageUrl =
    displayImageUrl ||
    "https://png.pngtree.com/png-vector/20190820/ourmid/pngtree-no-image-vector-illustration-isolated-png-image_1694547.jpg"; // Use prop + fallback

  const handleAddToCart = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    event.preventDefault();
    addToCart(product);
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="border rounded-lg overflow-hidden shadow-lg bg-white flex flex-col hover:shadow-xl transition-shadow duration-200"
    >
      {/* Product Image */}
      <div className="w-full h-48 overflow-hidden">
        <img
          src={imageUrl} // <-- Use the final imageUrl variable
          alt={product.name}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-grow">
        {/* ... (rest of the card content: name, description, stock, price, button) ... */}
        {/* Product Name */}
        <h3 className="text-lg font-semibold mb-2 text-gray-800">
          {product.name}
        </h3>
        {/* Product Description */}
        <p className="text-sm text-gray-600 mb-4 flex-grow">
          {product.description.length > 100
            ? `${product.description.substring(0, 97)}...`
            : product.description}
        </p>
        {/* Stock Status */}
        <div className="text-sm mb-3">
          {product.isActive ? (
            product.stockQuantity > 0 ? (
              <span className="text-green-600 font-medium">In Stock</span>
            ) : (
              <span className="text-red-600 font-medium">Out of Stock</span>
            )
          ) : (
            <span className="text-gray-500 font-medium">Discontinued</span>
          )}
        </div>
        {/* Price and Button */}
        <div className="mt-auto flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">
            USD {product.price.toFixed(2)}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={!product.isActive || product.stockQuantity <= 0}
            className={`bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-200 z-10 relative ${
              !product.isActive || product.stockQuantity <= 0
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-700"
            }`}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
