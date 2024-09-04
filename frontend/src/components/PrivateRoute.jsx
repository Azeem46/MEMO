import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = () => {
  const user = useSelector((state) => state.auth.user);
  const token = user?.token; // Use optional chaining to avoid destructuring null/undefined

  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
