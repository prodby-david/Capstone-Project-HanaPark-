import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

const ProtectedRoute =({ children }) => {

  const { auth } = useAuth();

  if (!auth.user){
    return <Navigate to="/" replace />;
  } 

  return children;
}

export default ProtectedRoute;