import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../auth/useAuth.jsx";

const ProtectedRoute = () => {
  const {isLoggedIn} = useAuth();
  if (!isLoggedIn) {
    console.log("redirected");
    return <Navigate to="/login" replace />;
  }
  
  return <Outlet />;
};

export default ProtectedRoute;
