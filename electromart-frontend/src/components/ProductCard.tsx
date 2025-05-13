// src/components/ProductCard.tsx
import React, { useState } from "react"; // Ensure useState is imported
import { Link } from "react-router-dom";
import { Product } from "../data/mockData";
import { useCart } from "../hooks/useCart";

interface ProductCardProps {
  product: Product;
  displayImageUrl?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  displayImageUrl,
}) => {
  const { addToCart } = useCart();
  // --- Step 2: Add local state for feedback ---
  const [showAddedFeedback, setShowAddedFeedback] = useState(false);

  const imageUrl =
    displayImageUrl ||
    "https://png.pngtree.com/png-vector/20190820/ourmid/pngtree-no-image-vector-illustration-isolated-png-image_1694547.jpg";

  // --- Step 3: Modify handleAddToCart ---
  const handleAddToCart = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    event.preventDefault();
    addToCart(product);

    // Show feedback
    setShowAddedFeedback(true);
    // Reset feedback after 2 seconds (2000 milliseconds)
    setTimeout(() => {
      setShowAddedFeedback(false);
    }, 2000);
  };

  // Determine if the button should be truly disabled (ignoring feedback state)
  const isDisabled = !product.isActive || product.stockQuantity <= 0;

  return (
    <Link
      to={`/product/${product.id}`}
      className="border rounded-lg overflow-hidden shadow-lg bg-white flex flex-col hover:shadow-xl transition-shadow duration-200"
    >
      {/* Product Image */}
      <div className="w-full h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-grow">
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
          {/* --- Step 4: Update Button JSX --- */}
          <button
            onClick={handleAddToCart}
            disabled={isDisabled || showAddedFeedback} // Disable while showing feedback too
            className={`text-white font-semibold py-2 px-4 rounded transition-all duration-200 z-10 relative ${
              isDisabled
                ? "bg-gray-400 opacity-50 cursor-not-allowed" // Disabled style takes precedence
                : showAddedFeedback
                ? "bg-green-500 hover:bg-green-600 cursor-default" // Feedback style
                : "bg-blue-600 hover:bg-blue-700" // Default style
            }`}
          >
            {isDisabled
              ? product.stockQuantity <= 0 ? "Out of Stock" : "Unavailable" // More specific disabled text
              : showAddedFeedback
              ? "Added ✔"
              : "Add to Cart"}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;