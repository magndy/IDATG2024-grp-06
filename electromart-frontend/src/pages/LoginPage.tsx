// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // Import the useAuth hook

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null); // For login-specific errors

  const { login, isLoading } = useAuth(); // Get login function and loading state
  const navigate = useNavigate(); // Hook for navigation

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent default page reload
    setLocalError(null); // Clear previous errors

    try {
      // Call the placeholder login function from AuthContext
      // In a real app, credentials would be sent to a backend API
      await login(email, password);
      // If login simulation is successful, navigate home
      navigate('/'); // Redirect to homepage after successful login
    } catch (err) {
      // If the placeholder login function were to throw an error
      // (it currently doesn't, but would in a real scenario)
      console.error("Login simulation error (won't happen with current placeholder):", err);
      setLocalError('Login failed. Please check your credentials.'); // Set local error state
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 flex justify-center items-start mt-10">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Login</h1>
        <form onSubmit={handleSubmit}>
          {/* Display Login Error */}
          {localError && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-400 rounded">
              {localError}
            </div>
          )}

          {/* Email Input */}
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
              disabled={isLoading} // Disable input while loading
            />
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              autoComplete="current-password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading} // Disable input while loading
            />
          </div>

          {/* Submit Button */}
          <div className="mb-6">
            <button
              type="submit"
              disabled={isLoading} // Disable button while loading
              className={`w-full text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200 ${
                isLoading
                  ? 'bg-indigo-300 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {isLoading ? 'Logging In...' : 'Login'}
            </button>
          </div>
        </form>

        {/* Link to Register Page */}
        <p className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;