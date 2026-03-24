import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import axiosClient from "../api/axiosClient";

const AuthContext = createContext(null);

const ACCESS_TOKEN_KEY = "access_token";
const AUTH_USER_KEY = "auth_user";

function getStoredToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

function getStoredUser() {
  const raw = localStorage.getItem(AUTH_USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

function saveAuth(token, user) {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

function clearAuth() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(getStoredToken());
  const [user, setUser] = useState(getStoredUser());
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!token;

  const login = async ({ email, password, device_name = "react-web" }) => {
    const response = await axiosClient.post("/auth/login", {
      email,
      password,
      device_name,
    });

    const data = response.data;

    if (!data?.success || !data?.access_token) {
      throw new Error(data?.message || "Đăng nhập thất bại");
    }

    setToken(data.access_token);
    setUser(data.user);
    saveAuth(data.access_token, data.user);

    return data;
  };

  const fetchMe = async () => {
    try {
      const response = await axiosClient.get("/auth/me");
      const data = response.data;

      if (data?.success && data?.user) {
        setUser(data.user);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.user));
      } else {
        throw new Error("Không lấy được thông tin người dùng");
      }
    } catch (error) {
      setToken(null);
      setUser(null);
      clearAuth();
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axiosClient.post("/auth/logout");
    } catch (error) {
      // bỏ qua lỗi phía server nếu token đã hết hạn
    } finally {
      setToken(null);
      setUser(null);
      clearAuth();
    }
  };

  const changePassword = async ({
    old_password,
    new_password,
    new_password_confirmation,
  }) => {
    const response = await axiosClient.post("/auth/change-password", {
      old_password,
      new_password,
      new_password_confirmation,
    });

    return response.data;
  };

  useEffect(() => {
    const initAuth = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        await fetchMe();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated,
      login,
      logout,
      fetchMe,
      changePassword,
      setUser,
    }),
    [user, token, loading, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth phải được dùng bên trong AuthProvider");
  }

  return context;
}