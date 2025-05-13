// src/pages/RegisterPage.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// --- Type for our errors state object ---
interface RegistrationErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  phone?: string;
  addressLine?: string;
  postalCode?: string;
  city?: string;
  country?: string;
  form?: string; // For general form errors not tied to a specific field
}

// --- Validation Helper Functions ---
const validateEmail = (email: string): string | undefined => {
  if (!email) return "Email is required.";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Invalid email format.";
  return undefined; // No error
};

const validatePassword = (password: string): string | undefined => {
  if (!password) return "Password is required.";
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter.";
  if (!/[0-9]/.test(password)) return "Password must contain at least one number.";
  return undefined; // No error
};

const isNumeric = (value: string): boolean => /^\d+$/.test(value);

const validatePhone = (phone: string): string | undefined => {
  if (!phone) return "Phone number is required.";
  if (!isNumeric(phone)) return "Phone number must contain only digits.";
  // Add more specific phone length/format checks if needed (e.g., for Norway)
  // if (phone.length !== 8) return "Phone number must be 8 digits." // Example
  return undefined;
};

const validatePostalCode = (postalCode: string): string | undefined => {
  if (!postalCode) return "Postal code is required.";
  if (!isNumeric(postalCode)) return "Postal code must contain only digits.";
  // Add more specific postal code length/format checks if needed (e.g., for Norway)
  // if (postalCode.length !== 4) return "Postal code must be 4 digits." // Example
  return undefined;
};

