import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Loader } from "./Loader";

type Role = "NO_ACCESS" | "USER" | "ADMIN";

interface ProtectedRouteProps {
  allowedRoles: Role[];
  delay?: number; // delay in milliseconds
}

// 1 second delay
export const ProtectedRoute = ({ allowedRoles, delay = 1000 }: ProtectedRouteProps) => {
  const { user, role } = useAuth();
  const [ready, setReady] = useState(false); // useState to manage delay

  useEffect(() => {
    // setTimeout schedules a function to be called which sets ready to true after the specified delay
    const timer = setTimeout(() => {
      setReady(true);
    }, delay);

    return () => clearTimeout(timer); // Cleanup the timer on unmount
  }, [delay]); // Dependency array includes delay

  if (!ready) return <Loader fullScreen />; // Shows the spinner while waiting

  if (!user || !role) {
    return <Navigate to="/unauthorized" replace />; // Redirect to unauthorized page if not authenticated
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />; // Redirect to unauthorized page if role not allowed
  }

  return <Outlet />; // Render the protected component
};