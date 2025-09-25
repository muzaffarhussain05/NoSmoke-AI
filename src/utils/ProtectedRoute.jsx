import { Navigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

const ProtectedRoute = ({ children }) => {
  const { user, authLoading } = useApp();

  // Wait until auth state is restored
  if (authLoading) {
    return <div className="mt-20 container mx-auto">
    Loading...
    </div>; // or spinner
  }

  if (!user?._id) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default ProtectedRoute;
