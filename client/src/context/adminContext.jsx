import React, { useState, createContext, useContext } from 'react';

const AdminContext  = createContext();

export const AdminContextProvider =  ({ children }) => {

    const [admin, setAdmin] = useState(() => {
        const savedAdmin = localStorage.getItem('hanaparkadmin');
        return savedAdmin && savedAdmin !== "undefined" ? JSON.parse(savedAdmin) : null;

    });

    const [verified, setVerified] = useState(() => {
    const saved = localStorage.getItem('passcode_verified');
    return saved === 'true'; 
    });

    const verifyPasscode = () => {
    localStorage.setItem('passcode_verified', 'true');
    setVerified(true);
    };


    const Login = (adminData) => {
        localStorage.setItem('hanaparkadmin', JSON.stringify(adminData)); 
        setAdmin(adminData);
    };

    const Logout = () => {
        localStorage.removeItem('hanaparkadmin'); 
        localStorage.removeItem('passcode_verified');
        setAdmin(null);
    }

 
    return(
        <AdminContext.Provider value={{admin, Login, Logout, verified, verifyPasscode}}>
           { children }
        </AdminContext.Provider>
    )
}

export const useAdminContext = () => useContext(AdminContext);