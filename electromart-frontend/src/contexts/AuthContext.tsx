// src/contexts/AuthContext.tsx
import React, { createContext, useState, ReactNode } from "react";

// 1. Define a simple User type (adjust as needed)
export interface User {
  id: string | number; // Or just string/number depending on your backend
  name?: string; // Optional name
  email: string; // Assuming email is the main identifier/username
  // Add other relevant user fields if needed later (e.g., roles)
}

// 2. Define the shape of the context value
export interface AuthContextType {
  currentUser: User | null; // null if logged out, User object if logged in
  isLoading: boolean; // For potential async checks later
  login: (email?: string, password?: string) => Promise<void>; // Placeholder login
  logout: () => void; // Placeholder logout
  register: (name?: string, email?: string, password?: string) => Promise<void>; // Placeholder register
}

// 3. Create the Context with a default value (null!)
// We assert non-null because we'll always use it within the Provider
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType>(null!);

// 4. Create the Provider Component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  // isLoading could be true initially if checking auth status on load later
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // --- Placeholder Auth Functions ---

  // Simulate login - sets a dummy user
  const login = async (email?: string, password?: string) => {
    console.log("Attempting login with:", { email, password }); // Log credentials (remove in production!)
    setIsLoading(true);
    // Simulate API call delay
    await new Promise((res) => setTimeout(res, 500));
    // In real app: make API call, get user data/token on success
    const dummyUser: User = {
      id: "user123",
      name: "Test User",
      email: email || "test@example.com",
    };
    setCurrentUser(dummyUser);
    setIsLoading(false);
    console.log("Simulated login successful:", dummyUser);
    // No need to return Promise.resolve() explicitly from async function
  };

  // Simulate logout - clears user state
  const logout = () => {
    console.log("Logging out");
    // In real app: call logout API endpoint, clear tokens etc.
    setCurrentUser(null);
  };

  // Simulate register - logs details and sets dummy user
  const register = async (name?: string, email?: string, password?: string) => {
    console.log("Attempting registration with:", { name, email, password }); // Log credentials (remove in production!)
    setIsLoading(true);
    // Simulate API call delay
    await new Promise((res) => setTimeout(res, 500));
    // In real app: make API call, handle success/error
    const dummyUser: User = {
      id: "user" + Math.random().toString(16).slice(2), // pseudo-random ID
      name: name || "New User",
      email: email || "register@example.com",
    };
    setCurrentUser(dummyUser);
    setIsLoading(false);
    console.log("Simulated registration successful:", dummyUser);
  };

  // --- Provide Context Value ---
  const value = {
    currentUser,
    isLoading,
    login,
    logout,
    register,
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Render children only when not initially loading auth status */}
      {/* We can refine this loading state later if needed */}
      {children}
    </AuthContext.Provider>
  );
};
