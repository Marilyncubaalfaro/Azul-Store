import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const AuthContext = createContext(null);
const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

async function requestJson(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    ...options,
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const message = payload?.message;
    throw new Error(
      Array.isArray(message)
        ? message.join(", ")
        : message || "Error de autenticacion.",
    );
  }

  return payload;
}

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
      logout,
      refreshSession,
      fetchCurrentUser,
    }),
    [
      user,
      accessToken,
      isAuthenticated,
      isCheckingSession,
      login,
      logout,
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
