import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function RequireAuth({ children, allowedRoles = [] }) {
  const { user, isAuthenticated, isCheckingSession } = useAuth();

  if (isCheckingSession) {
    return (
      <div style={{ padding: "60px 20px", textAlign: "center" }}>
        Verificando sesion...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (
    allowedRoles.length > 0 &&
    !allowedRoles.some((role) => user?.roles?.includes(role))
  ) {
    return <Navigate to="/account" replace />;
  }

  return children;
}
