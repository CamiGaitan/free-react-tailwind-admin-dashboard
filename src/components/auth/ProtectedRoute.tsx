import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { useAuth } from "../../context/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
}