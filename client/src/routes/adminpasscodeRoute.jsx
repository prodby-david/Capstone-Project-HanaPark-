import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminContext } from '../context/adminContext';

const PasscodeProtectedRoute = ({ children }) => {
  const { verified } = useAdminContext();
  if (!verified) {
    return <Navigate to="/admin/passcode" replace />;
  }
  return children;
};

export default PasscodeProtectedRoute;
