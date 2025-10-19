import React, { useState, useEffect } from 'react';
import { TrashIcon, LockClosedIcon, LockOpenIcon } from '@heroicons/react/24/solid';
import Swal from 'sweetalert2';
import { api } from '../../lib/api';
import AdminAPI from '../../lib/inteceptors/adminInterceptor';
import SearchBar from '../../components/search/search';
import AdminHeader from '../../components/headers/adminHeader';
import Loader from '../../components/loaders/loader';
import LockPopup from '../../components/popups/lockuser';

const UserList = () => {
  const [usersList, setUsersList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [popup, setPopup] = useState({
    show: false,
    userId: null,
    isLocked: false,
  });

  useEffect(() => {
    const fetchUsers = async () => {
    setIsLoading(true);
        try {
          const endpoint = showArchived ? '/admin/users?archived=true' : '/admin/users';
          const res = await api.get(endpoint);
          setUsersList(res.data);
        } catch (err) {
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
    fetchUsers();
  }, [showArchived]);

  const filteredUsers = usersList
  .filter((user) => {
    if (showArchived) {
      return user.status === 'Archived';
    } else {
      return user.status !== 'Archived';
    }
  })
  .filter((user) => {
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
      (vehicle.plateNumber?.toLowerCase().includes(query) ||
        vehicle.brand?.toLowerCase().includes(query) ||
        vehicle.model?.toLowerCase().includes(query) ||
        vehicle.color?.toLowerCase().includes(query));

    return matchesUserFields || matchesVehicleFields;
  });

  const handleLock = (id, currentStatus) => {
    if (currentStatus) {
      Swal.fire({
        title: 'Unlock Account?',
        text: 'Are you sure you want to unlock this user account?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#10b981',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, unlock it!',
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const res = await AdminAPI.patch(`/admin/lock/${id}`, {
              isLocked: false,
              lockReason: '',
            });

            setUsersList((prev) =>
              prev.map((u) =>
                u._id === id ? { ...u, isLocked: false, lockReason: '' } : u
              )
            );

            Swal.fire({
              title: res.data.message,
              icon: 'success',
              confirmButtonColor: '#10b981',
            });
          } catch (err) {
            console.error(err);
            Swal.fire({
              title: 'Error',
              text: 'Failed to unlock user.',
              icon: 'error',
            });
          }
        }
      });
    } else {
      setPopup({ show: true, userId: id, isLocked: currentStatus });
    }
  };

  const confirmLockAction = async (reason) => {
    try {
      const res = await AdminAPI.patch(`/admin/lock/${popup.userId}`, {
        isLocked: !popup.isLocked,
        lockReason: reason || '',
      });

      setUsersList((prev) =>
        prev.map((u) =>
          u._id === popup.userId ? { ...u, isLocked: !popup.isLocked } : u
        )
      );

      setPopup({ show: false, userId: null, isLocked: false });
    } catch (err) {
      console.error(err);
      alert('Failed to update lock status.');
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Archive this user?',
      text: "This action cannot be undone.",
      icon: 'warning',
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Yes, archive it!',
      showCancelButton: true,
      cancelButtonColor: '#6b7280',
      cancelButtonText: 'Cancel',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await AdminAPI.patch(`/admin/archive/${id}`);
          Swal.fire({
            title: 'User Archived',
            text: 'User archived successfully.',
            icon: 'success',
            confirmButtonColor: '#10b981',
          });
          setUsersList(res.data);
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

  const handleUnarchive = async (id) => {
  Swal.fire({
    title: 'Unarchive this user?',
    text: "This will restore the user to active status.",
    icon: 'question',
    confirmButtonColor: '#10b981',
    confirmButtonText: 'Yes, unarchive it!',
    showCancelButton: true,
    cancelButtonColor: '#6b7280',
    cancelButtonText: 'Cancel',
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const res = await AdminAPI.patch(`/admin/unarchive/${id}`);
        Swal.fire({
          title: 'User Unarchived',
          text: 'User has been restored successfully.',
          icon: 'success',
          confirmButtonColor: '#10b981',
        });
        setUsersList(res.data);
      } catch (err) {
        console.error('Unarchive error:', err);
        Swal.fire({
          title: 'Error',
          text: 'Failed to unarchive user.',
          icon: 'error',
        });
      }
    }
  });
};

  return (
    <>
      <AdminHeader />

      <div className="flex flex-col items-center mt-10 px-4 sm:px-6 ">
        <h2 className="text-2xl font-bold text-color mb-6">User Management</h2>
        
        <div className='flex items-center justify-between w-full'>
           <button
            onClick={() => setShowArchived((prev) => !prev)}
            className={`px-4 py-2 rounded-md text-white font-medium ${
              showArchived ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
            }`}
            >
              {showArchived ? 'Show Active Users' : 'Show Archived Users'}
            </button>

          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader />
          </div>
        ) : (
          <div className="w-full max-w-6xl overflow-x-auto mt-6">
            <div className="min-w-[700px] bg-white shadow-md rounded-2xl overflow-hidden">
              <div className="grid grid-cols-8 gap-3 bg-color text-white p-4 font-semibold text-center text-sm rounded-t-2xl">
                <p>User Type</p>
                <p>Lastname</p>
                <p>Firstname</p>
                <p>Student ID</p>
                <p>Username</p>
                <p>Email</p>
                <p>Vehicle</p>
                <p>Actions</p>
              </div>

              <div className="max-h-[450px] overflow-y-auto divide-y divide-gray-100">
                {filteredUsers.map((user) => (
                  <div
                    key={user._id}
                    className={`grid grid-cols-8 items-center text-center px-4 py-3 text-sm transition-all ${
                      user.isLocked
                        ? 'bg-red-50 border-l-4 border-red-400'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <p
                      className={`font-semibold ${
                        user.isLocked ? 'text-red-600' : 'text-gray-700'
                      }`}
                    >
                      {user.userType}
                    </p>
                    <p>{user.lastname}</p>
                    <p>{user.firstname}</p>
                    <p>{user.studentId}</p>
                    <p>{user.username}</p>
                    <p className="truncate" title={user.email}>
                      {user.email}
                    </p>
                    <p>
                      {user.vehicle
                        ? `${user.vehicle.brand} ${user.vehicle.model} - ${user.vehicle.plateNumber}`
                        : 'No vehicle'}
                    </p>

                    <div className="flex justify-center gap-2">
                        {showArchived ? (
                          <button
                            onClick={() => handleUnarchive(user._id)}
                            className="px-3 py-1 rounded-md bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition"
                            title="Unarchive User"
                          >
                            Unarchive
                          </button>
                        ) : (
                          // Show lock & archive buttons for active users
                          <>
                            <button
                              onClick={() => handleLock(user._id, user.isLocked)}
                              className={`p-2 rounded-full cursor-pointer transition ${
                                user.isLocked
                                  ? 'bg-green-500 hover:bg-green-600'
                                  : 'bg-yellow-500 hover:bg-yellow-600'
                              } text-white`}
                              title={user.isLocked ? 'Unlock User' : 'Lock User'}
                            >
                              {user.isLocked ? (
                                <LockOpenIcon className="w-5 h-5" />
                              ) : (
                                <LockClosedIcon className="w-5 h-5" />
                              )}
                            </button>

                            <button
                              onClick={() => handleDelete(user._id)}
                              className="p-2 rounded-full cursor-pointer bg-red-500 hover:bg-red-600 text-white transition"
                              title="Archive User"
                            >
                              <TrashIcon className="w-5 h-5" />
                            </button>
                          </>
                        )}
                      </div>

                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <LockPopup
        show={popup.show}
        isLocked={popup.isLocked}
        onClose={() =>
          setPopup({ show: false, userId: null, isLocked: false })
        }
        onConfirm={confirmLockAction}
      />
    </>
  );
};

export default UserList;
