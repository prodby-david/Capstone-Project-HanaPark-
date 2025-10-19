import React, { useState, useEffect } from 'react';
import {
  TrashIcon,
  LockClosedIcon,
  LockOpenIcon,
} from '@heroicons/react/24/outline';
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
  const [popup, setPopup] = useState({
    show: false,
    userId: null,
    isLocked: false,
  });

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
    .filter((user) => user.status !== 'Archived')
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

  // 🔐 Lock or Unlock
  const handleLock = (id, currentStatus) => {
    if (currentStatus) {
      Swal.fire({
        title: 'Unlock Account?',
        text: 'Do you want to unlock this user account?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#00509e',
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
              confirmButtonColor: '#00509e',
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

  // 🔒 Confirm lock action
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
      Swal.fire({
        title: res.data.message,
        icon: 'success',
        confirmButtonColor: '#00509e',
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: 'Error',
        text: 'Failed to update lock status.',
        icon: 'error',
      });
    }
  };

  // 🗑️ Archive user
  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Archive this user?',
      text: "This action cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00509e',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, archive it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await AdminAPI.patch(`/admin/archive/${id}`);
          Swal.fire({
            title: 'User Archived',
            icon: 'success',
            confirmButtonColor: '#00509e',
          });
          setUsersList(res.data);
        } catch (err) {
          console.error(err);
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
        <h2 className="text-2xl text-color font-bold mb-6">User Management</h2>

        <SearchBar value={searchQuery} onChange={setSearchQuery} />

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader />
          </div>
        ) : (
          <div className="w-full max-w-6xl">
            <div className="overflow-x-auto bg-white rounded-2xl shadow-lg p-5">
              <div className="grid grid-cols-8 gap-3 border-b pb-3 text-gray-600 font-semibold text-center">
                <p>User Type</p>
                <p>Lastname</p>
                <p>Firstname</p>
                <p>Student ID</p>
                <p>Username</p>
                <p>Email</p>
                <p>Vehicle</p>
                <p>Actions</p>
              </div>

              <div className="max-h-[450px] overflow-y-auto mt-3">
                {filteredUsers.map((user) => (
                  <div
                    key={user._id}
                    className={`grid grid-cols-8 gap-4 items-center p-4 my-2 rounded-xl text-center font-medium transition-all duration-200 border ${
                      user.isLocked
                        ? 'bg-gray-100 border-gray-300 text-gray-500'
                        : 'bg-white hover:bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div
                      className={`font-semibold ${
                        user.isLocked ? 'text-gray-500' : 'text-color'
                      }`}
                    >
                      {user.userType}
                    </div>
                    <div>{user.lastname}</div>
                    <div>{user.firstname}</div>
                    <div>{user.studentId}</div>
                    <div>{user.username}</div>
                    <div className="truncate" title={user.email}>
                      {user.email}
                    </div>
                    <div>
                      {user.vehicle ? (
                        <p>
                          {user.vehicle.brand} {user.vehicle.model} –{' '}
                          {user.vehicle.plateNumber}
                        </p>
                      ) : (
                        <p className="text-gray-400 italic">
                          No vehicle registered
                        </p>
                      )}
                    </div>

                    <div className="flex justify-center gap-2">
                      {/* Delete */}
                      <button
                        className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition"
                        onClick={() => handleDelete(user._id)}
                        title="Archive User"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>

                      {/* Lock/Unlock */}
                      <button
                        className={`p-2 rounded-lg text-white transition ${
                          user.isLocked
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'bg-color-3 hover:opacity-85'
                        }`}
                        onClick={() => handleLock(user._id, user.isLocked)}
                        title={user.isLocked ? 'Unlock Account' : 'Lock Account'}
                      >
                        {user.isLocked ? (
                          <LockOpenIcon className="w-5 h-5" />
                        ) : (
                          <LockClosedIcon className="w-5 h-5" />
                        )}
                      </button>
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
