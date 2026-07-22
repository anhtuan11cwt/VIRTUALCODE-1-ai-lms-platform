import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { userData } = useSelector((state) => state.user);

  if (!userData) return <Navigate replace to="/register" />;

  if (requiredRole && userData.role !== requiredRole) {
    return <Navigate replace to="/" />;
  }

  return children;
};

export default ProtectedRoute;
