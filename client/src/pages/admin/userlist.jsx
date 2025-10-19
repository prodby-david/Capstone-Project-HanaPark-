import React, { useState, useEffect } from 'react';
import { TrashIcon, LockClosedIcon, LockOpenIcon } from '@heroicons/react/24/solid';
import { api } from '../../lib/api';
import AdminAPI from '../../lib/inteceptors/adminInterceptor';
import SearchBar from '../../components/search/search';
import AdminHeader from '../../components/headers/adminHeader';
import Loader from '../../components/loaders/loader';
import LockPopup from '../../components/popups/lockuser';
import CustomPopup from '../../components/popups/popup';

const UserList = () => {
  const [usersList, setUsersList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [lockPopup, setLockPopup] = useState({
    show: false,
    userId: null,
    isLocked: false,
  });
  const [popup, setPopup] = useState({
    show: false,
    type: '',
    title: '',
    message: '',
    onConfirm: null,
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
    .filter((user) => (showArchived ? user.status === 'Archived' : user.status !== 'Archived'))
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
      setPopup({
        show: true,
        type: 'question',
        title: 'Unlock Account?',
        message: 'Are you sure you want to unlock this user account?',
        onConfirm: async () => {
          try {
            const res = await AdminAPI.patch(`/admin/lock/${id}`, {
              isLocked: false,
              lockReason: '',
            });
            setUsersList((prev) =>
              prev.map((u) => (u._id === id ? { ...u, isLocked: false, lockReason: '' } : u))
            );
            setPopup({
              show: true,
              type: 'success',
              title: 'Account Unlocked',
              message: res.data.message || 'User account has been unlocked successfully.',
              onConfirm: () => setPopup({ show: false }),
            });
          } catch (err) {
            console.error(err);
            setPopup({
              show: true,
              type: 'error',
              title: 'Error',
              message: 'Failed to unlock user.',
              onConfirm: () => setPopup({ show: false }),
            });
          }
        },
      });
    } else {
      setLockPopup({ show: true, userId: id, isLocked: currentStatus });
    }
  };

  const confirmLockAction = async (reason) => {
    try {
      const res = await AdminAPI.patch(`/admin/lock/${lockPopup.userId}`, {
        isLocked: !lockPopup.isLocked,
        lockReason: reason || '',
      });

      setUsersList((prev) =>
        prev.map((u) =>
          u._id === lockPopup.userId ? { ...u, isLocked: !lockPopup.isLocked } : u
        )
      );

      setLockPopup({ show: false, userId: null, isLocked: false });
      setPopup({
        show: true,
        type: 'success',
        title: 'User Locked',
        message: 'User account has been locked successfully.',
        onConfirm: () => setPopup({ show: false }),
      });
    } catch (err) {
      console.error(err);
      setPopup({
        show: true,
        type: 'error',
        title: 'Error',
        message: 'Failed to update lock status.',
        onConfirm: () => setPopup({ show: false }),
      });
    }
  };

  const handleDelete = (id) => {
    setPopup({
      show: true,
      type: 'warning',
      title: 'Archive this user?',
      message: 'This action cannot be undone.',
      onConfirm: async () => {
        try {
          const res = await AdminAPI.patch(`/admin/archive/${id}`);
          setUsersList(res.data);
          setPopup({
            show: true,
            type: 'success',
            title: 'User Archived',
            message: 'User archived successfully.',
            onConfirm: () => setPopup({ show: false }),
          });
        } catch (err) {
          console.error('Delete error:', err);
          setPopup({
            show: true,
            type: 'error',
            title: 'Error',
            message: 'Failed to archive user.',
            onConfirm: () => setPopup({ show: false }),
          });
        }
      },
    });
  };

  const handleUnarchive = (id) => {
    setPopup({
      show: true,
      type: 'question',
      title: 'Unarchive this user?',
      message: 'This will restore the user to active status.',
      onConfirm: async () => {
        try {
          const res = await AdminAPI.patch(`/admin/unarchive/${id}`);
          setUsersList(res.data);
          setPopup({
            show: true,
            type: 'success',
            title: 'User Unarchived',
            message: 'User has been restored successfully.',
            onConfirm: () => setPopup({ show: false }),
          });
        } catch (err) {
          console.error('Unarchive error:', err);
          setPopup({
            show: true,
            type: 'error',
            title: 'Error',
            message: 'Failed to unarchive user.',
            onConfirm: () => setPopup({ show: false }),
          });
        }
      },
    });
  };

  return (
    <>
      <AdminHeader />

      <div className="flex flex-col items-center mt-10 px-4 sm:px-6 ">
        <div className='text-center'>
          <h2 className="text-2xl font-bold text-color">User Management</h2>
           <p className="text-gray-600 text-sm">
              Manage all user accounts — lock, unlock, archive, or restore users as needed.
            </p>
        </div>
        

        <div className="flex items-center justify-between w-full">
          <button
            onClick={() => setShowArchived((prev) => !prev)}
            className={`px-4 py-2 rounded-md text-white cursor-pointer font-medium ${
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
                        >
                          Unarchive
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => handleLock(user._id, user.isLocked)}
                            className={`p-2 rounded-full transition ${
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
                            className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white transition"
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
        show={lockPopup.show}
        isLocked={lockPopup.isLocked}
        onClose={() => setLockPopup({ show: false, userId: null, isLocked: false })}
        onConfirm={confirmLockAction}
      />

      <CustomPopup
        show={popup.show}
        type={popup.type}
        title={popup.title}
        message={popup.message}
        onConfirm={popup.onConfirm}
        onClose={() => setPopup({ show: false })}
      />
    </>
  );
};

export default UserList;
