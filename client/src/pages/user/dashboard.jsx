import React from 'react'
import { useAuth } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Dashboard = () => {

const { logout } = useAuth();
const navigate = useNavigate();

const handleLogout = () => {
    Swal.fire({
        title: 'Are you sure?',
        text: "You will be logged out.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirm'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
            title: 'Logged out!',
            text: 'You have been logged out successfully.',
            icon: 'success',
            confirmButtonText: 'OK'
            }).then(() => {
                logout();
                navigate('/sign-in');
            });
        }
    });
}


  return (
    <div>
      <h2>Hello, user</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Dashboard;
