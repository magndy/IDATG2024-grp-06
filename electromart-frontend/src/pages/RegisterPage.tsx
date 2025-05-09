// src/pages/RegisterPage.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const RegisterPage: React.FC = () => {
  // --- Updated State for More Fields ---
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('Norway'); // Default

  const [localError, setLocalError] = useState<string | null>(null);
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLocalError(null);

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }

    // Collect all registration data
    const registrationDetails = {
      firstName,
      lastName,
      email,
      password, // In a real app, only send password if setting it, not if just creating profile
      phone,
      address: {
        line: addressLine,
        postalCode,
        city,
        country,
      }
    };

    console.log("--- Attempting Registration (Simulation) ---");
    console.log("Full Registration Details:", JSON.stringify(registrationDetails, null, 2));

    try {
      // Call the placeholder register function from AuthContext.
      // It currently expects (name, email, password). We'll pass a combined name.
      // A real backend would handle all the fields in registrationDetails.
      await register(`${firstName} ${lastName}`, email, password);

      alert("Registration successful (simulated)! Please login.");
      navigate('/login');
    } catch (err) {
      console.error("Registration simulation error:", err);
      setLocalError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 flex justify-center items-start mt-10 mb-10">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md"> {/* Increased max-w-lg */}
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Create Your Account</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {localError && (
            <div className="p-3 bg-red-100 text-red-700 border border-red-400 rounded">
              {localError}
            </div>
          )}

          {/* Personal Details Section */}
          <fieldset className="border p-4 rounded-md">
            <legend className="text-lg font-semibold px-2 text-gray-700">Personal Details</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input type="text" id="firstName" name="firstName" required autoComplete="given-name"
                       className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                       value={firstName} onChange={(e) => setFirstName(e.target.value)} disabled={isLoading} />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input type="text" id="lastName" name="lastName" required autoComplete="family-name"
                       className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                       value={lastName} onChange={(e) => setLastName(e.target.value)} disabled={isLoading} />
              </div>
            </div>
            <div className="mt-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input type="email" id="email" name="email" required autoComplete="email"
                     className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                     value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} />
            </div>
            <div className="mt-4">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input type="tel" id="phone" name="phone" required autoComplete="tel"
                     className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                     value={phone} onChange={(e) => setPhone(e.target.value)} disabled={isLoading} />
            </div>
          </fieldset>

          {/* Address Section */}
          <fieldset className="border p-4 rounded-md">
            <legend className="text-lg font-semibold px-2 text-gray-700">Address</legend>
            <div className="mt-2">
              <label htmlFor="addressLine" className="block text-sm font-medium text-gray-700 mb-1">Address Line</label>
              <input type="text" id="addressLine" name="addressLine" required autoComplete="street-address"
                     className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                     value={addressLine} onChange={(e) => setAddressLine(e.target.value)} disabled={isLoading} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                <input type="text" id="postalCode" name="postalCode" required autoComplete="postal-code"
                       className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                       value={postalCode} onChange={(e) => setPostalCode(e.target.value)} disabled={isLoading} />
              </div>
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input type="text" id="city" name="city" required autoComplete="address-level2"
                       className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                       value={city} onChange={(e) => setCity(e.target.value)} disabled={isLoading} />
              </div>
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input type="text" id="country" name="country" required autoComplete="country-name"
                       className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
                       value={country} onChange={(e) => setCountry(e.target.value)} disabled={isLoading} />
              </div>
            </div>
          </fieldset>

          {/* Password Section */}
          <fieldset className="border p-4 rounded-md">
            <legend className="text-lg font-semibold px-2 text-gray-700">Set Password</legend>
            <div className="mt-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" id="password" name="password" required autoComplete="new-password"
                     className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                     value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} />
            </div>
            <div className="mt-4">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input type="password" id="confirmPassword" name="confirmPassword" required autoComplete="new-password"
                     className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                     value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={isLoading} />
            </div>
          </fieldset>

          {/* Submit Button */}
          <div className="mt-6">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200 ${
                isLoading
                  ? 'bg-indigo-300 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {isLoading ? 'Registering...' : 'Create Account'}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;