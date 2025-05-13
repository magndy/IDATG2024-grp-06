// src/pages/OrderConfirmationPage.tsx
import React from "react";
import { Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa"; // Using an icon

const OrderConfirmationPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4 md:p-8 text-center">
      <div className="bg-white p-10 rounded-lg shadow-md max-w-md mx-auto">
        <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-800 mb-3">Thank You!</h1>
        <p className="text-lg text-gray-600 mb-6">
          Your order has been placed successfully.
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Order summary
        </p>
        <Link
          to="/products" // Link back to products or home page
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded transition duration-200"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
