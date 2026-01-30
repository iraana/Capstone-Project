import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";

type Role = "NO_ACCESS" | "USER" | "ADMIN";

interface ProtectedRouteProps {
  allowedRoles: Role[];
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user, role } = useAuth();

  if (!user || !role) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};