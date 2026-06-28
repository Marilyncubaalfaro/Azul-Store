import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { requestJson } from "../utils/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  const isAuthenticated = Boolean(user && accessToken);

  const login = useCallback(async (email, password) => {
    const data = await requestJson("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    setUser(data.user ?? null);
    setAccessToken(data.accessToken ?? null);
    return data.user ?? null;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const data = await requestJson("/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    return data.user ?? null;
  }, []);

  const refreshSession = useCallback(async () => {
    const data = await requestJson("/auth/refresh", { method: "POST" });
    setUser(data.user ?? null);
    setAccessToken(data.accessToken ?? null);
    return data.user ?? null;
  }, []);

  const fetchCurrentUser = useCallback(async () => {
    if (!accessToken) {
      return null;
    }

    const data = await requestJson("/auth/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    setUser(data ?? null);
    return data ?? null;
  }, [accessToken]);

  const logout = useCallback(async () => {
    try {
      await requestJson("/auth/logout", { method: "POST" });
    } finally {
      setUser(null);
      setAccessToken(null);
    }
  }, []);

  const updateShippingAddress = useCallback(
    async ({ line1, city, country }) => {
      if (!accessToken) {
        throw new Error("No hay sesion activa.");
      }

      const data = await requestJson("/auth/me/address", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ line1, city, country }),
      });

      setUser(data ?? null);
      return data ?? null;
    },
    [accessToken],
  );

  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      try {
        await refreshSession();
      } catch {
        if (isMounted) {
          setUser(null);
          setAccessToken(null);
        }
      } finally {
        if (isMounted) {
          setIsCheckingSession(false);
        }
      }
    };

    checkSession();

    return () => {
      isMounted = false;
    };
  }, [refreshSession]);

  const value = useMemo(
    () => ({
      user,
      accessToken,
      isAuthenticated,
      isCheckingSession,
      login,
      register,
      logout,
      updateShippingAddress,
      refreshSession,
      fetchCurrentUser,
    }),
    [
      user,
      accessToken,
      isAuthenticated,
      isCheckingSession,
      login,
      register,
      logout,
      updateShippingAddress,
      refreshSession,
      fetchCurrentUser,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider.");
  }

  return context;
}
