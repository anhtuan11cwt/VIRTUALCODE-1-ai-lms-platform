import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, isChecking, requiredRole }) => {
  const { userData } = useSelector((state) => state.user);

  if (isChecking) return null;
  if (!userData) return <Navigate replace to="/register" />;

  if (requiredRole && userData.role !== requiredRole) {
    return <Navigate replace to="/" />;
  }

  return children;
};

export default ProtectedRoute;
