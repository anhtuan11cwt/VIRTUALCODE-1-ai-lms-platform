import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const GuestRoute = ({ children, isChecking }) => {
  const { userData } = useSelector((state) => state.user);

  if (isChecking) return null;
  if (userData) return <Navigate replace to="/" />;

  return children;
};

export default GuestRoute;
