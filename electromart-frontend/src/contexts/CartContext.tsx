// src/contexts/CartContext.tsx
import React, {
  createContext,
  useState,
  ReactNode,
  useMemo,
  useEffect,
} from "react";
import { Product } from "../data/models";

// Define the shape of an item in the cart
export interface CartItem extends Product {
  // Extends Product to include all its details
  quantity: number;
}

// Define the shape of the context value (state and functions)
export interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => void; // Simplified: adds 1 quantity
  removeFromCart: (productId: number | string) => void;
  updateQuantity: (productId: number | string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getCartTotal: () => number;
}

// --- localStorage Key ---
const CART_STORAGE_KEY = "electroMartCart"; // Choose a unique key

// --- Function to load initial state from localStorage ---
const getInitialCart = (): CartItem[] => {
  try {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);
      // Basic validation: check if it's an array
      if (Array.isArray(parsedCart)) {
        // TODO: Could add deeper validation here to ensure items match CartItem structure
        return parsedCart;
      }
    }
  } catch (error) {
    console.error("Failed to parse cart from localStorage:", error);
    // If parsing fails, clear the invalid item
    localStorage.removeItem(CART_STORAGE_KEY);
  }
  // Return empty array if nothing stored or parsing failed
  return [];
};

// Create the Context with a default value
// The '!' tells TypeScript we know this won't be null when accessed within the Provider
// eslint-disable-next-line react-refresh/only-export-components
export const CartContext = createContext<CartContextType>(null!);

// 5. Create the Provider Component
interface CartProviderProps {
  children: ReactNode; // To wrap around other components
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  // State to hold the array of cart items
  const [cartItems, setCartItems] = useState<CartItem[]>(getInitialCart);

  // --- useEffect to SAVE cart to localStorage whenever it changes ---
  useEffect(() => {
    try {
      // Stringify the cart state and save it
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error);
      // Handle potential errors like storage being full
    }
    // This effect runs every time the 'cartItems' state variable changes
  }, [cartItems]);

  // --- Core Cart Functions ---

  const addToCart = (product: Product) => {
    setCartItems((prevItems) => {
      // Check if item already exists
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        // If exists, map over items and increase quantity for the matching item
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // If new, add the product with quantity 1
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
    console.log(`Added ${product.name} to cart. Current items:`, cartItems); // Log for debugging
  };

  const removeFromCart = (productId: number | string) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId)
    );
    console.log(
      `Removed item ${productId} from cart. Current items:`,
      cartItems
    ); // Log for debugging
  };

  const updateQuantity = (productId: number | string, quantity: number) => {
    setCartItems((prevItems) => {
      if (quantity <= 0) {
        // If quantity is 0 or less, remove the item
        return prevItems.filter((item) => item.id !== productId);
      } else {
        // Otherwise, update the quantity
        return prevItems.map((item) =>
          item.id === productId ? { ...item, quantity: quantity } : item
        );
      }
    });
    console.log(
      `Updated quantity for item ${productId} to ${quantity}. Current items:`,
      cartItems
    ); // Log for debugging
  };

  const clearCart = () => {
    setCartItems([]);
    console.log("Cart cleared."); // Log for debugging
  };

  // --- Helper Functions (Calculated Values) ---

  // Use useMemo to optimize calculations that depend on cartItems
  const getItemCount = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const getCartTotal = useMemo(() => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }, [cartItems]);

  // --- Provide Context Value ---
  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    // Provide functions directly - they implicitly use the 'cartItems' state
    getItemCount: () => getItemCount, // Return the memoized value
    getCartTotal: () => getCartTotal, // Return the memoized value
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
