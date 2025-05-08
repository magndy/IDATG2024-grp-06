// src/pages/CheckoutPage.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
// import { Product, CartItem } from '../data/mockData'; // Example if needed

const CheckoutPage: React.FC = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  // --- State for Form Inputs ---
  // REMOVED shippingName state
  // ADDED shippingFirstName and shippingLastName state
  const [shippingFirstName, setShippingFirstName] = useState("");
  const [shippingLastName, setShippingLastName] = useState("");
  const [shippingStreet, setShippingStreet] = useState("");
  const [shippingCity, setShippingCity] = useState("");
  const [shippingPostalCode, setShippingPostalCode] = useState("");
  const [shippingCountry, setShippingCountry] = useState("Norway");
  const [shippingPhone, setShippingPhone] = useState("");
  const [email, setEmail] = useState("");

  // --- Handle Order Placement (Updated name fields) ---
  const handlePlaceOrder = async (event: React.FormEvent) => {
    event.preventDefault();

    const orderData = {
      contact: { email },
      address: {
        // CHANGED from name: shippingName
        firstName: shippingFirstName,
        lastName: shippingLastName,
        // --- End Change ---
        street: shippingStreet,
        city: shippingCity,
        postalCode: shippingPostalCode,
        country: shippingCountry,
        phone: shippingPhone,
      },
      items: cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        pricePerUnit: item.price,
      })),
      totalAmount: getCartTotal(),
    };

    console.log("--- Placing Order (Simulation) ---");
    console.log(
      "Order Data to be sent to backend:",
      JSON.stringify(orderData, null, 2)
    );

    alert(
      "Simulating order placement! Check the console for order data. You would normally send this to the backend now."
    );

    clearCart();
    navigate("/order-confirmation");
  };

  // Prevent checkout if cart is empty (remains the same)
  if (cartItems.length === 0) {
    // ... (empty cart JSX) ...
    return (
      <div className="container mx-auto p-10 text-center">
        <h1 className="text-xl font-semibold mb-4">Your cart is empty!</h1>
        <Link to="/products" className="text-blue-600 hover:underline">
          Continue Shopping
        </Link>
      </div>
    );
  }

  // --- Render Form (Updated name fields) ---
  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6 border-b pb-4">Checkout</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Forms Column */}
        <div className="lg:w-2/3">
          <form onSubmit={handlePlaceOrder}>
            {/* Contact Information (remains the same) */}
            <section className="mb-6">
              {/* ... email input ... */}
              <h2 className="text-xl font-semibold mb-3">
                Contact Information
              </h2>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  autoComplete="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </section>

            {/* Address Section (Name fields updated) */}
            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Address</h2>
              {/* --- UPDATED NAME FIELDS --- */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* First Name Field */}
                <div className="mb-4">
                  <label
                    htmlFor="shippingFirstName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="shippingFirstName"
                    name="shippingFirstName"
                    required
                    autoComplete="given-name" // Updated autocomplete
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    value={shippingFirstName}
                    onChange={(e) => setShippingFirstName(e.target.value)}
                  />
                </div>
                {/* Last Name Field */}
                <div className="mb-4">
                  <label
                    htmlFor="shippingLastName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="shippingLastName"
                    name="shippingLastName"
                    required
                    autoComplete="family-name" // Updated autocomplete
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    value={shippingLastName}
                    onChange={(e) => setShippingLastName(e.target.value)}
                  />
                </div>
              </div>
              {/* --- END UPDATED NAME FIELDS --- */}

              {/* Phone Number Field (Moved slightly for layout demo) */}
              <div className="mb-4">
                <label
                  htmlFor="shippingPhone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="shippingPhone"
                  name="shippingPhone"
                  required
                  autoComplete="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={shippingPhone}
                  onChange={(e) => setShippingPhone(e.target.value)}
                />
              </div>

              {/* Street Address Field (remains same) */}
              <div className="mb-4">
                {/* ... street input ... */}
                <label
                  htmlFor="shippingStreet"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Street Address
                </label>
                <input
                  type="text"
                  id="shippingStreet"
                  name="shippingStreet"
                  required
                  autoComplete="street-address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={shippingStreet}
                  onChange={(e) => setShippingStreet(e.target.value)}
                />
              </div>
              {/* City/Postal/Country Grid (remains same) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* ... city input ... */}
                <div className="mb-4">
                  <label
                    htmlFor="shippingCity"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {" "}
                    City{" "}
                  </label>
                  <input
                    type="text"
                    id="shippingCity"
                    name="shippingCity"
                    required
                    autoComplete="address-level2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    value={shippingCity}
                    onChange={(e) => setShippingCity(e.target.value)}
                  />
                </div>
                {/* ... postal code input ... */}
                <div className="mb-4">
                  <label
                    htmlFor="shippingPostalCode"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {" "}
                    Postal Code{" "}
                  </label>
                  <input
                    type="text"
                    id="shippingPostalCode"
                    name="shippingPostalCode"
                    required
                    autoComplete="postal-code"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    value={shippingPostalCode}
                    onChange={(e) => setShippingPostalCode(e.target.value)}
                  />
                </div>
                {/* ... country input ... */}
                <div className="mb-4">
                  <label
                    htmlFor="shippingCountry"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {" "}
                    Country{" "}
                  </label>
                  <input
                    type="text"
                    id="shippingCountry"
                    name="shippingCountry"
                    required
                    autoComplete="country-name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
                    value={shippingCountry}
                    onChange={(e) => setShippingCountry(e.target.value)}
                  />
                </div>
              </div>
            </section>

            {/* Place Order Button */}
            <div className="mt-8 pt-6 border-t">
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded transition duration-200 text-lg"
              >
                Place Order (Simulated)
              </button>
            </div>
          </form>{" "}
          {/* End Form */}
        </div>
        {/* Order Summary Column (remains the same) */}
        <div className="lg:w-1/3">
          {/* ... order summary JSX ... */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm sticky top-28">
            <h2 className="text-xl font-semibold mb-4 border-b pb-3">
              {" "}
              Order Summary{" "}
            </h2>
            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center text-sm"
                >
                  <span className="text-gray-600">
                    {item.name} x {item.quantity}
                  </span>
                  <span className="text-gray-800 font-medium">
                    USD {(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between font-semibold text-base">
                <span>Total</span>
                <span>USD {getCartTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>{" "}
        {/* End Order Summary */}
      </div>{" "}
      {/* End Flex Container */}
    </div> // End Main Container
  );
};

export default CheckoutPage;
