// src/pages/ProductDetailPage.tsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  mockProducts,
  mockProductImages, // <--- Add this
  mockBrands, // <--- Add this if displaying brand name
  Product, // <--- Ensure Product type is imported
  ProductImage, // <--- Add this type
} from "../data/mockData";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId?: string }>();
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // State for image index

  // --- Navigation Functions ---
  const goToPreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? productImages.length - 1 : prevIndex - 1
    );
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === productImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Add ': Product | undefined' after 'product'
  const product: Product | undefined = React.useMemo(() => {
    if (!productId) return undefined;
    // Find product where ID matches the parameter (handle string/number comparison)
    return mockProducts.find((p) => p.id.toString() === productId);
  }, [productId]);

  // Find associated images
  const productImages = React.useMemo(() => {
    if (!product) return [];
    // --- FIX 2: Explicitly type 'img' ---
    return mockProductImages.filter(
      (img: ProductImage) => img.productId.toString() === product.id.toString()
    );
  }, [product]);

  // --- Reset index when product changes ---
  useEffect(() => {
    setCurrentImageIndex(0); // Reset to the first image when the product loads/changes
  }, [product]); // Dependency array ensures this runs when 'product' updates

  const displayImageUrl =
    productImages[currentImageIndex]?.imageUrl || // Uses current index state
    "https://www.ict.eu/sites/corporate/files/images/ICT_Electronics_website_header.jpg";

  if (!product) {
    // ... (Not Found JSX remains the same) ...
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Product Not Found
        </h1>
        <p className="text-gray-600 mb-6">
          Sorry, we couldn't find the product you were looking for.
        </p>
        <Link
          to="/products"
          className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition duration-200"
        >
          Back to Products
        </Link>
      </div>
    );
  }

  // --- Get Brand Name (Optional) ---
  const brand = mockBrands.find((b) => b.id === product.brandId);

  // Placeholder Add to Cart handler
  const handleAddToCart = () => {
    alert(
      `Added ${product.name} to cart from detail page! (ID: ${product.id})`
    );
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <Link to="/products" className="text-blue-600 hover:underline">
          &larr; Back to Products
        </Link>
      </div>

      <div className="md:flex md:space-x-8">
        {/* Product Image Container */}
        <div className="md:w-1/2 mb-6 md:mb-0 relative group aspect-auto overflow-hidden rounded-lg shadow-md">
          {" "}
          {/* Added relative and group */}
          <img
            src={displayImageUrl} // Use the state-driven URL
            alt={`${product.name} - Image ${currentImageIndex + 1}`} // More descriptive alt text
            className="w-full h-full object-cover"
          />
          {/* --- Navigation Arrows --- */}
          {productImages.length > 1 && ( // Only show arrows if multiple images
            <>
              {/* Left Arrow */}
              <button
                onClick={goToPreviousImage}
                className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black bg-opacity-40 text-white p-2 rounded-full hover:bg-opacity-60 transition duration-200 focus:outline-none opacity-0 group-hover:opacity-100" // Appear on hover
                aria-label="Previous Image"
              >
                <FaChevronLeft size={20} /> {/* Icon */}
              </button>

              {/* Right Arrow */}
              <button
                onClick={goToNextImage}
                className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black bg-opacity-40 text-white p-2 rounded-full hover:bg-opacity-60 transition duration-200 focus:outline-none opacity-0 group-hover:opacity-100" // Appear on hover
                aria-label="Next Image"
              >
                <FaChevronRight size={20} /> {/* Icon */}
              </button>
            </>
          )}
          {/* Optional: Image index indicator */}
          {productImages.length > 1 && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
              {currentImageIndex + 1} / {productImages.length}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="md:w-1/2">
          {/* Optional: Display Brand Name */}
          {brand && (
            <p className="text-sm text-gray-500 mb-2">Brand: {brand.name}</p>
          )}

          <h1 className="text-3xl font-bold mb-4 text-gray-800">
            {product.name}
          </h1>
          <p className="text-gray-600 mb-6 text-base leading-relaxed">
            {product.description}
          </p>

          {/* --- ADDED: Stock Status Display --- */}
          <div className="mb-4 text-lg">
            {product.isActive ? (
              product.stockQuantity > 0 ? (
                <span className="text-green-700 font-semibold">In Stock</span>
              ) : (
                <span className="text-red-700 font-semibold">Out of Stock</span>
              )
            ) : (
              <span className="text-gray-500 font-semibold">Discontinued</span>
            )}
            {/* Optionally show quantity if low */}
            {product.isActive &&
              product.stockQuantity > 0 &&
              product.stockQuantity <= 5 && (
                <span className="text-yellow-600 ml-2">
                  ({product.stockQuantity} left)
                </span>
              )}
          </div>

          <div className="mb-6">
            <span className="text-3xl font-bold text-gray-900">
              NOK {product.price.toFixed(2)}
            </span>
          </div>

          {/* --- ADDED: Disabled logic to button --- */}
          <button
            onClick={handleAddToCart}
            disabled={!product.isActive || product.stockQuantity <= 0} // Disable logic
            className={`w-full bg-blue-600 text-white font-bold py-3 px-6 rounded transition duration-200 text-lg ${
              !product.isActive || product.stockQuantity <= 0
                ? "opacity-50 cursor-not-allowed" // Disabled styles
                : "hover:bg-blue-700" // Hover only when enabled
            }`}
          >
            Add to Cart
          </button>

          {/* TODO: Add other details like Specs later */}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
