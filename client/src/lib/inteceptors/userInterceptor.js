import axios from 'axios';
import { toast } from 'react-toastify';
import toastOptions from '../../lib/toastConfig';

let hasShownSessionToast = false;

const UserAPI = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

UserAPI.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const message = error.response?.data?.message || "";

    if (error.response && (error.response.status === 401 || error.response.status === 403)) {

      if (originalRequest.url.includes('/sign-in') || originalRequest.url.includes('/logout')) {
        return Promise.reject(error);
      }

      if (!hasShownSessionToast) {
        hasShownSessionToast = true;

        if (message.includes('logged in elsewhere')) {
          toast.error('You have been logged out because your account was logged in on another device.', toastOptions);
        } else if (message.includes('expired')) {
          toast.error('Your session has expired. Please log in again.', toastOptions);
        } else {
          toast.error('Session expired. Please log in again.', toastOptions);
        }

        try {
          await UserAPI.post("/logout").catch(() => {});
        } catch (err) {
          console.error("Error during logout:", err);
        }

        sessionStorage.clear();

        setTimeout(() => {
          window.location.href = "/";
          hasShownSessionToast = false; 
        }, 3500);
      }
    }

    return Promise.reject(error);
  }
);

export default UserAPI;
