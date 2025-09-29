import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext"; 

const GuestRoute = ({ children }) => {
  const { auth } = useAuth();

  if (auth?.user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default GuestRoute;
