// src/contexts/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from "react";
import { User } from "../data/models";
import { fetchCurrentUser } from "../services/apiService";

export interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>(null!);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // --- Load current user on mount ---
  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await fetchCurrentUser();
        setCurrentUser(user);
      } catch {
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  // --- Login ---
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const error = await res.text();
        throw new Error(`Login failed: ${error}`);
      }

      const user = await fetchCurrentUser();
      setCurrentUser(user);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Logout ---
  const logout = async () => {
    await fetch("http://127.0.0.1:8000/api/logout/", {
      method: "POST",
      credentials: "include",
    });
    setCurrentUser(null);
  };

  // --- Register (not yet implemented) ---
  const register = async (name: string, email: string, password: string) => {
    console.warn("Register is not implemented.");
    throw new Error("Registration not yet implemented.");
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, isLoading, login, logout, register }}
    >
      {children}
    </AuthContext.Provider>
  );
};
