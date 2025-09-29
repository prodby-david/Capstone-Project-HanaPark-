// src/context/SocketContext.js
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const socketRef = useRef();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    socketRef.current = io('http://localhost:4100');

    // Listen for notification events
    socketRef.current.on('new-notification', (notif) => {
      setNotifications(prev => [notif, ...prev]); 
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, notifications, markAsRead }}>
      {children}
    </SocketContext.Provider>
  );
};
