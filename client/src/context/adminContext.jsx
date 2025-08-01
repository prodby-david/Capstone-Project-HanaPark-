import React, { useState, createContext, useContext } from 'react';

const AdminContext  = createContext();

export const AdminContextProvider =  ({ children }) => {

    const [admin, setAdmin] = useState(() => {
        const savedAdmin = sessionStorage.getItem('hanaparkadmin');
        return savedAdmin && savedAdmin !== "undefined" ? JSON.parse(savedAdmin) : null;

    });

    const [verified, setVerified] = useState(() => {
    const saved = sessionStorage.getItem('passcode_verified');
    return saved === 'true'; 
    });

    const verifyPasscode = () => {
    sessionStorage.setItem('passcode_verified', 'true');
    setVerified(true);
    };


    const Login = (adminData) => {
        sessionStorage.setItem('hanaparkadmin', JSON.stringify(adminData)); 
        setAdmin(adminData);
    };

    const Logout = () => {
        sessionStorage.removeItem('hanaparkadmin'); 
        sessionStorage.removeItem('passcode_verified');
        setAdmin(null);
    }

 
    return(
        <AdminContext.Provider value={{admin, Login, Logout, verified, verifyPasscode}}>
           { children }
        </AdminContext.Provider>
    )
}

export const useAdminContext = () => useContext(AdminContext);