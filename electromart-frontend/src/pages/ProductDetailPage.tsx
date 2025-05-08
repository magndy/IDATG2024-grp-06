// src/pages/ProductDetailPage.tsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
// --- Import only TYPES ---
import {
  Product,
  ProductImage,
  Brand
} from "../data/mockData"; // Assuming mock data arrays are removed from here
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"; // Icon import
import { useCart } from "../hooks/useCart";

const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId?: string }>();

  // --- State Variables ---
  const [product, setProduct] = useState<Product | null>(null);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [brand, setBrand] = useState<Brand | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { addToCart } = useCart();

  // --- useEffect to Fetch All Data ---
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

      try {
        const [productsResponse, imagesResponse, brandsResponse] = await Promise.all([
          fetch('/mock-data/products.json'),
          fetch('/mock-data/productImages.json'),
          fetch('/mock-data/brands.json')
        ]);

        // Check all responses were successful
        if (!productsResponse.ok) throw new Error(`Failed to load products: ${productsResponse.statusText} (${productsResponse.status})`);
        if (!imagesResponse.ok) throw new Error(`Failed to load images: ${imagesResponse.statusText} (${imagesResponse.status})`);
        if (!brandsResponse.ok) throw new Error(`Failed to load brands: ${brandsResponse.statusText} (${brandsResponse.status})`);

        // Parse all JSON data
        const allProducts: Product[] = await productsResponse.json();
        const allImages: ProductImage[] = await imagesResponse.json();
        const allBrands: Brand[] = await brandsResponse.json();

        // Find the specific product
        const foundProduct = allProducts.find(p => p.id.toString() === productId);

        if (!foundProduct) {
          setProduct(null); // Explicitly set to null for "Not Found" state
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
  }, [productId]); // Dependency: Re-run if productId changes

  // --- Slideshow Navigation Functions ---
  const goToPreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      // Check images.length BEFORE calculating next index
      images.length === 0 ? 0 : // Avoid NaN/errors if no images
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      // Check images.length BEFORE calculating next index
      images.length === 0 ? 0 : // Avoid NaN/errors if no images
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Calculate the URL for the currently selected image
  const displayImageUrl =
    images[currentImageIndex]?.imageUrl || // Use image from 'images' state based on current index
    "https://via.placeholder.com/600x400?text=No+Image+Available"; // Fallback

  // --- Render Logic ---

  if (isLoading) {
    return <div className="text-center p-10">Loading product details...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-600">Error: {error}</div>;
  }

  if (!product) {
    // This state means loading finished, no error occurred, but the product wasn't found
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

  // --- Product Found - Render Details ---

  const handleAddToCart = () => {
    // Ensure product is loaded before adding
    if (product) {
      // alert(`Added ${product.name} to cart from detail page! (ID: ${product.id})`); // <-- REMOVE THIS
      addToCart(product); // <-- ADD THIS: Call the function from context
      // Optional: Add visual feedback
    } else {
      console.error("Cannot add to cart: Product data not loaded yet.");
      // Optional: Show an error to the user
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Back Link */}
      <div className="mb-4">
        <Link to="/products" className="text-blue-600 hover:underline">
          &larr; Back to Products
        </Link>
      </div>

      {/* Main Content Grid */}
      <div className="md:flex md:space-x-8">

        {/* Image Column */}
        <div className="md:w-1/2 mb-6 md:mb-0 relative group aspect-square overflow-hidden rounded-lg shadow-md">
          {/* Main Image */}
          <img
            src={displayImageUrl}
            alt={`${product.name} - Image ${currentImageIndex + 1}`}
            className="w-full h-full object-contain"
          />

          {/* Navigation Arrows - Conditionally render ONLY if multiple images */}
          {images.length > 1 && (
            <>
              {/* Left Arrow Button */}
              <button
                onClick={goToPreviousImage}
                // --- FULL CLASSNAME - Always Visible ---
                className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-800 bg-opacity-40 text-white p-2 rounded-full hover:bg-blue-600 transition duration-200 focus:outline-none z-10"
                aria-label="Previous Image"
              >
                <FaChevronLeft size={20} />
              </button>

              {/* Right Arrow Button */}
              <button
                onClick={goToNextImage}
                 // --- FULL CLASSNAME - Always Visible ---
                 className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-800 bg-opacity-40 text-white p-2 rounded-full hover:bg-blue-600 transition duration-200 focus:outline-none z-10"
                aria-label="Next Image"
              >
                <FaChevronRight size={20} />
              </button>

              {/* Image index indicator */}
               <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded z-10"> {/* Added z-10 */}
                 {currentImageIndex + 1} / {images.length}
               </div>
            </>
          )}
        </div>

        {/* Info Column */}
        <div className="md:w-1/2">
          {/* Brand */}
          {brand && (
            <p className="text-sm text-gray-500 mb-2">Brand: {brand.name}</p>
          )}
          {/* Name */}
          <h1 className="text-3xl font-bold mb-4 text-gray-800">
            {product.name}
          </h1>
          {/* Description */}
          <p className="text-gray-600 mb-6 text-base leading-relaxed">
            {product.description}
          </p>
          {/* Stock Status */}
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
          {/* Price */}
          <div className="mb-6">
            <span className="text-3xl font-bold text-gray-900">
              NOK {product.price.toFixed(2)}
            </span>
          </div>
          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={!product.isActive || product.stockQuantity <= 0}
            className={`w-full bg-blue-600 text-white font-bold py-3 px-6 rounded transition duration-200 text-lg ${
              !product.isActive || product.stockQuantity <= 0
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-700"
            }`}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;