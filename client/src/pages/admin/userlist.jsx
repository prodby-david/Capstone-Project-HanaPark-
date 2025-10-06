import React, { useState, useEffect } from 'react';
import { TrashIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import Swal from 'sweetalert2';
import { api } from '../../lib/api';
import AdminAPI from '../../lib/inteceptors/adminInterceptor';
import SearchBar from '../../components/search/search';
import AdminHeader from '../../components/headers/adminHeader';
import Loader from '../../components/loaders/loader';

const UserList = () => {
  const [usersList, setUsersList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const res = await api.get('/admin/users');
        setUsersList(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = usersList
    .filter(user => user.status !== 'Archived')
    .filter(user => {
      const query = searchQuery.toLowerCase();
      const matchesUserFields =
        user.lastname.toLowerCase().includes(query) ||
        user.firstname.toLowerCase().includes(query) ||
        String(user.studentId).toLowerCase().includes(query) ||
        user.username.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query);

      const vehicle = user.vehicle;
      const matchesVehicleFields =
        vehicle &&
        (
          vehicle.plateNumber?.toLowerCase().includes(query) ||
          vehicle.brand?.toLowerCase().includes(query) ||
          vehicle.model?.toLowerCase().includes(query) ||
          vehicle.color?.toLowerCase().includes(query)
        );

      return matchesUserFields || matchesVehicleFields;
    });

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Are you sure you want to archive this user?',
      text: "This can't be undone.",
      icon: 'warning',
      confirmButtonColor: '#00509e',
      confirmButtonText: 'Yes, archive it!',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancel',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await AdminAPI.patch(`/admin/archive/${id}`);
          Swal.fire({
            title: 'User Archived',
            text: "User archived successfully.",
            icon: 'success',
            confirmButtonColor: '#00509e',
          });
          setUsersList(res.data);
          localStorage.removeItem('user');
        } catch (err) {
          console.error('Delete error:', err);
          Swal.fire({
            title: 'Error',
            text: 'Failed to archive user.',
            icon: 'error',
          });
        }
      }
    });
  };

  return (
    <>
      <AdminHeader />

      <div className="flex flex-col items-center justify-center mt-10 px-5">
        <h2 className="text-xl text-color font-bold mb-5">Users List</h2>

        <SearchBar value={searchQuery} onChange={setSearchQuery} />

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader />
          </div>
        ) : (
          <>
            {/* Scrollable container */}
            <div className="w-full max-w-6xl overflow-x-auto text-sm">
              <div className="min-w-[700px] mb-5">
                {/* Table Header */}
                <div className="grid grid-cols-8 gap-3 bg-white text-color-3 p-4 rounded-xl font-semibold text-center">
                  <p>User Type</p>
                  <p>Lastname</p>
                  <p>Firstname</p>
                  <p>Student ID</p>
                  <p>Username</p>
                  <p>Email</p>
                  <p>Vehicle</p>
                  <p>Actions</p>
                </div>

                {/* Scrollable Body */}
                <div className="max-h-[400px] overflow-y-auto mt-2 pr-2">
                  {filteredUsers.map((user) => (
                    <div
                      key={user._id}
                      className="grid grid-cols-8 gap-4 items-center bg-white text-color-2 my-2 p-3 rounded-xl shadow-sm hover:shadow-md transition text-center font-semibold"
                    >
                      <div>{user.userType}</div>
                      <div>{user.lastname}</div>
                      <div>{user.firstname}</div>
                      <div>{user.studentId}</div>
                      <div>{user.username}</div>
                      <div className="truncate" title={user.email}>
                        {user.email}
                      </div>
                      {user.vehicle ? (
                        <div>
                          <p className="text-center">
                            {user.vehicle.brand} {user.vehicle.model} - {user.vehicle.plateNumber}
                          </p>
                        </div>
                      ) : (
                        <div>No vehicle registered</div>
                      )}

                      <div className="flex gap-x-1 justify-center">
                        <button
                          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 cursor-pointer"
                          onClick={() => handleDelete(user._id)}
                        >
                          <TrashIcon className="w-5 h-5" title="Delete user" />
                        </button>

                        <button className="px-2 py-1 rounded cursor-pointer bg-color-3 text-white hover:opacity-75">
                          <LockClosedIcon className="w-5 h-5" title="Lock Account" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </>
        )}
      </div>
    </>
  );
};

export default UserList;
