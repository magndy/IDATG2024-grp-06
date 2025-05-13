// src/pages/ProductDetailPage.tsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Product,
  ProductImage,
  Brand
} from "../data/models";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useCart } from "../hooks/useCart";
import {
  fetchProducts,
  fetchProductImages,
  fetchBrands,
} from "../services/apiService";

const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId?: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [brand, setBrand] = useState<Brand | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // --- Step 1: Add state for button feedback ---
  const [showAddedFeedback, setShowAddedFeedback] = useState(false);

  const { addToCart } = useCart();

  useEffect(() => {
    if (!productId) {
      setError("Product ID is missing.");
      setIsLoading(false);
      return;
    }

    const loadProductDetails = async () => {
      setIsLoading(true);
      setError(null);
      setProduct(null);
      setImages([]);
      setBrand(undefined);
      setCurrentImageIndex(0);
      setShowAddedFeedback(false); // Reset feedback when loading new product

      try {
        const [allProducts, allImages, allBrands] = await Promise.all([
          fetchProducts(),
          fetchProductImages(),
          fetchBrands()
        ]);

        const foundProduct = allProducts.find(p => p.id.toString() === productId);

        if (!foundProduct) {
          setProduct(null);
        } else {
          setProduct(foundProduct);
          const foundImages = allImages.filter(img => img.productId.toString() === foundProduct.id.toString());
          setImages(foundImages);
          const foundBrand = allBrands.find(b => b.id === foundProduct.brandId);
          setBrand(foundBrand);
        }
      } catch (e) {
        console.error("Failed to load product details:", e);
        setError(e instanceof Error ? e.message : 'Failed to load data');
        setProduct(null);
        setImages([]);
        setBrand(undefined);
      } finally {
        setIsLoading(false);
      }
    };

    loadProductDetails();
  }, [productId]);

  const goToPreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      images.length === 0 ? 0 : prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      images.length === 0 ? 0 : prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const displayImageUrl =
    images[currentImageIndex]?.imageUrl ||
    "https://via.placeholder.com/600x400?text=No+Image+Available";

  if (isLoading) {
    return <div className="text-center p-10">Loading product details...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-600">Error: {error}</div>;
  }

  if (!product) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Product Not Found</h1>
        <p className="text-gray-600 mb-6">
          Sorry, we couldn't find the product you were looking for (ID: {productId}).
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

  // --- Step 2: Modify handleAddToCart ---
  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      setShowAddedFeedback(true);
      setTimeout(() => {
        setShowAddedFeedback(false);
      }, 2000); // Reset feedback after 2 seconds
    } else {
      console.error("Cannot add to cart: Product data not loaded yet.");
    }
  };

  // Determine if the button should be truly disabled
  const isDisabled = !product.isActive || product.stockQuantity <= 0;

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <Link to="/products" className="text-blue-600 hover:underline">
          &larr; Back to Products
        </Link>
      </div>

      <div className="md:flex md:space-x-8">
        <div className="md:w-1/2 mb-6 md:mb-0 relative group aspect-square overflow-hidden rounded-lg shadow-md">
          <img
            src={displayImageUrl}
            alt={`${product.name} - Image ${currentImageIndex + 1}`}
            className="w-full h-full object-contain"
          />
          {images.length > 1 && (
            <>
              <button onClick={goToPreviousImage}
                className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-800 bg-opacity-40 text-white p-2 rounded-full hover:bg-blue-600 transition duration-200 focus:outline-none z-10"
                aria-label="Previous Image"
              >
                <FaChevronLeft size={20} />
              </button>
              <button onClick={goToNextImage}
                className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-800 bg-opacity-40 text-white p-2 rounded-full hover:bg-blue-600 transition duration-200 focus:outline-none z-10"
                aria-label="Next Image"
              >
                <FaChevronRight size={20} />
              </button>
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded z-10">
                {currentImageIndex + 1} / {images.length}
              </div>
            </>
          )}
        </div>

        <div className="md:w-1/2">
          {brand && (
            <p className="text-sm text-gray-500 mb-2">Brand: {brand.name}</p>
          )}
          <h1 className="text-3xl font-bold mb-4 text-gray-800">
            {product.name}
          </h1>
          <p className="text-gray-600 mb-6 text-base leading-relaxed">
            {product.description}
          </p>
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
            {product.isActive && product.stockQuantity > 0 && product.stockQuantity <= 5 && (
              <span className="text-yellow-600 ml-2">({product.stockQuantity} left)</span>
            )}
          </div>
          <div className="mb-6">
            <span className="text-3xl font-bold text-gray-900">
              USD {product.price.toFixed(2)} {/* Using USD as requested */}
            </span>
          </div>
          {/* --- Step 3: Update Button JSX --- */}
          <button
            onClick={handleAddToCart}
            disabled={isDisabled || showAddedFeedback} // Also disable during feedback
            className={`w-full text-white font-bold py-3 px-6 rounded transition-all duration-200 text-lg ${
              isDisabled
                ? "bg-gray-400 opacity-50 cursor-not-allowed"
                : showAddedFeedback
                ? "bg-green-500 hover:bg-green-600 cursor-default"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isDisabled
              ? product.stockQuantity <= 0 ? "Out of Stock" : "Unavailable"
              : showAddedFeedback
              ? "Added to Cart ✔"
              : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;