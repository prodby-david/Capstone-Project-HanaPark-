import axios from 'axios';
import { toast } from 'react-toastify';
import toastOptions from '../toastConfig';

const UserAPI = axios.create({
  baseURL: "http://localhost:4100",
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
        await UserAPI.post("/logout");
        toast.error('Session expired. Please log in again.', toastOptions);
      } catch (err) {
        console.error("Error clearing cookies:", err);
      }
      sessionStorage.clear();
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default UserAPI;
