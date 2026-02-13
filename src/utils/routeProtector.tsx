import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./authContext";

export const ProtectedRoute = () => {
  const { token } = useAuth();
  
  // Log this to your console to see the timing!
  console.log("Guard checking token:", token);

  if (token === undefined) {
    return null; // Or a loading spinner
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};