import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import axiosClient from "../shared/api/axiosClient";

const AuthContext = createContext(null);

const ACCESS_TOKEN_KEY = "access_token";
const AUTH_USER_KEY = "auth_user";
const AUTH_SIDEBAR_KEY = "auth_sidebar";
const AUTH_PERMISSIONS_KEY = "auth_permissions";

function getStoredToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

function getStoredUser() {
  const raw = localStorage.getItem(AUTH_USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

function getStoredSidebar() {
  const raw = localStorage.getItem(AUTH_SIDEBAR_KEY);
  return raw ? JSON.parse(raw) : [];
}

function getStoredPermissions() {
  const raw = localStorage.getItem(AUTH_PERMISSIONS_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveAuth({ token, user, sidebar, permissions }) {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user || null));
  localStorage.setItem(AUTH_SIDEBAR_KEY, JSON.stringify(sidebar || []));
  localStorage.setItem(
    AUTH_PERMISSIONS_KEY,
    JSON.stringify(permissions || [])
  );
}

function clearAuth() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
  localStorage.removeItem(AUTH_SIDEBAR_KEY);
  localStorage.removeItem(AUTH_PERMISSIONS_KEY);
}

function findFirstPath(items = []) {
  for (const item of items) {
    if (item?.path) {
      return item.path;
    }

    if (item?.children?.length) {
      const childPath = findFirstPath(item.children);
      if (childPath) return childPath;
    }
  }

  return null;
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(getStoredToken());
  const [user, setUser] = useState(getStoredUser());
  const [sidebar, setSidebar] = useState(getStoredSidebar());
  const [permissions, setPermissions] = useState(getStoredPermissions());
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!token;

  const hasPermission = (permissionKey) => {
    if (!permissionKey) return false;
    if (user?.role?.role_code === "ADMIN") return true;
    return permissions.includes(permissionKey);
  };

  const getFirstAccessiblePath = () => {
    return findFirstPath(sidebar) || "/dashboard";
  };

  const applyAuthData = (data, newToken = null) => {
    const accessToken = newToken ?? token;
    const nextUser = data?.user ?? null;
    const nextSidebar = data?.sidebar ?? [];
    const nextPermissions = data?.permissions ?? [];

    if (newToken) {
      setToken(newToken);
    }

    setUser(nextUser);
    setSidebar(nextSidebar);
    setPermissions(nextPermissions);

    if (accessToken) {
      saveAuth({
        token: accessToken,
        user: nextUser,
        sidebar: nextSidebar,
        permissions: nextPermissions,
      });
    }
  };

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

    applyAuthData(data, data.access_token);

    return data;
  };

  const fetchMe = async () => {
    const response = await axiosClient.get("/auth/me");
    const data = response.data;

    if (!data?.success || !data?.user) {
      throw new Error("Không lấy được thông tin người dùng");
    }

    applyAuthData(data);

    return data.user;
  };

  const logout = async () => {
    try {
      await axiosClient.post("/auth/logout");
    } catch (error) {
      // token hết hạn vẫn cho logout local
    } finally {
      setToken(null);
      setUser(null);
      setSidebar([]);
      setPermissions([]);
      clearAuth();
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        await fetchMe();
      } catch (error) {
        setToken(null);
        setUser(null);
        setSidebar([]);
        setPermissions([]);
        clearAuth();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [token]);

  const value = useMemo(
    () => ({
      user,
      token,
      sidebar,
      permissions,
      loading,
      isAuthenticated,
      login,
      logout,
      fetchMe,
      hasPermission,
      getFirstAccessiblePath,
      setUser,
    }),
    [user, token, sidebar, permissions, loading, isAuthenticated]
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