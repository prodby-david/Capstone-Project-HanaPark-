import axios from 'axios'

export const AdminAPI = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, 
});

AdminAPI.interceptors.response.use((response) => { return response; }, async (error) => {

    const originalRequest = error.config;

    if (error.response && (error.response.status === 401 || error.response.status === 403) && !originalRequest._retry) {
      
      originalRequest._retry = true; 

      try {

        await AdminAPI.get('/admin/refresh');

        return AdminAPI(originalRequest);

      } catch (refreshError) {
        window.location.href = "/admin/passcode";
        sessionStorage.clear();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default AdminAPI;