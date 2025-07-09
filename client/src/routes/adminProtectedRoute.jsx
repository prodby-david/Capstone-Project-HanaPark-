import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminContext } from "../context/adminContext";
import Swal from 'sweetalert2'


const AdminRoute = ({ children }) => {

    const { admin } = useAdminContext();

   
    if(!admin){
        Swal.fire({
            title: 'Access Denied.',
            text: 'Only admins can access this page.',
            icon: 'error',
        })
        return <Navigate to={"/admin/passcode"} replace />
    }

    return children;
}

export default AdminRoute;