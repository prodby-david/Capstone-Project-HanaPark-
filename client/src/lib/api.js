import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:4100',
  withCredentials: true, 
});

export const publicApi = axios.create({
  baseURL: 'http://localhost:4100',
  withCredentials: false,
});


