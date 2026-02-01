import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";

type Role = "NO_ACCESS" | "USER" | "ADMIN";

interface ProtectedRouteProps {
  allowedRoles: Role[];
  delay?: number; // delay in milliseconds
}

const spinnerContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '50vh', 
};

const spinnerStyle = {
  width: '50px',
  height: '50px',
  border: '6px solid #f3f3f3',
  borderTop: '6px solid #3498db', 
  borderRadius: '50%',
  animation: 'spin 1s linear infinite',
};

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

  if (!ready) return <div style={spinnerContainerStyle}><div style={spinnerStyle}></div></div>; // Shows the spinner while waiting

  if (!user || !role) {
    return <Navigate to="/unauthorized" replace />; // Redirect to unauthorized page if not authenticated
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />; // Redirect to unauthorized page if role not allowed
  }

  return <Outlet />; // Render the protected component
};