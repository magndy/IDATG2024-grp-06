// src/hooks/useCart.ts
import { useContext } from 'react';
// Adjust the path based on your folder structure
import { CartContext, CartContextType } from '../contexts/CartContext';

// Export the hook from here
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === null) {
    // This error check is important!
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};