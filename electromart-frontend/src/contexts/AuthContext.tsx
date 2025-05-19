import React, { createContext, useState, useEffect, ReactNode } from "react";
import { User } from "../data/models";
import { fetchCurrentUser, registerUser } from "../services/apiService";

export interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (registrationDetails: any) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>(null!);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [csrfReady, setCsrfReady] = useState<boolean>(false);

  const getCsrfToken = () =>
    document.cookie
      .split("; ")
      .find((row) => row.startsWith("csrftoken="))
      ?.split("=")[1] || "";

  // Ensure CSRF cookie is set before any login/logout
  useEffect(() => {
    fetch("http://localhost:8000/api/csrf/", {
      credentials: "include",
    }).then(() => setCsrfReady(true));
  }, []);

  // Load user on mount
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

  const login = async (email: string, password: string) => {
    if (!csrfReady) throw new Error("CSRF token not ready yet.");
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/login/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCsrfToken(),
        },
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

  const logout = async () => {
    if (!csrfReady) throw new Error("CSRF token not ready yet.");
    try {
      await fetch("http://localhost:8000/api/logout/", {
        method: "POST",
        credentials: "include",
        headers: {
          "X-CSRFToken": getCsrfToken(),
        },
      });
    } catch (err) {
      console.warn("Logout failed:", err);
    } finally {
      setCurrentUser(null);
    }
  };

  const register = async (registrationDetails: any) => {
    if (!csrfReady) throw new Error("CSRF token not ready yet.");
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCsrfToken(),
        },
        body: JSON.stringify(registrationDetails),
        credentials: "include",
      });

      if (!res.ok) {
        const errorBody = await res.text();
        throw new Error(`Registration failed: ${errorBody}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, isLoading, login, logout, register }}
    >
      {children}
    </AuthContext.Provider>
  );
};
