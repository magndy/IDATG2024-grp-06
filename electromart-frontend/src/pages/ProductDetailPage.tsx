import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Product } from "../data/models";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useCart } from "../hooks/useCart";
import { fetchProducts } from "../services/apiService";

const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId?: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddedFeedback, setShowAddedFeedback] = useState(false);

  const { addToCart } = useCart();

  useEffect(() => {
    if (!productId) {
      setError("Product ID is missing.");
      setIsLoading(false);
      return;
    }

    const loadProduct = async () => {
      try {
        const allProducts = await fetchProducts();
        const foundProduct = allProducts.find(
          (p) => p.id.toString() === productId
        );

        if (!foundProduct) {
          setError("Product not found.");
          setProduct(null);
        } else {
          setProduct(foundProduct);
          setError(null);
        }
      } catch (e) {
        console.error("Failed to load product:", e);
        setError(e instanceof Error ? e.message : "Failed to load data");
      } finally {
        setIsLoading(false);
        setCurrentImageIndex(0);
        setShowAddedFeedback(false);
      }
    };

    loadProduct();
  }, [productId]);

  const goToPreviousImage = () => {
    if (!product || product.allImages.length <= 1) return;
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? product.allImages.length - 1 : prevIndex - 1
    );
  };

  const goToNextImage = () => {
    if (!product || product.allImages.length <= 1) return;
    setCurrentImageIndex((prevIndex) =>
      prevIndex === product.allImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const displayImageUrl =
    product?.allImages[currentImageIndex]?.imageUrl ??
    "https://via.placeholder.com/600x400?text=No+Image+Available";

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product);
    setShowAddedFeedback(true);
    setTimeout(() => setShowAddedFeedback(false), 2000);
  };

  const isDisabled =
    !product?.isActive || (product?.stockQuantity ?? 0) <= 0;

  if (isLoading) {
    return <div className="text-center p-10">Loading product details...</div>;
  }

  if (error) {
    return (
      <div className="text-center p-10 text-red-600">
        Error: {error}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Product Not Found
        </h1>
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

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <Link to="/products" className="text-blue-600 hover:underline">
          &larr; Back to Products
        </Link>
      </div>

      <div className="md:flex md:space-x-8">
        {/* --- Product Image Section --- */}
        <div className="md:w-1/2 mb-6 md:mb-0 relative group aspect-square overflow-hidden rounded-lg shadow-md">
          <img
            src={displayImageUrl}
            alt={`${product.name} - Image ${currentImageIndex + 1}`}
            className="w-full h-full object-contain"
          />
          {product.allImages.length > 1 && (
            <>
              <button
                onClick={goToPreviousImage}
                className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-800 bg-opacity-40 text-white p-2 rounded-full hover:bg-blue-600 transition duration-200 focus:outline-none z-10"
                aria-label="Previous Image"
              >
                <FaChevronLeft size={20} />
              </button>
              <button
                onClick={goToNextImage}
                className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-800 bg-opacity-40 text-white p-2 rounded-full hover:bg-blue-600 transition duration-200 focus:outline-none z-10"
                aria-label="Next Image"
              >
                <FaChevronRight size={20} />
              </button>
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded z-10">
                {currentImageIndex + 1} / {product.allImages.length}
              </div>
            </>
          )}
        </div>

        {/* --- Product Info Section --- */}
        <div className="md:w-1/2">
          <p className="text-sm text-gray-500 mb-2">
            Brand: {product.brandName}
          </p>
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
              USD {product.price.toFixed(2)}
            </span>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={isDisabled || showAddedFeedback}
            className={`w-full text-white font-bold py-3 px-6 rounded transition-all duration-200 text-lg ${
              isDisabled
                ? "bg-gray-400 opacity-50 cursor-not-allowed"
                : showAddedFeedback
                ? "bg-green-500 hover:bg-green-600 cursor-default"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isDisabled
              ? product.stockQuantity <= 0
                ? "Out of Stock"
                : "Unavailable"
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