const RegisterPage: React.FC = () => {
  // --- Form Input States ---
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

  // --- Error State ---
  const [errors, setErrors] = useState<RegistrationErrors>({});

  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const newErrors: RegistrationErrors = {};

    // --- Perform All Validations ---
    if (!firstName.trim()) newErrors.firstName = "First name is required.";
    if (!lastName.trim()) newErrors.lastName = "Last name is required.";

    const emailError = validateEmail(email);
    if (emailError) newErrors.email = emailError;

    const passwordError = validatePassword(password);
    if (passwordError) newErrors.password = passwordError;

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required.";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    const phoneError = validatePhone(phone);
    if (phoneError) newErrors.phone = phoneError;

    if (!addressLine.trim()) newErrors.addressLine = "Address line is required.";

    const postalCodeError = validatePostalCode(postalCode);
    if (postalCodeError) newErrors.postalCode = postalCodeError;

    if (!city.trim()) newErrors.city = "City is required.";
    if (!country.trim()) newErrors.country = "Country is required.";

    // If there are any errors, update state and stop submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({}); // Clear errors if all validations pass

    // Collect all registration data
    const registrationDetails = {
      firstName,
      lastName,
      email,
      password, // In a real app, only send password if setting it
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
      await register(`${firstName} ${lastName}`, email, password); // Placeholder context call
      alert("Registration successful (simulated)! Please login.");
      navigate('/login');
    } catch (err) {
      console.error("Registration simulation error:", err);
      setErrors({ form: 'Registration failed. Please try again.' });
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 flex justify-center items-start mt-10 mb-10">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Create Your Account</h1>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate> {/* Added noValidate to allow our JS validation to run */}
          {/* General Form Error Display */}
          {errors.form && (
            <div className="p-3 bg-red-100 text-red-700 border border-red-400 rounded">
              {errors.form}
            </div>
          )}

          <fieldset className="border p-4 rounded-md">
            <legend className="text-lg font-semibold px-2 text-gray-700">Personal Details</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 mt-2"> {/* Adjusted gap-y */}
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input type="text" id="firstName" name="firstName" required autoComplete="given-name"
                       className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                       value={firstName} onChange={(e) => { setFirstName(e.target.value); if(errors.firstName) setErrors(prev => ({...prev, firstName: undefined}));}} disabled={isLoading} />
                {errors.firstName && <p className="text-xs text-red-600 mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input type="text" id="lastName" name="lastName" required autoComplete="family-name"
                       className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                       value={lastName} onChange={(e) => { setLastName(e.target.value); if(errors.lastName) setErrors(prev => ({...prev, lastName: undefined}));}} disabled={isLoading} />
                {errors.lastName && <p className="text-xs text-red-600 mt-1">{errors.lastName}</p>}
              </div>
            </div>
            <div className="mt-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input type="email" id="email" name="email" required autoComplete="email"
                     className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                     value={email} onChange={(e) => { setEmail(e.target.value); if(errors.email) setErrors(prev => ({...prev, email: undefined}));}} disabled={isLoading} />
              {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
            </div>
            <div className="mt-4">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input type="tel" id="phone" name="phone" required autoComplete="tel"
                     className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                     value={phone} onChange={(e) => { setPhone(e.target.value); if(errors.phone) setErrors(prev => ({...prev, phone: undefined}));}} disabled={isLoading} />
              {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
            </div>
          </fieldset>

          <fieldset className="border p-4 rounded-md">
            <legend className="text-lg font-semibold px-2 text-gray-700">Address</legend>
            <div className="mt-2">
              <label htmlFor="addressLine" className="block text-sm font-medium text-gray-700 mb-1">Address Line</label>
              <input type="text" id="addressLine" name="addressLine" required autoComplete="street-address"
                     className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${errors.addressLine ? 'border-red-500' : 'border-gray-300'}`}
                     value={addressLine} onChange={(e) => { setAddressLine(e.target.value); if(errors.addressLine) setErrors(prev => ({...prev, addressLine: undefined}));}} disabled={isLoading} />
              {errors.addressLine && <p className="text-xs text-red-600 mt-1">{errors.addressLine}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-2 mt-4"> {/* Adjusted gap-y */}
              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                <input type="text" id="postalCode" name="postalCode" required autoComplete="postal-code"
                       className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${errors.postalCode ? 'border-red-500' : 'border-gray-300'}`}
                       value={postalCode} onChange={(e) => { setPostalCode(e.target.value); if(errors.postalCode) setErrors(prev => ({...prev, postalCode: undefined}));}} disabled={isLoading} />
                {errors.postalCode && <p className="text-xs text-red-600 mt-1">{errors.postalCode}</p>}
              </div>
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input type="text" id="city" name="city" required autoComplete="address-level2"
                       className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                       value={city} onChange={(e) => { setCity(e.target.value); if(errors.city) setErrors(prev => ({...prev, city: undefined}));}} disabled={isLoading} />
                {errors.city && <p className="text-xs text-red-600 mt-1">{errors.city}</p>}
              </div>
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input type="text" id="country" name="country" required autoComplete="country-name"
                       className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 ${errors.country ? 'border-red-500' : 'border-gray-300'}`}
                       value={country} onChange={(e) => { setCountry(e.target.value); if(errors.country) setErrors(prev => ({...prev, country: undefined}));}} disabled={isLoading} />
                {errors.country && <p className="text-xs text-red-600 mt-1">{errors.country}</p>}
              </div>
            </div>
          </fieldset>

          <fieldset className="border p-4 rounded-md">
            <legend className="text-lg font-semibold px-2 text-gray-700">Set Password</legend>
            <div className="mt-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" id="password" name="password" required autoComplete="new-password"
                     className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                     value={password} onChange={(e) => { setPassword(e.target.value); if(errors.password) setErrors(prev => ({...prev, password: undefined}));}} disabled={isLoading} />
              {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
            </div>
            <div className="mt-4">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input type="password" id="confirmPassword" name="confirmPassword" required autoComplete="new-password"
                     className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                     value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); if(errors.confirmPassword) setErrors(prev => ({...prev, confirmPassword: undefined}));}} disabled={isLoading} />
              {errors.confirmPassword && <p className="text-xs text-red-600 mt-1">{errors.confirmPassword}</p>}
            </div>
          </fieldset>

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