import axiosInstance from "@/lib/axios";
import type { AdminUser } from "@/shared/types";

interface LoginResponse {
  message: string;
  user: AdminUser;
  access_token: string;
  refresh_token: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

export const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
};

export const login = async (credentials: LoginCredentials) => {
  const response = await axiosInstance.post<LoginResponse>(
    "/login/",
    credentials,
  );

  const { access_token, refresh_token, user } = response.data;
  if (user.role !== "admin") {
    throw new Error("Only admins are allowed to log in");
  }

  localStorage.setItem("accessToken", access_token);
  localStorage.setItem("refreshToken", refresh_token);
  localStorage.setItem("userData", JSON.stringify(user));

  return { accessToken: access_token, refreshToken: refresh_token, user };
};

// TEMP: bypasses the real request while backend CORS isn't deployed yet.
// Mirrors the real /login/ response shape so the rest of the auth flow
// (token storage, redirect, protected routes) runs unchanged.
// Remove this and switch Login.tsx back to `login()` once CORS is live.
export const mockLogin = async (credentials: LoginCredentials) => {
  const fakePayload = btoa(
    JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 }),
  );
  const access_token = `mock.${fakePayload}.token`;
  const refresh_token = `mock-refresh-token`;
  const user: AdminUser = {
    id: 1,
    email: credentials.email,
    role: "admin",
    first_name: "Admin",
    last_name: "User",
    securityCode: 447189,
  };

  localStorage.setItem("accessToken", access_token);
  localStorage.setItem("refreshToken", refresh_token);
  localStorage.setItem("userData", JSON.stringify(user));

  return { accessToken: access_token, refreshToken: refresh_token, user };
};
//

export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userData");
};

export const getUserData = (): AdminUser | null => {
  const userData = localStorage.getItem("userData");
  return userData ? JSON.parse(userData) : null;
};
