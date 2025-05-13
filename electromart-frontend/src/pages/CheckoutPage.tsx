// src/pages/CheckoutPage.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";

// --- Type for our errors state object ---
interface CheckoutErrors {
  email?: string;
  shippingFirstName?: string;
  shippingLastName?: string;
  shippingPhone?: string;
  shippingStreet?: string;
  shippingPostalCode?: string;
  shippingCity?: string;
  shippingCountry?: string;
  form?: string; // For general form errors
}

// --- Validation Helper Functions (can be moved to a utils file) ---
const validateEmail = (email: string): string | undefined => {
  if (!email.trim()) return "Email is required.";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Invalid email format.";
  return undefined;
};

const isNumeric = (value: string): boolean => /^\d+$/.test(value);

const validatePhone = (phone: string): string | undefined => {
  if (!phone.trim()) return "Phone number is required.";
  if (!isNumeric(phone)) return "Phone number must contain only digits.";
  // Add more specific phone length/format checks if needed
  return undefined;
};

const validatePostalCode = (postalCode: string): string | undefined => {
  if (!postalCode.trim()) return "Postal code is required.";
  if (!isNumeric(postalCode)) return "Postal code must contain only digits.";
  // Add more specific postal code length/format checks if needed
  return undefined;
};


const CheckoutPage: React.FC = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  // --- State for Form Inputs ---
  const [shippingFirstName, setShippingFirstName] = useState("");
  const [shippingLastName, setShippingLastName] = useState("");
  const [shippingStreet, setShippingStreet] = useState("");
  const [shippingCity, setShippingCity] = useState("");
  const [shippingPostalCode, setShippingPostalCode] = useState("");
  const [shippingCountry, setShippingCountry] = useState("Norway");
  const [shippingPhone, setShippingPhone] = useState("");
  const [email, setEmail] = useState("");

  // --- Error State ---
  const [errors, setErrors] = useState<CheckoutErrors>({});


  const handlePlaceOrder = async (event: React.FormEvent) => {
    event.preventDefault();
    const newErrors: CheckoutErrors = {};

    // --- Perform Validations ---
    const emailError = validateEmail(email);
    if (emailError) newErrors.email = emailError;

    if (!shippingFirstName.trim()) newErrors.shippingFirstName = "First name is required.";
    if (!shippingLastName.trim()) newErrors.shippingLastName = "Last name is required.";

    const phoneError = validatePhone(shippingPhone);
    if (phoneError) newErrors.shippingPhone = phoneError;

    if (!shippingStreet.trim()) newErrors.shippingStreet = "Street address is required.";

    const postalCodeError = validatePostalCode(shippingPostalCode);
    if (postalCodeError) newErrors.shippingPostalCode = postalCodeError;

    if (!shippingCity.trim()) newErrors.shippingCity = "City is required.";
    if (!shippingCountry.trim()) newErrors.shippingCountry = "Country is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({}); // Clear errors if all pass

    // --- Collect Data (remains the same) ---
    const orderData = {
      contact: { email },
      address: {
        firstName: shippingFirstName,
        lastName: shippingLastName,
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
    console.log("Order Data to be sent to backend:", JSON.stringify(orderData, null, 2));
    alert("Simulating order placement! Check the console for order data.");

    clearCart();
    navigate("/order-confirmation");
  };

  // Prevent checkout if cart is empty
  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto p-10 text-center">
        <h1 className="text-xl font-semibold mb-4">Your cart is empty!</h1>
        <Link to="/products" className="text-blue-600 hover:underline">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6 border-b pb-4">Checkout</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Forms Column */}
        <div className="lg:w-2/3">
          <form onSubmit={handlePlaceOrder} className="space-y-6" noValidate>
            {errors.form && (
                <div className="p-3 bg-red-100 text-red-700 border border-red-400 rounded">
                    {errors.form}
                </div>
            )}
            {/* Contact Information */}
            <section>
              <h2 className="text-xl font-semibold mb-3">Contact Information</h2>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input type="email" id="email" name="email" required autoComplete="email"
                       className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                       value={email} onChange={(e) => {setEmail(e.target.value); if(errors.email) setErrors(prev => ({...prev, email: undefined}))}} />
                {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
              </div>
            </section>

            {/* Address Section */}
            <section>
              <h2 className="text-xl font-semibold mb-3">Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="shippingFirstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input type="text" id="shippingFirstName" name="shippingFirstName" required autoComplete="given-name"
                         className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${errors.shippingFirstName ? 'border-red-500' : 'border-gray-300'}`}
                         value={shippingFirstName} onChange={(e) => {setShippingFirstName(e.target.value); if(errors.shippingFirstName) setErrors(prev => ({...prev, shippingFirstName: undefined}))}} />
                  {errors.shippingFirstName && <p className="text-xs text-red-600 mt-1">{errors.shippingFirstName}</p>}
                </div>
                <div>
                  <label htmlFor="shippingLastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input type="text" id="shippingLastName" name="shippingLastName" required autoComplete="family-name"
                         className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${errors.shippingLastName ? 'border-red-500' : 'border-gray-300'}`}
                         value={shippingLastName} onChange={(e) => {setShippingLastName(e.target.value); if(errors.shippingLastName) setErrors(prev => ({...prev, shippingLastName: undefined}))}} />
                  {errors.shippingLastName && <p className="text-xs text-red-600 mt-1">{errors.shippingLastName}</p>}
                </div>
              </div>
              <div className="mt-4">
                <label htmlFor="shippingPhone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input type="tel" id="shippingPhone" name="shippingPhone" required autoComplete="tel"
                       className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${errors.shippingPhone ? 'border-red-500' : 'border-gray-300'}`}
                       value={shippingPhone} onChange={(e) => {setShippingPhone(e.target.value); if(errors.shippingPhone) setErrors(prev => ({...prev, shippingPhone: undefined}))}} />
                {errors.shippingPhone && <p className="text-xs text-red-600 mt-1">{errors.shippingPhone}</p>}
              </div>
              <div className="mt-4">
                <label htmlFor="shippingStreet" className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                <input type="text" id="shippingStreet" name="shippingStreet" required autoComplete="street-address"
                       className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${errors.shippingStreet ? 'border-red-500' : 'border-gray-300'}`}
                       value={shippingStreet} onChange={(e) => {setShippingStreet(e.target.value); if(errors.shippingStreet) setErrors(prev => ({...prev, shippingStreet: undefined}))}} />
                {errors.shippingStreet && <p className="text-xs text-red-600 mt-1">{errors.shippingStreet}</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <label htmlFor="shippingPostalCode" className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                  <input type="text" id="shippingPostalCode" name="shippingPostalCode" required autoComplete="postal-code"
                         className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${errors.shippingPostalCode ? 'border-red-500' : 'border-gray-300'}`}
                         value={shippingPostalCode} onChange={(e) => {setShippingPostalCode(e.target.value); if(errors.shippingPostalCode) setErrors(prev => ({...prev, shippingPostalCode: undefined}))}} />
                  {errors.shippingPostalCode && <p className="text-xs text-red-600 mt-1">{errors.shippingPostalCode}</p>}
                </div>
                <div>
                  <label htmlFor="shippingCity" className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input type="text" id="shippingCity" name="shippingCity" required autoComplete="address-level2"
                         className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${errors.shippingCity ? 'border-red-500' : 'border-gray-300'}`}
                         value={shippingCity} onChange={(e) => {setShippingCity(e.target.value); if(errors.shippingCity) setErrors(prev => ({...prev, shippingCity: undefined}))}} />
                  {errors.shippingCity && <p className="text-xs text-red-600 mt-1">{errors.shippingCity}</p>}
                </div>
                <div>
                  <label htmlFor="shippingCountry" className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input type="text" id="shippingCountry" name="shippingCountry" required autoComplete="country-name"
                         className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 ${errors.shippingCountry ? 'border-red-500' : 'border-gray-300'}`}
                         value={shippingCountry} onChange={(e) => {setShippingCountry(e.target.value); if(errors.shippingCountry) setErrors(prev => ({...prev, shippingCountry: undefined}))}} />
                  {errors.shippingCountry && <p className="text-xs text-red-600 mt-1">{errors.shippingCountry}</p>}
                </div>
              </div>
            </section>

            {/* Place Order Button */}
            <div className="mt-8 pt-6 border-t">
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded transition duration-200 text-lg"
              >
                Place Order
              </button>
            </div>
          </form>
        </div>

        {/* Order Summary Column (remains the same) */}
        <div className="lg:w-1/3">
          {/* ... order summary JSX ... */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm sticky top-28">
            <h2 className="text-xl font-semibold mb-4 border-b pb-3">Order Summary</h2>
            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">{item.name} x {item.quantity}</span>
                  <span className="text-gray-800 font-medium">USD {(item.price * item.quantity).toFixed(2)}</span>
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
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;