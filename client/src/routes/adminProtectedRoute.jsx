import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminContext } from "../context/adminContext";


const AdminRoute = ({ children }) => {

    const { admin } = useAdminContext();

   
    if(!admin){
        return <Navigate to={"/admin/passcode"} replace />
    }

    return children;
}

export default AdminRoute;