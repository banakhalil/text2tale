import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isTokenExpired, getUserData } from "@/services/authService";
import type { AdminUser } from "@/shared/types";

interface AuthContextType {
  token: string | null;
  user: AdminUser | null;
  isAuthenticated: boolean;
  setAuthData: (token: string, refreshToken: string, user: AdminUser) => void;
  updateUser: (updates: Partial<AdminUser>) => void;
  clearAuthData: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();

  const [token, setToken] = useState<string | null>(() => {
    const stored = localStorage.getItem("accessToken");
    if (stored && isTokenExpired(stored)) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userData");
      return null;
    }
    return stored;
  });

  const [user, setUser] = useState<AdminUser | null>(getUserData());

  const setAuthData = (
    newToken: string,
    refreshToken: string,
    newUser: AdminUser,
  ) => {
    localStorage.setItem("accessToken", newToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("userData", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const updateUser = (updates: Partial<AdminUser>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...updates };
      localStorage.setItem("userData", JSON.stringify(next));
      return next;
    });
  };

  const clearAuthData = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userData");
    setToken(null);
    setUser(null);
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    if (!token) return;

    const checkExpiration = () => {
      if (isTokenExpired(token)) clearAuthData();
    };

    const interval = setInterval(checkExpiration, 60000);
    return () => clearInterval(interval);
  }, [token]);

  const value: AuthContextType = {
    token,
    user,
    isAuthenticated: !!token && !isTokenExpired(token),
    setAuthData,
    updateUser,
    clearAuthData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
