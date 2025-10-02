import { io } from 'socket.io-client';

export const socket = io(
    import.meta.env.VITE_API_URL, 
    {   withCredentials: true, 
        transports: ["websocket", "polling"]
    },
);

socket.on("connect", () => {
  console.log("Socket connected:", socket.id);
});

socket.on("connect_error", (err) => {
  console.error("Socket connection error:", err);
});
