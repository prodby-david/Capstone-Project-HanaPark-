import axios from 'axios';
import { toast } from 'react-toastify';
import toastOptions from '../../lib/toastConfig';

const UserAPI = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

UserAPI.interceptors.response.use(
  (response) => response,
  async (error) => {

    const originalRequest = error.config;
    
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {

      if (originalRequest.url.includes('/sign-in')) {
        return Promise.reject(error); 
      }

      try {

        if (message.includes('logged in elsewhere')) {
          toast.error('You have been logged out because your account was logged in on another device.', toastOptions);
        } else if (message.includes('expired')) {
          toast.error('Your session has expired. Please log in again.', toastOptions);
        } else {
          toast.error('Session expired. Please log in again.', toastOptions);
        }

        await UserAPI.post("/logout");
        toast.error('Session expired. Please log in again.', toastOptions);
      } catch (err) {
        console.error("Error clearing cookies:", err);
      }
      sessionStorage.clear();
      setTimeout(() => {
        window.location.href = "/";
      }, 3000);
    }
    return Promise.reject(error);
  }
);

export default UserAPI;
